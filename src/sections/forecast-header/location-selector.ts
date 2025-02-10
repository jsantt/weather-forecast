import { css, html, LitElement } from 'lit';

import './combo-box';
import { CITIES, DEFAULT_PLACE, TOP_10_CITIES } from './city-list';
import { property } from 'lit/decorators.js';
import { Place } from '../../observation-data';

class LocationSelector extends LitElement {
  static get is() {
    return 'location-selector';
  }

  @property({ type: Boolean, reflect: true })
  loading: boolean = false;

  @property({ type: Object })
  place?: Place;

  @property({ type: String, reflect: true })
  city: string = DEFAULT_PLACE.city;

  static get styles() {
    return css`
      :host {
        display: inline-block;
        text-align: center;
      }
    `;
  }

  render() {
    return html` <combo-box
      .currentValue="${this.city}"
      .items="${LocationSelector._placeList()}"
      key="city"
      ?loading=${this.loading}
    ></combo-box>`;
  }

  constructor() {
    super();

    window.addEventListener('visibilitychange', () => {
      if (document.hidden === false) {
        this._notifyPreviousPlace();
      }
    });
    window.addEventListener('pageshow', (event) => {
      if (event.persisted) {
        this._notifyPreviousPlace();
      }
    });

    this.addEventListener('combo-box.clicked', () => {
      this.city = '';
    });

    this.addEventListener('combo-box.new-value', ((
      event: CustomEvent<string>
    ) => {
      this.city = event.detail;

      if (
        event.detail === '' ||
        event.detail === null ||
        event.detail === undefined
      ) {
        return;
      }

      // combobox tells the city only, get city and coordinates from localstorage items and city list
      const cityAndCoordinates = LocationSelector._placeList().find(
        (item) => item.city === this.city
      );

      if (!cityAndCoordinates?.coordinates) {
        return;
      }

      const latLon = LocationSelector._splitCoordinates(
        cityAndCoordinates.coordinates
      );

      const cityAndCoordinates2: {
        city: string;
        coordinates: string;
        lat?: number;
        lon?: number;
      } = cityAndCoordinates;
      cityAndCoordinates2.lat = parseFloat(latLon.lat);
      cityAndCoordinates2.lon = parseFloat(latLon.lon);

      this._dispatchEvent(
        'location-selector.location-changed',
        cityAndCoordinates2
      );
    }) as EventListener);
  }

  static _splitCoordinates(coordinateString: string) {
    const latLon = coordinateString.split(',');
    return { lat: latLon[0], lon: latLon[1] };
  }

  firstUpdated() {
    this._notifyPreviousPlace();
  }

  updated(changedProperties: Map<string, any>) {
    changedProperties.forEach((_oldValue, propName) => {
      if (propName === 'place' && this.place != null) {
        this._newPlace();
      }
    });
  }

  /**
   * When customer chooses geolocate, we need to wait response containing place name
   */
  _newPlace() {
    if (this.place === undefined) {
      return;
    }
    this.city = LocationSelector._getPlaceName(this.place.name);
    (this.shadowRoot?.querySelector('combo-box') as any).requestUpdate();

    const url = this.place.name;

    LocationSelector._changeUrl('place', url);
    LocationSelector._store('place', this.place.name, this.place.coordinates);
  }

  static _getPlaceName(name) {
    const newName = CITIES.filter((item) => {
      return name === item.key;
    });

    if (newName.length > 0) {
      return newName[0].city;
    }
    return name;
  }

  _notifyPreviousPlace() {
    const storedPlaces = LocationSelector._getFromLocalStorage('place');

    let currentPlace;
    if (storedPlaces) {
      // eslint-disable-next-line prefer-destructuring
      currentPlace = LocationSelector._placeList()[0];
    } else {
      currentPlace = {
        city: DEFAULT_PLACE.city,
        coordinates: DEFAULT_PLACE.coordinates,
      };
      LocationSelector._storeIntoLocalStorage('place', TOP_10_CITIES);
    }
    const latLon = LocationSelector._splitCoordinates(currentPlace.coordinates);

    currentPlace.lat = parseFloat(latLon.lat);
    currentPlace.lon = parseFloat(latLon.lon);

    this._dispatchEvent('location-selector.location-changed', currentPlace);
  }

  static _placeList() {
    const previousLocations = LocationSelector._getFromLocalStorage('place');
    if (previousLocations === undefined) {
      return CITIES;
    }

    const filterBadOnes = previousLocations.filter((item) => {
      return item.city !== undefined && item.coordinates !== undefined;
    });
    const allLocations = filterBadOnes.concat(CITIES);

    return allLocations;
  }

  /**
   * @return whether response API is supported
   */

  static _responseApi() {
    return navigator.permissions;
  }

  static _changeUrl(paramName, paramValue) {
    window.history.replaceState(null, '', `?${paramName}=${paramValue}`);
  }

  _dispatchEvent(name, payload) {
    const event = new CustomEvent(name, {
      detail: payload,
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }

  static _formPlaceObject(city, coordinates) {
    return { city, coordinates };
  }

  static _store(key: string, city, coordinates) {
    const newPlace = [LocationSelector._formPlaceObject(city, coordinates)];
    const previousPlaces = LocationSelector._getFromLocalStorage('place');

    if (!previousPlaces || previousPlaces.length < 1) {
      LocationSelector._storeIntoLocalStorage(key, newPlace);
      return;
    }

    const filtered10 = newPlace.concat(
      previousPlaces.filter((item) => item.city !== city).slice(0, 9)
    );
    LocationSelector._storeIntoLocalStorage(key, filtered10);
  }

  static _storeIntoLocalStorage(
    key: string,
    valueObject: { city: any; coordinates: any }[]
  ) {
    localStorage.setItem(key, JSON.stringify(valueObject));
  }

  static _getFromLocalStorage(key: string):
    | {
        coordinates: string;
        city: string;
      }[]
    | undefined {
    const item = localStorage.getItem(key);
    if (item === null) {
      return undefined;
    }
    return JSON.parse(item);
  }
}

window.customElements.define(LocationSelector.is, LocationSelector);
