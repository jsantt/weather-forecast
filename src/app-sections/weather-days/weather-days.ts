import { css, html, LitElement } from 'lit';

import './weather-day.ts';
import './weather-day-compact.ts';

import { Forecast } from '../../backend-calls/forecast-data/forecast-data.ts';
import { property, state } from 'lit/decorators.js';

class WeatherDays extends LitElement {
  static get is() {
    return 'weather-days';
  }

  @property({ type: Object })
  forecastData?: Forecast;

  @property({ type: Object })
  location?: object;

  @property({ type: Boolean, reflect: true })
  showFeelsLike: boolean = false;

  @property({ type: Boolean, reflect: true })
  showWind: boolean = false;

  @state()
  private expanded = Array(10).fill(false);

  static get styles() {
    return css`
      :host {
        display: grid;
        grid-template-columns: 1fr;
        grid-row-gap: 2px;
      }
    `;
  }

  private toggle(index: number) {
    const expandedCopy = [...this.expanded];
    expandedCopy[index] = !expandedCopy[index];
    this.expanded = expandedCopy;
  }

  render() {
    return html`
      ${this.forecastData?.days.map((day, index) => {
        if (this.expanded[index]) {
          return html`<weather-day
            @click=${() => this.toggle(index)}
            dayNumber=${index + 1}
            .location="${this.location}"
            .showFeelsLike="${this.showFeelsLike}"
            .showWind="${this.showWind}"
            .dayData="${day}"
          ></weather-day> `;
        } else {
          return html`<weather-day-compact
            @click=${() => this.toggle(index)}
            dayNumber=${index + 1}
            .location="${this.location}"
            .showFeelsLike="${this.showFeelsLike}"
            .dayData="${day}"
          ></weather-day-compact> `;
        }
      })}
    `;
  }
}

window.customElements.define(WeatherDays.is, WeatherDays);
