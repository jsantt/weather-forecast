import { css, html, LitElement } from 'lit';

import './rain-bars.js';
import './weather-description.js';
import '../../common-components/smooth-expand.js';
import '../../common-components/weather-symbol-small.js';
import '../../common-components/wind-icon.js';
import { getHighestWindGustHour, windClassification } from './wind-helper.js';
import { property, state } from 'lit/decorators.js';
import { ForecastDay } from '../../backend-calls/forecast-data/forecast-data.js';
import { getSymbolName } from '../../backend-calls/observation-data/weather-symbol-name.js';
import { classMap } from 'lit/directives/class-map.js';

class WeatherDay extends LitElement {
  static get is() {
    return 'weather-day';
  }

  @property({ type: Number, reflect: true })
  dayNumber: number = 0;

  @property({ type: Boolean, reflect: true })
  showFeelsLike: boolean = false;

  @property({ type: Boolean, reflect: true })
  showWind: boolean = false;

  @property({ type: Object })
  forecastDay?: ForecastDay;

  @property({ type: Boolean, reflect: true })
  debug: boolean = false;

  @property({ type: Boolean })
  expanded: boolean = false;

  @state()
  private highestWindGustHour: number = 0;

  updated(changedProperties: Map<string, any>) {
    if (changedProperties.has('dayData') && this.forecastDay !== undefined) {
      this.highestWindGustHour = getHighestWindGustHour(this.forecastDay);
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
        color: var(--color-dark-and-light);
        display: block;
        padding-bottom: var(--space-s);

        opacity: 1;
      }

      :host([daynumber='10']) {
        border-bottom: none;
      }

      h3 {
        margin: 0;
        padding: 0;
        font-weight: var(--font-weight-bold);
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
        padding-bottom: var(--space-m);
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

      .hour,
      .hour--empty {
        font-size: var(--font-size-s);

        grid-row: 3;
        grid-column: span 1;

        text-align: center;

        color: var(--color-dark-and-light);
        margin-bottom: var(--space-s);
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

      .temperature--min span {
        border-bottom: 2px solid var(--background-min);
      }

      .temperature--max span {
        border-top: 2px solid var(--background-max);
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

      expand-icon {
        color: var(--color-secondary-dark-and-light);
        padding-left: var(--space-l);
        padding-right: var(--space-s);
      }
    `;
  }

  render() {
    return html`
      <div class="weatherDay">
        <div class="weatherDay_grid">
          <weather-description .dayData="${this.forecastDay}">
          </weather-description>

          ${this.forecastDay?.hours.map((hour, index) => {
            return html`
              ${index === 0 && this.debug !== true
                ? html`
                    <div class="symbol--empty"></div>
                    <div class="temperature--empty"></div>
                    <div class="wind--empty"></div>
                  `
                : ''}

              <div class="hour">
                ${this._isThird(index) === true ? html`${hour.hour}` : ''}
              </div>

              ${this._isThird(index) === false
                ? ''
                : html`
                    <div class="symbol">
                      ${hour.smartSymbol
                        ? html`
                      <img
                        width="40"
                        height="40"
                        src="${`assets/image/smart/light/${hour.smartSymbol}.svg`}"
                         alt="${
                           getSymbolName(hour.smartSymbol) || 'sääsymboli'
                         }"
                      ></img>`
                        : ''}
                    </div>

                    <div
                      class=${classMap({
                        temperature: true,
                        'temperature--negative': hour.temperature < 0,
                        'temperature--positive': hour.temperature >= 0,
                        'temperature--max': this.showFeelsLike
                          ? hour.feelsLike ===
                            this.forecastDay?.dayMaxFeelsVisible
                          : hour.temperature ===
                            this.forecastDay?.dayMaxTempVisible,
                        'temperature--min': this.showFeelsLike
                          ? hour.feelsLike ===
                            this.forecastDay?.dayMaxFeelsVisible
                          : hour.temperature ===
                            this.forecastDay?.dayMinTempVisible,
                      })}
                    >
                      <span>
                        ${Number.isFinite(hour.temperature) === true
                          ? html`${this.showFeelsLike === true
                              ? html`<span class="feels-like"
                                  >${hour.feelsLike}°</span
                                >`
                              : html`${WeatherDay.round(hour.temperature)}<span
                                    class="celcius"
                                    >°</span
                                  >`} `
                          : ''}
                      </span>
                    </div>
                    <wind-icon
                      class="symbol wind"
                      .degrees="${hour.windDirection}"
                      .rating="${windClassification(hour.threeHourWindMax)}"
                      .windSpeed="${hour.threeHourWindMax}"
                      .windGustSpeed="${hour.threeHourWindMaxGust}"
                      ?minimal="${this.showWind !== true}"
                      ?isDayHighest=${(hour.hour === 3 &&
                        this.highestWindGustHour === 1) ||
                      Math.abs(hour.hour - this.highestWindGustHour) <= 1}
                    >
                    </wind-icon>
                  `}
              <div class="hourly-symbols">
                <weather-symbol-small
                  class="tiny-symbol"
                  .rainType="${hour.rainType}"
                >
                </weather-symbol-small>
                ${this.debug === true
                  ? html`${hour.wind}<br />${hour.windGust}<br />${hour.threeHourWindMax}<br />${hour.threeHourWindMaxGust}<br />`
                  : null}
              </div>
            `;
          })}

          <div class="hour hour--empty"></div>

          <rain-bars .forecastDay="${this.forecastDay}"> </rain-bars>
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
