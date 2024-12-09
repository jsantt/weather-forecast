import { css, html, LitElement } from 'lit';

class SvgIcon extends LitElement {
  static get is() {
    return 'svg-icon';
  }

  static get styles() {
    return css`
      :host {
        display: inline-block;
        height: 45px;
        width: 45px;

        vertical-align: middle;
      }

      :host([x-small]) {
        height: 14px;
        width: 14px;
      }

      :host([small]) {
        height: 20px;
        width: 20px;
      }

      :host([medium]) {
        height: 32px;
        width: 32px;
      }

      :host([large]) {
        height: 48px;
        width: 48px;
      }

      svg {
        display: block;
        pointer-events: none;
        height: 100%;
        width: 100%;
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
      small: {
        type: Boolean,
        reflect: true,
      },
      medium: {
        type: Boolean,
        reflect: true,
      },
    };
  }

  updated() {
    this.shadowRoot
      .querySelector('use')
      .setAttributeNS('http://www.w3.org/1999/xlink', 'href', this.path);
  }
}

window.customElements.define(SvgIcon.is, SvgIcon);
