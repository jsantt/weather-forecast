import { css, html, LitElement } from 'lit';

import './rain-bars.js';
import './weather-description.js';
import '../../common-components/weather-symbol-small.js';
import '../../common-components/wind-icon.js';
import { windClassification } from './wind-helper.js';
import { property } from 'lit/decorators.js';
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

  @property({ type: Boolean, reflect: true })
  showPressure: boolean = false;

  @property({ type: Boolean, reflect: true })
  showHumidity: boolean = false;

  @property({ type: Boolean, reflect: true })
  showThunderProbability: boolean = false;

  @property({ type: Object })
  forecastDay?: ForecastDay;

  @property({ type: Boolean, reflect: true })
  debug: boolean = false;

  @property({ type: Boolean })
  expanded: boolean = false;

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

        padding-left: var(--margin);

        padding-right: var(--margin);
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

      .pressure--text {
        grid-row: 11;
        grid-column: 2 / span 25;
      }

      .pressure--text,
      .humidity--text {
        font-size: var(--font-size-xs);
        padding-top: var(--space-l);
      }

      .pressure {
        grid-row: 12;
        grid-column: span 3;
      }

      .pressure--empty {
        grid-row: 12;
        grid-column: span 1;
      }

      .humidity--text {
        grid-row: 13;
        grid-column: 2 / span 25;
      }

      .humidity {
        grid-row: 14;
        grid-column: span 3;
      }

      .humidity--empty {
        grid-row: 14;
        grid-column: span 1;
      }

      .pressure,
      .humidity {
        font-size: var(--font-size-s);
        text-align: center;
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
        grid-row: 7;
        margin-top: 0.8rem;
        margin-bottom: var(--space-m);
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
      weather-description {
        z-index: var(--z-index-2);
      }

      rain-bars {
        grid-column: span 25;
        grid-row: 8;
        padding-top: var(--space-m);
      }

      .hourly-symbols {
        grid-row: 9;

        margin-top: -1.5rem;
        margin-left: 0.4rem;

        z-index: var(--z-index-1);
      }

      .thunder {
        color: var(--color-orange-500);
        font-weight: 400;

        grid-row: 10;
        grid-column: span 3;

        font-size: var(--font-size-xs);
        text-align: center;
      }

      .thunder--empty {
        grid-row: 10;
        grid-column: span 1;
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

      .rain-probability {
        font-size: var(--font-size-xs);
        margin-top: -0.7rem;
        color: #0a95d7;
        font-weight: 400;
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
                    ${this.showThunderProbability
                      ? html` <div class="thunder--empty"></div> `
                      : null}
                    ${this.showPressure
                      ? html`
                          <div class="pressure--text">Ilmanpaine (hPa)</div>
                          <div class="pressure--empty"></div>
                        `
                      : null}
                    ${this.showHumidity
                      ? html` <div class="humidity--text">
                            Suhteellinen ilmankosteus (%)
                          </div>
                          <div class="humidity--empty"></div>`
                      : null}
                  `
                : ''}

              <div class="hour">
                ${this._isThird(index) ? html`${hour.hour}` : ''}
              </div>

              ${!this._isThird(index)
                ? ''
                : html`
                    <div class="symbol">
                      ${hour.smartSymbolAggregate
                        ? html`
                      <img
                        width="40"
                        height="40"
                        src="${`assets/image/smart/light/${hour.smartSymbolAggregate}.svg`}"
                         alt="${
                           getSymbolName(hour.smartSymbolAggregate) ||
                           'sääsymboli'
                         }"
                      ></img><div class="rain-probability">${
                        hour.smartSymbolAggregate % 100 >= 10
                          ? html`${Math.round(
                              hour.rainProbabilityAggregate || 0
                            )}%`
                          : ''
                      }</div>`
                        : ''}
                      ${this.debug && hour.smartSymbol
                        ? html`
                      <img
                        width="20"
                        height="20"
                        src="${`assets/image/smart/light/${hour.smartSymbol}.svg`}"
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

                    ${this.showPressure
                      ? html` <div class="pressure">${hour.pressure}</div> `
                      : null}
                    ${this.showHumidity
                      ? html` <div class="humidity">${hour.humidity}</div> `
                      : null}
                    <wind-icon
                      class="symbol wind"
                      .degrees="${hour.windDirection}"
                      .rating="${windClassification(hour.threeHourWindMax)}"
                      .windSpeed="${hour.threeHourWindMax}"
                      .windGustSpeed="${hour.threeHourWindMaxGust}"
                      ?minimal="${this.showWind !== true}"
                      ?isDayHighest=${!!(
                        (hour.hour === 3 &&
                          this.forecastDay?.dayHighestWindGustHour === 1) ||
                        (this.forecastDay?.dayHighestWindGustHour !==
                          undefined &&
                          Math.abs(
                            hour.hour - this.forecastDay.dayHighestWindGustHour
                          ) <= 1)
                      )}
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
              ${this.showThunderProbability && this._isThird(index)
                ? html`
                    <div class="thunder">
                      ${hour.thunderProbabilityAggregate !== 0
                        ? html`${hour.thunderProbabilityAggregate}%`
                        : null}
                    </div>
                  `
                : null}
            `;
          })}

          <div class="hour hour--empty"></div>

          <rain-bars .forecastDay="${this.forecastDay}"> </rain-bars>
        </div>
      </div>
    `;
  }

  private _isThird(index: number): boolean {
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
