import { css, html, LitElement } from 'lit';

class WeatherSection extends LitElement {
  static get is() {
    return 'weather-section';
  }

  static get styles() {
    return css`
      :host {
        color: var(--color-primary);
        font-size: var(--font-size-s);
        display: flex;
        flex-direction: column;
        height: 100%;
      }

      h3 {
        color: var(--color-primary);
        font-size: var(--font-size-m);

        margin: 0;
        padding: var(--space-l) var(--space-l) 0 var(--space-l);

        font-weight: var(--font-weight-boldest);
      }

      section {
        padding: var(--padding, var(--space-l));
      }

      footer {
        display: flex;
        margin-top: auto;
        justify-content: space-between;
        padding: var(--space-l);
      }
    `;
  }

  render() {
    return html`
      ${this.header === undefined ? '' : html`<h3>${this.header}</h3>`}
      <section>
        <slot></slot>
      </section>
      <footer>
        <slot class="left" name="footer-left"></slot>
        <slot class="right" name="footer-right"></slot>
      </footer>
    `;
  }

  static get properties() {
    return {
      header: {
        type: String,
      },
      footer: {
        type: String,
      },
    };
  }
}

window.customElements.define(WeatherSection.is, WeatherSection);
