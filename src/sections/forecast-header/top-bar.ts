import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('top-bar')
class TopBar extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
      }

      header {
        padding: var(--padding-header);
        color: var(--color-dark-and-light);

        font-size: var(--font-size-s);
        display: grid;
        align-items: center;
        grid-template-columns: 1fr;
        grid-template-rows: 2fr 1fr;
        grid-template-areas:
          'h1 h1'
          'h2 h2';
      }

      h1 {
        font-family: var(--font-family-heading);
        text-align: left;
        grid-area: h1;
        font-size: var(--font-size-m);
        line-height: 1;
        margin: 0;
        padding: 0;

        span {
          font-weight: 400;
        }
      }

      h2 {
        font-weight: 400;
        grid-area: h2;
        font-size: var(--font-size-s);
        line-height: 1;
        margin: 0;
        padding: 0;
      }
    `;
  }

  render() {
    return html`<header>
      <h1>Sääennuste<span>.fi</span></h1>
      <h2>Ilmatieteen laitoksen sää yhdellä vilkaisulla</h2>
    </header> `;
  }
}

export { TopBar };
