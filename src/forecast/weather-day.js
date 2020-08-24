import { css, html, LitElement } from 'lit-element';

import { totalRain, totalSnow } from './rain-helper.js';
import { windWarning } from './wind-helper.js';

import './rain-amount.js';
import './snow-amount.js';
import './temperature-line.js';

import './rain-bars.js';
import './wind-speed.js';
import '../common/weather-symbol.js';
import '../common/weather-symbol-small.js';

import '../common/wind-icon.js';

class WeatherDay extends LitElement {
  static get is() {
    return 'weather-day';
  }

  static get styles() {
    return css`
      :host {
        --grid-last-column: 25;

        --color-dayHeader: var(--color-secondary);
        --color-dayHeader-delimiter: var(--color-gray-300);

        --color-dayHeader-font: var(--color-white);

        --color-toggle-background: var(--color-yellow-300);

        color: var(--color-blue-800);
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

      .weatherDay {
        min-height: 8rem;
        position: relative;
        margin: 0 var(--space-m) var(--space-l) var(--space-m);
      }

      .weatherDay_grid {
        background-color: var(--color-white);
        border-radius: var(--border-radius);
        display: grid;
        grid-row-gap: 0;
        grid-template-columns: repeat(25, 1fr);
        grid-template-rows: minmax(1.4rem, auto);
      }

      .day {
        background-color: var(--color-dayHeader);
        border-top-left-radius: var(--border-radius);
        border-top-right-radius: var(--border-radius);
        color: var(--color-dayHeader-font);

        font-size: var(--font-size-s);
        grid-column: span 25;
        grid-row: 1;

        padding-left: var(--space-m);

        padding-top: var(--space-s);
        padding-bottom: var(--space-s);
      }

      .day-name {
        display: inline-block;
        font-size: var(--font-size-s);
        text-transform: uppercase;
        font-weight: var(--font-weight-normal);
        padding: 0;
        margin: 0;
      }

      .symbol_svg {
        width: 32px;
      }

      .hour,
      .hour--empty {
        font-size: var(--font-size-s);

        grid-row: 2;
        grid-column: span 1;

        text-align: center;

        color: var(--color-gray-900);
        margin: var(--space-l) 0 var(--space-s) 0;
      }

      .hour--empty {
        grid-column: span 1;
      }

      .hour--past {
        color: var(--color-gray--light);
      }

      .past-hour {
        opacity: 0.1;
      }

      .symbol,
      .symbol--empty {
        grid-column: span 3;
        grid-row: 4;
        text-align: center;
        z-index: var(--z-index-1);
      }
      .symbol--empty {
        grid-column: span 1;
      }

      .temperature,
      .temperature--empty {
        font-weight: var(--font-weight-normal);
        grid-column: span 3;
        grid-row: 5;

        font-size: var(--font-size-m);
        text-align: center;
        z-index: var(--z-index-1);
      }

      .temperature_line {
        grid-column: span 25;
        grid-row: 6;
        height: 0;
      }

      .feelsLike_header,
      .wind_header {
        background-color: var(--color-toggle-background);

        color: var(--color-black);
        font-size: var(--font-size-xs);

        padding-left: 0.5rem;
        grid-column: span 25;

        margin-top: -0.25rem;
        text-align: right;
      }

      .feelsLike,
      .feelsLike--empty {
        grid-row: 7;
      }

      .feelsLike_header {
        grid-row: 8;
      }

      .wind,
      .wind--empty {
        grid-row: 9;
      }

      .wind_header {
        grid-row: 10;
      }

      .temperature--empty,
      .feelsLike--empty,
      .wind--empty {
        grid-column: span 1;
      }

      .wind--empty,
      .feelsLike--empty {
        background-color: var(--color-toggle-background);
        margin-top: var(--space-m);
      }

      .wind,
      .feelsLike {
        background-color: var(--color-toggle-background);
        color: var(--color-black);
        grid-column: span 3;
        font-size: var(--font-size-m);

        text-align: center;
        margin-top: var(--space-m);

        padding-top: var(--space-m);

        max-height: 5rem;
        transition: max-height 0.15s ease-out;
        overflow: hidden;

        will-change: max-height;
      }

      .wind,
      .feelsLike,
      .wind--empty,
      .feelsLike--empty,
      .wind_header,
      .feelsLike_header {
        z-index: var(--z-index-2);
      }

      .wind--hidden,
      .feelsLike--hidden {
        max-height: 0;
        padding: 0;
      }

      .wind-icon {
        vertical-align: sub;
        fill: var(--color-blue-300);
      }

      .wind-warning {
        padding-left: 0.5rem;
      }
      .rain-amount {
        float: right;
        padding-right: 0.5rem;
      }
      rain-amount,
      snow-amount {
        padding-left: 0.5rem;
      }

      .rainBars {
        grid-column: span 25;
        grid-row: 12;
        padding-top: 1.55rem;
      }

      .feelsLikeValue {
        font-size: 16px;
      }

      .hourlySymbols {
        grid-row: 13;
        margin-top: -1.5rem;

        z-index: var(--z-index-1);
      }

      .tinySymbol {
        position: absolute;
      }
    `;
  }

  render() {
    return html`
     <wind-helper></wind-helper>

      <div class="weatherDay"> 
        <div class="weatherDay_grid">
        
          <div class="day">
            <h3 class="day-name">
              <span class="visually-hidden">SÄÄ</span> 
              ${WeatherDay._day(this.dayNumber)} ${WeatherDay._weekday(
      this.dayNumber
    )}
            </h3>

            <span class="wind-warning">
              <wind-speed 
                .windRating="${this._windRating(this.dayData)}" 
                .windDescription="${WeatherDay._windDescription(this.dayData)}"
                @click="${() => this._toggleWind()}">
              </wind-speed>
            </span>
            <span class="rain-amount">
              <snow-amount .snowAmount="${WeatherDay._snow(
                this.dayData
              )}"></snow-amount>
              <rain-amount .rainAmount="${WeatherDay._rain(
                this.dayData
              )}"></rain-amount>
            </span>
          </span></span></div>
        
        <!-- headers here outside of repeat -->    

        ${
          this.showWind === true
            ? html`<div class="wind_header">
                keskituuli / tuuli puuskissa
              </div>`
            : ''
        }
        

        ${
          this.showFeelsLike === true
            ? html`<div class="feelsLike_header">tuntuu kuin</div>`
            : ''
        }

        ${this.dayData.map((entry, index) => {
          return html`
            <!-- EMPTY COLUMN -->
            ${this._isFirst(index) === true
              ? html`
                  <div class="symbol--empty"></div>
                  <div class="temperature--empty"></div>
                  <div class="feelsLike--empty"></div>
                  <div class="wind--empty"></div>
                `
              : ''}

            <div class="hour ${entry.past === true ? 'hour--past' : ''}">
              ${this._isThird(index) === true ? html`${entry.hour}` : ''}
            </div>

            ${this._isThird(index) === false
              ? ''
              : html` <div
                    class="symbol ${entry.past === true ? 'past-hour' : ''}"
                  >
                    <weather-symbol
                      .symbolId="${entry.symbol}"
                    ></weather-symbol>
                  </div>

                  <div
                    class="temperature ${entry.past === true
                      ? 'past-hour'
                      : ''}"
                  >
                    ${this._notNaN(entry.temperature) === true
                      ? html`${WeatherDay._round(entry.temperature)}<span
                            class="degree"
                            >°</span
                          >`
                      : ''}
                  </div>

                  <div
                    class="wind ${this.showWind !== true ? 'wind--hidden' : ''}"
                  >
                    <wind-icon
                      class="symbol ${entry.past === true ? 'past-hour' : ''}"
                      .degrees="${entry.windDirection}"
                      .windSpeed="${entry.wind}"
                      .windGustSpeed="${entry.windGust}"
                    >
                    </wind-icon>
                  </div>

                  <div
                    class="feelsLike ${this.showFeelsLike !== true
                      ? 'feelsLike--hidden'
                      : ''}"
                  >
                    <div
                      class="symbol ${entry.past === true ? 'past-hour' : ''}"
                    >
                      ${this._notNaN(entry.feelsLike) == true
                        ? html`${entry.feelsLike}<span class="degree">°</span>`
                        : ''}
                    </div>
                  </div>`}
            <div class="hourlySymbols">
              <weather-symbol-small
                class="tinySymbol"
                .rain="${entry.rain}"
                .symbolId="${entry.symbol}"
              >
              </weather-symbol-small>
            </div>
          `;
        })}

        <div class="hour hour--empty">
        </div>
      
        
        <div class="temperature_line">
            
          <temperature-line 
            .minTemperature="${this.minTemperature}" 
            .dayData="${this.dayData}">
          </temperature-line>
    
        </div>

        <section class="rainBars">

          <rain-bars
            .minTemperature="${this.minTemperature}" 
            .dayData="${this.dayData}">
          </rain-bars>

        </section>
      </div>
    </div>
    `;
  }

  static get properties() {
    return {
      dayNumber: {
        type: Number,
        reflect: true,
      },

      minTemperature: {
        type: Number,
        reflect: true,
      },

      showFeelsLike: {
        type: Boolean,
        reflect: true,
      },

      showWind: {
        type: Boolean,
        reflect: true,
      },

      dayData: {
        type: Array,
      },
    };
  }

  constructor() {
    super();
    this.dayData = [];
  }

  static _day(number) {
    const dayNames = ['Tänään', 'Huomenna', 'Ylihuomenna'];
    return dayNames[number - 1];
  }

  _getClasses(showBoth, baseClasses, pastClass) {
    const classes = showBoth
      ? baseClasses.concat(' ').concat(pastClass)
      : baseClasses;
    return classes;
  }

  static _weekday(number) {
    const day = new Date();
    day.setDate(day.getDate() + (number - 1));
    return day.toLocaleString('fi-FI', { weekday: 'short' });
  }

  static _windDescription(dayData) {
    return windWarning(dayData).description;
  }

  _windRating(dayData) {
    if (dayData === undefined || dayData.length < 1) {
      return '';
    }

    return windWarning(dayData).rating;
  }

  static _rain(dayData) {
    return totalRain(dayData);
  }

  static _snow(dayData) {
    return totalSnow(dayData);
  }

  static _round(item) {
    const rounded = Math.round(item);
    const result = Number.isNaN(rounded) ? '' : rounded;

    return result;
  }

  _isFirst(index) {
    return index === 1;
  }

  _isThird(index) {
    return (index + 1) % 3 === 0;
  }

  _notNaN(item) {
    return !Number.isNaN(item);
  }

  _toggleWind() {
    const toggleWind = new CustomEvent(`forecast-header.toggle-wind`, {
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(toggleWind);
  }

  get _windHelper() {
    return this.shadowRoot.querySelector('wind-helper');
  }
}

window.customElements.define(WeatherDay.is, WeatherDay);
