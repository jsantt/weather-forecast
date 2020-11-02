import { css, html, LitElement } from 'lit-element';

import '../other/geolocate-button.js';

class BottomBar extends LitElement {
  static get is() {
    return 'bottom-bar';
  }

  static get styles() {
    return css`
      :host {
        background: var(--color-white);
        border-top: 1px solid var(--color-gray-300);
        display: grid;
        grid-template-columns: 1fr 1rem 1fr;
        grid-template-rows: auto;

        touch-action: none;
        user-select: none;

        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;

        z-index: var(--z-index-floating-1);
      }

      button {
        background: var(--color-white);
        border: none;
        color: var(--color-blue-700);

        fill: var(--color-blue-700);
        text-align: center;
        margin: 0 auto;
        padding: var(--space-s) var(--space-xl);

        width: 100%;
      }

      :host([showFeelsLike]) .feelsLike,
      :host([showWind]) .wind {
        background: var(--color-yellow-300);
      }

      geolocate-button {
        position: absolute;
        bottom: 0.8rem;
        left: calc(50% - 2.5rem);
      }
    `;
  }

  render() {
    return html`
      <button @click="${this._toggleFeelsLike}" class="feelsLike">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          focusable="false"
          data-prefix="fas"
          data-icon="user"
          class="svg-inline--fa fa-user fa-w-14"
          role="img"
          viewBox="0 0 448 512"
          width="20px"
        >
        <path xmlns="http://www.w3.org/2000/svg" d="M313.6 304c-28.7 0-42.5 16-89.6 16-47.1 0-60.8-16-89.6-16C60.2 304 0 364.2 0 438.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-25.6c0-74.2-60.2-134.4-134.4-134.4zM400 464H48v-25.6c0-47.6 38.8-86.4 86.4-86.4 14.6 0 38.3 16 89.6 16 51.7 0 74.9-16 89.6-16 47.6 0 86.4 38.8 86.4 86.4V464zM224 288c79.5 0 144-64.5 144-144S303.5 0 224 0 80 64.5 80 144s64.5 144 144 144zm0-240c52.9 0 96 43.1 96 96s-43.1 96-96 96-96-43.1-96-96 43.1-96 96-96z"/>
        </svg>
        <div>tuntuu</div>
      </div>
      </button>
      <div>
    
    <geolocate-button ?loading="${this._loading}"></geolocate-button>
          

    </div>
      <button @click="${this._toggleWind}" class="wind">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          focusable="false"
          data-prefix="fas"
          data-icon="wind"
          class="svg-inline--fa fa-wind fa-w-16"
          role="img"
          viewBox="0 0 512 512"
          width="20px"
        >
          <path
            
            d="M156.7 256H16c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h142.2c15.9 0 30.8 10.9 33.4 26.6 3.3 20-12.1 37.4-31.6 37.4-14.1 0-26.1-9.2-30.4-21.9-2.1-6.3-8.6-10.1-15.2-10.1H81.6c-9.8 0-17.7 8.8-15.9 18.4 8.6 44.1 47.6 77.6 94.2 77.6 57.1 0 102.7-50.1 95.2-108.6C249 291 205.4 256 156.7 256zM16 224h336c59.7 0 106.8-54.8 93.8-116.7-7.6-36.2-36.9-65.5-73.1-73.1-55.4-11.6-105.1 24.9-114.9 75.5-1.9 9.6 6.1 18.3 15.8 18.3h32.8c6.7 0 13.1-3.8 15.2-10.1C325.9 105.2 337.9 96 352 96c19.4 0 34.9 17.4 31.6 37.4-2.6 15.7-17.4 26.6-33.4 26.6H16c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16zm384 32H243.7c19.3 16.6 33.2 38.8 39.8 64H400c26.5 0 48 21.5 48 48s-21.5 48-48 48c-17.9 0-33.3-9.9-41.6-24.4-2.9-5-8.7-7.6-14.5-7.6h-33.8c-10.9 0-19 10.8-15.3 21.1 17.8 50.6 70.5 84.8 129.4 72.3 41.2-8.7 75.1-41.6 84.7-82.7C526 321.5 470.5 256 400 256z"
          />
        </svg>
        <div>tuuli</div>
      </button>
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
}

window.customElements.define(BottomBar.is, BottomBar);
