import { css, html, LitElement } from 'lit';
import { property } from 'lit/decorators.js';

class WindIcon extends LitElement {
  static get is() {
    return 'wind-icon';
  }

  @property({ type: Number, reflect: true })
  degrees!: number;

  @property({ type: Boolean, reflect: true })
  isDayHighest!: boolean;

  @property({ type: Boolean, reflect: true })
  large!: boolean;

  @property({ type: Number, reflect: true })
  rating!: number;

  @property({ type: Boolean, reflect: true })
  minimal!: boolean;

  @property({ type: Boolean, reflect: true })
  whiteGust!: boolean;

  @property({ type: Number, reflect: true })
  windGustSpeed!: number;

  @property({ type: Number, reflect: true })
  windSpeed!: number;

  static get styles() {
    return css`
      :host {
        display: inline-block;
      }

      .windIcon {
        height: 36px;
        width: 36px;
      }

      :host([large]) .windIcon {
        height: 40px;
        width: 40px;
      }

      .windGustSpeed {
        fill: var(--color-primary);
      }

      .windSpeed,
      .windGustSpeed {
        font-weight: var(--font-weight-bold);
        font-size: 48px;
      }

      :host([whiteGust]) .windGustSpeed {
        fill: var(--color-secondary);
      }

      .windIcon_arrow {
        fill: var(--color-gray-500);
      }

      .windIcon_circle {
        fill: var(--background-accent);
      }

      g {
        transition: transform 1s ease;
      }

      :host([rating='2']) .windIcon_arrow {
        fill: var(--background-wind-warning);
      }

      :host([rating='3']) .windIcon_arrow,
      :host([rating='4']) .windIcon_arrow {
        fill: var(--background-wind-warning2);
      }

      .windIcon_innerCircle {
        fill: none;
        stroke: var(--background-wind-warning);
      }
    `;
  }

  render() {
    if (this.minimal && !this.isDayHighest) {
      return html``;
    }

    if (Number.isNaN(this.windSpeed)) {
      return html``;
    }
    return html`<svg
      id="windIcon"
      class="windIcon"
      viewBox="0 0 115 110"
      preserveAspectRatio="xMidYMid meet"
    >
      <g transform="${WindIcon._rotate(this.degrees)}">
        <polyline
          class="windIcon_arrow"
          stroke-width="0"
          points="36,29 50,10 64,29"
        ></polyline>
        <circle
          class="windIcon_circle"
          stroke-width="3"
          cx="50"
          cy="60"
          r="33"
          opacity="1"
        ></circle>
      </g>
      <text text-anchor="middle" x="49" y="79" class="windSpeed">
        ${WindIcon._round(this.windSpeed)}
      </text>
      <text text-anchor="middle" x="96" y="38" stroke="0" class="windGustSpeed">
        ${WindIcon._round(this.windGustSpeed)}
      </text>
    </svg>`;
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
