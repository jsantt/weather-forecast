import { css, html, LitElement, svg } from 'lit-element';

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

  updated() {}

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

  _createMap(coordinates, observations) {
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

          <circle
            cx="${coordinates.lon}"
            cy="${-1 * coordinates.lat}"
            r="0.35"
            stroke-width="0.005"
            stroke="#fff"
            fill="#fff"
            fill-opacity="0.1"
          />
        </g>

        ${observations.map(observation => {
          return svg`<use
              x="${observation.longitude}"
              y="${-1 * observation.latitude}"
              width="0.1"
              height="0.1"
              href="assets/image/weather-symbols.svg#weatherSymbol${
                observation.weatherCode3
              }"
            ></use>

            `;
        })}
      </svg>
    `;
  }
}

window.customElements.define(StationMap.is, StationMap);
