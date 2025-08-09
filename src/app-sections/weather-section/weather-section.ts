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
  settings?: boolean;

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

      header {
        display: flex;
        justify-content: space-between;
      }

      svg-icon {
        align-self: center;
        padding-right: calc(var(--margin) - 8px);
        color: var(--color-secondary-dark-and-light);
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
            ${this.settings
              ? html`<svg-icon
                  path="assets/image/icons.svg#settings3"
                  small
                  @click=${this.settingsClicked}
                ></svg-icon>`
              : null}
          </header>`}
      <section>
        <slot></slot>
      </section>
    `;
  }

  private settingsClicked() {
    this.dispatchEvent(
      new Event('weather-section.settings-clicked', {
        bubbles: true,
        composed: true,
      })
    );
  }
}

window.customElements.define(WeatherSection.is, WeatherSection);
