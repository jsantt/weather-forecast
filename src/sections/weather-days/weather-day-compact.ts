import { css, html, LitElement } from 'lit';

import './rain-bars.js';
import './weather-description.js';

import '../../common-components/smooth-expand.js';
import '../../common-components/weather-symbol-small.js';
import '../../common-components/wind-icon.js';

import { property, state } from 'lit/decorators.js';
import { ForecastDay } from '../../forecast-data.js';
import { getWeekdayShort } from './time-texts.js';
import { isNight } from '../../data-helpers/sun-calculations.js';

class WeatherDay extends LitElement {
  static get is() {
    return 'weather-day-compact';
  }

  @property({ type: Number, reflect: true })
  dayNumber: number = 0;

  @property({ type: Object })
  location?: object;

  @property({ type: Number, reflect: true })
  minTemperature?: number;

  @property({ type: Boolean, reflect: true })
  showFeelsLike: boolean = false;

  @property({ type: Array })
  dayData: ForecastDay[] = [];

  @state()
  dayMin?: number;

  @state()
  dayMax?: number;

  @state()
  dayMinFeelsLike?: number;

  @state()
  dayMaxFeelsLike?: number;

  willUpdate(changedProperties: Map<string, any>) {
    if (changedProperties.has('dayData') && this.dayData) {
      const roundedMin = Math.round(
        this.dayData.reduce((min, entry) => {
          if (!Number.isNaN(entry.temperature)) {
            return Math.min(min, entry.temperature);
          }
          return min;
        }, Infinity)
      );

      if (!Number.isNaN(roundedMin)) {
        this.dayMin = roundedMin;
      }

      const roundedMax = Math.round(
        this.dayData.reduce((max, entry) => {
          if (!Number.isNaN(entry.temperature)) {
            return Math.max(max, entry.temperature);
          }
          return max;
        }, -Infinity)
      );

      if (!Number.isNaN(roundedMax)) {
        this.dayMax = roundedMax;
      }

      // feels like
      const roundedMinFeelsLike = Math.round(
        this.dayData.reduce((min, entry) => {
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
        this.dayData.reduce((max, entry) => {
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
        font-size: var(--font-size-m);
        font-weight: var(--font-weight-bold);
        padding: 1rem;
      }

      .temperature--min {
        background: var(--color-blue-100);
      }

      .temperature--max {
        background: #ffe5e8;
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
    return html` <header>
        ${this.dayNumber === 1 ? 'Tänään' : getWeekdayShort(this.dayNumber)}
      </header>

      <div
        class="temperature temperature--min ${this.dayMin && this.dayMin < 0
          ? 'temperature--negative'
          : 'temperature--positive'}"
      >
        ${this.showFeelsLike === true
          ? html`<span class="feels-like">${this.dayMinFeelsLike}°</span>`
          : html`${this.dayMin}°`}
      </div>

      <div
        class="temperature temperature--max ${this.dayMax && this.dayMax < 0
          ? 'temperature--negative'
          : 'temperature--positive'}"
      >
        ${this.showFeelsLike === true
          ? html`<span class="feels-like">${this.dayMaxFeelsLike}°</span>`
          : html`${this.dayMax}°`}
      </div>

      <div class="symbols fade">
        <svg-icon
          path="${`assets/image/weather-symbols.svg#weatherSymbol${
            this.dayData[8].symbolCompactAggregate
          }${isNight(this.dayData[9].time, this.location) ? '-night' : ''}`}"
        ></svg-icon>
        <svg-icon
          path="${`assets/image/weather-symbols.svg#weatherSymbol${
            this.dayData[15].symbolCompactAggregate
          }${isNight(this.dayData[14].time, this.location) ? '-night' : ''}`}"
        ></svg-icon>
        <svg-icon
          path="${`assets/image/weather-symbols.svg#weatherSymbol${
            this.dayData[23].symbolCompactAggregate
          }${isNight(this.dayData[23].time, this.location) ? '-night' : ''}`}"
        ></svg-icon>
      </div>`;
  }
}

window.customElements.define(WeatherDay.is, WeatherDay);
