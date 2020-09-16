import { css, html, LitElement } from 'lit-element';

import './combo-box.js';
import { CITIES, DEFAULT_PLACE, TOP_10_CITIES } from './city-list.js';

/**
 * @customElement
 */
class LocationSelector extends LitElement {
  static get is() {
    return 'location-selector';
  }

  static get styles() {
    return css`
      :host {
        display: inline-block;
        text-align: center;
      }

      .lds-ripple {
        display: inline-block;
        position: relative;
        width: 66px;
        height: 66px;
      }
      .lds-ripple div {
        position: absolute;
        border: 4px solid #fff;
        opacity: 1;
        border-radius: 50%;
        animation: lds-ripple 1.5s cubic-bezier(0, 0.2, 0.8, 1) infinite;
      }
      .lds-ripple div:nth-child(2) {
        animation-delay: -0.5s;
      }
      @keyframes lds-ripple {
        0% {
          top: 36px;
          left: 36px;
          width: 0;
          height: 0;
          opacity: 1;
        }
        100% {
          top: 0px;
          left: 0px;
          width: 52px;
          height: 52px;
          opacity: 0;
        }
      }
    `;
  }

  render() {
    return html` <combo-box
      .currentValue="${this.city}"
      .items="${this._placeList()}"
      key="city"
      ?loading=${this.loading}
    ></combo-box>`;
  }

  /**
   * place example: {"geoid":"651436","name":"Korospohja","coordinates":"61.92410999999999,25.748151","region":"Jyväskylä"}
   */
  static get properties() {
    return {
      _defaultPlace: {
        type: Object,
        reflect: true,
      },
      _previousPlace: {
        type: Object,
        reflect: true,
      },
      loading: {
        type: Boolean,
        reflect: true,
      },
      place: {
        type: Object,
        reflect: true,
      },
      city: {
        type: String,
        reflect: true,
      },
    };
  }

  constructor() {
    super();

    this.city = DEFAULT_PLACE.city;

    this._defaultPlace = {
      city: 'Helsinki',
      coordinates: '60.1698557,24.9383791',
    };

    document.addEventListener('visibilitychange', () => {
      if (document.hidden === false) {
        this._notifyPreviousPlace();
      }
    });

    this.addEventListener('combo-box.clicked', () => {
      this.city = '';
    });

    this.addEventListener('combo-box.new-value', event => {
      this.city = event.detail;

      if (
        event.detail === '' ||
        event.detail === null ||
        event.detail === undefined
      ) {
        return;
      }

      // combobox tells the city only, get city and coordinates from localstorage items and city list
      const cityAndCoordinates = this._placeList().find(
        item => item.city === this.city
      );

      const latLon = LocationSelector._splitCoordinates(
        cityAndCoordinates.coordinates
      );
      cityAndCoordinates.lat = latLon.lat;
      cityAndCoordinates.lon = latLon.lon;

      this._dispatchEvent(
        'location-selector.location-changed',
        cityAndCoordinates
      );
    });
  }

  static _splitCoordinates(coordinateString) {
    const latLon = coordinateString.split(',');
    return { lat: latLon[0], lon: latLon[1] };
  }

  firstUpdated() {
    this._notifyPreviousPlace();
  }

  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName === 'place') {
        this._newPlace();
      }
    });
  }

  /**
   * When customer chooses geolocate, we need to wait response containing place name
   */
  _newPlace() {
    this.city = this.place.name;

    const url = this.place.name;

    LocationSelector._changeUrl('place', url);
    this._store('place', this.place.name, this.place.coordinates);
  }

  _notifyPreviousPlace() {
    const storedPlaces = LocationSelector._getFromLocalStorage('place');
    let currentPlace;
    if (storedPlaces) {
      currentPlace = storedPlaces[0];
    } else {
      currentPlace = this._defaultPlace;
      LocationSelector._storeIntoLocalStorage('place', TOP_10_CITIES);
    }
    const latLon = LocationSelector._splitCoordinates(currentPlace.coordinates);
    currentPlace.lat = latLon.lat;
    currentPlace.lon = latLon.lon;

    this._dispatchEvent('location-selector.location-changed', currentPlace);
  }

  _placeList() {
    let allLocations;

    const previousLocations = LocationSelector._getFromLocalStorage('place');
    if (previousLocations !== null) {
      allLocations = previousLocations.concat(CITIES);
    }

    return allLocations;
  }

  /**
   * @return whether response API is supported
   */

  static _responseApi() {
    return navigator.permissions;
  }

  static _changeUrl(paramName, paramValue) {
    history.replaceState(null, null, `?${paramName}=${paramValue}`);
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

  _store(key, city, coordinates) {
    const newPlace = [LocationSelector._formPlaceObject(city, coordinates)];
    const previousPlaces = LocationSelector._getFromLocalStorage('place');

    const filtered10 = newPlace.concat(
      previousPlaces.filter(item => item.city !== city).slice(0, 9)
    );
    LocationSelector._storeIntoLocalStorage(key, filtered10);
  }

  static _storeIntoLocalStorage(key, valueObject) {
    localStorage.setItem(key, JSON.stringify(valueObject));
  }

  static _getFromLocalStorage(key) {
    return JSON.parse(localStorage.getItem(key));
  }
}

window.customElements.define(LocationSelector.is, LocationSelector);
