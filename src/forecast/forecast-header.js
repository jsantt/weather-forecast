import { css, html, LitElement } from 'lit-element';

import './feels-like-icon.js';
import './weather-name-wawa.js';
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
        margin-bottom: calc(-1 * (var(--header-background-expand) + 0.25rem));
        padding-bottom: var(--header-background-expand);

        /* anchor for h2 */
        position: relative;
      }

      h2 {
        margin: 0;
        text-align: center;
        position: absolute;
        left: 0;
        right: 0;
        top: -1rem;
      }

      station-map {
        width: 100%;
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

      .selected {
        backdrop-filter: blur(2px);

        display: grid;
        grid-template-columns: 1fr auto;
        grid-template-rows: 1fr 1fr;

        grid-template-areas:
          'distance wind'
          'name     wind';

        line-height: var(--line-height-dense);
        position: absolute;
        right: var(--space-m);
        bottom: 4rem;

        text-align: right;
      }

      .selected-distance {
        grid-area: distance;
      }

      .selected-name {
        grid-area: name;
      }

      wind-icon {
        grid-area: wind;
        padding-left: var(--space-m);
      }
      weather-name-wawa {
        display: block;
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
          ?showFeelsLike="${this.showFeelsLike}"
          ?showWind="${this.showWind}"
        ></station-map>
        ${this.observationData !== undefined
          ? html` <div class="selected">
              <div class="selected-distance">
                <span class="selected-text">${
                  this.observationData[0].distance
                } km</span>
              </div>
              <div class="selected-name">
              <span class="selected-text">${
                this.observationData[0].name
              }</span></div>

              ${
                this.showWind === true
                  ? html` <wind-icon
                      .degrees="${this.observationData[0].windDirection}"
                      large
                      whiteGust
                      .windSpeed="${this.observationData[0].wind}"
                      .windGustSpeed="${this.observationData[0].windGust}"
                    >
                    </wind-icon>`
                  : ''
              }
              </div>
            </div>`
          : ''}
      </header>
    `;
  }

  static get properties() {
    return {
      loading: { type: Boolean, reflect: true },
      location: { type: Object, reflect: true },
      place: { type: Object, reflect: true },
      observationData: { type: Object },
      showFeelsLike: { type: Boolean, reflect: true },
      showWind: { type: Boolean, reflect: true },
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
