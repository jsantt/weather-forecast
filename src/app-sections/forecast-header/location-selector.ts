import { css, html, LitElement } from 'lit';

import './combo-box';
import { CITIES, DEFAULT_PLACE, TOP_10_CITIES } from './city-list';
import { property } from 'lit/decorators.js';
import { Place } from '../../backend-calls/observation-data/observation-data';

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
        display: block;
        text-align: center;
        max-width: 450px;
        margin-bottom: -0.5rem;
      }
    `;
  }

  render() {
    return html` <combo-box
      .currentValue="${this.city}"
      .items="${LocationSelector.placeList()}"
      key="city"
      ?loading=${this.loading}
      @combo-box.clicked=${() => (this.city = '')}
      @combo-box.new-value=${this._onComboBoxNewValue}
    ></combo-box>`;
  }

  constructor() {
    super();

    window.addEventListener('visibilitychange', () =>
      this._onVisibilityChange()
    );
    window.addEventListener('pageshow', (e) => this._onPageShow(e));
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('visibilitychange', this._onVisibilityChange);
    window.removeEventListener('pageshow', this._onPageShow);
  }

  _onVisibilityChange() {
    if (document.hidden === false) {
      this.onInit();
    }
  }

  _onPageShow(event: PageTransitionEvent) {
    if (event.persisted) {
      this.onInit();
    }
  }

  _onComboBoxNewValue(e: CustomEvent<string>) {
    this.city = e.detail;

    if (e.detail === '' || e.detail === null || e.detail === undefined) {
      return;
    }

    // combobox tells the city only, get city and coordinates from localstorage items and city list
    const cityAndCoordinates = LocationSelector.placeList().find(
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

    this.raiseEvent('location-selector.location-changed', cityAndCoordinates2);
  }

  static _splitCoordinates(coordinateString: string) {
    const latLon = coordinateString.split(',');
    return { lat: latLon[0], lon: latLon[1] };
  }

  firstUpdated() {
    this.onInit();
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

    window.history.replaceState(null, '', `/${url}`);

    LocationSelector.store('place', this.place.name, this.place.coordinates);
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

  getContextPath(): string {
    const pathname = window.location.pathname;
    const match = pathname.match(/^\/([^\/]+)(?=\/|$)/);
    return match ? match[1] : '';
  }

  onInit() {
    const contextPath = this.getContextPath(); // Works for '/', '/myapp', but not '/my/app'

    // get from URL
    let currentPlace = CITIES.find((city) => city.city === contextPath);

    // get from local storage
    if (!currentPlace) {
      const storedPlaces = LocationSelector.getFromLocalStorage('place');

      if (storedPlaces) {
        // eslint-disable-next-line prefer-destructuring
        currentPlace = LocationSelector.placeList()[0];
      } else {
        // default
        currentPlace = {
          city: DEFAULT_PLACE.city,
          coordinates: DEFAULT_PLACE.coordinates,
        };
        LocationSelector.storeIntoLocalStorage('place', TOP_10_CITIES);
      }
    }

    const latLon = LocationSelector._splitCoordinates(currentPlace.coordinates);

    // placeEvent example:
    // {city: "Espoo",
    // coordinates: "60.205556,24.655556",
    // lat: 60.205556,
    // lon: 24.655556}
    const placeEvent = {
      ...currentPlace,
      lat: parseFloat(latLon.lat),
      lon: parseFloat(latLon.lon),
    };

    this.raiseEvent('location-selector.location-changed', placeEvent);
  }

  static placeList() {
    const previousLocations = LocationSelector.getFromLocalStorage('place');
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

  static responseApi() {
    return navigator.permissions;
  }

  raiseEvent(name: string, payload: Object) {
    const event = new CustomEvent(name, {
      detail: payload,
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }

  static formPlaceObject(city, coordinates) {
    return { city, coordinates };
  }

  static store(key: string, city, coordinates) {
    const newPlace = [LocationSelector.formPlaceObject(city, coordinates)];
    const previousPlaces = LocationSelector.getFromLocalStorage('place');

    if (!previousPlaces || previousPlaces.length < 1) {
      LocationSelector.storeIntoLocalStorage(key, newPlace);
      return;
    }

    const filtered10 = newPlace.concat(
      previousPlaces.filter((item) => item.city !== city).slice(0, 9)
    );
    LocationSelector.storeIntoLocalStorage(key, filtered10);
  }

  static storeIntoLocalStorage(
    key: string,
    valueObject: { city: any; coordinates: any }[]
  ) {
    localStorage.setItem(key, JSON.stringify(valueObject));
  }

  static getFromLocalStorage(key: string):
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
