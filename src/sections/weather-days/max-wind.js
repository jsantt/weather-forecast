import { css, html, LitElement } from 'lit-element';

import '../../common-components/svg-icon.js';

class MaxWind extends LitElement {
  static get is() {
    return 'max-wind';
  }

  static get styles() {
    return css`
      :host {
        display: inline-block;
      }

      svg-icon {
        fill: var(--color-gray-600);
        width: 12px;
        height: 12px;
        margin-bottom: 2px;
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

  render() {
    return html`
      <svg-icon class="wind-icon" path="assets/image/icons.svg#wind"></svg-icon>
      ${MaxWind._windDescription(this.rating)} ${this.maxWind}<slot></slot>
    `;
  }

  static _windDescription(rating) {
    switch (rating) {
      case 2:
        return 'kovaa tuulta';
      case 3:
        return 'myrskyä';
      case 4:
        return 'hirmumyrskyä';
      default:
        return 'tuulen nopeus';
    }
  }
}

window.customElements.define(MaxWind.is, MaxWind);
