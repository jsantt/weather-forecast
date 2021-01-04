import { css, html, LitElement } from 'lit-element';

/**
 * Expand component including smooth transition (animation)
 *
 * Usage:
 *
 *   <smooth-expand ?expanded="${month.expanded}">
 *    <div class="expandable">content here </div>
 *   </smooth-expand>
 *
 * Notice that the content has to be inside an HTML element, such as div. Otherwise possible padding won't work nicely
 *
 */
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
        transition: var(--transition, max-height 0.3s, padding 0.3s);
      }
    }`;
  }

  render() {
    return html`<slot></slot>`;
  }

  constructor() {
    super();
    this.ready = true;
  }

  static get properties() {
    return {
      expanded: { type: Boolean, reflect: true },
      ready: { type: Boolean, reflect: true },
    };
  }

  updated() {
    if (this.expanded === true) {
      this._setMaxHeight(this._getHiddenHeight());
    } else {
      this._setMaxHeight(0);
    }
    this.ready = false;
    setTimeout(() => {
      this.ready = true;
    }, 300);
  }

  _setMaxHeight(maxHeight) {
    this.style.maxHeight = `${maxHeight}px`;
  }

  _getHiddenHeight() {
    return this.scrollHeight;
  }
}

window.customElements.define(SmoothExpand.is, SmoothExpand);
