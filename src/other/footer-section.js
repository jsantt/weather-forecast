import { css, html, LitElement } from 'lit-element';

class FooterSection extends LitElement {
  static get is() {
    return 'footer-section';
  }

  static get styles() {
    return css`
      :host {
        border-radius: 0.15rem;
        color: var(--color-blue-800);

        display: flex;
        flex-direction: column;

        padding: var(--space-m) 0;
      }

      h3 {
        color: var(--color-blue-700);
        font-size: var(--font-size-m);
        font-weight: var(--font-weight-bold);

        margin: 0;
        padding: var(--space-m) var(--space-l) var(--space-m) var(--space-l);
        text-transform: uppercase;
        font-weight: var(--font-weight-boldest);
      }

      section {
        background-color: var(--background-color-main);
        padding: var(--space-m) var(--space-l);
      }

      footer {
        display: flex;
        margin-top: auto;
        justify-content: space-between;
        padding: var(--space-m) var(--space-l);
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

window.customElements.define(FooterSection.is, FooterSection);
