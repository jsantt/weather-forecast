import { css, html, LitElement } from 'lit';

import '../common-components/svg-icon';
import '../weather-section';

class ShareApp extends LitElement {
  static get is() {
    return 'share-app';
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }

      .content {
        padding: var(--space-l) var(--space-l) 0 var(--space-l);
      }

      button {
        background: transparent;
        border: 2px solid var(--color-dark-and-light);

        border-radius: 1.5rem;

        color: var(--color-dark-and-light);
        font-family: inherit;
        font-size: var(--font-size-s);
        font-weight: var(--font-weight-bold);

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
        fill: var(--color-blue-800);
        min-width: 100px;
        min-height: 100px;
        margin-bottom: var(--space-l);
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
      <weather-section padding liftedHeading="Jaa sovellus" green>
        <div class="content">
          <div>
            <svg-icon
              class="qr half"
              path="assets/image/icons.svg#qr"
            ></svg-icon>
          </div>

          ${ShareApp._show() === true
            ? html`
                <button class="half" @click="${ShareApp._share}">
                  lähetä linkki
                </button>
              `
            : ''}
        </div>
      </weather-section>
    `;
  }

  static _show() {
    return true; // navigator.share;
  }

  static _share() {
    if (navigator.share) {
      navigator.share({
        title: 'Uusi sääsovellus',
        text: 'Hei, ajattelin että saattaisit tykätä tästä sovelluksesta, joka näyttää Ilmatieteen laitoksen sään.',
        url: 'https://saaennuste.fi',
      });
    }
  }
}

window.customElements.define(ShareApp.is, ShareApp);
