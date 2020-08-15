import { css, html, LitElement } from 'lit-element';
import '@polymer/iron-icon/iron-icon.js';

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

      iron-icon {
        --iron-icon-width: 16px;
        --iron-icon-height: 16px;
        z-index: 20;
      }
    `;
  }

  render() {
    if (this._getRightIcon(this.symbolId) === undefined) {
      return html``;
    }

    return html` <iron-icon
      .icon="weather-symbol-small-icons:${this._getRightIcon(this.symbolId)}"
    ></iron-icon>`;
  }

  static get properties() {
    return {
      symbolId: {
        type: Number,
        reflect: true,
      },
    };
  }

  constructor() {
    super();

    this.icons = [
      { min: 40, max: 60, symbolName: 'snow' },
      { min: 60, max: 70, symbolName: 'thunder' },
      { min: 70, max: 90, symbolName: 'slush' },
    ];
  }

  _getRightIcon(symbol) {
    for (const item of this.icons) {
      if (item.min < symbol && symbol < item.max) {
        return item.symbolName;
      }
    }
    return undefined;
  }
}

window.customElements.define(WeatherSymbolSmall.is, WeatherSymbolSmall);
