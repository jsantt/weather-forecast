import { css, html, LitElement } from 'lit-element';

import '../common/svg-icon.js';

class InstallApp extends LitElement {
  static get is() {
    return 'install-app';
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }

      button {
        box-sizing: border-box;
        background-color: transparent;
        border-style: none;
        color: var(--color-blue-800);

        display: flex;
        align-items: center;

        font: inherit;
        font-weight: var(--font-weight-boldest);

        padding: 0 var(--space-l) 1.5rem var(--space-l);
        text-align: center;
        text-transform: uppercase;
        outline: none;

        width: 100%;

        /* Corrects inability to style clickable input types in iOS */
        -webkit-appearance: none;
      }

      @media only screen and (min-width: 48rem) {
        button {
          margin-bottom: 0;
        }
      }

      .notification {
        color: var(--color-blue-800);
        margin-top: -1.25rem;
        padding: 0 var(--space-l) 1.5rem var(--space-l);
      }

      ol {
        line-height: 1.7;
        margin: 0 0 0 2rem;
        padding: 0;
      }

      .install {
        padding: 0 var(--space-m) 0 0;
      }

      .share,
      .install {
        fill: var(--color-blue-700);
        stroke: var(--color-blue-700);
        width: 24px;
        height: 24px;
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
                  class="install"
                  path="assets/image/icons.svg#install"
                ></svg-icon>
                <div>
                  ASENNA SOVELLUS
                </div>
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
      InstallApp._isPortableApple() === true && InstallApp._isSafari() === true
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

window.customElements.define(InstallApp.is, InstallApp);
