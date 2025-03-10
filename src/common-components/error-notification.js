import { css, html, LitElement } from 'lit';

import './svg-icon.js';

class ErrorNotification extends LitElement {
  static get is() {
    return 'error-notification';
  }

  static get styles() {
    return css`
      :host {
        color: var(--color-light);
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;

        min-height: 45rem;
      }

      section {
        margin: var(--space-xl) 0;
      }

      a {
        color: var(--color-light);
      }

      img {
        height: 124px;
        width: 124px;
      }
    `;
  }

  render() {
    return html`
      <section>
        <img
          src="assets/image/smart/light/77.svg"
          alt="Kuva ukkospilvestä ja salamasta"
        ></img>

        <div>
          ${this.errorText}${
      navigator.onLine === false
        ? html` Verkkoyhteydessäsi näyttää olevan ongelmia.`
        : ''
    }
        </div>
        <div><a href="">Kokeile uudelleen.</a></div>
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
