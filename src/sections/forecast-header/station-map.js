import { css, html, LitElement, svg } from 'lit';
import { classMap } from 'lit/directives/class-map.js';

import '../../common-components/error-notification.js';
import '../../common-components/wind-icon.js';
import { isNight } from '../../data-helpers/sun-calculations.js';

class StationMap extends LitElement {
  static get is() {
    return 'station-map';
  }

  static get styles() {
    return css`
      :host {
        display: block;

        min-height: 275px;
      }

      .temperature {
        font-size: 0.13px;

        text-rendering: optimizeLegibility;
      }
      .temperature.home-station {
        font-size: 0.34px;
      }

      circle {
        stroke: var(--color-blue-650);
        fill: var(--color-blue-650);
      }
      /* for debugging
      circle.collides {
        stroke: red;
      }
      */
      text {
        font-synthesis: style;
        fill: var(--color-gray-300);
      }

      text.selected-station {
        fill: var(--color-gray-800);
        stroke: var(--color-gray-400);
      }

      circle.selected-station {
        fill: var(--color-gray-400);
        stroke: var(--color-gray-400);
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
        --color: var(--color-white);
      }
    `;
  }

  render() {
    if (this.observationData === undefined && this.observationError !== true) {
      return html``;
    }

    return html`
      ${this._createMap(
        this.location,
        this.observationData,
        this.observationError,
        this.showFeelsLike
      )}
    `;
  }

  _createMap(coordinates, observations, error, showFeelsLike) {
    if (error === true) {
      return html`<error-notification
        errorText="Sääasemien havaintotietojen haku epäonnistui."
      >
      </error-notification>`;
    }

    this._observationData = observations;

    return svg`
      <svg viewBox="${StationMap._viewBox(coordinates)}">
        <!-- paint in "z-index" order, because
              svg does not have z-index --> 

        ${this._observationData.map((observation, index) => {
          return svg`
            <g>
              <circle
              class="${classMap({
                'selected-station': observation.selectedStation === true,
                'home-station': observation.calculated,
                collides: observation.collision,
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
                href="assets/image/weather-symbols.svg#weatherSymbol${
                  observation.weatherCode3
                }${isNight(new Date(), this.location) ? '-night' : ''}"
              ></use>
              ${
                showFeelsLike === true &&
                (observation.feelsLike === undefined ||
                  Number.isNaN(observation.feelsLike))
                  ? ''
                  : svg`
                  <text class=${classMap({
                    temperature: true,
                    'selected-station': observation.selectedStation,
                    'home-station': observation.calculated,
                  })}
                  paint-order="stroke"
                  stroke-width="0.02"
                  text-anchor="end" 
                  x="${
                    observation.calculated
                      ? observation.lonForMap + 0.17
                      : observation.lonForMap + 0.07
                  }"
                    y="${
                      observation.calculated
                        ? -1 * observation.latForMap + 0.06
                        : -1 * observation.latForMap - 0
                    }">${
                      showFeelsLike === true
                        ? svg`<tspan class="feels-like">${observation.feelsLike}`
                        : svg`${Math.round(observation.temperature)}`
                    }</text>`
              }
          </g>
            `;
        })}
        <!-- showing original location for debugging -->
        <!-- ${this._observationData.map((observation) => {
          return observation.selectedStation
            ? svg` <circle
              class="original-location"
              cx="${observation.lon}"
              cy="${-1 * observation.lat}"
              r="0.01"
              stroke-width="0.013"
            ></circle>
             <circle
              class="original-location original-location--corrected"
              cx="${observation.lonMoved || 0}"
              cy="${-1 * observation.latMoved || 0}"
              r="0.01"
              stroke-width="0.013"
            ></circle>
            `
            : undefined;
        })}-->
      </svg>
    `;
  }

  static get properties() {
    return {
      largeMap: {
        type: Boolean,
      },
      location: {
        type: Object,
      },
      observationData: {
        type: Array,
      },
      observationError: {
        type: Boolean,
      },
      showFeelsLike: {
        type: Boolean,
        reflect: true,
      },
      showWind: {
        type: Boolean,
        reflect: true,
      },
      // local version with selected station
      _observationData: {
        type: Array,
      },
    };
  }

  constructor() {
    super();
    this.observationData = [];
  }

  /**
   * Negative latitude (y) to flip coordinates
   * @param { Object } coordinates
   * @param { Number } coordinates.lat
   * @param { Number } coordinates.lon
   *
   */
  static _viewBox(coordinates) {
    const width = 1.8;
    const height = 2.2;

    return `${coordinates.lon - width / 2} -${
      coordinates.lat + height / 2 + 0.13
    } ${width} ${height}`;
  }

  _stationClicked(index) {
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
