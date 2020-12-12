import { css, html, LitElement } from 'lit-element';

class SmoothExpand extends LitElement {
  static get is() {
    return 'smooth-expand';
  }

  static get styles() {
    return css`
      :host {
        display: block;
        max-height: var(--initial-height, 0);

        overflow: hidden;
        transition: var(--transition, max-height 0.3s ease);
      }
  }`;
  }

  render() {
    return html`<slot></slot>`;
  }

  static get properties() {
    return {
      expanded: { type: Boolean, reflect: true },
    };
  }

  updated() {
    if (this.expanded === true) {
      this._setMaxHeight(this._getHiddenHeight());
    } else {
      this._setMaxHeight(0);
    }
  }

  _setMaxHeight(maxHeight) {
    this.style.maxHeight = `${maxHeight}px`;
  }

  _getHiddenHeight() {
    return this.scrollHeight;
  }
}

window.customElements.define(SmoothExpand.is, SmoothExpand);
