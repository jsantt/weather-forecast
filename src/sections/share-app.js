import { css, html, LitElement } from 'lit-element';

import '../common-components/svg-icon.js';

class ShareApp extends LitElement {
  static get is() {
    return 'share-app';
  }

  static get styles() {
    return css`
      :host {
        padding: var(--space-m);
        margin: var(--space-m);
      }

      .content {
        padding: 1rem;
        display: flex;
        align-items: center;
      }

      button {
        background: transparent;
        border: 2px solid var(--color-blue-700);

        border-radius: 3rem;

        color: var(--color-blue-700);
        font-family: inherit;
        font-size: var(--font-size-m);
        font-weight: var(--font-weight-boldest);

        margin: 0;
        padding: var(--space-m);

        text-align: center;
        width: 100%;
      }

      button:focus {
        outline: none;
      }

      button:focus-visible {
        outline: 2px solid var(--color-orange);
      }

      .qr {
        fill: var(--color-blue-700);
        min-width: 100px;
        min-height: 100px;
      }

      .half {
        height: 100%;
        width: 100%;
      }

      .share {
        fill: var(--color-blue-700);
        opacity: 0.7;
      }
    `;
  }

  render() {
    return html`
      <div class="content">
        <div>
          <svg-icon class="qr half" path="assets/image/icons.svg#qr"></svg-icon>
        </div>

        ${ShareApp._show() === true
          ? html` <button class="half" @click="${ShareApp._share}">
              lähetä linkki &nbsp;
              <svg-icon
                class="share"
                path="assets/image/icons.svg#share"
                small
              ></svg-icon>
            </button>`
          : ''}
      </div>
    `;
  }

  static _show() {
    return true; // navigator.share;
  }

  static _share() {
    if (navigator.share) {
      navigator.share({
        title: 'Uusi sääsovellus',
        text:
          'Hei, ajattelin että saattaisit tykätä tästä sovelluksesta, joka näyttää Ilmatieteen laitoksen sään.',
        url: 'https://saaennuste.fi',
      });
    }
  }
}

window.customElements.define(ShareApp.is, ShareApp);
