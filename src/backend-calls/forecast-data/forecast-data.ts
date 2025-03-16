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
import { snowAmount } from '../../app-sections/weather-days/rain-helper.ts';

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

type ForecastDay = ForecastHour[];

type ForecastHourPartial = {
  humidity: number;
  time: number;
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
  smartSymbolCompactAggregate?: number;
  rainType?: string;
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
        const json = ForecastData._toJson(filteredResponse);

        // enrich data here to keep logic inside components simple
        const hourAdded = ForecastData._addFullHour(json);
        const rainTypeAdded = ForecastData._addRainType(hourAdded);

        const smartSymbolAggregateAdded =
          ForecastData._addSmartSymbolAggregateForCompactMode(rainTypeAdded);

        const day1Data = ForecastData._sliceDay(smartSymbolAggregateAdded, 1);
        const day2Data = ForecastData._sliceDay(smartSymbolAggregateAdded, 2);
        const day3Data = ForecastData._sliceDay(smartSymbolAggregateAdded, 3);
        const day4Data = ForecastData._sliceDay(smartSymbolAggregateAdded, 4);
        const day5Data = ForecastData._sliceDay(smartSymbolAggregateAdded, 5);
        const day6Data = ForecastData._sliceDay(smartSymbolAggregateAdded, 6);
        const day7Data = ForecastData._sliceDay(smartSymbolAggregateAdded, 7);
        const day8Data = ForecastData._sliceDay(smartSymbolAggregateAdded, 8);
        const day9Data = ForecastData._sliceDay(smartSymbolAggregateAdded, 9);
        const day10Data = ForecastData._sliceDay(smartSymbolAggregateAdded, 10);

        const forecastDays: ForecastDay[] = [];
        forecastDays.push(
          day1Data,
          day2Data,
          day3Data,
          day4Data,
          day5Data,
          day6Data,
          day7Data,
          day8Data,
          day9Data,
          day10Data
        );

        this.dispatch('forecast-data.new-data', forecastDays);
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

  static _sliceDay(data: ForecastHour[], dayNumber: number): ForecastDay {
    if (data === undefined) {
      return [];
    }

    try {
      data[(dayNumber - 1) * 24];
      data[dayNumber * 24];
    } catch (e) {
      console.log('cannot slice', data, dayNumber);
      return [];
    }

    return data.slice((dayNumber - 1) * 24, dayNumber * 24);
  }

  static _toJson(response: ForecastResponse): ForecastHour[] {
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
    const combined = forecastDays.map((element) => {
      const copy = { ...element };
      copy.hour = ForecastData._toHour(copy.time);
      return copy;
    });

    return combined;
  }

  static _addRainType(forecastDays: ForecastHour[]): ForecastHour[] {
    const result = forecastDays.map((item) => {
      const copy = { ...item };
      copy.rainType = rainType(copy.smartSymbol);
      return copy;
    });

    return result;
  }

  static _addSmartSymbolAggregateForCompactMode(
    forecastData: ForecastHour[]
  ): ForecastHour[] {
    let previousSmartSymbol = -Infinity;
    const forecast = forecastData.map((item, index) => {
      const newItem = { ...item };

      const max = item.smartSymbol
        ? Math.max(previousSmartSymbol, item.smartSymbol)
        : previousSmartSymbol;

      newItem.smartSymbolCompactAggregate = max || undefined;

      //day is divided into 3 sections, and we are calculating aggregate for each
      if (index === 8 || index === 15 || index === 24) {
        previousSmartSymbol = -Infinity;
      } else {
        previousSmartSymbol = newItem.smartSymbol || previousSmartSymbol;
      }
      return newItem;
    });

    return forecast;
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

  static _toHour(time) {
    if (typeof time === 'number') {
      return time;
    }

    const dateObject = new Date(time);
    const hour = dateObject.getHours();

    return hour === 0 ? 24 : dateObject.getHours();
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

export { ForecastData, type ForecastDay, type ForecastHour };
