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
        padding: 1.5rem var(--margin) calc(var(--space-xl) + var(--margin))
          var(--margin);
        color: var(--color-dark-and-light);

        display: grid;
        align-items: center;
        grid-template-columns: auto 1fr;
        grid-template-rows: 1fr;
        grid-template-areas: 'icon heading';

        gap: var(--space-m);
      }

      .icon {
        grid-area: icon;
        background: var(--color-yellow);
        border-radius: 12px;
        padding: var(--space-m);
        width: 28px;
        height: 28px;
      }

      .heading {
        grid-area: heading;
      }

      h1 {
        font-family: var(--font-family-heading);
        text-align: left;
        font-size: var(--font-size-l);
        line-height: 1;
        margin: 0;
        padding: 0;

        span {
          font-weight: 400;
        }
      }

      h2 {
        font-weight: 400;
        font-size: var(--font-size-s);
        line-height: 1;
        margin: 0;
        padding: 0;
      }

      @media only screen and (min-width: 600px) {
        header {
          padding-top: var(--space-xl);
        }
        .icon {
          width: 44px;
          height: 44px;
        }
        h1 {
          font-size: var(--font-size-xl);
        }
        h2 {
          font-size: var(--font-size-m);
        }
      }
    `;
  }

  render() {
    return html`<header>
      <svg
        class="icon"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 695 503"
      >
        <path
          stroke-width="55"
          stroke="#174072"
          fill="#ededee"
          d="m 667.5,331.5 c 0,79.5
        -64.5,144 -144,144 h -368 c -70.7,0 -128,-57.3 -128,-128 0,-61.9
        44,-113.6 102.4,-125.4 -4.1,-10.7 -6.4,-22.4 -6.4,-34.6 0,-53 43,-96
        96,-96 19.7,0 38.1,6 53.3,16.2 27.7,-48 79.4,-80.2 138.7,-80.2 88.4,0
        160,71.6 160,160 0,2.7 -0.1,5.4 -0.2,8.1 56,19.7 96.2,73.1 96.2,135.9 z"
        />
      </svg>
      <div class="heading">
        <h1>Saaennuste<span>.fi</span></h1>
        <h2>Nopein tapa tarkastaa Ilmatieteen laitoksen sää</h2>
      </div>
    </header> `;
  }
}

export { TopBar };
