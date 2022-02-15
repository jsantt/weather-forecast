import { css, html, LitElement, svg } from 'lit-element';
import { checkCollision, extendVector } from './vector-math.js';

import '../../common-components/error-notification.js';
import '../../common-components/wind-icon.js';

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

      .svg-text {
        fill: var(--color-gray-300);
        font-size: 0.15px;

        text-rendering: optimizeLegibility;
      }

      .selected-station circle {
        opacity: 1;
        fill: var(--color-blue-800);
        stroke: var(--color-white);
      }

      use,
      .svg-text {
        pointer-events: none;
      }

      .celcius {
        dominant-baseline: ideographic;
        font-size: 0.08px;
        fill: var(--color-gray-300);
      }

      .feels-like {
        font-style: italic;
      }

      error-notification {
        padding: var(--space-l) 0 var(--space-xl) 0;
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
        errorText="Sääasemille ei valitettavasti saatu yhteyttä"
      >
      </error-notification>`;
    }

    this._observationData = observations;

    StationMap._adjustCoordinates(coordinates, this._observationData);

    return svg`
      <svg viewBox="${StationMap._viewBox(coordinates, large)}">
        <!-- paint in "z-index" order, because
              svg does not have z-index --> 

        ${this._observationData.map((observation, index) => {
          return svg`
            <g class="${
              observation.selectedStation === true ? 'selected-station' : ''
            }">
            <circle
              @click="${() => this._stationClicked(index)}"
              cx="${observation.lonForMap}"
              cy="${-1 * observation.latForMap}"
              r="${observation.selectedStation ? 0.16 : 0.16}"
              opacity="0.8"
              stroke="var(--color-gray-500)"
              stroke-width="0.013"
              fill="var(--color-blue-650)"
            />
          
           <use
              x="${observation.lonForMap - 0.14}"
              y="${-1 * observation.latForMap - 0.09}"
              width="0.25"
              height="0.25"
              href="assets/image/weather-symbols.svg#weatherSymbol${
                observation.weatherCode3
              }"
            ></use>
            ${
              showFeelsLike === true &&
              (observation.feelsLike === undefined ||
                Number.isNaN(observation.feelsLike))
                ? ''
                : svg`
                  <text  class="svg-text" text-anchor="end" x="${
                    observation.lonForMap + 0.1
                  }"
                  y="${-1 * observation.latForMap - 0.02}">${
                    showFeelsLike === true
                      ? svg`<tspan class="feels-like">${observation.feelsLike}<tspan class="celcius">°</tspan>`
                      : svg`${Math.round(
                          observation.temperature
                        )}<tspan class="celcius">°</tspan>`
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
  static _adjustCoordinates(coordinates, observations) {
    const stationRadius = 0.165;
    const extendLength = 0.01; // how much station is moved per cycle

    // for some reason, algorithm performs better when applied 3 times in a row :)
    for (let i = 0; i <= 2; i += 1) {
      observations.forEach((o1, index) => {
        observations.forEach(o2 => {
          while (
            o1.latForMap !== o2.latForMap &&
            o1.lonForMap !== o2.latForMap &&
            o1.collision !== true &&
            o2.collision !== true &&
            checkCollision(
              o1.lonForMap,
              o1.latForMap,
              stationRadius,
              o2.lonForMap,
              o2.latForMap,
              stationRadius
            ) === true
          ) {
            // eslint-disable-next-line no-param-reassign
            o1.collisionId = index;
            // eslint-disable-next-line no-param-reassign
            o2.collisionId = index;

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
