import { css, html, LitElement } from 'lit-element';

import './feels-like-icon.js';
import './time-now.js';
import './weather-symbol-name.js';
import '../common/wind-icon.js';
import '../common/svg-icon.js';

class ForecastHeader extends LitElement {
  static get is() {
    return 'forecast-header';
  }

  static get styles() {
    return css`
      :host {
        display: block;
        background-color: var(--color-primary);
        background: var(--background-header);

        padding-bottom: var(--header-background-expand);
      }

      .visually-hidden {
        position: absolute !important;
        clip: rect(1px, 1px, 1px, 1px);
        padding: 0 !important;
        border: 0 !important;
        height: 1px !important;
        width: 1px !important;
        overflow: hidden;
      }

      .header {
        display: grid;
        grid-template-columns: 3.5rem 1fr 1fr 3.5rem;
        grid-template-rows: 1.2rem 4.3rem 3rem 3.5rem;
        grid-template-areas:
          'left empty empty empty'
          'left place place aside'
          'left temp  icon  aside'
          'left text  text  aside ';

        align-items: center;
      }

      .left {
        grid-area: left;
        height: 100%;
        padding-top: 1rem;
      }

      svg-icon {
        --width: 80px;
        --height: 80px;
        grid-area: icon;
        margin: -1rem 0 -1.5rem 0;
      }

      .place {
        text-align: center;
      }

      h2 {
        grid-area: place;
      }

      aside {
        grid-area: aside;
        height: 100%;
        opacity: 0.8;
      }

      .aside-item {
        font-size: var(--font-size-s);
        padding-top: 0.5rem;
        text-align: center;
      }

      .aside-item.selected {
        background-color: #f5f5f529;
      }

      .aside-icon:hover {
        transform: scale(1.1);
      }

      .feelsLike {
        border-top-left-radius: var(--border-radius);
      }

      .wind {
        border-bottom-left-radius: var(--border-radius);
      }

      .item-text--feelsLike {
        margin-top: -0.3rem;
      }

      .item-text--wind {
        margin-top: -0.75rem;
        padding-right: 0.2rem;
      }

      .temperature {
        grid-area: temp;
        font-size: var(--font-size-xxxl);
        line-height: 1.15;
        margin: 0 0 0 auto;
      }

      .degree {
        font-size: var(--font-size-l);
        vertical-align: top;
      }

      #wind {
        padding-left: 0.25rem;
      }

      weather-symbol-name {
        grid-area: text;
        text-align: center;
      }
    `;
  }

  render() {
    return html`
      <header>
        <div class="header">
          <h2 class="visually-hidden">sää nyt</h2>
          <section class="left"></section>
          <div class="circle"></div>
          <h2 class="place">
            <location-selector
              .loading="${this.loading}"
              .place="${this.place}"
            >
            </location-selector>
          </h2>

          <div class="temperature">
            ${ForecastHeader._round(this.temperature)}
            <span class="degree">°C</span>
          </div>

          <svg-icon
            path="assets/image/weather-symbols.svg#weatherSymbol${this.symbol}"
          >
          </svg-icon>

          <weather-symbol-name .symbolId="${this.symbol}">
          </weather-symbol-name>

          <aside>
            <div
              id="feelsLike"
              @click="${this._toggleFeelsLike}"
              class="feelsLike aside-item"
            >
              <feels-like-icon
                .temperature="${this.feelsLike}"
              ></feels-like-icon>
              <div class="item-text item-text--feelsLike">tuntuu</div>
            </div>

            <div id="wind" class="wind aside-item" @click="${this._toggleWind}">
              <wind-icon
                .degrees="${this.windDirection}"
                large
                whiteGust
                .windSpeed="${this.wind}"
                .windGustSpeed="${this.windGust}"
              >
              </wind-icon>
              <div class="item-text item-text--wind">tuuli</div>
            </div>
          </aside>
        </div>
        <time-now .updateTime="${this.loading}"></time-now>
      </header>
    `;
  }

  static get properties() {
    return {
      feelsLike: { type: Number, reflect: true },
      loading: { type: Boolean, reflect: true },
      place: { type: Object, reflect: true },

      symbol: { type: Number, reflect: true },
      temperature: { type: Number, reflect: true },

      wind: { type: Number, reflect: true },
      windDirection: { type: Number, reflect: true },
      windGust: { type: Number, reflect: true },
    };
  }

  _toggleFeelsLike() {
    this.shadowRoot.querySelector('#feelsLike').classList.toggle('selected');

    const toggleFeelsLike = new CustomEvent(
      'forecast-header.toggle-feels-like',
      {
        bubbles: true,
        composed: true,
      }
    );
    this.dispatchEvent(toggleFeelsLike);

    // this._deselectWind();
  }

  _toggleWind() {
    this.shadowRoot.querySelector('#wind').classList.toggle('selected');

    const toggleWind = new CustomEvent('forecast-header.toggle-wind', {
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(toggleWind);

    // this._deselectFeelsLike();
  }

  _deselectWind() {
    const windSelected = this.shadowRoot
      .querySelector('#wind')
      .classList.contains('selected');

    if (windSelected) {
      this.shadowRoot.querySelector('#wind').classList.remove('selected');
      const toggleWind = new CustomEvent('forecast-header.toggle-wind', {
        bubbles: true,
        composed: true,
      });
      this.dispatchEvent(toggleWind);
    }
  }

  _deselectFeelsLike() {
    const feelsSelected = this.shadowRoot
      .querySelector('#feelsLike')
      .classList.contains('selected');

    if (feelsSelected) {
      this.shadowRoot.querySelector('#feelsLike').classList.remove('selected');
      const toggleFeelsLike = new CustomEvent(
        'forecast-header.toggle-feels-like',
        { bubbles: true, composed: true }
      );
      this.dispatchEvent(toggleFeelsLike);
    }
  }

  static _round(value) {
    if (Number.isNaN(value)) {
      return '';
    }

    return Math.round(value);
  }
}

window.customElements.define(ForecastHeader.is, ForecastHeader);
