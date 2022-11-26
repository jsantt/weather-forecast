import { css, html, LitElement } from 'lit-element';

class WindIcon extends LitElement {
  static get styles() {
    return css`
      :host {
        display: inline-block;
      }

      .windIcon {
        height: 36px;
        width: 36px;
      }

      .windIcon--large {
        height: 40px;
        width: 40px;
      }

      .windSpeed,
      .windGustSpeed {
        fill: var(--color-primary);
        font-weight: var(--font-weight-boldest);
        font-size: 48px;
      }

      :host([rating='2']) .windSpeed {
        fill: #333;
      }

      .windGustSpeed--white {
        fill: var(--color-secondary);
      }

      .windIcon_arrow {
        fill: var(--color-primary);
        stroke: var(--color-primary);
      }

      g {
        transition: transform 1s ease;
      }

      .windIcon_circle {
        fill: var(--background-wind);
        stroke: var(--color-gray-900);
      }

      :host([rating='1']) .windIcon_circle {
        fill: var(--background-wind);
      }

      :host([rating='2']) .windIcon_circle {
        fill: var(--background-wind-warning);
      }

      :host([rating='3']) .windIcon_circle,
      :host([rating='4']) .windIcon_circle {
        fill: var(--background-wind-warning2);
      }

      :host([rating='3']) .windSpeed,
      :host([rating='4']) .windSpeed {
        fill: var(--color-wind-warning2);
      }
    `;
  }

  render() {
    if (Number.isNaN(this.windSpeed)) {
      return html``;
    }
    return html`<svg
      id="windIcon"
      class="windIcon ${this.large === true ? 'windIcon--large' : ''}"
      viewBox="0 0 115 110"
      preserveAspectRatio="xMidYMid meet"
    >
      <g transform="${WindIcon._rotate(this.degrees)}">
        <polyline
          class="windIcon_arrow"
          stroke-width="4"
          points="36,29 50,10 64,29"
        ></polyline>
        <circle
          class="windIcon_circle"
          stroke-width="4"
          cx="50"
          cy="60"
          r="33"
        ></circle>
      </g>
      <text text-anchor="middle" x="49" y="79" class="windSpeed">
        ${WindIcon._round(this.windSpeed)}
      </text>
      <text
        text-anchor="middle"
        x="96"
        y="38"
        stroke="0"
        class="windGustSpeed ${this.whiteGust === true
          ? 'windGustSpeed--white'
          : ''}"
      >
        ${WindIcon._round(this.windGustSpeed)}
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
      rating: {
        type: Number,
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

  static _rotate(degrees) {
    let transform = 0;

    if (Number.isFinite(degrees)) {
      transform = (degrees + 180) % 360;
    }

    return `rotate(${transform}, 50, 60)`;
  }

  static _round(value) {
    if (Number.isNaN(value)) {
      return '';
    }

    return Math.round(value);
  }
}

window.customElements.define(WindIcon.is, WindIcon);
