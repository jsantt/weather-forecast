import { css, html, LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import {
  ForecastDay,
  ForecastHour,
} from '../../backend-calls/forecast-data/forecast-data.ts';

class RainBars extends LitElement {
  static get is() {
    return 'rain-bars';
  }

  static get styles() {
    return css`
      :host {
        display: block;
        opacity: 0.6;
      }
      .chart {
        position: relative;
      }

      .rainBar {
        fill: var(--color-rain);
        animation: growRainBars 0.3s ease-out;
      }

      .svg {
        padding-bottom: 0.1rem;

        position: absolute;
        bottom: 0;

        overflow: visible;
      }

      @keyframes growRainBars {
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
      <div class="chart" id="chart"></div>
    `;
  }

  @property({ type: Object })
  forecastDay?: ForecastDay;

  @property({ type: Number, reflect: true })
  _chartHeight: number;

  constructor() {
    super();
    this._chartHeight = 50;
  }

  updated() {
    if (!this.forecastDay) {
      return;
    }

    this._createChart(this.forecastDay.hours);
  }

  /**
   * Chart containing rain bars
   */
  _createChart(dayData: ForecastHour[]) {
    const svg = this._svg();

    this._rainBars(svg, dayData);

    // remove previous children

    if (this._chart && this._chart.children.length > 0) {
      this._chart.removeChild(this._chart.children[0]);
    }
    if (this._chart) {
      this._chart.appendChild(svg);
    }
  }

  _svg() {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

    // min-x, min-y, width and height
    svg.setAttribute('viewBox', `0 0 240 ${this._chartHeight}`);
    svg.setAttribute('id', 'chartsvg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', this._chartHeight.toString());

    svg.setAttribute('preserveAspectRatio', 'none');
    svg.setAttribute('class', 'svg');
    return svg;
  }

  _rainBars(svg: SVGSVGElement, hours: ForecastHour[]) {
    hours.map((hour, index) => {
      if (!Number.isNaN(hour.rain)) {
        const bar = document.createElementNS(
          'http://www.w3.org/2000/svg',
          'rect'
        );

        bar.setAttribute('class', `rainBar ${hour.rainType}`);
        bar.setAttribute('width', '8');

        const rectHeight = RainBars._rectHeight(
          hour.rain,
          hour.snow,
          hour.rainType
        );

        bar.setAttribute('height', rectHeight.toString());

        // define top left corner of rectangle
        bar.setAttribute('y', `${this._chartHeight - rectHeight}`);
        bar.setAttribute('x', `${index * 9.6}`);

        svg.appendChild(bar);
      }
    });
  }

  /**
   *  draw rectangle of height 10 x rain amount, 107 being maximum height
   * @param {v} rainAmount
   */
  static _rectHeight(rainAmount: number, snow: number, rainType?: string) {
    if (Number.isNaN(rainAmount)) {
      return 0;
    }
    // even though the rain amount is zero, if weather symbol shows the rain or snow, we want to
    // show it
    if (rainAmount === 0 && rainType !== undefined) {
      return 1;
    }

    if (rainType === 'snow' && snow !== undefined) {
      return Math.min(snow * 15, 145);
    }

    return Math.min(rainAmount * 10, 145);
  }

  get _chart() {
    return this.shadowRoot?.querySelector('#chart');
  }
}

window.customElements.define(RainBars.is, RainBars);
