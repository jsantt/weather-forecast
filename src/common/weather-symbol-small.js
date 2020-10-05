import { css, html, LitElement } from 'lit-element';
import './svg-icon.js';

/**
 * Snow: 41, 42, 43, 51, 52, 53 / [40-60]
 * thunder: 61, 62, 63, 64
 * slush: 71, 72, 73, 81, 82, 83
 */
class WeatherSymbolSmall extends LitElement {
  static get is() {
    return 'weather-symbol-small';
  }

  static get styles() {
    return css`
      :host {
        display: inline-block;
      }

      svg-icon {
        width: 16px;
        height: 16px;
      }
    `;
  }

  render() {
    if (this.rainType === undefined || this.rainType === 'rain') {
      return html``;
    }

    return html`<svg-icon
      path="assets/image/icons.svg#${this.rainType}"
    ></svg-icon>`;
  }

  static get properties() {
    return {
      rainType: {
        type: String,
        refrect: true,
      },
    };
  }
}

window.customElements.define(WeatherSymbolSmall.is, WeatherSymbolSmall);
