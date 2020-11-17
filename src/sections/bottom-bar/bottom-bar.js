import { css, html, LitElement } from 'lit-element';

import '../../common-components/svg-icon.js';

class BottomBar extends LitElement {
  static get is() {
    return 'bottom-bar';
  }

  static get styles() {
    return css`
      :host {
        --color: var(--color-blue-700);

        display: block;
        background: var(--color-gray-300);

        border-top: 1px solid var(--color-gray-300);

        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;

        z-index: var(--z-index-floating-1);
      }

      nav {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
        grid-template-rows: auto;

        max-width: 500px;
        margin: 0 auto;
      }

      button {
        background: none;
        border: none;
        color: var(--color);

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-end;

        fill: var(--color);
        font-family: var(--font-family-primary);
        font-size: var(--font-size-s);
        font-weight: var(--font-weight-bold);

        height: 100%;

        text-align: center;
        margin: 0 auto;
        padding: var(--space-s);
        width: 100%;
      }

      button:hover {
        cursor: pointer;
      }

      button:focus {
        outline: none;
      }

      button:active .locate-icon {
        filter: none;
      }

      :host([showFeelsLike]) .feelsLike,
      :host([showWind]) .wind {
        color: var(--color-black);
        fill: var(--color-black);
      }

      .locate {
        position: relative;
      }

      .locate-icon {
        position: absolute;
        top: -16px;

        filter: drop-shadow(0px 3px 4px rgba(0, 0, 0, 0.3));
      }

      .small-icon {
        fill: var(--color-blue-700);

        filter: drop-shadow(rgba(0, 0, 0, 0.3) 0px 3px 4px);

        height: 20px;
        width: 20px;
        padding: var(--space-s) var(--space-s) 0 var(--space-s);
      }
      .error {
        color: var(--color-blue-700);
        font-size: var(--font-size-l);
        font-weight: var(--font-weight-boldest);
        padding: var(--space-s);
        text-align: center;
      }
    `;
  }

  render() {
    return html`
      <nav>
        <button @click="${this._toggleMapSize}">
          <svg
            class="small-icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
            id="expand"
          >
            <path
              d="M212.686 315.314L120 408l32.922 31.029c15.12 15.12 4.412 40.971-16.97 40.971h-112C10.697 480 0 469.255 0 456V344c0-21.382 25.803-32.09 40.922-16.971L72 360l92.686-92.686c6.248-6.248 16.379-6.248 22.627 0l25.373 25.373c6.249 6.248 6.249 16.378 0 22.627zm22.628-118.628L328 104l-32.922-31.029C279.958 57.851 290.666 32 312.048 32h112C437.303 32 448 42.745 448 56v112c0 21.382-25.803 32.09-40.922 16.971L376 152l-92.686 92.686c-6.248 6.248-16.379 6.248-22.627 0l-25.373-25.373c-6.249-6.248-6.249-16.378 0-22.627z"
            />
          </svg>
          <div class="button-text">havainnot</div>
        </button>

        <button @click="${this._toggleFeelsLike}" class="feelsLike">
          <svg-icon
            class="small-icon"
            path="assets/image/icons.svg#feelsLike"
          ></svg-icon>
          <div class="button-text">tuntuu</div>
        </button>

        <button @click="${this._geolocate}">
          <svg-icon
            class="locate-icon"
            path="assets/image/icons.svg#locate"
          ></svg-icon>
          <div class="button-text">paikanna</div>
        </button>

        <button @click="${this._toggleWind}" class="wind">
          <svg-icon
            class="small-icon"
            path="assets/image/icons.svg#wind"
          ></svg-icon>
          <div class="button-text">tuuli</div>
        </button>

        <button @click="${BottomBar._radar}">
          <svg class="small-icon" viewBox="0 0 576 512" id="radar">
            <path
              d="M575.7 280.8C547.1 144.5 437.3 62.6 320 49.9V32c0-17.7-14.3-32-32-32s-32 14.3-32 32v17.9C138.3 62.6 29.5 144.5.3 280.8c-2.2 10.1 8.5 21.3 18.7 11.4 52-55 107.7-52.4 158.6 37 5.3 9.5 14.9 8.6 19.7 0 20.2-35.4 44.9-73.2 90.7-73.2 58.5 0 88.2 68.8 90.7 73.2 4.8 8.6 14.4 9.5 19.7 0 51-89.5 107.1-91.4 158.6-37 10.3 10 20.9-1.3 18.7-11.4zM256 301.7V432c0 8.8-7.2 16-16 16-7.8 0-13.2-5.3-15.1-10.7-5.9-16.7-24.1-25.4-40.8-19.5-16.7 5.9-25.4 24.2-19.5 40.8 11.2 31.9 41.6 53.3 75.4 53.3 44.1 0 80-35.9 80-80V301.6c-9.1-7.9-19.8-13.6-32-13.6-12.3.1-22.4 4.8-32 13.7z"
            />
          </svg>
          <div class="button-text">sadetutka</div>
        </button>
      </nav>
      ${this._error === undefined
        ? ''
        : html`<div class="error">
            salli paikannus nähdäksesi paikkakuntasi sää
          </div>`}
    `;
  }

  static get properties() {
    return {
      showFeelsLike: {
        type: Boolean,
        reflect: true,
      },
      showWind: {
        type: Boolean,
        reflect: true,
      },
      _error: {
        type: String,
      },
    };
  }

  static _radar() {
    this._cleanError();
    document.location.href = 'https://sataako.fi';
  }

  _toggleFeelsLike() {
    this._cleanError();
    const toggleFeelsLike = new CustomEvent(
      'forecast-header.toggle-feels-like',
      {
        bubbles: true,
        composed: true,
      }
    );
    this.dispatchEvent(toggleFeelsLike);
  }

  _toggleMapSize() {
    this._cleanError();
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
    this._dispatchEvent('bottom-bar.toggleMapSize');
  }

  _toggleWind() {
    this._cleanError();
    const toggleWind = new CustomEvent('forecast-header.toggle-wind', {
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(toggleWind);
  }

  _geolocate() {
    this._cleanError();
    this._dispatchEvent('location-selector.locate-started');

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          this._dispatchEvent(
            'location-selector.location-changed',
            BottomBar._formPlaceObject(
              position.coords.latitude,
              position.coords.longitude
            )
          );
        },
        () => {
          this._dispatchEvent('location-selector.locate-error', {
            text: 'salli paikannus nähdäksesi paikkakuntasi sää',
          });
          this._error = 'salli paikannus selaimesi asetuksista';
        }
      );
    } else {
      this._dispatchEvent('location-selector.locate-error', {
        text: 'paikantaminen epäonnistui, yritä uudelleen',
      });
      this._error = 'salli paikannus selaimesi asetuksista';
    }
  }

  _cleanError() {
    this._error = undefined;
  }

  _dispatchEvent(name, payload) {
    const event = new CustomEvent(name, {
      detail: payload,
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }

  static _formPlaceObject(lat, lon) {
    const coordinates = `${lat},${lon}`;
    return { city: undefined, coordinates, lat, lon };
  }
}

window.customElements.define(BottomBar.is, BottomBar);
