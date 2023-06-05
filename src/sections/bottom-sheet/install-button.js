import { css, html, LitElement } from 'lit';

import '../../common-components/svg-icon.js';

class InstallButton extends LitElement {
  static get is() {
    return 'install-button';
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }

      button {
        background: var(--color-blue-700);
        border: 0;
        border-radius: 3rem;

        color: var(--color-white);
        font-family: inherit;
        font-size: var(--font-size-m);
        font-weight: var(--font-weight-boldest);

        margin: 0;
        padding: var(--space-l);

        text-align: center;
        text-transform: uppercase;
        width: 100%;
      }

      button:focus {
        outline: none;
      }

      button:focus-visible {
        outline: 2px solid var(--color-orange);
      }
    `;
  }

  render() {
    return html`
      <button @click="${() => this._dispatchEvent('clicked')}">
        <slot></slot>
      </button>
    `;
  }

  _dispatchEvent(name) {
    const event = new CustomEvent(`${InstallButton.is}.${name}`, {
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }
}

window.customElements.define(InstallButton.is, InstallButton);
