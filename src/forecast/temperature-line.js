import { css, html, LitElement } from 'lit-element';

class TemperatureLine extends LitElement {
  static get styles() {
    return css`
      :host {
        --color-30: rgb(255, 172, 172);
        --color-30: rgb(255, 182, 182);
        --color-20: rgb(255, 193, 193);
        --color-15: rgb(255, 205, 205);
        --color-10: rgb(255, 215, 215);
        --color-5: rgb(255, 225, 225);
        --color-0: rgb(255, 236, 236);
        --color--5: rgb(239, 244, 252);
        --color--10: rgb(220, 233, 250);
        --color--15: rgb(143, 177, 211);
        --color--20: rgb(202, 221, 247);
      }
      .chart {
        position: relative;
      }
      svg {
        position: absolute;
        bottom: 0;
        overflow: visible;
        animation: growTemperatureLine 0.3s ease-out;
      }

      @keyframes growTemperatureLine {
        0% {
          height: 0;
        }
        100% {
          height: 25;
        }
      }
    `;
  }

  render() {
    return html`
      <!-- placeholder for chart -->
      <div class="chart"></div>
    `;
  }

  constructor() {
    super();

    this._chartHeight = 25;
    this._lineVariance = 5;
    this._bottomMargin = 0;
  }

  firstUpdated() {
    setTimeout(() => {
      this._createChart(this.dayData);
    }, 600);
  }

  static get is() {
    return 'temperature-line';
  }

  static get properties() {
    return {
      minTemperature: {
        type: Number,
      },
      dayData: {
        type: Array,
      },
      _chartHeight: {
        type: Number,
      },
      _lineVariance: {
        type: Number,
      },
      _bottomMargin: {
        type: Number,
      },
    };
  }

  /**
   * Chart containing rain bars, temperature line, past time shadow and present time triangle
   */
  _createChart(dayData) {
    if (dayData === undefined) {
      return;
    }

    const svg = this._svg();

    const coordinates = this._temperatureCoordinates(dayData);
    const firstX = TemperatureLine._xCoordinate(
      TemperatureLine._getFirstTemperatureIndex(dayData)
    );
    const lastX = TemperatureLine._xCoordinate(
      TemperatureLine._getLastTemperatureIndex(dayData)
    );

    const line = TemperatureLine._temperatureLine(coordinates, firstX, lastX);
    svg.appendChild(line);

    this._$('.chart').appendChild(svg);
  }

  _svg() {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

    // min-x, min-y, width and height
    svg.setAttribute('viewBox', `0 0 240 ${this._chartHeight}`);
    svg.setAttribute('id', 'chartsvg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', this._chartHeight);

    svg.setAttribute('preserveAspectRatio', 'none');
    return svg;
  }

  static _temperatureLine(coordinates, firstX, lastX) {
    const line = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'polyline'
    );
    line.setAttribute('fill', 'rgb(225, 61, 55, 0.10)');
    line.setAttribute('fill-opacity', '1');
    line.setAttribute('stroke', '#fe0101');

    line.setAttribute('stroke-width', '0');
    line.setAttribute('stroke-opacity', '0.10');
    line.setAttribute('points', `${firstX},50 ${coordinates} ${lastX} 50`);

    return line;
  }

  static _getFirstTemperatureIndex(dayData) {
    function hasTemperature(element) {
      return !Number.isNaN(element.temperature);
    }

    return dayData.findIndex(hasTemperature);
  }

  static _getLastTemperatureIndex(dayData) {
    function hasTemperature(element) {
      return !Number.isNaN(element.temperature);
    }

    return (
      dayData.length - 1 - dayData.slice().reverse().findIndex(hasTemperature)
    );
  }

  _temperatureCoordinates(data) {
    let points = '';
    const baseY = this._maxYCoordinate(this._lineVariance, this._bottomMargin);

    for (let i = 0; i < data.length; i += 1) {
      if (!Number.isNaN(data[i].temperature)) {
        points = `${points}${TemperatureLine._xCoordinate(i)},
                    ${TemperatureLine._yCoordinate(
                      baseY,
                      data[i].temperature,
                      this._lineVariance
                    )} `;
      }
    }

    return points;
  }

  static _xCoordinate(index) {
    return index * 10;
  }

  static _yCoordinate(baseY, temperature, lineVariance) {
    return baseY + temperature * -lineVariance;
  }

  /**
   * @param { Number} lineHeightVariance - bigger number indicate more variance in line height
   * @param { Number } marginBottom -  Min margin for temperature graph
   */
  _maxYCoordinate(lineHeightVariance, marginBottom) {
    return (
      this._chartHeight +
      this.minTemperature * lineHeightVariance -
      marginBottom
    );
  }

  _$(selector) {
    return this.shadowRoot.querySelector(selector);
  }
}
window.customElements.define(TemperatureLine.is, TemperatureLine);
