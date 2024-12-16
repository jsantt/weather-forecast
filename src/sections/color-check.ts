import { css, html, LitElement } from 'lit';

import '../weather-section';
import '../common-components/svg-icon';

class ColorCheck extends LitElement {
  static get is() {
    return 'color-check';
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }
      .background,
      .background-middle,
      .background-topmost {
        margin: 1rem;
        padding: 1rem;
      }

      .background {
        background: var(--background);
      }
      .background-middle {
        background: var(--background-middle);
      }
      .background-topmost {
        background: var(--background-topmost);
      }

      .color-dark {
        color: var(--color-dark);
      }

      .color-light {
        color: var(--color-light);
      }

      .color-dark-and-light {
        color: var(--color-dark-and-light);
      }

      .background-yellow {
        background: var(--color-yellow);
      }
      .background-pink {
        background: var(--color-pink);
      }
      .background-gray {
        background: var(--color-gray);
      }

      .background-green {
        background: var(--color-green);
      }

      .background-blue {
        background: var(--color-blue);
      }

      div {
        padding: 0.25rem;
      }
    `;
  }

  render() {
    return html`
      <section class="background">
        <div class="color-dark-and-light">dark and light</div>
        <div class="background-yellow">
          <div class="color-dark">dark</div>
        </div>
        <div class="background-pink">
          <div class="color-dark">dark</div>
        </div>
        <div class="background-gray">
          <div class="color-dark">dark</div>
        </div>
        <div class="background-green">
          <div class="color-dark">dark</div>
        </div>
        <div class="background-blue">
          <div class="color-light">light</div>
        </div>
      </section>
      <section class="background-middle">
        <div class="color-dark-and-light">dark and light</div>
        <div class="background-yellow">
          <div class="color-dark">dark</div>
        </div>
        <div class="background-pink">
          <div class="color-dark">dark</div>
        </div>
        <div class="background-gray">
          <div class="color-dark">primary</div>
        </div>
        <div class="background-green">
          <div class="color-dark">dark</div>
        </div>
        <div class="background-blue">
          <div class="color-light">light</div>
        </div>
      </section>
      <section class="background-topmost">
        <div class="color-dark-and-light">dark and light</div>
        <div class="background-yellow">
          <div class="color-dark">dark</div>
        </div>
        <div class="background-pink">
          <div class="color-dark">dark</div>
        </div>
        <div class="background-gray">
          <div class="color-dark">dark</div>
        </div>
        <div class="background-green">
          <div class="color-dark">dark</div>
        </div>
        <div class="background-blue">
          <div class="color-light">light</div>
        </div>
      </section>
    `;
  }
}

window.customElements.define(ColorCheck.is, ColorCheck);
