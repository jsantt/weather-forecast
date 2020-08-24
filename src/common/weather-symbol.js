import { css, html, LitElement } from 'lit-element';

import './svg-icon.js';

class WeatherSymbol extends LitElement {
  static get is() {
    return 'weather-symbol';
  }

  static get styles() {
    return css`
      :host {
        display: inline-block;
      }

      :host([large]) {
        height: 80px;
        width: 80px;
      }
    `;
  }

  render() {
    return html`
      <svg-icon
        path="${`assets/image/weather-symbols.svg#weatherSymbol${this.symbolId}`}"
      ></svg-icon>
    `;
  }

  static get properties() {
    return {
      symbolId: {
        type: Number,
        reflect: true,
      },
      large: {
        type: Boolean,
        reflect: true,
      },
    };
  }
}

window.customElements.define(WeatherSymbol.is, WeatherSymbol);
