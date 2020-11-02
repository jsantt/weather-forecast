import { css, html, LitElement } from 'lit-element';

class FeelsLikeIcon extends LitElement {
  static get is() {
    return 'feels-like-icon';
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }

      text {
        fill: var(--color-gray-900);
        font-size: 19px;
      }

      svg {
        stroke: var(--color-gray-900);
      }
    `;
  }

  render() {
    return html`
      <svg viewBox="-4 -4 40 40" width="36" height="36">
        <ellipse
          class="body"
          ry="15.1"
          rx="14.9"
          cy="29"
          cx="15.9"
          stroke-width="1.5"
          fill="#fff"
        />
        <ellipse
          class="head"
          stroke-width="1.5"
          ry="7.3"
          rx="7.5"
          cy="8.2"
          cx="16"
          fill="#ffcdd2"
        />
        <text text-anchor="middle" stroke="0" stroke-width="0.7" x="15" y="33">
          ${this.temperature}
        </text>
      </svg>
    `;
  }

  static get properties() {
    return {
      temperature: { type: Number, reflect: true },
    };
  }
}

window.customElements.define(FeelsLikeIcon.is, FeelsLikeIcon);
