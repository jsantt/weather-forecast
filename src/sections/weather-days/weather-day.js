import { css, html, LitElement } from 'lit';

import './rain-bars.js';
import './weather-description.js';

import '../../common-components/smooth-expand.js';
import '../../common-components/weather-symbol-small.js';
import '../../common-components/wind-icon';
import { isNight } from '../../data-helpers/sun-calculations';
import { isDayHighest, windClassification } from './wind-helper.js';

class WeatherDay extends LitElement {
  static get is() {
    return 'weather-day';
  }

  static get styles() {
    return css`
      :host {
        --grid-last-column: 25;

        --color-dayHeader: var(--color-blue-800);
        --color-dayHeader-delimiter: var(--background-middle);

        --color-dayHeader-font: var(--color-gray-100);

        --color-toggle-background: var(--color-yellow-300);

        color: var(--color-dark-and-light);
        display: block;
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
      }

      .weatherDay_grid {
        display: grid;
        grid-row-gap: 0;
        grid-template-columns: repeat(25, 1fr);
        grid-template-rows: minmax(0rem, auto);
      }

      .day {
        background-color: var(--color-blue-800);
        color: var(--color-light);
        padding: var(--space-s) 0;
      }

      .day-name {
        grid-column: span 25;
        font-size: var(--font-size-l);
        font-weight: var(--font-weight-normal);
        margin: 0;
        padding-left: var(--space-l);
      }

      .symbol_svg {
        width: 32px;
      }

      .hour,
      .hour--empty {
        font-size: var(--font-size-s);
        font-weight: var(--font-weight-bold);

        grid-row: 3;
        grid-column: span 1;

        text-align: center;

        color: var(--color-dark-and-light);
        margin: var(--space-l) 0 var(--space-s) 0;
      }

      .hour--empty {
        grid-column: span 1;
      }

      .symbol,
      .symbol--empty {
        grid-column: span 3;
        grid-row: 5;
        text-align: center;
        z-index: var(--z-index-1);
      }

      .symbol--empty {
        grid-column: span 1;
      }

      :host([debug]) .symbol,
      :host([debug]) .temperature,
      :host([debug]) .wind {
        grid-column: span 1;
      }

      .temperature,
      .temperature--empty {
        font-weight: var(--font-weight-bold);
        grid-column: span 3;
        grid-row: 6;

        font-size: var(--font-size-m);
        margin: 0.2rem 0 0 0;
        text-align: center;

        z-index: var(--z-index-1);
      }

      .temperature--negative {
        color: var(--color-temperature-negative);
      }

      .temperature--positive {
        color: var(--color-dark-and-light);
      }

      .temperature_line {
        grid-column: span 25;
        grid-row: 7;
        height: 0;
      }

      weather-description {
        grid-row: 100;
        grid-column: span 25;

        color: var(--color-dark-and-light);
        font-size: var(--font-size-s);

        padding: var(--space-m) var(--space-l) var(--space-l) var(--space-l);
      }

      weather-description:empty {
        padding: 0;
      }

      .wind,
      .wind--empty {
        grid-row: 9;
        margin-top: 0.7rem;
      }

      .temperature--empty,
      .wind--empty {
        grid-column: span 1;
      }

      .wind {
        grid-column: span 3;
        text-align: center;
      }

      .wind,
      .wind--empty,
      weather-description,
      smooth-expand {
        z-index: var(--z-index-2);
      }

      rain-bars {
        grid-column: span 25;
        grid-row: 12;
      }

      .hourly-symbols {
        grid-row: 13;
        margin-top: -1.5rem;

        z-index: var(--z-index-1);
      }

      .feels-like {
        font-style: italic;
      }

      .tiny-symbol {
        position: absolute;
      }
    `;
  }

  render() {
    return html`
      <div class="weatherDay">
        <div class="weatherDay_grid">
          <h3 class="day day-name">
            <span class="visually-hidden">Sää</span>
            ${WeatherDay._day(this.dayNumber)}
            ${WeatherDay._weekday(this.dayNumber)}
          </h3>

          <!-- headers here outside of repeat -->

          <weather-description .dayData="${this.dayData}">
          </weather-description>

          ${this.dayData.map((entry, index) => {
            return html`
              <!-- EMPTY COLUMN -->
              ${index === 0 && this.debug !== true
                ? html`
                    <div class="symbol--empty"></div>
                    <div class="temperature--empty"></div>
                    <div class="wind--empty"></div>
                  `
                : ''}

              <div class="hour">
                ${this._isThird(index) === true ? html`${entry.hour}` : ''}
              </div>

              ${this._isThird(index) === false
                ? ''
                : html`
                    <div class="symbol">
                      <svg-icon
                        path="${`assets/image/weather-symbols.svg#weatherSymbol${
                          entry.symbol
                        }${
                          isNight(entry.time, this.location) ? '-night' : ''
                        }`}"
                      ></svg-icon>
                    </div>

                    <div
                      class="temperature ${entry.temperature < 0
                        ? 'temperature--negative'
                        : 'temperature--positive'}"
                    >
                      ${Number.isFinite(entry.temperature) === true
                        ? html`${this.showFeelsLike === true
                            ? html`<span class="feels-like"
                                >${entry.feelsLike}°</span
                              >`
                            : html`${WeatherDay._round(entry.temperature)}<span
                                  class="celcius"
                                  >°</span
                                >`} `
                        : ''}
                    </div>

                    <wind-icon
                      class="symbol wind"
                      .degrees="${entry.windDirection}"
                      .rating="${windClassification(entry.threeHourWindMax)}"
                      .windSpeed="${entry.threeHourWindMax}"
                      .windGustSpeed="${entry.threeHourWindMaxGust}"
                      ?minimal="${this.showWind !== true}"
                      ?isDayHighest="${isDayHighest(this.dayData, index)}"
                    >
                    </wind-icon>
                  `}
              <div class="hourly-symbols">
                <weather-symbol-small
                  class="tiny-symbol"
                  .rainType="${entry.rainType}"
                >
                </weather-symbol-small>
                ${this.debug === true
                  ? html`${entry.wind}<br />${entry.windGust}<br />${entry.threeHourWindMax}<br />${entry.threeHourWindMaxGust}<br />`
                  : null}
              </div>
            `;
          })}

          <div class="hour hour--empty"></div>

          <rain-bars
            .minTemperature="${this.minTemperature}"
            .dayData="${this.dayData}"
          >
          </rain-bars>
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

      location: {
        type: Object,
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
      debug: {
        type: Boolean,
        reflect: true,
      },
    };
  }

  constructor() {
    super();
    this.debug = false;
    this.dayData = [];
  }

  _isThird(index) {
    if (this.debug === true) {
      return true;
    }
    return (index + 1) % 3 === 0;
  }

  static _day(number) {
    const dayNames = ['Tänään', 'Huomenna', 'Ylihuomenna'];
    return dayNames[number - 1];
  }

  static _weekday(number) {
    const day = new Date();
    day.setDate(day.getDate() + (number - 1));
    return `${day.toLocaleString('fi-FI', { weekday: 'long' })}na`;
  }

  static _round(item) {
    const rounded = Math.round(item);
    const result = Number.isNaN(rounded) ? '' : rounded;

    return result;
  }
}

window.customElements.define(WeatherDay.is, WeatherDay);
