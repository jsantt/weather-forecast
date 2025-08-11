import { css, html, LitElement } from 'lit';

import './install-button';
import '../../common-components/svg-icon';

class BottomNotification extends LitElement {
  static get is() {
    return 'bottom-notification';
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }

      :host([fix-to-top]) .content {
        position: fixed;
        top: 0;
        bottom: auto;
      }

      .content {
        background: var(--background-topmost);

        border-radius: var(--border-radius);

        box-shadow: var(--box-shadow);

        display: grid;
        grid-template-columns: auto auto;
        max-width: 456px;

        padding: var(--space-l);
        margin: 0 auto var(--space-l) auto;

        position: absolute;
        bottom: calc(45px + var(--safe-area-inset-bottom));
        left: 0px;
        right: 0px;
      }

      section {
        color: var(--color-dark-and-light);
        font-size: var(--font-size-s);
      }

      .close {
        margin-left: auto;
        padding: 0 0 var(--space-l) var(--space-l);
      }
    `;
  }

  render() {
    return html`<div class="content">
      <section aria-live="polite">
        <slot></slot>
      </section>

      <div
        class="close"
        role="button"
        @click="${() => this._dispatchEvent('closed')}"
      >
        <svg-icon path="assets/image/icons.svg#close" small></svg-icon>
      </div>
    </div>`;
  }

  _dispatchEvent(name: string) {
    const event = new CustomEvent(`${BottomNotification.is}.${name}`, {
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }
}

window.customElements.define(BottomNotification.is, BottomNotification);

declare global {
  interface CustomEventMap {
    'bottom-notification.closed': CustomEvent<void>;
  }
}
