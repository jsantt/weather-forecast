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

      :host([showInstall][ios]) .content {
        position: fixed;
        top: 0;
        bottom: auto;
        border-radius: 0;
      }

      .content {
        background: var(--color-white);
        border: 1px solid var(--color-gray-300);

        border-radius: 0.75rem;
        border-top-right-radius: 0.75rem;

        display: grid;
        grid-template-columns: auto auto;
        max-width: 456px;
        margin: 0 auto var(--space-l) auto;

        position: absolute;
        bottom: 45px;
        left: 0px;
        right: 0px;
        box-shadow: var(--box-shadow);
      }

      section {
        color: var(--color-primary);
        font-size: var(--font-size-m);
        font-weight: var(--font-weight-bold);

        padding: var(--space-l) 0 var(--space-l) var(--space-l);
      }

      header {
        margin: 0;
        font-size: var(--font-size-m);
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
        font-weight: var(--font-weight-normal);
        line-height: 1.8;
        margin: var(--space-s) var(--space-l) var(--space-s) 0;
        padding: 0 0 0 var(--space-l);
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
        grid-column: span 2;
        padding: 0 var(--space-l) var(--space-l) var(--space-l);
      }
    `;
  }

  render() {
    return html`
      ${this.errorText !== undefined || this.showInstall
        ? html`<div class="content">
            <section aria-live="polite">
              ${this.showInstall === true
                ? html` <header>
                      Voit lisätä sovelluksen kotivalikkoon tai työpyödälle
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
                : html`<div class="error">${this.errorText}</div>`}
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

            ${!this.ios && this.showInstall
              ? html` <install-button> Lisää nyt</install-button>`
              : ''}
          </div>`
        : ''}
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
