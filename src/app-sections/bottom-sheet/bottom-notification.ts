import { css, html, LitElement } from 'lit';

import './install-button';
import '../../common-components/svg-icon';
import { property } from 'lit/decorators.js';

class BottomNotification extends LitElement {
  static get is() {
    return 'bottom-notification';
  }

  @property({ type: Boolean, reflect: true })
  showInstall?: boolean;

  @property({ type: String, reflect: true })
  errorText?: string;

  @property({ type: Boolean, reflect: true })
  ios?: boolean;

  static get styles() {
    return css`
      :host {
        display: block;
      }

      :host([showInstall][ios]) .content {
        position: fixed;
        top: 0;
        bottom: auto;
      }

      .content {
        background: var(--background-topmost);

        border-radius: var(--border-radius);

        box-shadow: var(--box-shadow);

        display: grid;
        grid-template-columns: auto auto;
        max-width: 456px;

        padding: var(--space-l);
        margin: 0 auto var(--space-l) auto;

        position: absolute;
        bottom: calc(45px + var(--safe-area-inset-bottom));
        left: 0px;
        right: 0px;
      }

      section {
        color: var(--color-dark-and-light);
        font-size: var(--font-size-s);
      }

      header {
        margin: 0;
        font-size: var(--font-size-m);
        font-weight: var(--font-weight-bold);
        padding-bottom: var(--space-l);
      }

      .close {
        margin-left: auto;
        padding: 0 0 var(--space-l) var(--space-l);
      }

      .home-icon {
        stroke: var(--color-dark-and-light);
      }

      svg-icon {
        color: var(--color-dark-and-light);
      }

      svg-icon[medium] {
        margin-top: -10px;
      }

      ol {
        line-height: 1.8;
        margin: var(--space-s) var(--space-l) var(--space-s) 0;
        padding: 0 0 0 var(--space-l);
      }

      @media only screen and (min-width: 400px) {
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
                      Lisää sovellus kotivalikkoon tai työpyödälle
                    </header>
                    ${this.ios
                      ? html` <ol>
                          <li>
                            Napauta sivun alalaidasta
                            <svg-icon
                              class="home-icon"
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

  _dispatchEvent(
    name: string,
    payload: { iosInstructions: boolean | undefined }
  ) {
    const event = new CustomEvent(`${BottomNotification.is}.${name}`, {
      detail: payload,
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }
}

window.customElements.define(BottomNotification.is, BottomNotification);

declare global {
  interface CustomEventMap {
    'bottom-notification.closed': CustomEvent<{
      iosInstructions: boolean | undefined;
    }>;
  }
}
