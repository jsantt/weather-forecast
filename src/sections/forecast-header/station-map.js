import { css, html, LitElement, svg } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { checkCollision, extendVector } from './vector-math.js';

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
        padding-top: 2rem;
      }

      .temperature {
        font-size: 0.15px;

        text-rendering: optimizeLegibility;
      }

      circle {
        stroke: var(--color-blue-650);
        fill: var(--color-blue-650);
      }

      text {
        font-synthesis: style;
        fill: var(--color-gray-300);
      }

      .selected-station text {
        fill: var(--color-gray-800);
      }

      .home-station text {
        font-size: 0.4px;
      }

      .selected-station circle {
        fill: var(--color-gray-400);
        stroke: var(--color-gray-400);
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
        this.largeMap,
        this.location,
        this.observationData,
        this.observationError,
        this.showFeelsLike
      )}
    `;
  }

  _createMap(large, coordinates, observations, error, showFeelsLike) {
    if (error === true) {
      return html`<error-notification
        errorText="Sääasemien havaintotietojen haku epäonnistui."
      >
      </error-notification>`;
    }

    this._observationData = observations;

    StationMap._adjustCoordinates(this._observationData);

    return svg`
      <svg viewBox="${StationMap._viewBox(coordinates, large)}">
        <!-- paint in "z-index" order, because
              svg does not have z-index --> 

        ${this._observationData.map((observation, index) => {
          return svg`
            <g class=${classMap({
              'selected-station': observation.selectedStation === true,
              'home-station': index === 0,
            })}>
            <circle
              @click="${() => this._stationClicked(index)}"
              cx="${observation.lonForMap}"
              cy="${-1 * observation.latForMap}"
              r="${observation.calculated ? 0.32 : 0.16}"

              stroke-width="0.013"
            />
          
           <use
              x="${
                observation.calculated
                  ? observation.lonForMap - 0.35
                  : observation.lonForMap - 0.14
              }"
              y="${
                observation.calculated
                  ? -1 * observation.latForMap - 0.17
                  : -1 * observation.latForMap - 0.09
              }"
              width="${observation.calculated ? 0.48 : 0.25}"
              height="${observation.calculated ? 0.48 : 0.25}"
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
                  <text class="temperature ${
                    observation.temperature < 0
                      ? 'temperature--negative'
                      : 'temperature--positive'
                  }"
                 paint-order="stroke"
                 stroke-width="0.02"
                 text-anchor="end" x="${
                   observation.calculated
                     ? observation.lonForMap + 0.22
                     : observation.lonForMap + 0.09
                 }"
                  y="${
                    observation.calculated
                      ? -1 * observation.latForMap + 0.05
                      : -1 * observation.latForMap - 0.01
                  }">${
                    showFeelsLike === true
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
  static _viewBox(coordinates, large) {
    const width = 2;
    const height = large === true ? 1.6 : 1.6;

    return `${coordinates.lon - width / 2} -${
      coordinates.lat + height / 2
    } ${width} ${height}`;
  }

  /**
   * Adjusting coordinates iteratively. Places the stations on the map starting from
   * the nearest. If the placed stations collides with the previous stations, move
   * it by extendLength until it fits
   */
  static _adjustCoordinates(observations) {
    const stationRadius = 0.165;
    const calculatedStationRadius = 0.35;
    const extendLength = 0.01; // how much station is moved per cycle

    // for some reason, algorithm performs better when applied 3 times in a row :)
    for (let i = 0; i <= 5; i += 1) {
      observations.forEach(o1 => {
        observations.forEach(o2 => {
          while (
            o2.calculated !== true &&
            o1.latForMap !== o2.latForMap &&
            o1.lonForMap !== o2.latForMap &&
            o1.collision !== true &&
            o2.collision !== true &&
            checkCollision(
              o1.lonForMap,
              o1.latForMap,
              o1.calculated ? calculatedStationRadius : stationRadius,
              o2.lonForMap,
              o2.latForMap,
              stationRadius
            ) === true
          ) {
            const extendedLine = extendVector(
              o1.lonForMap,
              o1.latForMap,
              o2.lonForMap,
              o2.latForMap,
              extendLength
            );

            // eslint-disable-next-line no-param-reassign
            o2.lonForMap = extendedLine.x2Ext;
            // eslint-disable-next-line no-param-reassign
            o2.latForMap = extendedLine.y2Ext;
          }
        });
      });
    }
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
