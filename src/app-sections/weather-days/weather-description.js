import { css, html, LitElement } from 'lit';

import './rain-amount.js';
import './max-wind.js';

import { rainStartTime, totalRain, totalSnow } from './rain-helper';

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
        .rainAmount="${totalRain(this.dayData)}"
        .snowAmount="${totalSnow(this.dayData)}"
      ></rain-amount>
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
