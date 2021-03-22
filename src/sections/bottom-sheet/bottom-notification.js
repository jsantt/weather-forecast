import { css, html, LitElement } from 'lit-element';

import './install-button.js';
import '../../common-components/svg-icon.js';

class BottomNotification extends LitElement {
  static get is() {
    return 'bottom-notification';
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }

      :host([showInstall]) {
        position: fixed;
        top: 0px;
        background: var(--color-gray-300);
        left: 0px;
        right: 0px;
      }

      .content {
        display: flex;
      }

      section {
        color: var(--color-blue-700);
        font-size: var(--font-size-m);

        padding: var(--space-l) 0 var(--space-l) var(--space-l);
      }

      header {
        margin: 0;
        font-size: var(--font-size-l);
        font-weight: var(--font-weight-bold);
      }

      .close {
        margin-left: auto;
        padding: var(--space-l) var(--space-l) 0 var(--space-l);
      }

      svg-icon {
        fill: var(--color);
        stroke: var(--color);
      }

      ol {
        line-height: 2.1;
        margin: 0 var(--space-l) var(--space-l) 0;
        padding: 0 0 0 var(--space-xl);
      }

      @media only screen and (min-width: 430px) {
        button {
          padding-bottom: 0;
        }
        ol {
          margin-top: var(--space-m);
          margin-bottom: var(--space-m);
        }
      }

      install-button {
        padding: 0 var(--space-l) var(--space-l) var(--space-l);
      }
    `;
  }

  render() {
    return html`
      <smooth-expand
        ?expanded="${this.errorText !== undefined || this.showInstall}"
      >
        <div>
          <div class="content">
            <section aria-live="polite">
              ${this.showInstall === true
                ? html` <header>
                      Nopein tapa tarkistaa Ilmatieteen laitoksen sää! Lisää
                      sovellus kotivalikkoon
                    </header>
                    ${this.ios
                      ? html` <ol>
                          <li>
                            Napauta sivun alalaidasta
                            <svg-icon
                              path="assets/image/icons.svg#iosShare"
                              medium
                            ></svg-icon>
                          </li>
                          <li>vieritä alaspäin</li>
                          <li>
                            valitse "lisää Koti-valikkoon"
                            <svg-icon
                              path="assets/image/icons.svg#add-home"
                              small
                            ></svg-icon>
                          </li>
                        </ol>`
                      : ''}`
                : ''}
              ${this.errorText === undefined
                ? html``
                : html`<div class="error">
                    ${this.errorText}
                  </div>`}
            </section>

            <div
              class="close"
              role="button"
              @click="${() =>
                this._dispatchEvent('closed', {
                  iosInstructions: this.showInstall,
                })}"
            >
              <svg-icon path="assets/image/icons.svg#close" small></svg-icon>
            </div>
          </div>
          ${this.ios ? '' : html` <install-button> Asenna nyt</install-button>`}
        </div>
      </smooth-expand>
    `;
  }

  static get properties() {
    return {
      showInstall: {
        type: Boolean,
        reflect: true,
      },
      errorText: {
        type: String,
        reflect: true,
      },
      ios: {
        type: Boolean,
        reflect: true,
      },
    };
  }

  _dispatchEvent(name, payload) {
    const event = new CustomEvent(`${BottomNotification.is}.${name}`, {
      detail: payload,
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }
}

window.customElements.define(BottomNotification.is, BottomNotification);
