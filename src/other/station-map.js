import { css, html, LitElement, svg } from 'lit-element';
import { checkCollision, extendVector } from './vector-math.js';

class StationMap extends LitElement {
  static get is() {
    return 'station-map';
  }

  static get styles() {
    return css`
      :host {
        display: block;
        background: var(--background-header);
      }

      .svg-text {
        fill: var(--color-gray-900);
        font-size: 0.05px;
        font-weight: var(--font-weight-bold);
      }
    `;
  }

  render() {
    return html`${this._createMap(this.location, this.observationData)} `;
  }

  static get properties() {
    return {
      location: {
        type: Object,
      },
      observationData: {
        type: Array,
      },
    };
  }

  /**
   * Negative latitude (y) to flip coordinates
   * @param {*} coordinates
   */
  static _viewBox(coordinates) {
    const radius = 0.5;
    const lat = Number.parseFloat(coordinates.lat);
    const lon = Number.parseFloat(coordinates.lon);

    return `${lon - radius} -${lat + radius} 1 1`;
  }

  static _adjustCoordinates(observations) {
    const stationRadius = 0.04;
    const extendLength = 0.03;

    observations.map((o1, index) => {
      observations.map(o2 => {
        if (
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
          o1.lonForMap = extendedLine.x1Ext;
          o1.latForMap = extendedLine.y1Ext;
          o2.lonForMap = extendedLine.x2Ext;
          o2.latForMap = extendedLine.y2Ext;
        }
      });
    });
  }

  _createMap(coordinates, observations) {
    StationMap._adjustCoordinates(observations);

    return svg`
      <svg viewBox="${StationMap._viewBox(coordinates)}">
        
        <g>
          <circle
            cx="${coordinates.lon}"
            cy="${-1 * coordinates.lat}"
            r="0.01"
            stroke-width="0"
            fill="#fff"
          />

          <circle
            cx="${coordinates.lon}"
            cy="${-1 * coordinates.lat}"
            r="0.02"
            stroke-width="0.005"
            fill="none"
            stroke="#fff"
          />

          <!--circle
            cx="${coordinates.lon}"
            cy="${-1 * coordinates.lat}"
            r="0.35"
            stroke-width="0.005"
            stroke="#fff"
            fill="#fff"
            fill-opacity="0.1"
          /-->
        </g>

        ${observations.map(observation => {
          return svg`
          <circle
            cx="${observation.lon}"
            cy="${-1 * observation.lat}"
            r="0.08"
            opacity="0.1"
            fill="#fff"
          />
           <use
              x="${observation.lonForMap - 0.05}"
              y="${-1 * observation.latForMap - 0.01}"
              width="0.1"
              height="0.1"
              href="assets/image/weather-symbols.svg#weatherSymbol${
                observation.weatherCode3
              }"
            ></use><text class="svg-text" text-anchor="middle" x="${
              observation.lonForMap
            }"
              y="${-1 * observation.latForMap}">${
            observation.temperature
          }°C</text>
          

            `;
        })}
      </svg>
    `;
  }
}

window.customElements.define(StationMap.is, StationMap);
