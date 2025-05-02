import { LitElement } from 'lit';

import {
  getByAttributeValue,
  getTime,
  getTimeAndValuePairs,
  getValue,
  parseLocationName,
  raiseEvent,
  value,
  parseRegion,
} from '../xml-parser.ts';
import { snowAmount, totalRain, totalSnow } from './rain-helper.ts';

import { feelsLike } from '../feels-like.ts';
import { rainType } from './rain-type.ts';
import { customElement, property } from 'lit/decorators.js';
import { LocationCoordinates } from '../../app-sections/forecast-header/station-map.ts';

type ForecastResponse = {
  humidity: HTMLCollection;
  rain: HTMLCollection;
  smartSymbol: HTMLCollection;
  temperature: HTMLCollection;
  wind: HTMLCollection;
  windDirection: HTMLCollection;
  windGust: HTMLCollection;
};

/**
example data structure:
const forecast: Forecast =
  location: {
    geoid: '840741', name: 'Latokaski', coordinates: '60.1762468,24.6488656', lat: 60.1762468, lon: 24.6488656, region: 'Espoo',
  },
  days: [
    {
      dayMaxFeels: -1,
      dayMaxFeelsVisible: -1,
      dayMaxTemp: 5.18,
      dayMaxTempVisible: 5.12,
      dayMinFeels: -12,
      dayMinFeelsVisible: -12,
      dayMinTemp: -6.04,
      dayMinTempVisible: -6.04,
      hours: [
        {
          humidity: 77.34, time: 1,
        }, ...
      ],
    }, ...
  ],
};
*/
type Forecast = {
  location?: { name: string; coordinates: string };
  days: ForecastDay[];
};

type ForecastDay = {
  dayMinTemp?: number;
  dayMinFeels?: number;
  dayMinTempVisible?: number;
  dayMinFeelsVisible?: number;
  dayMaxTemp?: number;
  dayMaxFeels?: number;
  dayMaxTempVisible?: number;
  dayMaxFeelsVisible?: number;
  dayRainAmount: number;
  daySnowAmount: number;
  hours: ForecastHour[];
};

type ForecastHourPartial = {
  humidity: number;
  time: Date;
  threeHourWindMax: number;

  threeHourWindMaxGust: number;
  rain: number;
  roundWind: number;

  roundWindGust: number;
  snow: number;
  wind: number;

  windGust: number;
  temperature: number;

  windDirection: number;
  feelsLike?: number;
  hour?: number;
};

type ForecastHourOptional = {
  smartSymbol?: number;
  smartSymbolAggregate?: number;
  rainType?: string;
  summerTimeStarts?: boolean;
};

type ForecastHour = Required<ForecastHourPartial> & ForecastHourOptional;

/**
 *  Fetches weather forecast from Ilmatieteen laitos API.
 */
@customElement('forecast-data')
class ForecastData extends LitElement {
  @property({ type: Object, reflect: true })
  location?: LocationCoordinates;

  updated(changedProperties: Map<string, any>) {
    changedProperties.forEach((_, propName) => {
      if (propName === 'location' && this.location !== undefined) {
        this._newLocation();
      }
    });
  }

  /**
   * Fetches the data from the backend
   */
  _newLocation() {
    if (!this.location) {
      return;
    }

    this.dispatch('forecast-data.fetching');

    const params = {
      request: 'getFeature',
      storedquery_id:
        'fmi::forecast::edited::weather::scandinavia::point::timevaluepair',
      parameters:
        'Humidity,Temperature,WindDirection,WindSpeedMS,HourlyMaximumGust,Precipitation1h,SmartSymbol',
      starttime: ForecastData._todayFirstHour(),
      endtime: ForecastData._endTime(),
      latlon: this.location.coordinates,
    };
    const queryParams = new URLSearchParams(params).toString();

    fetch(`https://opendata.fmi.fi/wfs?${queryParams}`, {
      headers: {
        'Cache-Control': 'no-cache',
      },
    })
      .then((response) => response.text())
      .then((str) => new window.DOMParser().parseFromString(str, 'text/xml'))
      .then((data) => {
        this._sendNotification(
          ForecastData._parseLocationGeoid(data),
          parseLocationName(data),
          this.location?.coordinates,
          this.location?.lat,
          this.location?.lon,
          parseRegion(data)
        );

        const filteredResponse = ForecastData._filterResponse(data);

        // turn data to json hours
        const hours = ForecastData._toJsonHours(filteredResponse);

        // enrich data here to keep logic inside components simple
        const hourAdded = ForecastData._addFullHour(hours);
        const rainTypeAdded = ForecastData._addRainType(hourAdded);
        const aggregateAdded = ForecastData._addSymbolAggregate(rainTypeAdded);

        // from one array to have the days separated
        //const days = ForecastData._splitIntoDays(smartSymbolAggregateAdded);

        const days: ForecastDay[] = ForecastData.splitToDays(aggregateAdded);

        let lastRemoved = [...days];
        const lastDayEvening = days.at(-1)?.hours.at(23)?.temperature;
        if (!lastDayEvening) {
          lastRemoved = days.slice(0, -1);
        }

        // find daylight saving time change. The third hour is normally 3rd, not 4rd
        const index = days.findIndex((day) => {
          if (day.hours.at(2)?.hour === 4) {
            return true;
          }
          return false;
        });

        // add extra array item for the missing 3rd hour
        if (index >= 0) {
          days.at(index)?.hours.splice(2, 0, {
            hour: 3,
            feelsLike: NaN,
            humidity: NaN,
            rain: NaN,
            roundWind: NaN,
            roundWindGust: NaN,
            snow: NaN,
            temperature: NaN,
            threeHourWindMax: NaN,
            threeHourWindMaxGust: NaN,
            time: new Date(),
            wind: NaN,
            windDirection: NaN,
            windGust: NaN,
            summerTimeStarts: true,
          });
        }

        const daysWithMinAndMax =
          ForecastData._addDayMaxAndMinTemperatures(lastRemoved);

        const daysWithRainAmount =
          ForecastData._addRainAmount(daysWithMinAndMax);

        const forecast: Forecast = {
          location: undefined,
          days: daysWithRainAmount,
        };

        this.dispatch('forecast-data.new-data', forecast);
      })
      .catch((rejected) => {
        raiseEvent(this, 'forecast-data.fetch-error', {
          text: 'Virhe haettaessa ennustetietoja',
        });
        // eslint-disable-next-line no-console
        console.log(`error ${rejected.stack}`);
      })
      .then(() => {
        raiseEvent(this, 'forecast-data.fetch-done', {
          text: 'Fetch data done',
        });
      });
  }

  private static splitToDays(smartSymbolAggregateAdded: ForecastHour[]) {
    let dayIndex: number = -1;
    const days: ForecastDay[] = [];
    smartSymbolAggregateAdded.forEach((hour) => {
      if (hour.hour <= 1) {
        dayIndex++;
      }

      if (!isNaN(hour.temperature)) {
        const hourCopy = { ...hour };
        if (!days[dayIndex]) {
          days[dayIndex] = { hours: [], dayRainAmount: 0, daySnowAmount: 0 };
        }
        days[dayIndex].hours.push(hourCopy);
      }
    });
    return days;
  }

  static _filterResponse(response: Document): ForecastResponse {
    const timeSeries = response.getElementsByTagName(
      'wml2:MeasurementTimeseries'
    );

    return {
      humidity: getTimeAndValuePairs(timeSeries, 'mts-1-1-Humidity'),
      rain: getTimeAndValuePairs(timeSeries, 'mts-1-1-Precipitation1h'),
      smartSymbol: getTimeAndValuePairs(timeSeries, 'mts-1-1-SmartSymbol'),
      temperature: getTimeAndValuePairs(timeSeries, 'mts-1-1-Temperature'),
      wind: getTimeAndValuePairs(timeSeries, 'mts-1-1-WindSpeedMS'),
      windDirection: getTimeAndValuePairs(timeSeries, 'mts-1-1-WindDirection'),
      windGust: getTimeAndValuePairs(timeSeries, 'mts-1-1-HourlyMaximumGust'),
    };
  }

  static _toJsonHours(response: ForecastResponse): ForecastHour[] {
    const forecastDays: ForecastHour[] = [];

    for (let i = 0; i < response.temperature.length; i += 1) {
      const temperatureValue = getValue(response.temperature[i]);
      const windValue = getValue(response.wind[i]);
      const windGustValue = getValue(response.windGust[i]);
      const humidityValue = getValue(response.humidity[i]);
      const roundWind = Math.round(windValue);
      const roundWindGust = Math.round(windGustValue);
      const rain = getValue(response.rain[i]);
      const smartSymbol = getValue(response.smartSymbol[i]);

      // previous wind and wind gust
      let previousRoundWind = 0;
      let previousRoundWindGust = 0;

      if (i > 0) {
        previousRoundWind = Math.round(getValue(response.wind[i - 1])) || 0;
        previousRoundWindGust =
          Math.round(getValue(response.windGust[i - 1])) || 0;
      }

      // next wind and wind gust
      const nextWind = getValue(response.wind[i + 1]) || 0;
      const nextWindGust = getValue(response.windGust[i + 1]) || 0;

      const nextRoundWind = Math.round(nextWind);
      const nextRoundWindGust = Math.round(nextWindGust);

      const forecastEntry: ForecastHourPartial & ForecastHourOptional = {
        feelsLike: feelsLike(temperatureValue, windValue, humidityValue),
        humidity: humidityValue,
        rain,
        snow: snowAmount(temperatureValue, rain, smartSymbol),
        smartSymbol: smartSymbol || undefined,
        time: getTime(response.temperature[i]),
        temperature: temperatureValue,
        wind: windValue,
        roundWind,
        threeHourWindMax: Math.max(roundWind, previousRoundWind, nextRoundWind),
        windDirection: getValue(response.windDirection[i]),
        windGust: windGustValue,
        roundWindGust,
        threeHourWindMaxGust: Math.max(
          roundWindGust,
          previousRoundWindGust,
          nextRoundWindGust
        ),
      };

      forecastDays.push(forecastEntry as ForecastHour);

      previousRoundWind = roundWind;
      previousRoundWindGust = roundWindGust;
    }

    return forecastDays;
  }

  static _addFullHour(forecastDays: ForecastHour[]): ForecastHour[] {
    const combined = forecastDays.map((day) => {
      const dayCopy = { ...day };
      dayCopy.hour = ForecastData._toHour(dayCopy.time);
      return dayCopy;
    });

    return combined;
  }

  static _addDayMaxAndMinTemperatures(
    forecastDays: ForecastDay[]
  ): ForecastDay[] {
    const processedForecastDays = forecastDays.map(
      (day: ForecastDay): ForecastDay => {
        let dayMaxTemp = -Infinity;
        let dayMinTemp = Infinity;
        let dayMaxTempVisible = -Infinity;
        let dayMinTempVisible = Infinity;

        let dayMaxFeels = -Infinity;
        let dayMinFeels = Infinity;
        let dayMaxFeelsVisible = -Infinity;
        let dayMinFeelsVisible = Infinity;

        day.hours.forEach((hour) => {
          if (!isNaN(hour.temperature)) {
            dayMaxTemp = Math.max(dayMaxTemp, hour.temperature);
            dayMinTemp = Math.min(dayMinTemp, hour.temperature);
            dayMaxFeels = Math.max(dayMaxFeels, hour.feelsLike);
            dayMinFeels = Math.min(dayMinFeels, hour.feelsLike);

            if (hour.hour % 3 === 0) {
              dayMaxTempVisible = Math.max(dayMaxTempVisible, hour.temperature);
              dayMinTempVisible = Math.min(dayMinTempVisible, hour.temperature);
              dayMaxFeelsVisible = Math.max(dayMaxFeelsVisible, hour.feelsLike);
              dayMinFeelsVisible = Math.min(dayMinFeelsVisible, hour.feelsLike);
            }
          }
        });

        return {
          ...day,
          dayMaxTemp,
          dayMaxFeels,
          dayMaxTempVisible,
          dayMaxFeelsVisible,
          dayMinTemp,
          dayMinFeels,
          dayMinTempVisible,
          dayMinFeelsVisible,
        };
      }
    );
    return processedForecastDays;
  }

  static _addRainAmount(forecastDays: ForecastDay[]): ForecastDay[] {
    const daysWithRain = forecastDays.map((day: ForecastDay): ForecastDay => {
      const dayRainAmount = totalRain(day);
      const daySnowAmount = totalSnow(day);

      return {
        ...day,
        dayRainAmount,
        daySnowAmount,
      };
    });
    return daysWithRain;
  }

  static _addRainType(forecastDays: ForecastHour[]): ForecastHour[] {
    const result = forecastDays.map((item) => {
      const copy = { ...item };
      copy.rainType = rainType(copy.smartSymbol);
      return copy;
    });

    return result;
  }

  /*static _splitIntoDays(forecastHours: ForecastHour[]): Forecast {
 

    const groupedByDay = hours.reduce((daysArray, curr, index) => {
      const dayIndex = Math.floor(index / 24);
      if (!daysArray[dayIndex]) {
        daysArray[dayIndex] = [];
      }
      daysArray[dayIndex].push(curr);
      return daysArray;
    }, [] as Array<Array<{hour: number}>>);

    return {location: undefined,days: days}
  }*/

  static _addSymbolAggregate(forecastData: ForecastHour[]): ForecastHour[] {
    return forecastData.map((item, index) => {
      const newItem = { ...item };
      if ((index + 1) % 3 === 0) {
        newItem.smartSymbolAggregate = ForecastData.infer3HourAggregate(
          forecastData.at(index - 1)?.smartSymbol,
          item.smartSymbol,
          forecastData.at(index + 1)?.smartSymbol
        );
      }
      return newItem;
    });
  }

  static infer3HourAggregate(
    prevSymbol?: number,
    currentSymbol?: number,
    nextSymbol?: number
  ): number {
    if (
      prevSymbol === undefined ||
      currentSymbol === undefined ||
      nextSymbol === undefined
    ) {
      return 0;
    }

    const previous = prevSymbol % 100;
    const current = currentSymbol % 100;
    const next = nextSymbol % 100;

    const max = Math.max(previous, current, next);

    return currentSymbol >= 100 ? max + 100 : max;
  }

  /* <gml:name codeSpace="http://xml.fmi.fi/namespace/locationcode/name">Kattilalaakso</gml:name> 
  <gml:identifier codeSpace="http://xml.fmi.fi/namespace/stationcode/geoid">7521689</gml:identifier> */
  static _parseLocationGeoid(response: Document): string {
    const locations = response.getElementsByTagName('gml:identifier');
    const locationRow = getByAttributeValue(
      locations,
      'codeSpace',
      'http://xml.fmi.fi/namespace/stationcode/geoid'
    );

    const location = value(locationRow);

    return location;
  }

  _sendNotification(geoid, name, coordinates, lat, lon, region) {
    const details = {
      location: {
        geoid,
        name,
        coordinates,
        lat,
        lon,
        region,
      },
    };

    raiseEvent(this, 'forecast-data.new-place', details.location);
  }

  static _todayFirstHour() {
    const firstHour = new Date();
    firstHour.setHours(1, 0, 0, 0);

    return firstHour.toISOString();
  }

  static _toHour(time: Date) {
    const hour = time.getHours();

    return hour === 0 ? 24 : hour;
  }

  static _endTime() {
    const now = new Date();

    const tomorrow = new Date();
    tomorrow.setDate(now.getDate() + 11);
    tomorrow.setHours(24, 0, 0, 0);

    return tomorrow.toISOString();
  }

  dispatch(eventName: string, message?: any): void {
    const event = new CustomEvent(eventName, {
      detail: message,
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }
}

declare global {
  interface CustomEventMap {
    'forecast-data.fetching': CustomEvent;
    'forecast-data.new-data': CustomEvent<Forecast>;
  }
}

export { ForecastData, type ForecastDay, type ForecastHour, type Forecast };
