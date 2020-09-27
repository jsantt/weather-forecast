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
      }

      .nearest-circle {
        opacity: 1;
      }

      .svg-text {
        fill: var(--color-gray-300);
        font-size: 0.11px;

        text-rendering: optimizeLegibility;
      }

      .nearest-svg-text {
        fill: var(--color-blue-800);
      }

      .celcius {
        dominant-baseline: ideographic;
        font-size: 0.07px;
        fill: var(--color-gray-700);
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
    const extendLength = 0.001;

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

  _createMap(coordinates, observations) {
    if (observations === undefined) {
      return;
    }

    StationMap._adjustCoordinates(coordinates, observations);

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
            fill="var(--color-gray-500)"
          />

          <circle
            cx="${coordinates.lon}"
            cy="${-1 * coordinates.lat}"
            r="0.06"
            stroke="var(--color-gray-500)"
            stroke-width="0.007"
            fill="none"
          />
        </g>
        ${observations.map((observation, index) => {
          return svg`
            <circle
              class="${index === 0 ? 'nearest-circle' : ''}"
              cx="${observation.lonForMap}"
              cy="${-1 * observation.latForMap}"
              r="0.12"
              fill="var(--color-gray-300)"
              opacity="0.1"
              stroke="var(--color-gray-300)"
              stroke-width="0.010"
            />
            }
            `;
        })}
        

        ${observations.map((observation, index) => {
          return svg`
          <!-- moved line -->
          <!-- g opacity="0.5">
            <line 
              x1="${observation.lon}" 
              y1="${-1 * observation.lat}"
              x2="${observation.lonForMap}" 
              y2="${-1 * observation.latForMap}" 
              stroke-width="0.005" 
              stroke-dasharray="0.01" 
              stroke="var(--color-gray-300)"/>

            <circle
              cx="${observation.lon}"
              cy="${-1 * observation.lat}"
              r="0.01"
            stroke-width="0"
            fill="var(--color-gray-300)"
            /-->
            
          </g>

           <use
              x="${observation.lonForMap - 0.14}"
              y="${-1 * observation.latForMap - 0.07}"
              width="0.2"
              height="0.2"
              href="assets/image/weather-symbols.svg#weatherSymbol${
                observation.weatherCode3
              }"
            ></use>
              <text  class="svg-text ${
                index === 0 ? 'nearest-svg-text' : ''
              }" text-anchor="right" x="${observation.lonForMap - 0.02}"
              y="${-1 * observation.latForMap}">${Math.round(
            observation.temperature
          )}<tspan class="celcius">°C</tspan></text>
          
            `;
        })}
      </svg>
    `;
  }
}

window.customElements.define(StationMap.is, StationMap);
