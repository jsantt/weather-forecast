import { css, html, LitElement } from 'lit';

import './weather-description.js';

import '../../common-components/smooth-expand.js';
import '../../common-components/weather-symbol-small.js';
import '../../common-components/wind-icon.js';

import { property, state } from 'lit/decorators.js';
import { ForecastDay } from '../../backend-calls/forecast-data/forecast-data.js';
import { getWeekdayShort } from './time-texts.js';
import { getSymbolName } from '../../backend-calls/observation-data/weather-symbol-name.js';

class WeatherDay extends LitElement {
  static get is() {
    return 'weather-day-compact';
  }

  @property({ type: Number, reflect: true })
  dayNumber: number = 0;

  @property({ type: Object })
  location?: object;

  @property({ type: Boolean, reflect: true })
  showFeelsLike: boolean = false;

  @property({ type: Object })
  forecastDay?: ForecastDay;

  @state()
  dayMinFeelsLike?: number;

  @state()
  dayMaxFeelsLike?: number;

  willUpdate(changedProperties: Map<string, any>) {
    if (changedProperties.has('dayData') && this.forecastDay?.hours) {
      // feels like
      const roundedMinFeelsLike = Math.round(
        this.forecastDay.hours.reduce((min, entry) => {
          if (!Number.isNaN(entry.feelsLike)) {
            return Math.min(min, entry.feelsLike);
          }
          return min;
        }, Infinity)
      );

      if (!Number.isNaN(roundedMinFeelsLike)) {
        this.dayMinFeelsLike = roundedMinFeelsLike;
      }

      const roundedMaxFeelsLike = Math.round(
        this.forecastDay.hours.reduce((max, entry) => {
          if (!Number.isNaN(entry.feelsLike)) {
            return Math.max(max, entry.feelsLike);
          }
          return max;
        }, -Infinity)
      );

      if (!Number.isNaN(roundedMaxFeelsLike)) {
        this.dayMaxFeelsLike = roundedMaxFeelsLike;
      }
    }
  }

  static get styles() {
    return css`
      :host {
        display: grid;
        align-items: center;
        gap: var(--space-m);
        grid-template-columns:
          minmax(1rem, 2fr) minmax(2rem, 4rem) minmax(2rem, 4rem)
          5fr;

        background: var(--background-middle);
      }

      :host([daynumber='10']) {
        border-bottom: none;
      }

      header {
        font-size: var(--font-size-s);
        font-weight: var(--font-weight-bold);
        text-transform: capitalize;
        color: var(--color-dark-and-light);
        padding: var(--space-l);
      }
      .symbols {
        justify-self: center;
        display: flex;
      }

      .temperature {
        justify-self: center;

        font-size: var(--font-size-m);
        font-weight: var(--font-weight-bold);

        padding: 0.25rem 0.5rem;
        margin: var(--space-l) 0;
      }

      .temperature--min {
        border-bottom: 2px solid var(--background-min);
      }

      .temperature--max {
        border-top: 2px solid var(--background-max);
      }

      .temperature--negative {
        color: var(--color-temperature-negative);
      }

      .feels-like {
        font-style: italic;
      }
    `;
  }

  render() {
    if (!this.forecastDay) {
      return;
    }

    return html` <header>
        ${this.dayNumber === 1 ? 'Tänään' : getWeekdayShort(this.dayNumber)}
      </header>

      <div
        class="temperature temperature--min ${this.forecastDay.dayMinTemp &&
        this.forecastDay.dayMinTemp < 0
          ? 'temperature--negative'
          : 'temperature--positive'}"
      >
        ${this.showFeelsLike === true
          ? html`<span class="feels-like">${this.dayMinFeelsLike}°</span>`
          : html`${this.forecastDay.dayMinTemp !== undefined &&
            Math.round(this.forecastDay.dayMinTemp)}°`}
      </div>

      <div
        class="temperature temperature--max ${this.forecastDay.dayMaxTemp &&
        this.forecastDay.dayMaxTemp < 0
          ? 'temperature--negative'
          : 'temperature--positive'}"
      >
        ${this.showFeelsLike === true
          ? html`<span class="feels-like">${this.dayMaxFeelsLike}°</span>`
          : html`${this.forecastDay.dayMaxTemp !== undefined &&
            Math.round(this.forecastDay.dayMaxTemp)}°`}
      </div>

      <div class="symbols fade">
        ${this.forecastDay.hours[8]?.smartSymbolCompactAggregate
          ? html`
        <img
          src="${`assets/image/smart/light/${this.forecastDay.hours[8]?.smartSymbolCompactAggregate}.svg`}"
          alt="${
            getSymbolName(this.forecastDay.hours[8].smartSymbol) || 'sääsymboli'
          }"
        ></img>`
          : ''}
        ${this.forecastDay.hours[15]?.smartSymbolCompactAggregate
          ? html`<img
          src="${`assets/image/smart/light/${this.forecastDay.hours[15]?.smartSymbolCompactAggregate}.svg`}"
          alt="${
            getSymbolName(this.forecastDay.hours[15].smartSymbol) ||
            'sääsymboli'
          }"
        ></img>`
          : ''}
        ${this.forecastDay.hours[23]?.smartSymbolCompactAggregate
          ? html`<img
            src="${`assets/image/smart/light/${this.forecastDay.hours[23]?.smartSymbolCompactAggregate}.svg`}"
            alt="${
              getSymbolName(this.forecastDay.hours[23].smartSymbol) ||
              'sääsymboli'
            }"
        ></img>`
          : ''}
      </div>`;
  }
}

window.customElements.define(WeatherDay.is, WeatherDay);
