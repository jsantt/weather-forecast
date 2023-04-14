import { css, html, LitElement } from 'lit-element';

import './rain-amount.js';
import './max-wind.js';

import { rainStartTime, totalRain, totalSnow } from './rain-helper.js';
import { windGustWarning, windWarning } from './wind-helper.js';

class WeatherDescription extends LitElement {
  static get is() {
    return 'weather-description';
  }

  static get styles() {
    return css`
      :host {
        display: inline-block;
      }
      sup {
        vertical-align: text-top;
      }
      sub {
        vertical-align: text-bottom;
      }
    `;
  }

  render() {
    return html`
      <wind-helper></wind-helper>

      <rain-amount
        .rainStartTime="${rainStartTime(this.dayData)}"
        .rainAmount="${totalRain(this.dayData)}"
        .snowAmount="${totalSnow(this.dayData)}"
      ></rain-amount>

      <max-wind
        .gustRating="${windGustWarning(this.dayData).gustRating}"
        .maxGustWind="${windGustWarning(this.dayData).maxGustWind}"
        .rating="${windWarning(this.dayData).rating}"
        .maxWind="${windWarning(this.dayData).maxWind}"
        @click="${() => this._toggleWind()}"
      >
        <span><sup>m</sup>/<sub>s</sub></span>
      </max-wind>
    `;
  }

  static get properties() {
    return {
      dayData: {
        type: Object,
      },
    };
  }

  _toggleWind() {
    const toggleWind = new CustomEvent(`forecast-header.toggle-wind`, {
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(toggleWind);
  }
}

window.customElements.define(WeatherDescription.is, WeatherDescription);
