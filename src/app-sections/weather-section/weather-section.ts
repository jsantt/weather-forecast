import { css, html, LitElement } from 'lit';
import { property } from 'lit/decorators.js';

class WeatherSection extends LitElement {
  static get is() {
    return 'weather-section';
  }

  @property({ type: Boolean, reflect: true })
  padding: boolean = false;

  @property({ type: String, reflect: true })
  heading?: string;

  @property({ type: String, reflect: true })
  liftedHeading?: string;

  @property({ type: Boolean, reflect: true })
  orange?: boolean;

  @property({ type: String })
  footer?: string;

  static get styles() {
    return css`
      :host {
        display: inline-block;
        color: var(--color-dark-and-light);
        font-size: var(--font-size-s);

        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: auto 1fr;
      }

      :host([padding]) .normal-heading {
        padding: var(--space-m) var(--space-l) 0 var(--space-l);
      }

      :host([padding]) section {
        padding: var(--margin);
      }

      :host([gray]) .lifted-heading {
        background-color: var(--color-gray);
        color: var(--color-dark);
      }

      :host([pink]) .lifted-heading {
        background-color: var(--color-pink);
        color: var(--color-dark);
      }

      :host([yellow]) .lifted-heading {
        background-color: var(--color-yellow);
        color: var(--color-dark);
      }

      :host([green]) .lifted-heading {
        background-color: var(--color-green);
        color: var(--color-dark);
      }

      section {
        background-color: var(--background-middle);
        border-radius: var(--border-radius);
      }

      :host([transparent]) section {
        background-color: transparent;
      }

      .lifted-heading {
        margin-bottom: 0;
        background-color: var(--color-blue);
        color: var(--color-light);

        display: inline-block;
        padding: 0.16rem var(--space-l) var(--space-s) var(--space-l);
        font-size: var(--font-size-s);
        font-weight: var(--font-weight-bold);
        border-radius: var(--border-radius);

        margin-bottom: var(--space-m);
      }

      h2 {
        color: var(--color-dark-and-light);
        font-size: var(--font-size-m);
        margin: 0;
        padding: 0;
      }

      footer {
        display: flex;
        margin-top: auto;
        justify-content: space-between;
        padding: var(--space-l);
      }

      footer:has(slot:empty + slot:empty) {
        display: none;
      }
    `;
  }

  render() {
    return html`
      ${this.liftedHeading === undefined
        ? ''
        : html`<header>
            <h2 class="lifted-heading">${this.liftedHeading}</h2>
          </header>`}
      ${this.heading === undefined
        ? ''
        : html`<h2 class="normal-heading">${this.heading}</h2>`}

      <section>
        <slot></slot>
      </section>
    `;
  }
}

window.customElements.define(WeatherSection.is, WeatherSection);
