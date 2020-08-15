import { css, html, LitElement } from 'lit-element';

class RainBars extends LitElement {
  static get is() {
    return 'rain-bars';
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }
      .chart {
        position: relative;
      }

      .rainBar {
        fill: var(--color-blue-300);
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

  static get properties() {
    return {
      dayData: {
        type: Array,
      },

      minTemperature: {
        type: Number,
        reflect: true,
      },

      _chartHeight: {
        type: Number,
        reflect: true,
      },
    };
  }

  constructor() {
    super();
    this._chartHeight = 50;
  }

  updated() {
    this._createChart(this.dayData);
  }

  /**
   * Chart containing rain bars
   */
  _createChart(dayData) {
    let svg = this._svg();

    this._rainBars(svg, dayData);

    // remove previous childs

    if (this._chart && this._chart.children.length > 0) {
      this._chart.removeChild(this._chart.children[0]);
    }
    if (this._chart) {
      this._chart.appendChild(svg);
    }
  }

  _svg() {
    let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

    // min-x, min-y, width and height
    svg.setAttribute('viewBox', '0 0 240 ' + this._chartHeight);
    svg.setAttribute('id', 'chartsvg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', this._chartHeight);

    svg.setAttribute('preserveAspectRatio', 'none');
    svg.setAttribute('class', 'svg');
    return svg;
  }

  _rainBars(svg, data) {
    for (let i = 0; i < data.length; i++) {
      if (!Number.isNaN([i].rain)) {
        let bar = document.createElementNS(
          'http://www.w3.org/2000/svg',
          'rect'
        );

        bar.setAttribute('class', 'rainBar');

        let opacity = data[i].past ? '0.3' : '1';
        bar.setAttribute('fill-opacity', opacity);
        bar.setAttribute('width', '9');

        const rectHeight = this._rectHeight(data[i].rain);

        bar.setAttribute('height', rectHeight);

        // define top left corner of rectangle
        bar.setAttribute('y', this._chartHeight - rectHeight);
        bar.setAttribute('x', i * 9.6);

        svg.appendChild(bar);
      }
    }
  }

  /**
   *  draw rectangle of height 10 x rain amount, 107 being maximum height
   * @param {v} rainAmount
   */
  _rectHeight(rainAmount) {
    return Number.isNaN(rainAmount) ? 0 : Math.min(rainAmount * 10, 107);
  }

  get _chart() {
    return this.shadowRoot.querySelector('#chart');
  }
}

window.customElements.define(RainBars.is, RainBars);
