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
        border: 2px solid var(--color-blue);
        border-radius: 3rem;

        color: var(--color-dark);
        
        
        font-family: inherit;
        font-optical-sizing: inherit;
        font-style: inherit;
        font-variation-settings: inherit;

        font-size: var(--font-size-s);
        font-weight: var(--font-weight-bold);

        margin: 0;
        padding: var(--space-m) var(--space-l);

        text-align: center;
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

  _dispatchEvent(name: string) {
    const event = new CustomEvent(`${InstallButton.is}.${name}`, {
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }
}

window.customElements.define(InstallButton.is, InstallButton);
