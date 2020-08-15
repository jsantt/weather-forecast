import { LitElement } from 'lit-element';

import {
  getTime,
  getTimeAndValuePairs,
  getValue,
  parseLatLon,
  parseLocationName,
  raiseEvent,
} from './common/xml-parser.js';

/**
 * Observations are fetched from the nearest observation station using area name, because
 * there is no support for coordinates. New data is available every 10 minutes
 */
class ObservationData extends LitElement {
  static get is() {
    return 'observation-data';
  }

  static get properties() {
    return {
      // location object, e.g {geoid: "7521614", name: "Kattilalaakso"}
      place: {
        type: Object,
      },
    };
  }

  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName === 'place' && this.place !== undefined) {
        this._newPlace();
      }
    });
  }

  _newPlace() {
    if (this.place == undefined) {
      return;
    }

    const params = this._getParams(this.place.geoid);
    const queryParams = Object.keys(params)
      .map((key) => key + '=' + params[key])
      .join('&');

    const query = `https://opendata.fmi.fi/wfs?${queryParams}`;

    fetch(query)
      .then((response) => response.text())
      .then((str) => new window.DOMParser().parseFromString(str, 'text/xml'))
      .then((req) => {
        const formattedObservations = this._formatObservations(req);
        this._dispatch('observation-data.new-data', formattedObservations);
      })
      .catch((rejected) => {
        raiseEvent(this, 'observation-data.fetch-error', {
          text: 'Havaintoja ei saatavilla',
        });
        console.log('error ' + rejected.stack);
      });
  }

  _getParams(geoid) {
    let params = {
      request: 'getFeature',
      storedquery_id: 'fmi::observations::weather::timevaluepair',
      geoid: geoid,
      maxlocations: 1,
      starttime: this._roundDownToFullMinutes(-12), // get the latest data only
      endtime: this._roundDownToFullMinutes(0), // get the latest data only
    };

    return params;
  }

  /**
   * Response example
   *
   * <wfs:FeatureCollection>
   *   <wfs:member>
   *     <omso:PointTimeSeriesObservation>
   *       <om:phenomenonTime>...
   *       <om:resultTime>...
   *       <gml:name codeSpace="http://xml.fmi.fi/namespace/locationcode/name">
   *         Helsinki Kaisaniemi
   *       </gml:name>...
   *       <om:result>
   *         <wml2:MeasurementTimeseries gml:id="obs-obs-1-1-t2m">
   *           <wml2:point>
   *             <wml2:MeasurementTVP>
   *               <wml2:time>2018-04-29T07:40:00Z</wml2:time>
   *	              <wml2:value>6.4</wml2:value>...
   *           <wml2:point>
   *             <wml2:MeasurementTVP>
   *               <wml2:time>2018-04-29T07:50:00Z</wml2:time>
   *	              <wml2:value>6.4</wml2:value>
   *
   *   wd_10min = tuulen suunta
   *   wawa = säätila
   *   ws_10min = tuulen nopeus
   *   wg_10min = puuskatuuli
   *   p_sea = ilmanpaine
   *   rh = ilmankosteus
   *   t2m = lämpötila
   *   r_1h = 1h sademäärä
   *   ri_10min = sateen rankkuus
   *   snow_aws = lumen syvyys niiltä asemilta jossa se on
   *
   *   vis = näkyvyys
   *
   * And it is converted to the following JSON and stored into this.observationData
   *
   * {
   *   humidity: 98
   *   pressure: 1014.8
   *   rain: NaN
   *   rainExplanation: 0
   *   snow: NaN
   *   temperature: 1.3
   *   time: "2018-10-07T19:40:00Z"
   *   weatherCode: 0
   *   weatherStation: "Espoo Tapiola"
   *   wind: 2.4
   *   windDirection: 314
   * }
   *
   */
  _formatObservations(rawResponse) {
    let observations = this._pickUpValues(rawResponse);

    return {
      weatherStation: parseLocationName(rawResponse),
      latLon: parseLatLon(rawResponse),
      time: getTime(observations.temperature),
      cloudiness: getValue(observations.cloudiness),
      dewPoint: getValue(observations.dewPoint),
      humidity: getValue(observations.humidity),
      pressure: getValue(observations.pressure),
      rain: getValue(observations.rain),
      rainExplanation: getValue(observations.rainExplanation),
      snow: getValue(observations.snow),
      temperature: parseFloat(getValue(observations.temperature)),
      visibility: getValue(observations.visibility),
      weatherCode: getValue(observations.weatherCode),
      wind: parseFloat(getValue(observations.wind)),
      windDirection: parseFloat(getValue(observations.windDirection)),
      windGust: parseFloat(getValue(observations.windGust)),
    };
  }

  _pickUpValues(response) {
    const timeSeries = response.getElementsByTagName(
      'wml2:MeasurementTimeseries'
    );

    let observation = {};

    //measurementTVP
    observation.cloudiness = getTimeAndValuePairs(
      timeSeries,
      'obs-obs-1-1-n_man',
      'cloudiness'
    )[0];
    observation.dewPoint = getTimeAndValuePairs(
      timeSeries,
      'obs-obs-1-1-td',
      'dewPoint'
    )[0];
    observation.humidity = getTimeAndValuePairs(
      timeSeries,
      'obs-obs-1-1-rh',
      'humidity'
    )[0];
    observation.pressure = getTimeAndValuePairs(
      timeSeries,
      'obs-obs-1-1-p_sea',
      'pressure'
    )[0];
    observation.rain = getTimeAndValuePairs(
      timeSeries,
      'obs-obs-1-1-r_1h',
      'rain'
    )[0];
    observation.rainExplanation = getTimeAndValuePairs(
      timeSeries,
      'obs-obs-1-1-ri_10min',
      'rainExplanation'
    )[0];
    observation.snow = getTimeAndValuePairs(
      timeSeries,
      'obs-obs-1-1-snow_aws',
      'snow'
    )[0];
    observation.temperature = getTimeAndValuePairs(
      timeSeries,
      'obs-obs-1-1-t2m',
      'temperature'
    )[0];
    (observation.visibility = getTimeAndValuePairs(
      timeSeries,
      'obs-obs-1-1-vis',
      'visibility'
    )[0]),
      (observation.weatherCode = getTimeAndValuePairs(
        timeSeries,
        'obs-obs-1-1-wawa',
        'weatherCode'
      )[0]);
    observation.wind = getTimeAndValuePairs(
      timeSeries,
      'obs-obs-1-1-ws_10min',
      'wind'
    )[0];
    observation.windDirection = getTimeAndValuePairs(
      timeSeries,
      'obs-obs-1-1-wd_10min',
      'windDirection'
    )[0];
    observation.windGust = getTimeAndValuePairs(
      timeSeries,
      'obs-obs-1-1-wg_10min',
      'windGust'
    )[0];

    return observation;
  }

  _roundDownToFullMinutes(minutes) {
    let timeNow = new Date();

    timeNow.setMinutes(timeNow.getMinutes() + minutes);
    timeNow.setSeconds(0, 0);

    return timeNow.toISOString();
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

window.customElements.define(ObservationData.is, ObservationData);
