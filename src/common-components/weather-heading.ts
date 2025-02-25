import { css, html, LitElement } from 'lit';
import { property } from 'lit/decorators.js';

class WeatherHeading extends LitElement {
  static get is() {
    return 'weather-heading';
  }

  @property({ reflect: true, type: String })
  type: 'h1' | 'h2' = 'h1';

  static get styles() {
    return css`
      :host {
        display: block;
      }

      h1,
      h2 {
        font-family: 'Open sans', serif;
        font-weight: 700;
        font-style: normal;

        padding: 0;
        margin: 0;
      }

      h1 {
        font-size: var(--font-size-xl);
      }

      h2 {
        font-size: var(--font-size-m);
      }
    `;
  }

  render() {
    if (this.type === 'h2') {
      return html`<h2><slot></slot></h2>`;
    } else {
      return html`<h1><slot></slot></h1>`;
    }
  }
}

window.customElements.define(WeatherHeading.is, WeatherHeading);
