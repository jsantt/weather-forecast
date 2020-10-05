import { LitElement } from 'lit-element';

import { raiseEvent } from './common/xml-parser.js';

import { wawaToSymbol3 } from './common/wawa-converter.js';
import { distance } from './common/distance.js';

import { feelsLike } from './helper-functions/feels-like.js';

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
        reflect: true,
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
      .map(key => `${key}=${params[key]}`)
      .join('&');

    const query = `https://opendata.fmi.fi/wfs?${queryParams}`;

    fetch(query)
      .then(response => response.text())
      .then(str => new window.DOMParser().parseFromString(str, 'text/xml'))
      .then(parsedResponse => {
        window.observationsTest = parsedResponse;
        const formattedObservations = this._formatObservations(parsedResponse);
        this._dispatch('observation-data.new-data', formattedObservations);
      })
      .catch(rejected => {
        raiseEvent(this, 'observation-data.fetch-error', {
          text: 'Havaintoja ei saatavilla',
        });
        console.log(`error ${rejected.stack}`);
      });
  }

  _getParams(geoid) {
    const params = {
      request: 'getFeature',
      storedquery_id: 'fmi::observations::weather::multipointcoverage', // multipointcoverage',
      geoid,
      meters: 'ws_10min,t2m',
      maxlocations: 20,
      starttime: this._roundDownToFullMinutes(-12), // get the latest data only
      endtime: this._roundDownToFullMinutes(0), // get the latest data only
    };

    return params;
  }

  /**
   * Response example
   *
   * Station names:
   *
   *  <gml:pointMember>
   *     <gml:Point gml:id="point-101786" srsName="http://www.opengis.net/def/crs/EPSG/0/4258" srsDimension="2">
   *       <gml:name>Oulu lentoasema</gml:name>
   *       <gml:pos>64.93503 25.33920 </gml:pos>
   *     </gml:Point>
	 *   </gml:pointMember>
   *   <gml:pointMember>
   *     <gml:Point gml:id="point-101794" srsName="http://www.opengis.net/def/crs/EPSG/0/4258" srsDimension="2">
   *       <gml:name>Oulu Vihreäsaari satama</gml:name>
   *       <gml:pos>65.00640 25.39321 </gml:pos>
   *     </gml:Point>
	 *   </gml:pointMember>
   *   <gml:pointMember>
   *     <gml:Point gml:id="point-101799" srsName="http://www.opengis.net/def/crs/EPSG/0/4258" srsDimension="2">
   *       <gml:name>Oulu Oulunsalo Pellonpää</gml:name>
   *       <gml:pos>64.93698 25.37299 </gml:pos>
   *     </gml:Point>
	 *   </gml:pointMember>
   * 
   * Positions:
   * 
   * <gmlcov:positions>
      64.93503 25.33920  1599891720
      64.93503 25.33920  1599891780
      64.93503 25.33920  1599891840
      64.93503 25.33920  1599891900
      64.93503 25.33920  1599891960
      64.93503 25.33920  1599892020
      64.93503 25.33920  1599892080
      64.93503 25.33920  1599892140
      64.93503 25.33920  1599892200
      64.93503 25.33920  1599892260
      64.93503 25.33920  1599892320
      64.93503 25.33920  1599892380
      65.00640 25.39321  1599892200
      64.93698 25.37299  1599892200
      </gmlcov:positions>
   *
   * Values:
   *
   * <gml:doubleOrNilReasonTupleList>
      NaN NaN NaN NaN NaN NaN NaN NaN NaN NaN NaN 8.0 NaN 
      NaN NaN NaN NaN NaN NaN NaN NaN NaN NaN NaN 8.0 NaN 
      NaN NaN NaN NaN NaN NaN NaN NaN NaN NaN NaN 8.0 NaN 
      NaN NaN NaN NaN NaN NaN NaN NaN NaN NaN NaN 8.0 NaN 
      NaN NaN NaN NaN NaN NaN NaN NaN NaN NaN NaN 8.0 NaN 
      NaN NaN NaN NaN NaN NaN NaN NaN NaN NaN NaN 8.0 NaN 
      NaN NaN NaN NaN NaN NaN NaN NaN NaN NaN NaN 8.0 NaN 
      NaN NaN NaN NaN NaN NaN NaN NaN NaN NaN NaN 8.0 NaN 
      NaN NaN NaN NaN NaN NaN NaN NaN NaN NaN NaN 8.0 NaN 
      NaN NaN NaN NaN NaN NaN NaN NaN NaN NaN NaN 8.0 NaN 
      NaN NaN NaN NaN NaN NaN NaN NaN NaN NaN NaN 8.0 NaN 
      NaN NaN NaN NaN NaN NaN NaN NaN NaN NaN NaN 8.0 NaN 
      8.9 8.9 12.4 145.0 94.0 8.0 NaN NaN NaN 999.8 12560.0 NaN 62.0 
      7.9 3.3 6.7 152.0 99.0 7.8 NaN 0.4 -1.0 999.9 16372.0 8.0 61.0 
    </gml:doubleOrNilReasonTupleList>
   * 
   * 
   *  <swe:DataRecord>
   *    <swe:field name="t2m"  xlink:href="https://opendata.fmi.fi/meta?observableProperty=observation&amp;param=t2m&amp;language=eng"/>
   *    <swe:field name="ws_10min"  xlink:href="https://opendata.fmi.fi/meta?observableProperty=observation&amp;param=ws_10min&amp;language=eng"/>
   *    <swe:field name="wg_10min"  xlink:href="https://opendata.fmi.fi/meta?observableProperty=observation&amp;param=wg_10min&amp;language=eng"/>
   *    <swe:field name="wd_10min"  xlink:href="https://opendata.fmi.fi/meta?observableProperty=observation&amp;param=wd_10min&amp;language=eng"/>
   *    <swe:field name="rh"  xlink:href="https://opendata.fmi.fi/meta?observableProperty=observation&amp;param=rh&amp;language=eng"/>
   *    <swe:field name="td"  xlink:href="https://opendata.fmi.fi/meta?observableProperty=observation&amp;param=td&amp;language=eng"/>
   *    <swe:field name="r_1h"  xlink:href="https://opendata.fmi.fi/meta?observableProperty=observation&amp;param=r_1h&amp;language=eng"/>
   *    <swe:field name="ri_10min"  xlink:href="https://opendata.fmi.fi/meta?observableProperty=observation&amp;param=ri_10min&amp;language=eng"/>
   *    <swe:field name="snow_aws"  xlink:href="https://opendata.fmi.fi/meta?observableProperty=observation&amp;param=snow_aws&amp;language=eng"/>
   *    <swe:field name="p_sea"  xlink:href="https://opendata.fmi.fi/meta?observableProperty=observation&amp;param=p_sea&amp;language=eng"/>
   *    <swe:field name="vis"  xlink:href="https://opendata.fmi.fi/meta?observableProperty=observation&amp;param=vis&amp;language=eng"/>
   *    <swe:field name="n_man"  xlink:href="https://opendata.fmi.fi/meta?observableProperty=observation&amp;param=n_man&amp;language=eng"/>
   *    <swe:field name="wawa"  xlink:href="https://opendata.fmi.fi/meta?observableProperty=observation&amp;param=wawa&amp;language=eng"/>
   *    </swe:DataRecord>
   *  </gmlcov:rangeType>
   *
   *  XML response is coverted into JSON Array
   *
   *  [
   *    {
   *     humidity: 98
   *     pressure: 1014.8
   *     rain: NaN
   *     rainExplanation: 0
   *     snow: NaN
   *     temperature: 1.3
   *     time: "2018-10-07T19:40:00Z"
   *     weatherCode: 0
   *     weatherCode3: 0
   *     weatherStation: "Espoo Tapiola"
   *     wind: 2.4
   *     windDirection: 314
   * }, {...}
   *  ]
   *
   */

  _parseStations(xmlDocResponse) {
    const stations = xmlDocResponse.querySelectorAll('Point');

    const result = [];

    for (let i = 0; i < stations.length; i += 1) {
      const name = stations[i].querySelector('name').innerHTML.trim();
      const position = stations[i].querySelector('pos').innerHTML.trim();

      result[i] = {};
      result[i].name = name;
      result[i].position = position;

      const positionArray = position.split(' ');
      result[i].lat = parseFloat(positionArray[0]);
      result[i].lon = parseFloat(positionArray[1]);
      result[i].latLon = `${positionArray[0]} ${positionArray[1]}`;
    }

    return result;
  }

  /**
   * Parse stations latitude and longitude. Example of position to be parsed:
   *
   * <gmlcov:positions>
   *   64.93503 25.33920  1599892620
   *   64.93503 25.33920  1599892680
   *   64.93503 25.33920  1599892740
   *   64.93503 25.33920  1599892800
   *   64.93503 25.33920  1599892860
   *   64.93503 25.33920  1599892920
   *   64.93503 25.33920  1599892980
   *   64.93503 25.33920  1599893040
   *   64.93503 25.33920  1599893100
   *   64.93503 25.33920  1599893160
   *   64.93503 25.33920  1599893220
   *   65.00640 25.39321  1599892800
   *   64.93698 25.37299  1599892800
   * </gmlcov:positions>
   *
   * @param {XMLDocument} xmlDocResponse
   */
  _parsePositions(xmlDocResponse) {
    const positions = xmlDocResponse
      .querySelector('positions')
      .innerHTML.trim();
    const positionRows = positions.split(/\r?\n/);

    const stationPositions = [];

    positionRows.map(positionRow => {
      const singleValues = positionRow.trim().split(' ');

      stationPositions.push({
        lat: parseFloat(singleValues[0]),
        latForMap: parseFloat(singleValues[0]),
        lon: parseFloat(singleValues[1]),
        lonForMap: parseFloat(singleValues[1]),
        latLon: `${singleValues[0]} ${singleValues[1]}`,
        timestamp: singleValues[3],
      });
    });

    return stationPositions;
  }

  _parseObservations(xmlDocResponse) {
    const observations = xmlDocResponse
      .querySelector('doubleOrNilReasonTupleList')
      .innerHTML.trim();

    const formattedObservations = [];

    const observationArray = observations.split(/\r?\n/);

    observationArray.forEach(observationLine => {
      const singleValues = observationLine.trim().split(' ');

      const station = {
        temperature: window.parseFloat(singleValues[0]), // t2m
        wind: window.parseFloat(singleValues[1]), // ws_10min
        windGust: window.parseFloat(singleValues[2]), // wg_10min
        windDirection: window.parseFloat(singleValues[3]), // wd_10min
        humidity: window.parseFloat(singleValues[4]), // rh
        dewPoint: window.parseFloat(singleValues[5]), // td
        rain: window.parseFloat(singleValues[6]), // r_1h
        rainExplanation: window.parseFloat(singleValues[7]), // ri_10min
        snow: window.parseFloat(singleValues[8]), // snow_aws
        pressure: Math.round(window.parseFloat(singleValues[9])), // p_sea
        visibility: Math.round(window.parseFloat(singleValues[10]) / 1000), // vis
        cloudiness: window.parseFloat(singleValues[11]), // n_man
        wawaCode: window.parseFloat(singleValues[12]), // wawa
        detailsVisible: false, // toggle visibility in UI
      };

      station.weatherCode3 = wawaToSymbol3(
        station.wawaCode,
        station.cloudiness
      );
      station.feelsLike = feelsLike(station.temperature, station.wind);

      formattedObservations.push(station);
    });

    return formattedObservations;
  }

  _removeWithoutTemperature(observations) {
    return observations.filter(observation =>
      Number.isFinite(observation.temperature)
    );
  }

  _removeDuplicates(observations) {
    return observations.filter((observation, index) => {
      const next = observations[index + 1];
      // hack to remove harmaja for now
      if (observation.latLon === '60.10512 24.97539') {
        return false;
      }

      return next === undefined || observation.latLon !== next.latLon;
    });
  }

  _formatObservations(rawResponse) {
    const positions = this._parsePositions(rawResponse);
    const stations = this._parseStations(rawResponse);
    const observations = this._parseObservations(rawResponse);

    const positionAndName = positions.map(position => {
      const correctStation = stations.find(
        station => station.latLon === position.latLon
      );
      return { ...position, ...correctStation };
    });

    const combined = positionAndName.map((item, index) => {
      return { ...item, ...observations[index] };
    });

    const filteredObservations = this._removeWithoutTemperature(combined);
    let finalObservations = this._removeDuplicates(filteredObservations);

    finalObservations.map(item => {
      item.distance = Math.round(
        distance(item.lat, item.lon, this.place.lat, this.place.lon)
      );
    });

    return finalObservations.sort((item, next) => {
      if (item.distance < next.distance) {
        return -1;
      }
      return 1;
    });
  }

  _roundDownToFullMinutes(minutes) {
    const timeNow = new Date();

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
