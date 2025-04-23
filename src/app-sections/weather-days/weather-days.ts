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
  forecast?: Forecast;

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
      ${this.forecast?.days.map((forecastDay, index) => {
        return html`<div>
          <weather-day-compact
            @click=${() => this.toggle(index)}
            dayNumber=${index + 1}
            .showFeelsLike="${this.showFeelsLike}"
            .forecastDay="${forecastDay}"
            ?expanded="${this.expanded[index]}"
          ></weather-day-compact>
          ${this.expanded[index]
            ? html` <weather-day
                @click=${() => this.toggle(index)}
                dayNumber=${index + 1}
                .showFeelsLike="${this.showFeelsLike}"
                .showWind="${this.showWind}"
                .forecastDay="${forecastDay}"
                ?expanded="${this.expanded[index]}"
              ></weather-day>`
            : null}
        </div>`;
      })}
    `;
  }
}

window.customElements.define(WeatherDays.is, WeatherDays);
