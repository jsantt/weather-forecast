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
        width: 11px;
        height: 11px;
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

  render() {
    return html`
      ja puuskissa ${MaxWind._windDescription(this.rating)}
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

  static _windDescription(rating) {
    switch (rating) {
      case 2:
        return 'kovaa tuulta';
      case 3:
        return 'myrskyä';
      case 4:
        return 'hirmumyrskyä';
      default:
        return '';
    }
  }
}

window.customElements.define(MaxWind.is, MaxWind);
