import { css, html, LitElement } from 'lit-element';

import './svg-icon.js';

class WeatherSymbol extends LitElement {
  static get styles() {
    return css`
      :host {
        display: inline-block;
      }

      :host([large]) {
        --height: 80px;
        --width: 80px;
      }

      svg {
        display: block;
        pointer-events: none;
        height: var(--height, 45px);
        width: var(--width, 45px);
      }
    `;
  }

  render() {
    return html`
      <svg
        viewBox="0 0 37 37"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
        focusable="false"
      >
        <use></use>
      </svg>
    `;
  }

  static get is() {
    return 'weather-symbol';
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

  updated() {
    this.shadowRoot
      .querySelector('use')
      .setAttributeNS(
        'http://www.w3.org/1999/xlink',
        'xlink:href',
        `assets/image/weather-symbols.svg#weatherSymbol${this.symbolId}`
      );
  }
}

window.customElements.define(WeatherSymbol.is, WeatherSymbol);
