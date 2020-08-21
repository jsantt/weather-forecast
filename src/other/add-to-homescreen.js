import { css, html, LitElement } from 'lit-element';

import '../common/svg-icon.js';

class AddToHomescreen extends LitElement {
  static get is() {
    return 'add-to-homescreen';
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }

      #install-prompt {
        margin: var(--space-l);
      }

      button {
        box-sizing: border-box;
        background-color: var(--color-white);
        border-style: none;
        color: var(--color-black);

        display: flex;
        align-items: center;
        justify-content: center;

        font: inherit;
        font-weight: var(--font-weight-boldest);
        text-align: center;
        text-transform: uppercase;

        outline: none;
        padding: 1rem;
        width: 100%;

        /* Corrects inability to style clickable input types in iOS */
        -webkit-appearance: none;
      }

      .notification {
        background-color: var(--color-white);
        color: var(--color-black);
        padding: var(--space-l) var(--space-m);
      }

      ol {
        line-height: 1.7;
        margin: 0 0 0 2rem;
        padding: 0;
      }

      .sun {
        --iron-icon-width: 32px;
        --iron-icon-height: 32px;

        padding: 0 var(--space-l);
      }

      .sun--hidden {
        visibility: hidden;
      }

      .share {
        --iron-icon-stroke-color: var(--color-black);
        --iron-icon-fill-color: var(--color-black);
      }
    `;
  }

  render() {
    return html`
      ${this._installButtonVisible === true
        ? html`
            <section id="install-prompt">
              <button @click="${this._install}">
                <svg-icon
                  class="sun"
                  path="assets/image/weather-symbols.svg#weatherSymbol1"
                ></svg-icon>

                <div>
                  ASENNA SOVELLUS
                </div>
                <svg-icon
                  class="sun sun--hidden"
                  path="assets/image/weather-symbols.svg#weatherSymbol1"
                ></svg-icon>
              </button>

              ${this._iosInstructionsVisible === true
                ? html`
              <div class="notification">

              <ol class="text">
                <li>Napauta sivun alalaidasta
                  <svg-icon
                  class="share"
                  path="assets/image/icons.svg#iosShare"
                ></svg-icon>
                </li>
                <li>vieritä alaspäin</li>
                <li>valitse "lisää Koti-valikkoon"</li>
              </ol>
            </div>
            </section>`
                : ''}
            </section>
          `
        : ''}
    `;
  }

  static get properties() {
    return {
      forceShow: { type: Boolean },
      _deferredPrompt: { type: Object },
      _installButtonVisible: { type: Boolean },
      _iosInstructionsVisible: { type: Boolean },
    };
  }

  constructor() {
    super();

    this.forceShow = false;
    this._floating = true;
    this._installButtonVisible = this._showInstallButton();

    window.addEventListener('beforeinstallprompt', event => {
      // prevent install prompt so it can be triggered later
      event.preventDefault();
      this._deferredPrompt = event;
      this._installButtonVisible = true;
    });
  }

  _install() {
    if (this._showIosInstructions() === true) {
      this._iosInstructionsVisible = !this._iosInstructionsVisible;
    } else if (this._deferredPrompt != null) {
      // Show the install prompt.
      this._deferredPrompt.prompt();
      // Log the result
      this._deferredPrompt.userChoice.then(() => {
        // Reset the deferred prompt variable, since
        // prompt() can only be called once.
        this._deferredPrompt = null;

        // Hide the install button.
        this._showInstallButton = false;
      });
    }
  }

  _showInstallButton() {
    // if already installed
    if (navigator.standalone) {
      return false;
    }

    return this.forceShow === true || this._showIosInstructions();
  }

  _showIosInstructions() {
    if (this.forceShow === true) {
      return true;
    }

    return (
      AddToHomescreen._isPortableApple() === true &&
      AddToHomescreen._isSafari() === true
    );
  }

  static _isPortableApple() {
    return ['iPhone', 'iPad', 'iPod'].includes(navigator.platform);
  }

  static _isSafari() {
    const { userAgent } = window.navigator;
    return (
      !/CriOS/.test(userAgent) &&
      !/FxiOS/.test(userAgent) &&
      !/OPiOS/.test(userAgent) &&
      !/mercury/.test(userAgent)
    );
  }
}

window.customElements.define(AddToHomescreen.is, AddToHomescreen);
