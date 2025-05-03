import { css, html, LitElement } from 'lit';

class WeatherParagraph extends LitElement {
  static get is() {
    return 'weather-paragraph';
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }

      h2 {
        font-family: 'Open Sans', serif;
        font-optical-sizing: auto;
        font-weight: 300;
        font-style: normal;
        font-variation-settings: 'wdth' 75;

        font-size: var(--font-size-s);

        margin: 0;
        padding: 0;
      }
    `;
  }

  render() {
    return html`<h2><slot></slot></h2>`;
  }
}

window.customElements.define(WeatherParagraph.is, WeatherParagraph);
