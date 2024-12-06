import { css, html, LitElement } from 'lit';

import { windClassification } from '../weather-days/wind-helper';

import '../../common-components/smooth-expand';
import '../../common-components/svg-icon';
import '../../common-components/wind-icon';

import './location-selector';
import './station-map';
import './station-details';
import { property } from 'lit/decorators.js';
import { Station } from '../../observation-data.ts';
import { LocationCoordinates } from './station-map';

class ForecastHeader extends LitElement {
  static get is() {
    return 'forecast-header';
  }

  @property({ type: Boolean, reflect: true })
  largeMap?: boolean;

  @property({ type: Boolean, reflect: true })
  loading?: boolean;

  @property({ type: Object, reflect: true })
  location?: LocationCoordinates;

  @property({ type: Object, reflect: true })
  place?: object;

  @property({ type: Array })
  observationData?: [];

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

        padding-bottom: var(--header-background-expand);
      }

      header {
        margin-bottom: calc(-1 * (var(--header-background-expand)));
        padding-bottom: var(--header-background-expand);

        /* anchor for h2 */
        position: relative;

        background: var(--color-blue-600);
        background-image: var(--background-image);
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center;
      }

      @media only screen and (min-width: 430px) {
        header {
          border-top-left-radius: var(--border-radius);
          border-top-right-radius: var(--border-radius);
        }
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
        color: var(--color-secondary);
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
        grid-area: name;
        font-size: var(--font-size-m);
        font-weight: var(--font-weight-bold);
      }

      .selected-details {
        grid-area: details;

        transition: padding var(--transition-time);
      }

      wind-icon {
        grid-area: wind;
        padding-left: var(--space-l);
      }

      .expand-icon {
        grid-area: expand;
        align-self: center;
        justify-self: end;

        height: 16px;
        width: 16px;

        margin-right: var(--space-m);

        transition: transform var(--transition-time) ease;
      }

      :host([largeMap]) .expand-icon {
        transform: scaleY(-1);
      }

      weather-name-wawa {
        padding-bottom: 0.15rem;
      }

      station-details {
        color: var(--color-secondary);
        margin: var(--space-l) 0 var(--space-l) 0;
        padding: 0;
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
          ?largeMap="${this.largeMap}"
          .location="${this.location}"
          .observationData=${this.observationData}
          ?observationError=${this.observationError}
          ?showFeelsLike="${this.showFeelsLike}"
          ?showWind="${this.showWind}"
        ></station-map>
        ${this._selectedStation !== undefined
          ? html`
            <div class="selected" @click="${this._expand}">
            <div class="selected-label">${
              this._selectedStation.calculated
                ? 'SÄÄ NYT'
                : html`SÄÄASEMA ${this._selectedStation.distance} km`
            }</div>
            <svg-icon class="expand-icon" path="assets/image/icons.svg#caret-down"></svg-icon>  
            <div class="selected-name">
              
              <span class="selected-text">
              ${
                this._selectedStation.calculated
                  ? this._selectedStation.name
                  : this._selectedStation.name
              }
               </span>
               <weather-name-wawa
                .wawaId="${this._selectedStation.wawaCode}"
                .cloudiness="${this._selectedStation.cloudiness}"
              ></weather-name-wawa>      
               </div>
               <div class="selected-details">
                <smooth-expand ?expanded="${this.largeMap}">
                  <station-details
                      .station="${this._selectedStation}"
                    ></station-details>
                </smooth-expand>

                
               </div>
                <wind-icon
                  .degrees="${this._selectedStation.windDirection}"
                  large
                  .rating="${windClassification(
                    this._selectedStation.windGust
                  )}"
                  whiteGust
                  .windSpeed="${this._selectedStation.wind}"
                  .windGustSpeed="${this._selectedStation.windGust}"
                >
                </wind-icon>
                      
              </div>
            </div>
            `
          : ''}
      </header>
    `;
  }

  updated(changedProperties) {
    changedProperties.forEach((_, propName): undefined => {
      if (
        propName !== 'observationData' ||
        this.observationData === undefined
      ) {
        return;
      }

      // hack to fix expand issue with smooth expand
      if (this.largeMap) {
        this.largeMap = false;
        setTimeout(() => {
          this.largeMap = true;
        }, 0);
      }

      // eslint-disable-next-line prefer-destructuring
      this._selectedStation = this.observationData.filter((item: any) => {
        return item.selectedStation === true;
      })[0];
    });
  }

  _expand() {
    this.largeMap = !this.largeMap;
  }

  static _round(value: number) {
    if (Number.isNaN(value)) {
      return '';
    }

    return Math.round(value);
  }

  static _time(dateTime) {
    const minutes = dateTime.getMinutes();

    const fullMinutes = minutes < 10 ? `0${minutes}` : minutes;

    return `klo ${dateTime.getHours()}.${fullMinutes}`;
  }
}

window.customElements.define(ForecastHeader.is, ForecastHeader);
