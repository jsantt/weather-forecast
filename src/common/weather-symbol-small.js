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
    if (
      this._removeUnnecessaryRain(this._getRightIcon(this.symbolId)) ===
      undefined
    ) {
      return html``;
    }

    return html`<svg-icon
      path="assets/image/icons.svg#${this._removeUnnecessaryRain(
        this._getRightIcon(this.symbolId)
      )}"
    ></svg-icon>`;
  }

  static get properties() {
    return {
      rain: {
        type: Number,
        refrect: true,
      },
      symbolId: {
        type: Number,
        reflect: true,
      },
    };
  }

  constructor() {
    super();

    this.icons = [
      { min: 20, max: 40, symbolName: 'rain' },
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

  /* remove rain symbol if there is already rain bar shown */
  _removeUnnecessaryRain(symbol) {
    if (this.rain > 0 && symbol === 'rain') {
      return undefined;
    }
    return symbol;
  }
}

window.customElements.define(WeatherSymbolSmall.is, WeatherSymbolSmall);
