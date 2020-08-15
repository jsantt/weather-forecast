import { css, html, LitElement } from 'lit-element';

class WindIcon extends LitElement {
  static get styles() {
    return css`
      .windIcon {
        height: 30px;
        width: 30px;
      }

      .windIcon--large {
        height: 42px;
        width: 42px;
        transition: all 0.2s ease-in-out;
      }

      .windIcon--large:hover {
        transform: scale(1.1);
      }

      .windSpeed,
      .windGustSpeed {
        fill: var(--color-gray-900);
        font-weight: var(--font-weight-boldest);
        font-size: 48px;
      }

      .windGustSpeed--white {
        fill: var(--color-white);
      }

      .windIcon_arrow {
        fill: #ffcdd2;
        stroke: var(--color-gray-900);
      }

      .windIcon_circle {
        fill: var(--color-white);
        stroke: var(--color-gray-900);
      }

      g {
        transition: transform 1s ease;
      }
    `;
  }
  render() {
    return html`<svg
      id="windIcon"
      class="windIcon ${this.large === true ? 'windIcon--large' : ''}"
      viewBox="0 0 115 110"
      preserveAspectRatio="xMidYMid meet"
    >
      <g transform="${this._rotate(this.degrees)}">
        <polyline
          class="windIcon_arrow"
          stroke-width="4"
          points="36,29 50,10 64,29"
        ></polyline>
        <circle
          class="windIcon_circle warning--color${this.color}"
          stroke-width="4"
          cx="50"
          cy="60"
          r="33"
        ></circle>
      </g>
      <text text-anchor="middle" x="49" y="79" class="windSpeed">
        ${this._round(this.windSpeed)}
      </text>
      <text
        text-anchor="middle"
        x="96"
        y="38"
        stroke="0"
        class="windGustSpeed warning--color${this.color} ${this.whiteGust ===
        true
          ? 'windGustSpeed--white'
          : ''}"
      >
        ${this._round(this.windGustSpeed)}
      </text>
    </svg>`;
  }

  static get is() {
    return 'wind-icon';
  }

  static get properties() {
    return {
      degrees: {
        type: Number,
        reflect: true,
      },
      large: {
        type: Boolean,
        reflect: true,
      },
      whiteGust: {
        type: Boolean,
        reflect: true,
      },
      windGustSpeed: {
        type: Number,
        reflect: true,
      },
      windSpeed: {
        type: Number,
        reflect: true,
      },
    };
  }

  _rotate(degrees) {
    let transform = 0;

    if (Number.isFinite(degrees)) {
      transform = (degrees + 180) % 360;
    }

    return `rotate(${transform}, 50, 60)`;
  }

  _round(value) {
    if (Number.isNaN(value)) {
      return '';
    }

    return Math.round(value);
  }
}

window.customElements.define(WindIcon.is, WindIcon);
