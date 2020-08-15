import { css, html, LitElement } from 'lit-element';
import '@polymer/iron-icon/iron-icon.js';

class WeatherSymbol extends LitElement {
  static get styles() {
    return css`
      :host {
        display: inline-block;
      }

      .symbol {
        --iron-icon-width: var(--width, 45px);
        --iron-icon-height: var(--height, 45px);
        z-index: 20;
      }

      .symbol--large {
        --iron-icon-height: 80px;
        --iron-icon-width: 80px;
      }
    `;
  }

  render() {
    return html`<iron-icon
      class="${this._symbolSize(this.large)}"
      .icon="${this._iconName(this.symbolId)}"
    ></iron-icon> `;
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
  _iconName(id) {
    return 'weather-symbol-icons:weatherSymbol' + id;
  }

  _symbolSize(large) {
    return large ? 'symbol symbol--large' : 'symbol';
  }
}

window.customElements.define(WeatherSymbol.is, WeatherSymbol);
