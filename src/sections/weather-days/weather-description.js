import { css, html, LitElement } from 'lit-element';

import './rain-amount.js';
import './snow-amount.js';
import './max-wind.js';

import { totalRain, totalSnow } from './rain-helper.js';
import { windWarning } from './wind-helper.js';

class WeatherDescription extends LitElement {
  static get is() {
    return 'weather-description';
  }

  static get styles() {
    return css`
      :host {
      }
    `;
  }

  render() {
    return html`
      <wind-helper></wind-helper>

      <rain-amount
        .rainAmount="${WeatherDescription._rain(this.dayData)}"
      ></rain-amount>

      <snow-amount
        .snowAmount="${WeatherDescription._snow(this.dayData)}"
      ></snow-amount>

      <max-wind
        .rating="${WeatherDescription._windRating(this.dayData)}"
        .maxWind="${WeatherDescription._maxWind(this.dayData)}"
        @click="${() => this._toggleWind()}"
      >
        m/s
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

  static _maxWind(dayData) {
    return windWarning(dayData).maxWind;
  }

  static _windRating(dayData) {
    if (dayData === undefined || dayData.length < 1) {
      return '';
    }

    return windWarning(dayData).rating;
  }

  static _rain(dayData) {
    return totalRain(dayData);
  }

  static _snow(dayData) {
    return totalSnow(dayData);
  }
}

window.customElements.define(WeatherDescription.is, WeatherDescription);
