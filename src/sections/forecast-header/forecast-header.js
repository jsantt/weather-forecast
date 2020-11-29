import { css, html, LitElement } from 'lit-element';

import '../../common-components/svg-icon.js';
import '../../common-components/wind-icon.js';

import './location-selector.js';
import './station-map.js';
import './station-details.js';

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
        margin-bottom: calc(-1 * (var(--header-background-expand)));
        padding-bottom: var(--header-background-expand);

        /* anchor for h2 */
        position: relative;
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
        top: var(--space-m);
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
        -webkit-backdrop-filter: blur(2px);

        color: var(--color-blue-100);
        display: grid;
        grid-template-columns: auto 3rem 2rem;
        grid-template-rows: auto;
        align-items: center;

        grid-template-areas:
          'name    wind  expand'
          'details details details';

        line-height: var(--line-height-dense);

        text-align: left;
        padding: var(--space-m) var(--space-l);
      }

      .selected-name {
        grid-area: name;
        font-size: var(--font-size-m);
      }

      .selected-text {
        display: flex;
        justify-content: flex-start;
      }

      .selected-details {
        grid-area: details;

        max-height: 0;
        transition: max-height 0.3s ease;
        will-change: max-height;
      }

      :host([largeMap]) .selected-details {
        margin-top: var(--space-m);
        max-height: 10rem;
      }

      wind-icon {
        grid-area: wind;
        padding-left: var(--space-m);
      }

      .expand-icon {
        grid-area: expand;
        height: 16px;
        width: 16px;

        margin-left: auto;
        padding: 0 var(--space-m);
      }

      weather-name-wawa {
        font-size: var(--font-size-l);
        font-weight: var(--font-weight-bold);
        padding-bottom: 0.15rem;
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
          .largeMap="${this.largeMap}"
          .location="${this.location}"
          .observationData=${this.observationData}
          ?showFeelsLike="${this.showFeelsLike}"
          ?showWind="${this.showWind}"
        ></station-map>
        ${this._selectedStation !== undefined
          ? html`
            <div class="selected" @click="${this._expand}">
            <svg-icon class="expand-icon" path="assets/image/icons.svg#caret-${
              this.largeMap ? 'up' : 'down'
            }"></svg-icon>  
            <div class="selected-name">
              <weather-name-wawa
                .wawaId="${this._selectedStation.wawaCode}"
                .cloudiness="${this._selectedStation.cloudiness}"
              ></weather-name-wawa>
              <span class="selected-text">
              
              ${this._selectedStation.name}
                ${this._selectedStation.distance} km

               </span>
      
               </div>
               <div class="selected-details">

              ${
                this.largeMap
                  ? html` <station-details
                      .station="${this._selectedStation}"
                    ></station-details>`
                  : ''
              }
               </div>
              
             
              ${
                this.showWind === true
                  ? html` <wind-icon
                      .degrees="${this._selectedStation.windDirection}"
                      large
                      whiteGust
                      .windSpeed="${this._selectedStation.wind}"
                      .windGustSpeed="${this._selectedStation.windGust}"
                    >
                    </wind-icon>`
                  : ''
              }
                
              
              </div>
            </div>
            
            `
          : ''}
      </header>
    `;
  }

  static get properties() {
    return {
      largeMap: { type: Boolean, reflect: true },
      loading: { type: Boolean, reflect: true },
      location: { type: Object, reflect: true },
      place: { type: Object, reflect: true },
      observationData: { type: Object },
      showFeelsLike: { type: Boolean, reflect: true },
      showWind: { type: Boolean, reflect: true },
      _selectedStation: { type: Object },
    };
  }

  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (
        propName === 'observationData' &&
        this.observationData !== undefined
      ) {
        // eslint-disable-next-line prefer-destructuring
        this._selectedStation = this.observationData.filter(item => {
          return item.selectedStation === true;
        })[0];
      }
    });
  }

  _expand() {
    this.largeMap = !this.largeMap;
  }

  static _round(value) {
    if (Number.isNaN(value)) {
      return '';
    }

    return Math.round(value);
  }

  static _time(dateTime) {
    const minutes = dateTime.getMinutes();

    const fullMinutes = minutes < 10 ? `0${minutes}` : minutes;

    return `${dateTime.getHours()}.${fullMinutes}`;
  }
}

window.customElements.define(ForecastHeader.is, ForecastHeader);
