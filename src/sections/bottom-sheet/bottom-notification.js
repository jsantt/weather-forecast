import { css, html, LitElement } from 'lit-element';

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

      .content {
        display: flex;
      }

      section {
        color: var(--color-blue-700);
        font-size: var(--font-size-s);

        padding: var(--space-l) 0 var(--space-l) var(--space-l);
      }

      header {
        margin-bottom: var(--space-l);
        font-size: var(--font-size-m);
        font-weight: var(--font-weight-boldest);
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
    `;
  }

  render() {
    return html`
      <smooth-expand
        ?expanded="${this.errorText !== undefined || this.showInstall}"
      >
        <div class="content">
          <section aria-live="polite">
            ${this.showInstall === true
              ? html` <header>
                    Nopein tapa tarkistaa sää! Lisää sovellus kotivalikkoon
                  </header>
                  <ol>
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
            @click="${() => this._dispatchEvent('closed')}"
          >
            <svg-icon path="assets/image/icons.svg#caret-down" small></svg-icon>
          </div>
        </div>
      </smooth-expand>
    `;
  }

  static get properties() {
    return {
      showInstall: {
        type: Boolean,
      },
      errorText: {
        type: String,
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
