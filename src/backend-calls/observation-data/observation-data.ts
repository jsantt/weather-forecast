import { LitElement } from 'lit';

import { distance } from './distance.ts';
import { feelsLike } from '../feels-like.ts';

import { raiseEvent } from '../xml-parser.ts';

import {
  addCoordinatesForMap,
  resolveCollisions,
} from './observation-helpers.js';
import { property } from 'lit/decorators.js';
import { getSmartSymbol } from './weather-symbol-name.ts';

type Station = {
  cloudiness: number;
  detailsVisible: boolean;
  dewPoint: number;
  humidity: number;

  pressure: number;
  rain: number;
  rainExplanation: number;
  snow: number;

  temperature: number;
  visibility: number;
  wawaCode: number; // this can be NaN
  wind: number;

  windDirection: any;
  windGust: number;

  calculated?: boolean;
  collision?: boolean;
  distance?: number;
  feelsLike?: number;
  name?: string;
  weatherCode3?: number;
  smartSymbol?: number;

  lat: number;
  latForMap?: number;
  lon: number;
  lonForMap?: number;
  selectedStation?: boolean;
  timestamp: Date;
};

type Place = {
  geoid: string;
  name: string;
  coordinates: string;
  region: string;
  lat: number;
  lon: number;
};

/**
 * Observations are fetched from the nearest observation station using area name, because
 * there is no support for coordinates
 */
class ObservationData extends LitElement {
  static get is() {
    return 'observation-data';
  }

  // location object, e.g {geoid: "7521614", name: "Kattilalaakso"}
  @property({ type: Object, reflect: true })
  place?: Place;

  updated(changedProperties: Map<string, any>) {
    changedProperties.forEach((_, propName) => {
      if (propName === 'place' && this.place !== undefined) {
        this._newPlace();
      }
    });
  }

  _newPlace() {
    if (this.place === undefined) {
      return;
    }

    const params = ObservationData._getParams(this.place.geoid);
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
      .then((parsedResponse) => {
        // Form [{feelsLike, humidity, ...}, {...}]
        const formattedObservations = this._formatObservations(parsedResponse);

        const calculatedItem = this.calculateStationDetails(
          formattedObservations
        );
        const allObservations = [calculatedItem, ...formattedObservations];

        const observationsWithMapCoordinates =
          addCoordinatesForMap(allObservations);

        const resolvedObs = resolveCollisions(observationsWithMapCoordinates);

        this._dispatch('observation-data.new-data', resolvedObs);
      })
      .catch((rejected) => {
        raiseEvent(this, 'observation-data.fetch-error', {
          text: 'Havaintoja ei saatavilla',
        });
        // eslint-disable-next-line no-console
        console.log(`error ${rejected.stack}`);
      });
  }

  /**
   * Calculate stations details for the current point.
   * @param {*} formattedObservations
   * @returns
   */
  calculateStationDetails(formattedObservations: any[]) {
    if (!formattedObservations || !this.place) {
      return undefined;
    }

    const calculatedItem: any = {
      calculated: true,
      selectedStation: true,
      distance: 0,
      lat: this.place.lat,
      lon: this.place.lon,
      latForMap: this.place.lat,
      lonForMap: this.place.lon,
      latLon: `${this.place.lat} ${this.place.lon}`,
      position: `${this.place.lat} ${this.place.lon}`,
      region: this.place.region,
      name: this.place.name,
    };

    // calculate temperature
    calculatedItem.temperature = ObservationData.calculateWeights(
      formattedObservations,
      'temperature'
    );

    calculatedItem.snow = ObservationData.calculateWeights(
      formattedObservations,
      'snow'
    );

    calculatedItem.wind = ObservationData.calculateWeights(
      formattedObservations,
      'wind'
    );

    calculatedItem.windGust = ObservationData.calculateWeights(
      formattedObservations,
      'windGust'
    );

    calculatedItem.windDirection = ObservationData.calculateWeights(
      formattedObservations,
      'windDirection'
    );

    calculatedItem.humidity = ObservationData.calculateWeights(
      formattedObservations,
      'humidity'
    );

    calculatedItem.dewPoint = ObservationData.calculateWeights(
      formattedObservations,
      'dewPoint'
    );

    calculatedItem.pressure = ObservationData.calculateWeights(
      formattedObservations,
      'pressure'
    );

    calculatedItem.rain = ObservationData.calculateWeights(
      formattedObservations,
      'rain'
    );

    calculatedItem.visibility = ObservationData.calculateWeights(
      formattedObservations,
      'visibility'
    );

    calculatedItem.timestamp = formattedObservations.reduce(
      (accumulator, observation) => {
        return observation.timestamp > accumulator
          ? observation.timestamp
          : accumulator;
      },
      0
    );

    // use nearest wawa code, average hard to calculate
    calculatedItem.wawaCode = formattedObservations
      .filter((item) => {
        return item.wawaCode !== undefined && isFinite(item.wawaCode);
      })
      .at(0).wawaCode;

    // use nearest smart code, average hard to calculate
    calculatedItem.smartSymbol = formattedObservations
      .filter((item) => {
        return item.smartSymbol !== undefined;
      })
      .at(0).smartSymbol;

    calculatedItem.cloudiness = formattedObservations
      .filter((item) => {
        return item.cloudiness !== undefined && isFinite(item.cloudiness);
      })
      .at(0).cloudiness;

    calculatedItem.feelsLike = feelsLike(
      calculatedItem.temperature,
      calculatedItem.wind,
      calculatedItem.humidity
    );

    return calculatedItem;
  }

  static weightedSum(
    observationsWithNormalizedWeights: any[],
    property: string
  ) {
    return observationsWithNormalizedWeights.reduce((accumulator, current) => {
      if (Number.isNaN(current[property])) {
        return accumulator;
      }

      return accumulator + current.normalizedWeight * current[property];
    }, 0);
  }

  /**
   * Calculate normalized weights based on distance.
   * TODO: Ignore stations, where the data is not available
   *
   */
  static calculateWeights(observations, property: string) {
    const pow = 2;

    const observationsWithWeights = observations.map((observation) => {
      let weight: number;
      if (!observation[property]) {
        weight = 0;
      } else if (observation.distance === 0) {
        weight = 1;
      } else {
        weight = 1 / observation.distance ** pow;
      }

      return { ...observation, weight };
    });

    const totalWeight = observationsWithWeights.reduce(
      (accumulator, current) => {
        const weight = current.weight || 0;
        return accumulator + weight;
      },
      0
    );

    if (totalWeight === 0 || isNaN(totalWeight)) {
      return 0;
    }

    const observationsWithNormalizedWeights = observationsWithWeights.map(
      (observation) => {
        const normalizedWeight = observation.weight / totalWeight;
        return { ...observation, normalizedWeight };
      }
    );

    const calculatedAverage = ObservationData.weightedSum(
      observationsWithNormalizedWeights,
      property
    );

    return Math.round(calculatedAverage);
  }

  static _getParams(geoid) {
    const params = {
      request: 'getFeature',
      storedquery_id: 'fmi::observations::weather::multipointcoverage', // multipointcoverage',
      geoid,
      meters: 'ws_10min,t2m',
      maxlocations: 50,
      starttime: ObservationData._roundDownToFullMinutes(-12), // get the latest data only
      endtime: ObservationData._roundDownToFullMinutes(0), // get the latest data only
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

  static _parseStations(xmlDocResponse) {
    const stations = xmlDocResponse.querySelectorAll('Point');

    const result: any = [];

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
  static _parsePositions(xmlDocResponse) {
    if (!xmlDocResponse.querySelector('positions')) {
      return [];
    }

    const positions = xmlDocResponse
      .querySelector('positions')
      .innerHTML.trim();

    const positionRows = positions.split(/\r?\n/);

    const stationPositions: any[] = [];

    positionRows.forEach((positionRow) => {
      const singleValues = positionRow.trim().split(' ');

      stationPositions.push({
        lat: parseFloat(singleValues[0]),
        latForMap: parseFloat(singleValues[0]),
        lon: parseFloat(singleValues[1]),
        lonForMap: parseFloat(singleValues[1]),
        latLon: `${singleValues[0]} ${singleValues[1]}`,
        timestamp: new Date(singleValues[3] * 1000),
      });
    });

    return stationPositions;
  }

  static _parseObservations(xmlDocResponse) {
    if (!xmlDocResponse.querySelector('doubleOrNilReasonTupleList')) {
      return [];
    }

    const observations = xmlDocResponse
      .querySelector('doubleOrNilReasonTupleList')
      .innerHTML.trim();

    const formattedObservations: any = [];

    const observationArray = observations.split(/\r?\n/);

    observationArray.forEach((observationLine) => {
      const singleValues = observationLine.trim().split(' ');
      const cloudiness = window.parseFloat(singleValues[11]); // n_man

      const station: Pick<
        Station,
        | 'temperature'
        | 'wind'
        | 'windGust'
        | 'windDirection'
        | 'humidity'
        | 'dewPoint'
        | 'rain'
        | 'rainExplanation'
        | 'snow'
        | 'pressure'
        | 'visibility'
        | 'cloudiness'
        | 'wawaCode'
        | 'detailsVisible'
        | 'smartSymbol'
        | 'feelsLike'
      > = {
        temperature: window.parseFloat(singleValues[0]), // t2m
        wind: window.parseFloat(singleValues[1]), // ws_10min
        windGust: window.parseFloat(singleValues[2]), // wg_10min
        windDirection: window.parseFloat(singleValues[3]), // wd_10min
        humidity: window.parseFloat(singleValues[4]), // rh
        dewPoint: window.parseFloat(singleValues[5]), // td
        rain: window.parseFloat(singleValues[6]), // r_1h
        rainExplanation: window.parseFloat(singleValues[7]), // ri_10min
        snow: window.parseFloat(singleValues[8]), // snow_aws
        pressure: window.parseFloat(singleValues[9]), // p_sea
        visibility: Math.round(window.parseFloat(singleValues[10]) / 1000), // vis
        cloudiness: cloudiness,
        wawaCode: window.parseFloat(singleValues[12]), // wawa
        detailsVisible: false,
      };

      station.smartSymbol = getSmartSymbol(
        station.wawaCode,
        station.cloudiness
      );

      station.feelsLike = feelsLike(
        station.temperature,
        station.wind,
        station.humidity
      );

      formattedObservations.push(station);
    });

    return formattedObservations;
  }

  static _removeWithoutTemperature(observations) {
    return observations.filter((observation) =>
      Number.isFinite(observation.temperature)
    );
  }

  static _removeDuplicates(observations: Station[]) {
    return observations.filter((observation, index) => {
      const next = observations[index + 1];
      // hack to remove harmaja for now
      if (observation.lat === 60.10512 && observation.lon === 24.97539) {
        return false;
      }

      return (
        next === undefined ||
        (observation.lat !== next.lat && observation.lon !== next.lon)
      );
    });
  }

  _formatObservations(rawResponse: Document): Station[] {
    const positions = ObservationData._parsePositions(rawResponse);
    const stations = ObservationData._parseStations(rawResponse);
    const observations = ObservationData._parseObservations(rawResponse);

    const positionAndName = positions.map((position) => {
      const correctStation = stations.find(
        (station) => station.latLon === position.latLon
      );
      return { ...position, ...correctStation };
    });

    const combined = positionAndName.map((item, index) => {
      return { ...item, ...observations[index] };
    });

    const filteredObservations =
      ObservationData._removeWithoutTemperature(combined);
    console.log('before', filteredObservations);
    const temperatureRemoved =
      ObservationData._removeDuplicates(filteredObservations);
    console.log('after', temperatureRemoved);

    const observations9 = temperatureRemoved.map((item) => {
      const copy = { ...item };
      copy.distance = Math.round(
        distance(copy.lat, copy.lon, this.place?.lat, this.place?.lon)
      );
      return copy;
    });

    const observations10 = observations9.sort((item, next) => {
      if (item.distance && next.distance && item.distance < next.distance) {
        return -1;
      }
      return 1;
    });

    return observations10;
  }

  static _roundDownToFullMinutes(minutes: number) {
    const timeNow = new Date();

    timeNow.setMinutes(timeNow.getMinutes() + minutes);
    timeNow.setSeconds(0, 0);

    return timeNow.toISOString();
  }

  _dispatch(eventName: string, detail: object) {
    const event = new CustomEvent(eventName, {
      detail: detail,
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }
}

window.customElements.define(ObservationData.is, ObservationData);

export type { Place, Station };
