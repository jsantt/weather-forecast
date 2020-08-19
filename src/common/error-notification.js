import { css, html, LitElement } from 'lit-element';

import './svg-icon.js';

class ErrorNotification extends LitElement {
  static get is() {
    return 'error-notification';
  }

  static get styles() {
    return css`
      :host {
        color: var(--color-black);
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 5rem var(--space-l) 7rem var(--space-l);

        height: 100vh;
      }

      iron-icon {
        height: 96px;
        width: 96px;
      }

      div {
        padding: var(--space-m);
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
