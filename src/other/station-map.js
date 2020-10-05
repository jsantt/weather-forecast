import { css, html, LitElement, svg } from 'lit-element';
import { checkCollision, extendVector } from './vector-math.js';

import '../common/wind-icon.js';

class StationMap extends LitElement {
  static get is() {
    return 'station-map';
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }

      .svg-text {
        fill: var(--color-gray-300);
        font-size: 0.11px;

        text-rendering: optimizeLegibility;
      }

      .selected-station circle {
        opacity: 1;
        fill: var(--color-blue-650);
      }

      .selected-station .svg-text {
      }

      use,
      .svg-text {
        pointer-events: none;
      }

      .celcius {
        dominant-baseline: ideographic;
        font-size: 0.08px;
        fill: var(--color-gray-700);
      }
    `;
  }

  render() {
    return html`
      ${this._createMap(
        this.location,
        this.observationData,
        this.showFeelsLike
      )}
    `;
  }

  _createMap(coordinates, observations, showFeelsLike) {
    if (observations === undefined) {
      return;
    }

    this._observationData = observations;

    StationMap._adjustCoordinates(coordinates, this._observationData);

    return svg`
      <svg viewBox="${StationMap._viewBox(coordinates)}">
        <!-- paint in "z-index" order, because
              svg does not have z-index -->
        
        <!-- center cirle -->
        <g>
          <circle
            cx="${coordinates.lon}"
            cy="${-1 * coordinates.lat}"
            r="0.03"
            stroke-width="0"
            fill="var(--color-gray-300)"
          />

          <circle
            cx="${coordinates.lon}"
            cy="${-1 * coordinates.lat}"
            r="0.06"
            stroke="var(--color-gray-300)"
            stroke-width="0.007"
            fill="none"
          />
        </g>      

        ${this._observationData.map((observation, index) => {
          return svg`
            <g class="${index === 0 ? 'selected-station' : ''}">
            <circle
              @click="${this._stationClicked(index)}"
              cx="${observation.lonForMap}"
              cy="${-1 * observation.latForMap}"
              r="${index === 0 ? 0.14 : 0.12}"
              fill="var(--color-gray-300)"
              opacity="0.1"
              stroke="var(--color-gray-300)"
              stroke-width="0.010"
             
            />
          
           <use
              x="${observation.lonForMap - 0.14}"
              y="${-1 * observation.latForMap - 0.07}"
              width="0.2"
              height="0.2"
              href="assets/image/weather-symbols.svg#weatherSymbol${
                observation.weatherCode3
              }"
            ></use>
            ${
              showFeelsLike === true && observation.feelsLike === undefined
                ? ''
                : svg`
              <text  class="svg-text" text-anchor="right" x="${
                observation.lonForMap - 0.02
              }"
              y="${-1 * observation.latForMap}">${
                    showFeelsLike === true
                      ? svg`${observation.feelsLike}`
                      : svg`${Math.round(observation.temperature)}`
                  }<tspan class="celcius">°</tspan></text>`
            }
          </g>
            `;
        })}
      </svg>
    `;
  }

  static get properties() {
    return {
      location: {
        type: Object,
      },
      observationData: {
        type: Array,
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

  /**
   * Negative latitude (y) to flip coordinates
   * @param { Object } coordinates
   * @param { Number } coordinates.lat
   * @param { Number } coordinates.lon
   *
   */
  static _viewBox(coordinates) {
    const width = 1.6;
    const height = 1;

    return `${coordinates.lon - width / 2} -${
      coordinates.lat + height / 2
    } ${width} ${height}`;
  }

  static _adjustCoordinates(coordinates, observations) {
    const stationRadius = 0.125; // exact radius is 0.125
    const extendLength = 0.01;

    observations.map((o1, index) => {
      observations.map(o2 => {
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
          o1.collisionId = index;
          o2.collisionId = index;

          const extendedLine = extendVector(
            o1.lonForMap,
            o1.latForMap,
            o2.lonForMap,
            o2.latForMap,
            extendLength
          );
          o2.lonForMap = extendedLine.x2Ext;
          o2.latForMap = extendedLine.y2Ext;
        }
      });
    });
  }

  _stationClicked(index) {
    this._observationData = this._observationData.map(observation => {
      const obs = { ...observation };
      obs.selectedStation = false;
      return obs;
    });
    this._observationData[index].selectedStation = true;
    this.requestUpdate();
  }
}

window.customElements.define(StationMap.is, StationMap);
