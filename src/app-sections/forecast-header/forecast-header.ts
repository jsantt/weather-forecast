import { css, html, LitElement } from 'lit';

import { windClassification } from '../weather-days/wind-helper.js';

import '../../common-components/smooth-expand.js';
import '../../common-components/svg-icon.js';
import '../../common-components/wind-icon.js';
import '../../common-components/expand-icon.js';

import './location-selector.ts';
import './station-map.ts';
import './station-details.ts';
import { property } from 'lit/decorators.js';
import { Station } from '../../backend-calls/observation-data/observation-data.ts';
import { LocationCoordinates } from './station-map.ts';

class ForecastHeader extends LitElement {
  static get is() {
    return 'forecast-header';
  }

  @property({ type: Boolean, reflect: true })
  showDetails?: boolean;

  @property({ type: Boolean, reflect: true })
  loading?: boolean;

  @property({ type: Object, reflect: true })
  location?: LocationCoordinates;

  @property({ type: Array })
  observationData?: Station[];

  @property({ type: Boolean, reflect: true })
  observationError?: boolean;

  @property({ type: Boolean, reflect: true })
  showFeelsLike?: boolean;

  @property({ type: Boolean, reflect: true })
  showWind?: boolean;

  @property({ type: Object })
  _selectedStation?: Station;

  static get styles() {
    return css`
      * {
        box-sizing: border-box;
      }

      :host {
        display: block;
      }

      header {
        border-radius: var(--border-radius);

        /* anchor for h2 */
        position: relative;

        background: var(--background-map);
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center;

        padding-bottom: var(--space-xl);
      }

      :host([showDetails]) header {
        padding-bottom: var(--space-l);
      }

      h2 {
        margin: 0;
        text-align: center;
        position: absolute;
        right: 0;
        left: 0;
        top: var(--space-xl);
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
        display: grid;
        grid-template-columns: auto 1fr 1fr;
        grid-template-rows: auto auto auto var(--space-m);

        grid-template-areas:
          'label    wind    expand  '
          'name     wind    expand  '
          'details  details details '
          '.        .       .       ';

        line-height: var(--line-height-dense);

        padding: 0 var(--space-l);
      }
      .selected-label {
        grid-area: label;

        color: var(--color-gray-500);
        font-size: var(--font-size-xs);
        align-self: flex-end;
      }

      .selected-name {
        color: var(--color-light);
        grid-area: name;
        font-size: var(--font-size-m);
      }

      .selected-details {
        grid-area: details;

        transition: padding var(--transition-time);
      }

      wind-icon {
        grid-area: wind;
        padding-left: var(--space-l);
      }

      expand-icon {
        color: var(--color-light);
        padding-right: 0.75rem;

        grid-area: expand;
        align-self: center;
        justify-self: end;
      }

      station-details {
        margin: var(--space-l) 0 0 0;
        padding: 0;
      }
    `;
  }

  render() {
    return html`
      <header>
        <station-map
          ?showDetails="${this.showDetails}"
          .location="${this.location}"
          .observationData=${this.observationData}
          ?observationError=${this.observationError}
          ?showFeelsLike="${this.showFeelsLike}"
          ?showWind="${this.showWind}"
        ></station-map>
            <div class="selected" @click="${this._expand}">
            ${
              this._selectedStation
                ? html`
                    <div class="selected-label">
                      ${this._selectedStation?.calculated
                        ? ''
                        : html`SÄÄASEMA ${this._selectedStation?.distance} km`}
                    </div>

                    <expand-icon
                      ?open=${this.showDetails}
                      class="expand-icon"
                    ></expand-icon>
                  `
                : null
            }
            <div class="selected-name">
              
              <span class="selected-text">
              ${
                this._selectedStation?.calculated
                  ? this._selectedStation.name
                  : this._selectedStation?.name
              }
               </span>
              
               </div>
               <div class="selected-details">
                <smooth-expand ?expanded="${this.showDetails}">
                  <station-details
                      .station="${this._selectedStation}"
                    ></station-details>
                </smooth-expand>

                
               </div>
                ${
                  this._selectedStation
                    ? html` <wind-icon
                        .degrees="${this._selectedStation.windDirection}"
                        large
                        .rating="${windClassification(
                          this._selectedStation.windGust
                        )}"
                        whiteGust
                        .windSpeed="${this._selectedStation?.wind}"
                        .windGustSpeed="${this._selectedStation?.windGust}"
                      >
                      </wind-icon>`
                    : null
                }
                      
              </div>
            </div>
            
      </header>
    `;
  }

  updated(changedProperties: Map<string, any>) {
    changedProperties.forEach((_, propName): undefined => {
      if (
        propName !== 'observationData' ||
        this.observationData === undefined
      ) {
        return;
      }

    
      // eslint-disable-next-line prefer-destructuring
      this._selectedStation = this.observationData.filter((item: any) => {
        return item.selectedStation === true;
      })[0];
    });
  }

  _expand() {
    this.showDetails = !this.showDetails;
  }

  static _round(value: number) {
    if (Number.isNaN(value)) {
      return '';
    }

    return Math.round(value);
  }

  static _time(dateTime: Date) {
    const minutes = dateTime.getMinutes();

    const fullMinutes = minutes < 10 ? `0${minutes}` : minutes;

    return `klo ${dateTime.getHours()}.${fullMinutes}`;
  }
}

window.customElements.define(ForecastHeader.is, ForecastHeader);
