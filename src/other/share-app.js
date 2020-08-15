import { css, html, LitElement } from 'lit-element';

import '@polymer/iron-icon/iron-icon.js';

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
      button {
        all: unset;
        box-sizing: border-box;
        background-color: var(--color-blue-500);
        border-radius: 4px;
        color: var(--color-white);

        display: flex;
        align-items: center;
        justify-content: center;

        font-weight: var(--font-weight-bold);
        text-align: center;
        text-transform: uppercase;

        padding: 1rem;
        width: 100%;
      }
    `;
  }

  render() {
    return html` ${this._show === true
      ? html` <a @click="${this._share}">
          Jaa sovellus
          <iron-icon class="share" icon="weather-icons:iosShare"></iron-icon>
        </a>`
      : ''}`;
  }

  _show() {
    return navigator.share;
  }

  _share() {
    if (navigator.share) {
      navigator.share({
        title: 'Sääennuste',
        text:
          'Paras, yksinkertaisin ja nopein sääennuste. Perustuu Ilmatieteen laitoksen avoimeen dataan.',
        url: 'https://saaennuste.fi',
      });
    }
  }
}

window.customElements.define(ShareApp.is, ShareApp);
