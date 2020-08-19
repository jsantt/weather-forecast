import { css, html, LitElement } from 'lit-element';

import './combo-box.js';
import { CITIES, TOP_10_CITIES } from './city-list.js';

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

        margin: 0 0 0.2rem 0;
        text-align: center;
        padding-bottom: 0.5rem;
      }

      vaadin-combo-box {
        /* overwriting Vaadin's default styles */
        --lumo-contrast-10pct: transparent;
        --lumo-font-size-m: var(--font-size-l);
        --lumo-font-weight: var(--font-weight-boldest);
        --lumo-font-family: 'Open Sans Condensed', sans-serif;
        --vaadin-text-field-default-width: 13.5rem;
      }

      .lds-ripple {
        display: inline-block;
        position: relative;
        width: 80px;
        height: 80px;
      }
      .lds-ripple div {
        position: absolute;
        border: 4px solid #fff;
        opacity: 1;
        border-radius: 50%;
        animation: lds-ripple 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;
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
    return html` ${this.loading === true
      ? html` <div class="locate_loadIcon lds-ripple" active="">
          <div></div>
        </div>`
      : html`
          <!--vaadin-combo-box
            id="placeSelection"
            item-label-path="city"
            item-value-path="coordinates"
            @opened-changed="${event => this._openedChanged(event)}"
            label="Sää paikassa"
          >
            <template>
              <div>[[item.city]]</div>
            </template>
          </vaadin-combo-box-->
          <!-- todo: listen and set new value  -->
          <combo-box
            value="${this.place === undefined ? '' : this.place.name}"
            .items="${CITIES}"
            key="city"
          ></combo-box>
        `}`;
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
    };
  }

  constructor() {
    super();

    this._defaultPlace = {
      city: 'Helsinki',
      coordinates: '60.1698557,24.9383791',
    };

    document.addEventListener('visibilitychange', () => {
      if (document.hidden === false) {
        this._notifyPreviousPlace();
      }
    });

    this.addEventListener('combo-box.new-value', event => {
      this.place = event.detail;
    });
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
    // combobox.selectedItem = this.place.name;

    const url = this.place.name;

    this._changeUrl('place', url);
    this._store('place', this.place.name, this.place.coordinates);

    // combobox.items = this._placeList();
  }

  _notifyPreviousPlace() {
    const storedPlaces = this._getFromLocalStorage('place');
    let currentPlace;
    if (storedPlaces) {
      currentPlace = storedPlaces[0];
    } else {
      currentPlace = this._defaultPlace;
      this._storeIntoLocalStorage('place', TOP_10_CITIES);
    }
    this._dispatchEvent('location-selector.location-changed', currentPlace);
  }

  _isHighlighted(index) {
    return index < 10;
  }

  _openedChanged(customEvent) {
    const combobox = this.shadowRoot.querySelector('#placeSelection');

    if (this._isComboboxOpen(customEvent)) {
      combobox.focus();
      this._previousPlace = combobox.selectedItem; // this._formPlaceObject(this.placeName);
      combobox.selectedItem = null;
    } else if (this._isComboboxPlaceSelected(combobox)) {
      this._dispatchEvent(
        'location-selector.location-changed',
        combobox.selectedItem
      );
    } else if (this._isComboboxDismiss(combobox)) {
      combobox.selectedItem = this._previousPlace || this._defaultPlace;
    }
  }

  _isComboboxOpen(customEvent) {
    return customEvent.detail && customEvent.detail.value;
  }

  _isComboboxPlaceSelected(combobox) {
    return combobox && combobox.selectedItem;
  }

  /* return if user closes the city selection modal without any selections */
  _isComboboxDismiss(combobox) {
    return combobox && !combobox.selectedItem;
  }

  _placeList() {
    const previousLocations = this._getFromLocalStorage('place');
    const allLocations = previousLocations.concat(CITIES);

    return allLocations;
  }

  /**
   * @return whether response API is supported
   */

  _responseApi() {
    return navigator.permissions;
  }

  /**
   * @return whether location is already allowed and can be used without
   * showing pop up to user
   */

  _locationAlreadyAllowed() {
    return new Promise(function (resolve, reject) {
      if (!this._responseApi()) {
        reject;
      } else {
        navigator.permissions
          .query({ name: 'geolocation' })
          .then(permission =>
            permission.state === 'granted' ? resolve : reject
          );
      }
    });
  }

  _getUrlParams(name, url) {
    name = name.replace(/[\[\]]/g, '\\$&');

    const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`);
    const results = regex.exec(url);
    if (!results) {
      return null;
    }
    if (!results[2]) {
      return '';
    }

    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }

  _changeUrl(paramName, paramValue) {
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

  _formPlaceObject(city, coordinates) {
    return { city, coordinates };
  }

  _store(key, city, coordinates) {
    const newPlace = [this._formPlaceObject(city, coordinates)];
    const previousPlaces = this._getFromLocalStorage('place');

    const filtered10 = newPlace.concat(
      previousPlaces.filter(item => item.city !== city).slice(0, 9)
    );
    this._storeIntoLocalStorage(key, filtered10);
  }

  _storeIntoLocalStorage(key, valueObject) {
    localStorage.setItem(key, JSON.stringify(valueObject));
  }

  _getFromLocalStorage(key) {
    return JSON.parse(localStorage.getItem(key));
  }
}

window.customElements.define(LocationSelector.is, LocationSelector);
