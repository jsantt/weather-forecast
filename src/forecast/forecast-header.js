import { css, html, LitElement } from 'lit-element';

import './feels-like-icon.js';
import './time-now.js';
import './weather-symbol-name.js';
import '../common/wind-icon.js';
import '../common/svg-icon.js';
import '../other/station-map.js';

class ForecastHeader extends LitElement {
  static get is() {
    return 'forecast-header';
  }

  static get styles() {
    return css`
      :host {
        display: block;
        padding-bottom: var(--header-background-expand);
      }

      header {
        background: var(--color-blue-600);
        margin-bottom: calc(-1 * var(--header-background-expand));
        padding-top: var(--space-m);
        padding-bottom: var(--header-background-expand);
      }

      h2 {
        margin: -2rem 0 0 0;
        text-align: center;
      }

      station-map {
        width: 60%;
        margin: 0 auto;
      }

      .visually-hidden {
        position: absolute !important;
        clip: rect(1px, 1px, 1px, 1px);
        padding: 0 !important;
        border: 0 !important;
        height: 1px !important;
        width: 1px !important;
        overflow: hidden;
      }
    `;
  }

  render() {
    return html`
      <header>
        <div class="circle"></div>
        <h2>
          <span class="visually-hidden">Sää nyt paikassa</span>
          <location-selector .loading="${this.loading}" .place="${this.place}">
          </location-selector>
        </h2>

        <station-map
          .location="${this.location}"
          .observationData=${this.observationData}
        ></station-map>

        <!--weather-symbol-name .symbolId="${this.symbol}">
          </weather-symbol-name>
        </div>
        <time-now .updateTime="${this.loading}"></time-now-->
      </header>
    `;
  }

  static get properties() {
    return {
      loading: { type: Boolean, reflect: true },
      location: { type: Object, reflect: true },
      place: { type: Object, reflect: true },
      observationData: { type: Object },
    };
  }

  static _round(value) {
    if (Number.isNaN(value)) {
      return '';
    }

    return Math.round(value);
  }
}

window.customElements.define(ForecastHeader.is, ForecastHeader);
