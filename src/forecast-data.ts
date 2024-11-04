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
} from './data-helpers/xml-parser';
import { snowAmount } from './sections/weather-days/rain-helper';

import { feelsLike } from './data-helpers/feels-like';
import { rainType } from './data-helpers/rain-type';
import { property } from 'lit/decorators.js';

type HarmonieParams = {
  request: string;
  starttime: string;
  endtime: string;
  parameters?: string;
  storedquery_id?: string;
  latlon?: string;
  place?: string;
};

/**
 *  Fetches weather forecast from Ilmatieteenlaitos' "Harmonie" weather model API.
 *
 *  Exposes the data in forecastData property in the following format:
 * [{ hour: 1
 *    humidity: 50
 *    past: true|false
 *    rain: 0 | NAN
 *    symbol: 1
 *    temperature: 11.3
 *    time: "2018-09-26T22:00:00Z"
 *    wind: 7.6
 *    windDirection: 296 }, {...}]
 */
class ForecastData extends LitElement {
  static get is() {
    return 'forecast-data';
  }

  @property({ type: Object, reflect: true })
  location;

  updated(changedProperties) {
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
    this.dispatch('forecast-data.fetching');

    const params = ForecastData._getHarmonieParams(this.location);

    const queryParams = Object.keys(params)
      .map((key) => `${key}=${params[key]}`)
      .join('&');

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
          this.location.coordinates,
          this.location.lat,
          this.location.lon,
          parseRegion(data)
        );

        const filteredResponse = ForecastData._filterResponse(data);
        const json = ForecastData._toJson(filteredResponse);

        // enrich data here to keep logic inside components simple
        const hourAdded = ForecastData._addFullHour(json);
        const rainTypeAdded = ForecastData._addRainType(hourAdded);
        const forecastData = ForecastData._addSymbolAggregate(rainTypeAdded);
        forecastData.fetchTime = new Date();

        this.dispatch('forecast-data.new-data', forecastData);
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

  static _getHarmonieParams(location): HarmonieParams {
    const params = ForecastData._commonParams(location);

    params.storedquery_id =
      'fmi::forecast::harmonie::surface::point::timevaluepair';
    params.parameters =
      'Humidity,Temperature,WindDirection,WindSpeedMS,WindGust,Precipitation1h,WeatherSymbol3';

    return params;
  }

  static _commonParams(location): HarmonieParams {
    const params: HarmonieParams = {
      request: 'getFeature',
      starttime: ForecastData._todayFirstHour(),
      endtime: ForecastData._tomorrowLastHour(),
      parameters: undefined,
      storedquery_id: undefined,
    };
    if (location.coordinates) {
      params.latlon = location.coordinates;
    } else {
      // TODO: remove this branch if unused?
      params.place = location.city;
    }

    return params;
  }

  /**
   * Data comes from the following format from FMI open API
   *
   *	...
   * <wml2:MeasurementTimeseries gml:id="mts-1-1-Temperature">
   *		<wml2:point>
   *			<wml2:MeasurementTVP>
   *				<wml2:time>2018-01-09T20:00:00Z</wml2:time>
   *				<wml2:value>-2.41</wml2:value>
   *  ...
   * <wml2:MeasurementTimeseries gml:id="mts-1-1-WeatherSymbol3">
   *		...
   * <wml2:MeasurementTimeseries gml:id="mts-1-1-Precipitation1h">
   *    ...
   * <wml2:MeasurementTimeseries gml:id="mts-1-1-WindSpeedMS">
   *    ...
   * <wml2:MeasurementTimeseries gml:id="mts-1-1-WindDirection">
   *    ...
   * <wml2:MeasurementTimeseries gml:id="mts-1-1-Humidity">
   *
   *
   * And it is converted to the following JSON and stored into this.forecastData
   *
   * [
   *    {hour:1, rain: NaN, symbol: NaN, temperature: NaN, time: "2018-03-02T23:00:00Z", wind: NaN, windDirection: NaN}
   *    {hour:2, ...}
   * ]
   */
  static _filterResponse(response) {
    const timeSeries = response.getElementsByTagName(
      'wml2:MeasurementTimeseries'
    );

    const harmonieResponse = {
      humidity: getTimeAndValuePairs(timeSeries, 'mts-1-1-Humidity'),
      rain: getTimeAndValuePairs(timeSeries, 'mts-1-1-Precipitation1h'),
      symbol: getTimeAndValuePairs(timeSeries, 'mts-1-1-WeatherSymbol3'),
      temperature: getTimeAndValuePairs(timeSeries, 'mts-1-1-Temperature'),
      wind: getTimeAndValuePairs(timeSeries, 'mts-1-1-WindSpeedMS'),
      windDirection: getTimeAndValuePairs(timeSeries, 'mts-1-1-WindDirection'),
      windGust: getTimeAndValuePairs(timeSeries, 'mts-1-1-WindGust'),
    };

    return harmonieResponse;
  }

  static _toJson(data) {
    const weatherJson = [];

    for (let i = 0; i < data.temperature.length; i += 1) {
      const temperatureValue = getValue(data.temperature[i]);
      const windValue = getValue(data.wind[i]);
      const windGustValue = getValue(data.windGust[i]);
      const humidityValue = getValue(data.humidity[i]);
      const roundWind = Math.round(windValue);
      const roundWindGust = Math.round(windGustValue);
      const rain = getValue(data.rain[i]);
      const symbol = getValue(data.symbol[i]);

      // previous wind and wind gust
      let previousRoundWind = 0;
      let previousRoundWindGust = 0;

      if (i > 0) {
        previousRoundWind = Math.round(getValue(data.wind[i - 1])) || 0;
        previousRoundWindGust = Math.round(getValue(data.windGust[i - 1])) || 0;
      }

      // next wind and wind gust
      const nextWind = getValue(data.wind[i + 1]) || 0;
      const nextWindGust = getValue(data.windGust[i + 1]) || 0;

      const nextRoundWind = Math.round(nextWind);
      const nextRoundWindGust = Math.round(nextWindGust);

      (weatherJson as any).push({
        feelsLike: feelsLike(temperatureValue, windValue, humidityValue),
        humidity: humidityValue,
        rain,
        snow: snowAmount(temperatureValue, rain, symbol),
        symbol,
        time: getTime(data.temperature[i]),
        temperature: temperatureValue,
        wind: windValue,
        roundWind,
        threeHourWindMax: Math.max(roundWind, previousRoundWind, nextRoundWind),
        windDirection: getValue(data.windDirection[i]),
        windGust: windGustValue,
        roundWindGust,
        threeHourWindMaxGust: Math.max(
          roundWindGust,
          previousRoundWindGust,
          nextRoundWindGust
        ),
      });

      previousRoundWind = roundWind;
      previousRoundWindGust = roundWindGust;
    }

    return weatherJson;
  }

  static _addFullHour(combinedData) {
    const combined = combinedData.map((element) => {
      const copy = { ...element };
      copy.hour = ForecastData._toHour(copy.time);
      return copy;
    });

    return combined;
  }

  static _addRainType(data) {
    const result = data.map((item) => {
      const copy = { ...item };
      copy.rainType = rainType(copy.symbol);
      return copy;
    });

    return result;
  }

  static _addSymbolAggregate(forecastData) {
    let previousItem;
    let currentItem;

    forecastData.forEach((item) => {
      previousItem = currentItem;
      currentItem = item;

      if (currentItem.hour % 3 === 0) {
        currentItem.symbolAggregate = Math.max(
          previousItem.symbol,
          currentItem.symbol
        );
      }

      if (currentItem.hour % 4 === 0) {
        previousItem.symbolAggregate = Math.max(
          previousItem.symbolAggregate,
          currentItem.symbol
        );
      }
    });
    return forecastData;
  }

  /* <gml:name codeSpace="http://xml.fmi.fi/namespace/locationcode/name">Kattilalaakso</gml:name> 
  <gml:identifier codeSpace="http://xml.fmi.fi/namespace/stationcode/geoid">7521689</gml:identifier> */
  static _parseLocationGeoid(response) {
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

  static _tomorrowLastHour() {
    const now = new Date();

    const tomorrow = new Date();
    tomorrow.setDate(now.getDate() + 2);
    tomorrow.setHours(24, 0, 0, 0);

    return tomorrow.toISOString();
  }

  dispatch(eventName: string, message?: string): void {
    const event = new CustomEvent(eventName, {
      detail: message,
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }
}

window.customElements.define(ForecastData.is, ForecastData);
