import { css, html, LitElement } from 'lit-element';

import { totalRain, totalSnow } from './rain-helper.js';
import { windWarning } from './wind-helper.js';

import './rain-amount.js';
import './snow-amount.js';
import './temperature-line.js';

import './rain-bars.js';
import './wind-speed.js';

import '../../common-components/smooth-expand.js';
import '../../common-components/weather-symbol-small.js';
import '../../common-components/wind-icon.js';

class WeatherDay extends LitElement {
  static get is() {
    return 'weather-day';
  }

  static get styles() {
    return css`
      :host {
        --grid-last-column: 25;

        --color-dayHeader: var(--color-blue-650);
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
        color: var(--color-white);
        padding: var(--space-s) 0;
      }

      .day-name {
        border-top-left-radius: var(--border-radius);
        grid-column: span 10;
        font-weight: var(--font-weight-normal);
        margin: 0;
        padding-left: var(--space-m);
        text-transform: uppercase;
      }

      .day-snow,
      .day-rain,
      .day-wind {
        background-color: var(--color-dayHeader);
        grid-column: span 5;
        text-align: right;
      }

      .day-wind {
        border-top-right-radius: var(--border-radius);
        padding-right: var(--space-m);
      }

      @media only screen and (min-width: 400px) {
        .day-name {
          grid-column: span 13;
        }
        .day-snow,
        .day-rain,
        .day-wind {
          grid-column: span 4;
        }
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

      .wind_header {
        background: var(--color-dayHeader-delimiter);
        color: var(--color-black);
        font-size: var(--font-size-xs);

        padding-left: 0.5rem;
        grid-column: span 25;

        margin-top: -0.25rem;
        text-align: right;
      }

      .wind,
      .wind--empty {
        grid-row: 98;
      }

      .wind_header {
        grid-row: 100;
      }

      .temperature--empty,
      .wind--empty {
        grid-column: span 1;
      }

      .wind {
        color: var(--color-black);
        grid-column: span 3;
        font-size: var(--font-size-m);

        text-align: center;
      }

      .wind,
      .wind--empty,
      .wind_header,
      smooth-expand {
        background: var(--color-dayHeader-delimiter);
        z-index: var(--z-index-2);
      }

      wind-icon {
        margin-top: var(--space-m);
        min-height: 37px;
      }

      .rainBars {
        grid-column: span 25;
        grid-row: 12;
        padding-top: 1.55rem;
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
          <h3 class="day day-name">
            <span class="visually-hidden">SÄÄ</span>
            ${WeatherDay._day(this.dayNumber)}
            ${WeatherDay._weekday(this.dayNumber)}
          </h3>

          <snow-amount
            class="day day-snow"
            .snowAmount="${WeatherDay._snow(this.dayData)}"
          ></snow-amount>

          <rain-amount
            class="day day-rain"
            .rainAmount="${WeatherDay._rain(this.dayData)}"
          ></rain-amount>

          <wind-speed
            class="day day-wind"
            .windRating="${WeatherDay._windRating(this.dayData)}"
            .windDescription="${WeatherDay._windDescription(this.dayData)}"
            @click="${() => this._toggleWind()}"
          >
            m/s
          </wind-speed>

          <!-- headers here outside of repeat -->

          <smooth-expand
            class="wind_header"
            ?expanded="${this.showWind === true}"
          >
            keskituuli / tuuli puuskissa
          </smooth-expand>
          ${this.dayData.map((entry, index) => {
            return html`
              <!-- EMPTY COLUMN -->
              ${index === 1
                ? html`
                    <div class="symbol--empty"></div>
                    <div class="temperature--empty"></div>
                    <div class="wind--empty"></div>
                  `
                : ''}

              <div class="hour">
                ${WeatherDay._isThird(index) === true
                  ? html`${entry.hour}`
                  : ''}
              </div>

              ${WeatherDay._isThird(index) === false
                ? ''
                : html`
                    <div class="symbol">
                      <svg-icon
                        path="${`assets/image/weather-symbols.svg#weatherSymbol${entry.symbol}`}"
                      ></svg-icon>
                    </div>

                    <div class="temperature">
                      ${Number.isFinite(entry.temperature) === true
                        ? html`${this.showFeelsLike === true
                              ? entry.feelsLike2
                              : WeatherDay._round(entry.temperature)}<span
                              class="degree"
                              >°</span
                            >`
                        : ''}
                    </div>

                    <smooth-expand class="wind" ?expanded="${this.showWind}">
                      <wind-icon
                        class="symbol"
                        .degrees="${entry.windDirection}"
                        .windSpeed="${entry.wind}"
                        .windGustSpeed="${entry.windGust}"
                      >
                      </wind-icon>
                    </smooth-expand>
                  `}
              <div class="hourlySymbols">
                <weather-symbol-small
                  class="tinySymbol"
                  .rainType="${entry.rainType}"
                >
                </weather-symbol-small>
              </div>
            `;
          })}

          <div class="hour hour--empty"></div>

          <div class="temperature_line">
            <temperature-line
              .minTemperature="${this.minTemperature}"
              .dayData="${this.dayData}"
            >
            </temperature-line>
          </div>

          <section class="rainBars">
            <rain-bars
              .minTemperature="${this.minTemperature}"
              .dayData="${this.dayData}"
            >
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

  static _weekday(number) {
    const day = new Date();
    day.setDate(day.getDate() + (number - 1));
    return day.toLocaleString('fi-FI', { weekday: 'short' });
  }

  static _windDescription(dayData) {
    return windWarning(dayData).description;
  }

  static _windRating(dayData) {
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

  static _isThird(index) {
    return (index + 1) % 3 === 0;
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
