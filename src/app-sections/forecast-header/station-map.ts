import { css, html, LitElement, svg } from 'lit';
import { classMap } from 'lit/directives/class-map.js';

import '../../common-components/error-notification.js';
import '../../common-components/wind-icon.ts';
import { isNight } from './sun-calculations.ts';
import { property, state } from 'lit/decorators.js';
import { Station } from '../../backend-calls/observation-data/observation-data.ts';
import { getWeatherObservation } from '../../backend-calls/observation-data/weather-symbol-name.ts';

// TODO: move to source once it is converted into TS
type LocationCoordinates = {
  lon: number;
  lat: number;
  city: string;
  coordinates: string;
};

class StationMap extends LitElement {
  static get is() {
    return 'station-map';
  }

  @property({ type: Object })
  location?: LocationCoordinates;

  @property({ type: Array })
  observationData?: Station[];

  @property({ type: Boolean })
  observationError: boolean = false;

  @property({ type: Boolean, reflect: true })
  showFeelsLike: boolean = false;

  @property({ type: Boolean, reflect: true })
  showWind: boolean = false;

  @state()
  selectedIndex: number = 0;

  @state()
  hundredIfNight: number = 0;

  static get styles() {
    return css`
      :host {
        display: block;
      }

      .heading {
        font-size: var(--font-size-m);
        text-wrap: pretty;
        font-weight: 400;
        color: var(--color-gray-500);
        text-align: center;
        margin: 0;
        padding: var(--space-xl) var(--space-l) 0 var(--space-l);
      }

      .temperature {
        font-size: 0.13px;

        text-rendering: optimizeLegibility;
      }
      .temperature.home-station {
        font-size: 0.3px;
      }

      circle {
        stroke: var(--background-station);
        fill: var(--background-station);
      }
      /* for debugging
      circle.collides {
        stroke: red;
  
      */
      text {
        font-synthesis: style;
        fill: var(--color-light);
      }

      text.selected-station {
        fill: var(--color-gray-800);
        font-weight: 600;
      }

      circle.selected-station {
        fill: var(--background-selected-station);
        stroke: var(--background-selected-station);
      }

      circle.original-location {
        stroke: black;
      }

      circle.original-location.original-location--corrected {
        stroke: red;
      }

      use,
      .temperature {
        pointer-events: none;
      }

      .feels-like {
        font-style: italic;
      }

      error-notification {
        padding: var(--space-l) var(--space-m) var(--space-xl) var(--space-m);
        --color: var(--color-gray-100);
      }
    `;
  }

  render() {
    if (!this.location) {
      return;
    }
    if (isNight(new Date(), this.location)) {
      this.hundredIfNight = 100;
    } else {
      this.hundredIfNight = 0;
    }
    if (this.observationError || this.observationData === undefined) {
      return html`<error-notification
        errorText="Sääasemien tietojen haku epäonnistui."
      >
      </error-notification>`;
    }

    return svg`
      <h3 class="heading">${
        this.observationData?.at(this.selectedIndex)?.wawaCode !== undefined
          ? getWeatherObservation(
              this.observationData?.at(this.selectedIndex)?.wawaCode,
              this.observationData?.at(this.selectedIndex)?.cloudiness
            )
          : ''
      }</h3>
      <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="${StationMap._viewBox(
        this.location
      )}">
        <!-- paint in "z-index" order, because
              svg does not have z-index --> 

        ${this.observationData?.map((observation: Station, index) => {
          if (
            observation.latForMap === undefined ||
            observation.lonForMap === undefined
          ) {
            return svg`<g></g>`;
          }

          return svg`
            <g>
              <circle
              class="${classMap({
                'selected-station': observation.selectedStation === true,
                'home-station': observation.calculated === true,
                collides: observation.collision === true,
              })}"
                @click="${() => this._stationClicked(index)}"
                cx="${observation.lonForMap}"
                cy="${-1 * observation.latForMap}"
                r="${observation.calculated ? 0.26 : 0.11}"

                stroke-width="0.013"
                stroke="transparent"
              ></circle>

              <use
                x="${
                  observation.calculated
                    ? observation.lonForMap - 0.29
                    : observation.lonForMap - 0.12
                }"
                y="${
                  observation.calculated
                    ? -1 * observation.latForMap - 0.13
                    : -1 * observation.latForMap - 0.06
                }"
                width="${observation.calculated ? 0.4 : 0.2}"
                height="${observation.calculated ? 0.4 : 0.2}"
                href=${`assets/image/smart/light/${
                  (observation.smartSymbol || 0) + this.hundredIfNight
                }.svg#smartSymbol${
                  (observation.smartSymbol || 0) + this.hundredIfNight
                }`}
              ></use>



              ${
                this.showFeelsLike === true &&
                (observation.feelsLike === undefined ||
                  Number.isNaN(observation.feelsLike))
                  ? ''
                  : svg`
                  <text class=${classMap({
                    temperature: true,
                    'selected-station': observation.selectedStation === true,
                    'home-station': observation.calculated === true,
                  })}
                  paint-order="stroke"
                  stroke-width="0.02"
                  text-anchor="end" 
                  x="${
                    observation.calculated
                      ? observation.lonForMap + 0.16
                      : observation.lonForMap + 0.07
                  }"
                    y="${
                      observation.calculated
                        ? -1 * observation.latForMap + 0.0
                        : -1 * observation.latForMap - 0
                    }">${
                      this.showFeelsLike === true
                        ? svg`<tspan class="feels-like">${observation.feelsLike}`
                        : svg`${Math.round(observation.temperature)}`
                    }</text>`
              }
          </g>
            `;
        })}
      </svg>
    `;
  }

  /**
   * Negative latitude (y) to flip coordinates
   * @param { Object } location
   * @param { Number } location.lat
   * @param { Number } location.lon
   *
   */
  static _viewBox(location?: { lon: number; lat: number }) {
    const width = 1.8;
    const height = 2;

    if (location === undefined) {
      return '23.749041100000003 -61.4063682 1.8 2';
    }

    return `${location.lon - width / 2} -${
      location.lat + height / 2 + 0.13
    } ${width} ${height}`;
  }

  _stationClicked(index) {
    this.selectedIndex = index;
    this._dispatch('station-map.selected', index);
  }

  _dispatch(eventName, message) {
    const event = new CustomEvent(eventName, {
      detail: message,
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }
}

window.customElements.define(StationMap.is, StationMap);

export type { LocationCoordinates };
