import { LitElement } from 'lit-element';

import {
  getByAttributeValue,
  getTime,
  getTimeAndValuePairs,
  getValue,
  parseLocationName,
  raiseEvent,
  value,
  parseRegion,
} from './common/xml-parser.js';

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

  static get properties() {
    return {
      location: {
        type: Object,
        reflect: true,
      },
    };
  }

  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName === 'location' && this.location !== undefined) {
        this._newLocation();
      }
    });
  }

  /**
   * Fetches the data from the backend
   */
  _newLocation() {
    this._dispatch('forecast-data.fetching');

    const params = this._getHarmonieParams(this.location);

    const queryParams = Object.keys(params)
      .map(key => `${key}=${params[key]}`)
      .join('&');

    const query = `https://opendata.fmi.fi/wfs?${queryParams}`;

    fetch(query)
      .then(response => response.text())
      .then(str => new window.DOMParser().parseFromString(str, 'text/xml'))
      .then(data => {
        this._sendNotification(
          this._parseLocationGeoid(data),
          parseLocationName(data),
          this.location.coordinates,
          parseRegion(data)
        );

        const filteredResponse = this._filterResponse(data);
        const json = this._toJson(filteredResponse);

        // enrich data here to keep logic inside components simple
        const hourAdded = this._addFullHour(json);
        const pastMarked = this._markPastItems(hourAdded);
        const forecastData = this._addSymbolAggregate(pastMarked);

        this._dispatch('forecast-data.new-data', forecastData);
      })
      .catch(rejected => {
        raiseEvent(this, 'forecast-data.fetch-error', {
          text: 'Virhe haettaessa ennustetietoja',
        });
        console.log(`error ${rejected.stack}`);
      })
      .then(() => {
        raiseEvent(this, 'forecast-data.fetch-done', {
          text: 'Fetch data done',
        });
      });
  }

  _getHarmonieParams(location) {
    const params = this._commonParams(location);

    params.storedquery_id =
      'fmi::forecast::harmonie::surface::point::timevaluepair';
    params.parameters =
      'Humidity,Temperature,WindDirection,WindSpeedMS,WindGust,Precipitation1h,WeatherSymbol3';

    return params;
  }

  _commonParams(location) {
    const params = {
      request: 'getFeature',
      starttime: this._todayFirstHour(),
      endtime: this._tomorrowLastHour(),
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
  _filterResponse(response) {
    const timeSeries = response.getElementsByTagName(
      'wml2:MeasurementTimeseries'
    );

    const harmonieResponse = {};

    harmonieResponse.humidity = getTimeAndValuePairs(
      timeSeries,
      'mts-1-1-Humidity',
      'humidity'
    );
    harmonieResponse.rain = getTimeAndValuePairs(
      timeSeries,
      'mts-1-1-Precipitation1h',
      'rain'
    );
    harmonieResponse.symbol = getTimeAndValuePairs(
      timeSeries,
      'mts-1-1-WeatherSymbol3',
      'symbol'
    );
    harmonieResponse.temperature = getTimeAndValuePairs(
      timeSeries,
      'mts-1-1-Temperature',
      'temperature'
    );
    harmonieResponse.wind = getTimeAndValuePairs(
      timeSeries,
      'mts-1-1-WindSpeedMS',
      'wind'
    );
    harmonieResponse.windDirection = getTimeAndValuePairs(
      timeSeries,
      'mts-1-1-WindDirection',
      'windDirection'
    );
    harmonieResponse.windGust = getTimeAndValuePairs(
      timeSeries,
      'mts-1-1-WindGust',
      'windGust'
    );

    return harmonieResponse;
  }

  _toJson(data) {
    const weatherJson = [];

    for (let i = 0; i < data.temperature.length; i++) {
      const temperatureValue = getValue(data.temperature[i]);
      const windValue = getValue(data.wind[i]);

      weatherJson.push({
        feelsLike: this._feelsLike(temperatureValue, windValue),
        humidity: getValue(data.humidity[i]),
        rain: getValue(data.rain[i]),
        symbol: getValue(data.symbol[i]),
        time: getTime(data.temperature[i]),
        temperature: temperatureValue,
        wind: windValue,
        windDirection: getValue(data.windDirection[i]),
        windGust: getValue(data.windGust[i]),
      });
    }

    return weatherJson;
  }

  _enrichData(combinedData) {
    // enrich data here to simplify logic inside components
    const now = new Date();
    combinedData.forEach(element => {
      element.hour = this._toHour(element.time);
      element.past = this._isPast(now, element.time);
    });

    return combinedData;
  }

  _addFullHour(combinedData) {
    combinedData.forEach(element => {
      element.hour = this._toHour(element.time);
    });

    return combinedData;
  }

  _markPastItems(combinedData) {
    const now = new Date();
    combinedData.forEach(element => {
      element.past = this._isPast(now, element.time);
    });

    return combinedData;
  }

  _addSymbolAggregate(forecastData) {
    let previousItem;
    let currentItem;

    forecastData.forEach(item => {
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

  _isPast(now, dateTime) {
    const comparable = new Date(dateTime);

    return now > comparable;
  }

  /**
   * Calculates "feels like" estimate based on wind and temperature.
   * Formula by Ilmatieteen laitos: https://fi.wikipedia.org/wiki/Pakkasen_purevuus
   *
   * @param {*} temperature in celcius
   * @param {*} wind metres per second
   */
  _feelsLike(temperature, wind) {
    const feelsLike =
      13.12 +
      0.6215 * temperature -
      13.956 * Math.pow(wind, 0.16) +
      0.4867 * temperature * Math.pow(wind, 0.16);
    return Math.round(feelsLike);
  }

  /* <gml:name codeSpace="http://xml.fmi.fi/namespace/locationcode/name">Kattilalaakso</gml:name> 
  <gml:identifier codeSpace="http://xml.fmi.fi/namespace/stationcode/geoid">7521689</gml:identifier> */
  _parseLocationGeoid(response) {
    const locations = response.getElementsByTagName('gml:identifier');
    const locationRow = getByAttributeValue(
      locations,
      'codeSpace',
      'http://xml.fmi.fi/namespace/stationcode/geoid'
    );

    const location = value(locationRow);

    return location;
  }

  _sendNotification(geoid, name, coordinates, region) {
    const details = {
      location: {
        geoid,
        name,
        coordinates,
        region,
      },
    };

    raiseEvent(this, 'forecast-data.new-place', details.location);
  }

  _todayFirstHour() {
    const firstHour = new Date();
    firstHour.setHours(1, 0, 0, 0);

    return firstHour.toISOString();
  }

  _toHour(time) {
    if (typeof time === 'number') {
      return time;
    }

    const dateObject = new Date(time);
    const hour = dateObject.getHours();

    return hour === 0 ? 24 : dateObject.getHours();
  }

  _tomorrowLastHour() {
    const now = new Date();

    const tomorrow = new Date();
    tomorrow.setDate(now.getDate() + 2);
    tomorrow.setHours(24, 0, 0, 0);

    return tomorrow.toISOString();
  }

  _dispatch(eventName, message) {
    const event = new CustomEvent(eventName, {
      detail: message,
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }
}

window.customElements.define(ForecastData.is, ForecastData);
