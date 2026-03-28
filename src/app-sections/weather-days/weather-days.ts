import { css, html, LitElement } from 'lit';

import './weather-day.ts';
import './weather-day-header.ts';
import './weather-days-toggles.ts';

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

  @property({ type: Boolean, reflect: true })
  showSettings: boolean = false;

  @state()
  showThunderProbability: boolean = true;

  @state()
  showRainProbability: boolean = true;

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

      .info {
        font-weight: var(--font-weight-bold);
        padding-bottom: var(--space-s);
      }

      .description {
        font-size: var(--font-size-xs);
        margin: 0 0 var(--space-l) 0;
      }
    `;
  }

  constructor() {
    super();
    this.readAndPopulateToggles();
  }

  private readAndPopulateToggles() {
    const data = window.localStorage.getItem('weather-days-toggles');
    if (data) {
      try {
        const parsed = JSON.parse(data) as Partial<Record<string, boolean>>;
        if (typeof parsed.showWind === 'boolean') {
          this.showWind = parsed.showWind;
        }
        if (typeof parsed.showRainProbability === 'boolean') {
          this.showRainProbability = parsed.showRainProbability;
        }
        if (typeof parsed.showThunderProbability === 'boolean') {
          this.showThunderProbability = parsed.showThunderProbability;
        }
        if (typeof parsed.showPressure === 'boolean') {
          this.showPressure = parsed.showPressure;
        }
        if (typeof parsed.showHumidity === 'boolean') {
          this.showHumidity = parsed.showHumidity;
        }
      } catch {
        // ignore parse errors
      }
    }
  }

  private saveToLocalStorage() {
    const data = {
      showWind: this.showWind,
      showRainProbability: this.showRainProbability,
      showThunderProbability: this.showThunderProbability,
      showPressure: this.showPressure,
      showHumidity: this.showHumidity,
    };
    window.localStorage.setItem('weather-days-toggles', JSON.stringify(data));
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
      ${this.showSettings
        ? html`
            <weather-days-toggles
              .showWind=${this.showWind}
              .showRainProbability=${this.showRainProbability}
              .showThunderProbability=${this.showThunderProbability}
              .showPressure=${this.showPressure}
              .showHumidity=${this.showHumidity}
              @weather-day-toggles.close-modal=${() => {
                this.showSettings = false;
              }}
              @toggle-wind=${(e: CustomEvent) => {
                this.updateSmoothExpand = !this.updateSmoothExpand;
                this.showWind = e.detail;
                this.saveToLocalStorage();
              }}
              @toggle-rain-probability=${(e: CustomEvent) => {
                this.updateSmoothExpand = !this.updateSmoothExpand;
                this.showRainProbability = e.detail;
                this.saveToLocalStorage();
              }}
              @toggle-thunder-probability=${(e: CustomEvent) => {
                this.updateSmoothExpand = !this.updateSmoothExpand;
                this.showThunderProbability = e.detail;
                this.saveToLocalStorage();
              }}
              @toggle-pressure=${(e: CustomEvent) => {
                this.updateSmoothExpand = !this.updateSmoothExpand;
                this.showPressure = e.detail;
                this.saveToLocalStorage();
              }}
              @toggle-humidity=${(e: CustomEvent) => {
                this.updateSmoothExpand = !this.updateSmoothExpand;
                this.showHumidity = e.detail;
                this.saveToLocalStorage();
              }}
            ></weather-days-toggles>
          `
        : null}
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
              ?showRainProbability="${this.showRainProbability}"
              ?showThunderProbability="${this.showThunderProbability}"
              ?showPressure="${this.showPressure}"
              ?showHumidity="${this.showHumidity}"
              .forecastDay="${forecastDay}"
              ?expanded="${this.expanded[index]}"
            ></weather-day
          ></smooth-expand>
        </div>`;
      })}
    `;
  }
}

window.customElements.define(WeatherDays.is, WeatherDays);
