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
        color: var(--color-primary);
        font-size: var(--font-size-s);

        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: auto 1fr;
      }

      :host([padding]) {
        .normal-heading {
          padding: var(--space-m) var(--space-l) 0 var(--space-l);
        }

        section {
          padding: var(--padding-panel-textual);
        }
      }

      :host([orange]) {
        .lifted-heading {
          background-color: var(--color-orange-500);
          color: var(--color-primary-static);
        }
      }

      :host([pink]) {
        .lifted-heading {
          background-color: var(--color-pink);
          color: var(--color-primary-static);
        }
      }

      section {
        background-color: var(--background-panel);
        padding: var(--padding-panel);
        border-radius: var(--border-radius);
      }

      .lifted-heading {
        margin-bottom: var(--space-m);
        background-color: var(--background-accent2);
        color: var(--color-secondary);
        display: inline-block;
        padding: 0 var(--space-l) var(--space-s) var(--space-l);
        font-size: var(--font-size-s);
        border-radius: var(--border-radius);
      }

      h2 {
        color: var(--color-primary);
        font-size: var(--font-size-m);
        margin: 0;
        padding: 0;

        font-weight: var(--font-weight-boldest);
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
