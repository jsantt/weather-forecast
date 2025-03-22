import { css, html, LitElement } from 'lit';
import { roundRain } from './rain-helper';

class RainAmount extends LitElement {
  static get is() {
    return 'rain-amount';
  }

  static get styles() {
    return css`
      :host {
        display: block;
        padding: var(--space-l);
      }

      :host([empty]) {
        padding-bottom: var(--space-m);
      }
      .rain {
        fill: var(--color-rain);
      }
      .snow {
        fill: var(--color-snow);
      }
    `;
  }

  willUpdate() {
    if (this.rainAmount <= 0 && this.snowAmount <= 0) {
      this.empty = true;
    } else {
      this.empty = false;
    }
  }

  render() {
    return html`
      ${this.rainAmount > 0
        ? html`
            <svg class="rain" width="12" height="12" viewBox="0 0 32 32">
              <g>
                <path
                  stroke="null"
                  d="m24.66391,21.25916c0,4.95892 -4.01471,8.97363 -8.97735,8.97363c-4.9552,0 -8.97735,-4.01471 -8.97735,-8.97363s9.65762,-19.54571 9.65762,-19.47136c0.00372,0.1078 8.29708,14.51245 8.29708,19.47136z"
                />
              </g>
            </svg>
            ${this.rainAmount < 0.5
              ? 'Sadetta alle 1'
              : html`Sadetta ${roundRain(this.rainAmount)}`}
            mm<br />
          `
        : ''}
      ${this.snowAmount > 0
        ? html`
            <svg class="snow" width="12" height="12" viewBox="0 0 32 32">
              <g>
                <path
                  stroke="null"
                  clip-rule="evenodd"
                  fill-rule="evenodd"
                  d="m30.11096,15.89783l-0.74543,-1.28948l-3.29259,0l0.99272,-1.77348l-0.74543,-1.28948l-1.48379,0l-1.74168,3.06296l-4.87176,0l2.43411,-4.21819l3.38091,-0.01766l0.74543,-1.28948l-0.74543,-1.28948l-1.89006,0.01413l1.64983,-2.84745l-0.75249,-1.28948l-1.48379,0l-1.64629,2.84745l-0.97859,-1.69575l-1.49438,0l-0.74543,1.28948l1.73108,2.98523l-2.44118,4.22172l-2.43058,-4.22172l1.50145,-2.57543l-0.74543,-1.28948l-1.48379,0l-0.76309,1.28595l-1.64629,-2.85099l-1.49085,0l-0.74543,1.28948l1.64629,2.84745l-2.0561,0.08832l-0.74896,1.28948l0.74896,1.28948l3.54695,-0.08479l2.43058,4.21819l-4.87176,0l-1.69929,-2.75207l-1.49085,0l-0.74189,1.28595l0.95739,1.46612l-3.29259,0l-0.74543,1.28948l0.74543,1.28948l3.29259,0l-0.85141,1.54031l0.73836,1.28948l1.49438,0l1.59684,-2.82979l4.87176,0l-2.43058,4.22172l-3.03469,-0.01413l-0.74543,1.28595l0.74543,1.29301l1.54738,0.0106l-1.64629,2.85452l0.74543,1.28948l1.49085,0l1.64629,-2.85452l1.02099,1.61803l1.48025,0l0.74543,-1.28948l-1.76288,-2.89691l2.43058,-4.22172l2.44118,4.22172l-1.52618,2.69908l0.74543,1.28948l1.49085,0l0.77369,-1.4096l1.64983,2.85452l1.48379,0l0.75249,-1.28948l-1.64983,-2.85452l2.04197,0.04239l0.74543,-1.29301l-0.74189,-1.29301l-3.53282,-0.03533l-2.43411,-4.22172l4.86823,0l1.64276,2.87925l1.48379,0l0.75249,-1.28948l-0.89734,-1.58977l3.29259,0l0.74189,-1.29301z"
                />
              </g>
            </svg>
            ${this.snowAmount < 0.5
              ? 'Lumisadetta alle 1'
              : html` Lumisadetta ${roundRain(this.snowAmount)}`}
            cm <br />
          `
        : ''}
    `;
  }

  static get properties() {
    return {
      rainAmount: {
        type: Number,
      },
      rainStartTime: {
        type: String,
      },
      snowAmount: {
        type: Number,
      },
      empty: {
        type: Boolean,
        reflect: true,
      },
    };
  }

  static _hasRain(rainAmount) {
    return rainAmount !== '';
  }

  static _hasSnow(snowAmount) {
    return snowAmount !== '';
  }
}

window.customElements.define(RainAmount.is, RainAmount);
