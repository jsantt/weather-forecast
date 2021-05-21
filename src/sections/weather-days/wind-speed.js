import { css, html, LitElement } from 'lit-element';

import '../../common-components/svg-icon.js';

class WindSpeed extends LitElement {
  static get is() {
    return 'wind-speed';
  }

  static get styles() {
    return css`
      :host {
        color: var(--color-white);
      }

      svg-icon {
        fill: var(--color-green-300);
        width: 12px;
        height: 12px;
        margin-bottom: 1px;
      }

      :host([rating='1']) svg-icon {
        fill: var(--color-yellow-300);
      }

      :host([rating='2']) svg-icon {
        fill: var(--color-red-300);
      }

      :host([rating='3']) svg-icon {
        fill: var(--color-red-500);
      }

      :host([rating='4']) svg-icon {
        fill: var(--color-red-500);
      }
    `;
  }

  render() {
    return html`
      <svg-icon class="wind-icon" path="assets/image/icons.svg#wind"></svg-icon>
      ${this.maxWind}<slot></slot>
    `;
  }

  static get properties() {
    return {
      maxWind: {
        type: String,
        reflect: true,
      },
      rating: {
        type: Number,
        reflect: true,
      },
    };
  }
}

window.customElements.define(WindSpeed.is, WindSpeed);
