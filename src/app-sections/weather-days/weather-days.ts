import { css, html, LitElement } from 'lit';

import './weather-day.ts';
import './weather-day-header.ts';
import '../../common-components/smooth-expand.js';
import '../../common-components/switch-toggle.ts';
import '../../common-components/svg-icon.ts';

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
  showHumidity: boolean = false;

  @state()
  showPressure: boolean = false;

  @state()
  updateSmoothExpand: boolean = false;

  @state()
  private expanded = Array(10).fill(false);

  static get styles() {
    return css`
      :host {
        display: grid;
        grid-template-columns: 1fr;
        grid-row-gap: 2px;
      }

      .toggles {
        display: grid;
        justify-items: end;
        gap: var(--space-m);
        padding: var(--space-l);
        padding-bottom: var(--space-xl);
      }
    `;
  }

  updated(changedProperties: Map<string, unknown>) {
    super.updated?.(changedProperties);
    if (changedProperties.has('showWind')) {
      this.updateSmoothExpand = !this.updateSmoothExpand;
    }
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
          <weather-day-header
            @click=${() => this.toggle(index)}
            dayNumber=${index + 1}
            ?showFeelsLike="${this.showFeelsLike}"
            .forecastDay="${forecastDay}"
            ?expanded="${this.expanded[index]}"
          ></weather-day-header>
          <smooth-expand
            ?expanded=${this.expanded[index]}
            ?updateOnChange=${this.updateSmoothExpand}
          >
            <weather-day
              @click=${() => this.toggle(index)}
              dayNumber=${index + 1}
              ?showFeelsLike="${this.showFeelsLike}"
              ?showWind="${this.showWind}"
              ?showPressure="${this.showPressure}"
              ?showHumidity="${this.showHumidity}"
              .forecastDay="${forecastDay}"
              ?expanded="${this.expanded[index]}"
            ></weather-day
          ></smooth-expand>
        </div>`;
      })}
      <div class="toggles">
        <switch-toggle
          @switch-toggle.change=${(e) => {
            this.updateSmoothExpand = !this.updateSmoothExpand;
            this.showWind = e.detail;
          }}
          >Tuuli</switch-toggle
        >

        <switch-toggle
          @switch-toggle.change=${(e) => {
            this.updateSmoothExpand = !this.updateSmoothExpand;
            this.showPressure = e.detail;
          }}
          >Ilmanpaine</switch-toggle
        >
        <switch-toggle
          @switch-toggle.change=${(e) => {
            this.updateSmoothExpand = !this.updateSmoothExpand;
            this.showHumidity = e.detail;
          }}
          >Suhteellinen ilmankosteus</switch-toggle
        >
      </div>
    `;
  }
}

window.customElements.define(WeatherDays.is, WeatherDays);
