import { css, html, LitElement } from 'lit';
import './svg-icon';

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
    if (this.rainType === undefined || this.rainType !== 'thunder') {
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
