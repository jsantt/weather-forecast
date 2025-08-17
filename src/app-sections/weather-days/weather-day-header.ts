import { css, html, LitElement } from 'lit';

import '../../common-components/smooth-expand.js';
import '../../common-components/weather-symbol-small.js';
import '../../common-components/wind-icon.js';

import '../../common-components/expand-icon.js';

import { property } from 'lit/decorators.js';
import { ForecastDay } from '../../backend-calls/forecast-data/forecast-data.js';
import { getDayNumber, getWeekdayShort } from './time-texts.js';
import { getSymbolName } from '../../backend-calls/observation-data/weather-symbol-name.js';
import { classMap } from 'lit/directives/class-map.js';

class WeatherDayHeader extends LitElement {
  static get is() {
    return 'weather-day-header';
  }

  @property({ type: Number, reflect: true })
  dayNumber: number = 0;

  @property({ type: Boolean, reflect: true })
  showFeelsLike: boolean = false;

  @property({ type: Object })
  forecastDay?: ForecastDay;

  @property({ type: Boolean, reflect: true })
  expanded: boolean = false;

  static get styles() {
    return css`
      :host {
        background: var(--background-middle);

        display: grid;
        align-items: center;
        gap: var(--space-m);
        grid-template-columns:
          minmax(1rem, 3fr) minmax(2rem, auto) auto minmax(2rem, auto)
          5fr auto;

        grid-template-rows: 4rem;

        padding: 0 var(--margin);
      }

      :host([expanded]) {
        grid-template-columns: minmax(1rem, 3fr) 0 0 0 0 auto;
      }

      :host([daynumber='1']) {
        border-top-left-radius: var(--border-radius);
        border-top-right-radius: var(--border-radius);
      }

      :host([daynumber='10']) {
        border-bottom-left-radius: var(--border-radius);
        border-bottom-right-radius: var(--border-radius);
      }

      :host([daynumber='10']) {
        border-bottom: none;
      }

      header {
        font-size: var(--font-size-s);
        font-weight: var(--font-weight-bold);
        text-transform: capitalize;
        color: var(--color-dark-and-light);
      }
      .symbols {
        justify-self: center;
        display: flex;
      }

      .temperature {
        justify-self: center;

        font-size: var(--font-size-m);

        margin: var(--space-l) 0;
      }

      .temperature--min {
        justify-self: right;
      }

      .temperature--max {
        justify-self: left;
      }

      .temperature--negative {
        color: var(--color-temperature-negative);
      }

      .feels-like {
        font-style: italic;
      }

      expand-icon {
        color: var(--color-secondary-dark-and-light);
      }

      .today {
        font-size: var(--font-size-xs);
        font-weight: var(--font-weight-normal);
      }

      .hide span {
        display: none;
      }
      .divider {
        font-size: var(--font-size-l);
        opacity: 0.6;
      }
    `;
  }

  private dayText() {
    let text: string;

    text = getWeekdayShort(this.dayNumber);

    if (this.expanded) {
      text += ` ${getDayNumber(this.dayNumber)}`;
    }
    return text;
  }

  render() {
    if (!this.forecastDay) {
      return;
    }
    return html` <header>
        ${this.dayText()}
        <div class="today">
          ${this.dayNumber === 1 ? 'tänään' : ''}${this.dayNumber === 2
            ? 'huomenna'
            : ''}${this.dayNumber === 3 ? 'ylihuomenna' : ''}
        </div>
      </header>
      <div
        class=${classMap({
          temperature: true,
          'temperature--min': true,
          'temperature--negative':
            this.forecastDay.dayMinTemp !== undefined &&
            this.forecastDay.dayMinTemp < 0,
          'temperature--positive':
            this.forecastDay.dayMinTemp !== undefined &&
            this.forecastDay.dayMinTemp >= 0,
          hide: this.expanded,
        })}
      >
        <span>
          ${this.showFeelsLike === true
            ? html`<span class="feels-like"
                >${this.forecastDay.dayMinFeels}°</span
              >`
            : html`${this.forecastDay.dayMinTemp !== undefined &&
              Math.round(this.forecastDay.dayMinTemp)}°`}
        </span>
      </div>

      <div
        class=${classMap({
          divider: true,
          hide: this.expanded,
        })}
      >
        <span>...</span>
      </div>

      <div
        class=${classMap({
          temperature: true,
          'temperature--max': true,
          'temperature--negative':
            this.forecastDay.dayMaxTemp !== undefined &&
            this.forecastDay.dayMaxTemp < 0,
          'temperature--positive':
            this.forecastDay.dayMaxTemp !== undefined &&
            this.forecastDay.dayMaxTemp >= 0,
          hide: this.expanded,
        })}
      >
        <span>
          ${this.showFeelsLike === true
            ? html`<span class="feels-like"
                >${this.forecastDay.dayMaxFeels}°</span
              >`
            : html`${this.forecastDay.dayMaxTemp !== undefined &&
              Math.round(this.forecastDay.dayMaxTemp)}°`}
        </span>
      </div>

      <div class="symbols fade">
        ${this.expanded
          ? null
          : html` ${this.forecastDay.hours[8]?.smartSymbolAggregate
              ? html`
          <img
          src="${`assets/image/smart/light/${this.forecastDay.hours[8]?.smartSymbolAggregate}.svg`}"
          width="40"
          height="40"
          alt="${
            getSymbolName(this.forecastDay.hours[8].smartSymbolAggregate) ||
            'sääsymboli'
          }"
        ></img>`
              : ''}
            ${this.forecastDay.hours[14]?.smartSymbolAggregate
              ? html`<img
          src="${`assets/image/smart/light/${this.forecastDay.hours[14]?.smartSymbolAggregate}.svg`}"
          alt="${
            getSymbolName(this.forecastDay.hours[14].smartSymbolAggregate) ||
            'sääsymboli'
          }"
        ></img>`
              : ''}
            ${this.forecastDay.hours[20]?.smartSymbolAggregate
              ? html`<img
            src="${`assets/image/smart/light/${this.forecastDay.hours[20]?.smartSymbolAggregate}.svg`}"
            alt="${
              getSymbolName(this.forecastDay.hours[20].smartSymbolAggregate) ||
              'sääsymboli'
            }"
        ></img>`
              : ''}`}
      </div>

      <expand-icon ?open=${this.expanded}></expand-icon>`;
  }
}

window.customElements.define(WeatherDayHeader.is, WeatherDayHeader);
