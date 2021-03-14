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
        font-size: var(--font-size-m);
        font-weight: var(--font-weight-boldest);
        padding: var(--space-l) var(--space-l) var(--space-l) var(--space-l);

        border-top-left-radius: 0.75rem;
        border-top-right-radius: 0.75rem;
      }

      .close {
        margin-left: auto;
        padding-top: var(--space-m);
        padding-right: var(--space-l);
      }

      svg-icon {
        fill: var(--color);
        stroke: var(--color);
      }

      ol {
        line-height: 1.7;
        margin: -0.5rem var(--space-l) var(--space-l) var(--space-l);
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
              ? html` <ol>
                  <li>
                    Napauta sivun alalaidasta
                    <svg-icon
                      path="assets/image/icons.svg#iosShare"
                      medium
                    ></svg-icon>
                  </li>
                  <li>vieritä alaspäin</li>
                  <li>valitse "lisää Koti-valikkoon"</li>
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
