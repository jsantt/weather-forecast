import { css, html, LitElement } from 'lit';
import { property } from 'lit/decorators.js';

class ExpandIcon extends LitElement {
  static get is() {
    return 'expand-icon';
  }

  @property({ type: Boolean, reflect: true })
  open: boolean = false;

  static get styles() {
    return css`
      svg-icon {
        height: 16px;
        width: 16px;

        transition: transform var(--transition-time) ease;
      }

      :host([open]) svg-icon {
        transform: scaleY(-1);
      }
    `;
  }

  render() {
    return html` <svg-icon
      path="assets/image/icons.svg#caret-down"
    ></svg-icon>`;
  }
}

window.customElements.define(ExpandIcon.is, ExpandIcon);
