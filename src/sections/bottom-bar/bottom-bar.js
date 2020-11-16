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
        background: var(--color-white);
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
      }

      button {
        background: var(--color-white);
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
        padding: var(--space-s) var(--space-xl);

        touch-action: none;
        user-select: none;
        width: 100%;
      }

      button:hover {
        cursor: pointer;
      }

      button:focus {
        outline: none;
      }

      button:active {
      }

      button:active .locate-icon {
        -webkit-filter: none;
        filter: none;
      }

      :host([showFeelsLike]) .feelsLike,
      :host([showWind]) .wind {
        color: var(--color-blue-700);
        fill: var(--color-blue-700);
      }

      .locate {
        position: relative;
      }

      .locate-icon {
        position: absolute;
        top: -16px;

        -webkit-filter: drop-shadow(0px 3px 4px rgba(0, 0, 0, 0.3));
        filter: drop-shadow(0px 3px 4px rgba(0, 0, 0, 0.3));
      }

      .small-icon {
        height: 20px;
        width: 20px;
        padding: var(--space-s) var(--space-s) 0 var(--space-s);
      }
    `;
  }

  render() {
    return html`
      <nav>
        <div></div>
        <button @click="${this._toggleFeelsLike}" class="feelsLike">
          <svg-icon class="small-icon" path="assets/image/icons.svg#feelsLike"></svg-icon>
          <div class="button-text">tuntuu</div>
        </div>
        </button>
        
        <button @click="${this._geolocate}">
          <svg-icon class="locate-icon" path="assets/image/icons.svg#locate"></svg-icon>
          <div class="button-text">paikanna</div>
        </button>  
        
        <button @click="${this._toggleWind}" class="wind">
          <svg-icon class="small-icon" path="assets/image/icons.svg#wind"></svg-icon>
          <div class="button-text">tuuli</div>
        </button>
        <div></div>
      </nav>
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
    };
  }

  _toggleFeelsLike() {
    const toggleFeelsLike = new CustomEvent(
      'forecast-header.toggle-feels-like',
      {
        bubbles: true,
        composed: true,
      }
    );
    this.dispatchEvent(toggleFeelsLike);
  }

  _toggleWind() {
    const toggleWind = new CustomEvent('forecast-header.toggle-wind', {
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(toggleWind);
  }

  _geolocate() {
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
        }
      );
    } else {
      this._dispatchEvent('location-selector.locate-error', {
        text: 'paikantaminen epäonnistui, yritä uudelleen',
      });
    }
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
