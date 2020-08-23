import { css, html, LitElement } from 'lit-element';

class SvgIcon extends LitElement {
  static get is() {
    return 'svg-icon';
  }

  static get styles() {
    return css`
      :host {
        display: inline-block;
        vertical-align: middle;
      }

      svg {
        display: block;
        pointer-events: none;
        height: var(--height, 45px);
        width: var(--width, 45px);
      }
    `;
  }

  render() {
    return html`
      <svg
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
        focusable="false"
      >
        <use></use>
      </svg>
    `;
  }

  static get properties() {
    return {
      path: {
        type: String,
        reflect: true,
      },
    };
  }

  updated() {
    this.shadowRoot
      .querySelector('use')
      .setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', this.path);
  }
}

window.customElements.define(SvgIcon.is, SvgIcon);