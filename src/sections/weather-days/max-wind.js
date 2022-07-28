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
      maxGustWind: {
        type: String,
        reflect: true,
      },
      gustRating: {
        type: Number,
        reflect: true,
      },
    };
  }

  render() {
    return html`
      <svg-icon class="wind-icon" path="assets/image/icons.svg#wind"></svg-icon>
      ${MaxWind._windDescription(this.gustRating)} ${this.maxGustWind}<slot
      ></slot>
    `;
  }

  static _windDescription(rating) {
    switch (rating) {
      case 2:
        return 'kovaa tuulta puuskissa';
      case 3:
        return 'puuskissa myrskyä';
      case 4:
        return 'puuskissa hirmumyrskyä';
      default:
        return 'tuulen nopeus puuskissa';
    }
  }
}

window.customElements.define(MaxWind.is, MaxWind);
