import { css, html, LitElement } from 'lit';
import { property } from 'lit/decorators.js';

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
    `;
  }

  @property({ type: Boolean, reflect: true })
  expanded: boolean = false;

  render() {
    return html`<slot aria-hidden="${this.expanded === true}"></slot>`;
  }

  updated() {
    if (this.expanded === true) {
      this._setMaxHeight(this._getHiddenHeight() + 12);
      setTimeout(() => {
        this._setMaxHeight(this._getHiddenHeight() + 12);
      }, 310);
    } else {
      this._setMaxHeight(0);
    }
  }

  private _setMaxHeight(maxHeight: number) {
    this.style.maxHeight = `${maxHeight}px`;
  }

  private _getHiddenHeight() {
    const innerElement = this.querySelector('*');
    if (innerElement === null) {
      throw new Error(
        '<smooth-expand> has to contain at least one HTML element, such as a <div>'
      );
    }

    return innerElement.scrollHeight;
  }
}

window.customElements.define(SmoothExpand.is, SmoothExpand);
