import { css, html, LitElement } from 'lit';

import './rain-bars.js';
import './weather-description.js';

import '../../common-components/smooth-expand.js';
import '../../common-components/weather-symbol-small.js';
import '../../common-components/wind-icon.js';
import { isNight } from '../../data-helpers/sun-calculations.js';
import { getHighestWindGustHour, windClassification } from './wind-helper.js';
import { property, state } from 'lit/decorators.js';
import { ForecastDay } from '../../forecast-data.js';
import { getDayName, getDayNumber, getWeekday } from './time-texts.js';

class WeatherDay extends LitElement {
  static get is() {
    return 'weather-day';
  }

  @property({ type: Number, reflect: true })
  dayNumber: number = 0;

  @property({ type: Object })
  location?: object;

  @property({ type: Number, reflect: true })
  minTemperature?: number;

  @property({ type: Boolean, reflect: true })
  showFeelsLike: boolean = false;

  @property({ type: Boolean, reflect: true })
  showWind: boolean = false;

  @property({ type: Array })
  dayData: ForecastDay[] = [];

  @property({ type: Boolean, reflect: true })
  debug: boolean = false;

  @state()
  private highestWindGustHour: number = 0;

  updated(changedProperties: Map<string, any>) {
    if (changedProperties.has('dayData')) {
      this.highestWindGustHour = getHighestWindGustHour(this.dayData);
    }
  }

  static get styles() {
    return css`
      :host {
        --grid-last-column: 25;

        --color-dayHeader: var(--color-blue-800);
        --color-dayHeader-delimiter: var(--background-middle);

        --color-dayHeader-font: var(--color-gray-100);

        --color-toggle-background: var(--color-yellow-300);

        background: var(--background-middle);
        border-radius: var(--border-radius);
        color: var(--color-dark-and-light);
        display: block;
        padding: var(--space-m) 0;

        opacity: 1;
      }

      :host([daynumber='10']) {
        border-bottom: none;
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

        padding-right: var(--space-m);
      }

      :host([daynumber='2']) day,
      :host([daynumber='4']) day,
      :host([daynumber='6']) day,
      :host([daynumber='8']) day,
      :host([daynumber='10']) day {
        background: var(--background);
      }

      .day {
        padding: var(--space-m) 0;
      }

      .day::first-letter {
        text-transform: capitalize;
      }

      .day-name {
        grid-column: span 25;
        font-size: var(--font-size-s);
    
        margin: 0;
        padding-right: var(--space-l);
        padding-left: var(--space-l);
      }

      .day-name--date {
        float: right;
      }

      .symbol_svg {
        width: 32px;
      }

      .hour,
      .hour--empty {
        font-size: var(--font-size-s);
    

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
            ${getDayName(this.dayNumber)} ${getWeekday(this.dayNumber)}
            <span class="day-name--date">
              ${getDayNumber(this.dayNumber)}
            </span>
          </h3>

          <weather-description .dayData="${this.dayData}">
          </weather-description>

          ${this.dayData.map((entry, index) => {
            return html`
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
                            : html`${WeatherDay.round(entry.temperature)}<span
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
                      ?isDayHighest=${(entry.hour === 3 &&
                        this.highestWindGustHour === 1) ||
                      Math.abs(entry.hour - this.highestWindGustHour) <= 1}
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

  private _isThird(index: number) {
    if (this.debug === true) {
      return true;
    }
    return (index + 1) % 3 === 0;
  }

  private static round(item: number) {
    const rounded = Math.round(item);
    const result = Number.isNaN(rounded) ? '' : rounded;

    return result;
  }
}

export { WeatherDay };

window.customElements.define(WeatherDay.is, WeatherDay);
