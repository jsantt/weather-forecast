import { css, html, LitElement } from 'lit-element';

import './svg-icon.js';

class ErrorNotification extends LitElement {
  static get is() {
    return 'error-notification';
  }

  static get styles() {
    return css`
      :host {
        color: var(--color, var(--color-primary));
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      section {
        margin: var(--space-xl) 0;
      }

      a {
        color: var(--color, var(--color-primary));
      }

      svg-icon {
        height: 124px;
        width: 124px;
      }
    `;
  }

  render() {
    return html`
      <section>
        <svg-icon
          path="assets/image/weather-symbols.svg#weatherSymbol64"
        ></svg-icon>

        <div>
          ${this.errorText}${navigator.onLine === false
            ? html`, verkkoyhteydessäsi näyttää olevan ongelmia`
            : ''}
        </div>
        <div><a href="">kokeile uudelleen</a></div>
      </section>
    `;
  }

  static get properties() {
    return {
      errorText: {
        type: String,
      },
    };
  }
}

window.customElements.define(ErrorNotification.is, ErrorNotification);
