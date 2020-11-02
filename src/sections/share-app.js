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
    return html` ${ShareApp._show === true
      ? html` <a @click="${ShareApp._share}">
          Jaa sovellus
          <svg-icon path="assets/image/icons.svg#iosShare"></svg-icon>
        </a>`
      : ''}`;
  }

  static _show() {
    return navigator.share;
  }

  static _share() {
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
