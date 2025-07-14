import { css, html, LitElement } from 'lit';

import '../../common-components/svg-icon';
import '../weather-section/weather-section';

class ShareApp extends LitElement {
  static get is() {
    return 'share-app';
  }

  static get styles() {
    return css`
      :host {
        display: grid;
        justify-content: center;
      }

      button {
        background: transparent;
        border: 2px solid var(--color-dark-and-light);

        border-radius: 1.5rem;

        color: var(--color-dark-and-light);

        font-family: inherit;
        font-optical-sizing: inherit;
        font-style: inherit;
        font-variation-settings: inherit;
        font-size: var(--font-size-s);
        font-weight: var(--font-weight-bold);

        padding: var(--space-m);
        margin-bottom: var(--space-l);

        text-align: center;
        width: 100%;
      }

      button:focus {
        outline: none;
      }

      button:focus-visible {
        outline: 2px solid var(--color-orange);
      }

      .qr {
        fill: var(--color-dark-and-light);
        color: var(--background-middle);
        width: 200px;
      }

      .share {
        fill: var(--color-light-and-dark);
      }
    `;
  }

  render() {
    return html`
      <div>
        <div class="qr">
          <svg id="qr" viewBox="0 0 370 370">
            <path
              style="fill:currentColor; stroke:none;"
              d="M0 0L0 370L370 370L370 0L0 0z"
            />
            <path
              style="stroke:none;"
              d="M40 40L40 110L110 110L110 40L40 40M160 40L160 50L150 50L150 60L140 60L140 50L120 50L120 60L140 60L140 80L150 80L150 90L140 90L140 110L130 110L130 90L120 90L120 120L80 120L80 130L90 130L90 140L70 140L70 130L60 130L60 140L70 140L70 150L50 150L50 160L40 160L40 170L50 170L50 160L60 160L60 180L40 180L40 220L50 220L50 210L60 210L60 220L70 220L70 230L80 230L80 220L100 220L100 230L90 230L90 240L70 240L70 250L90 250L90 240L100 240L100 250L110 250L110 240L100 240L100 230L110 230L110 220L120 220L120 230L140 230L140 220L120 220L120 210L110 210L110 200L120 200L120 190L110 190L110 180L100 180L100 170L110 170L110 160L120 160L120 170L130 170L130 150L120 150L120 140L130 140L130 130L150 130L150 140L140 140L140 160L150 160L150 170L140 170L140 180L150 180L150 190L140 190L140 200L150 200L150 190L160 190L160 170L190 170L190 190L200 190L200 210L180 210L180 200L170 200L170 210L150 210L150 230L170 230L170 220L180 220L180 230L190 230L190 240L200 240L200 250L210 250L210 240L200 240L200 230L230 230L230 220L240 220L240 230L250 230L250 210L260 210L260 220L270 220L270 230L280 230L280 220L290 220L290 240L240 240L240 260L230 260L230 240L220 240L220 260L200 260L200 290L210 290L210 300L180 300L180 310L210 310L210 300L220 300L220 310L240 310L240 330L250 330L250 310L260 310L260 330L270 330L270 320L280 320L280 330L290 330L290 320L300 320L300 310L310 310L310 330L320 330L320 320L330 320L330 300L320 300L320 280L330 280L330 250L320 250L320 240L330 240L330 200L320 200L320 190L330 190L330 130L320 130L320 120L310 120L310 140L300 140L300 150L290 150L290 160L300 160L300 150L310 150L310 160L320 160L320 190L310 190L310 210L300 210L300 220L290 220L290 210L260 210L260 190L250 190L250 180L240 180L240 190L230 190L230 180L210 180L210 190L200 190L200 170L230 170L230 160L240 160L240 170L250 170L250 160L260 160L260 140L270 140L270 130L280 130L280 140L290 140L290 130L280 130L280 120L260 120L260 140L250 140L250 150L240 150L240 130L250 130L250 120L230 120L230 130L220 130L220 140L210 140L210 160L200 160L200 170L190 170L190 160L180 160L180 150L200 150L200 140L170 140L170 130L180 130L180 120L190 120L190 130L200 130L200 120L190 120L190 100L180 100L180 120L170 120L170 130L160 130L160 110L170 110L170 90L160 90L160 80L170 80L170 70L180 70L180 80L190 80L190 90L200 90L200 80L210 80L210 100L200 100L200 110L210 110L210 100L220 100L220 110L230 110L230 100L240 100L240 110L250 110L250 100L240 100L240 90L230 90L230 60L240 60L240 50L250 50L250 40L230 40L230 50L220 50L220 60L210 60L210 70L200 70L200 60L190 60L190 50L210 50L210 40L190 40L190 50L180 50L180 40L160 40M260 40L260 110L330 110L330 40L260 40z"
            />
            <path
              style="fill:currentColor; stroke:none;"
              d="M50 50L50 100L100 100L100 50L50 50M270 50L270 100L320 100L320 50L270 50z"
            />
            <path style="stroke:none;" d="M60 60L60 90L90 90L90 60L60 60z" />
            <path
              style="fill:currentColor; stroke:none;"
              d="M180 60L180 70L190 70L190 60L180 60z"
            />
            <path
              style="stroke:none;"
              d="M280 60L280 90L310 90L310 60L280 60z"
            />
            <path
              style="fill:currentColor; stroke:none;"
              d="M150 70L150 80L160 80L160 70L150 70M210 70L210 80L220 80L220 70L210 70M150 90L150 110L160 110L160 90L150 90M220 90L220 100L230 100L230 90L220 90M120 120L120 130L100 130L100 140L120 140L120 130L130 130L130 120L120 120z"
            />
            <path
              style="stroke:none;"
              d="M40 130L40 140L50 140L50 130L40 130z"
            />
            <path
              style="fill:currentColor; stroke:none;"
              d="M150 140L150 160L170 160L170 140L150 140M220 140L220 150L230 150L230 140L220 140M310 140L310 150L320 150L320 140L310 140M70 150L70 160L80 160L80 150L70 150M90 150L90 160L110 160L110 150L90 150z"
            />
            <path
              style="stroke:none;"
              d="M270 160L270 170L260 170L260 180L270 180L270 170L280 170L280 190L270 190L270 200L280 200L280 190L290 190L290 200L300 200L300 190L290 190L290 170L280 170L280 160L270 160z"
            />
            <path
              style="fill:currentColor; stroke:none;"
              d="M80 170L80 180L90 180L90 210L100 210L100 220L110 220L110 210L100 210L100 200L110 200L110 190L100 190L100 180L90 180L90 170L80 170z"
            />
            <path
              style="stroke:none;"
              d="M300 170L300 180L310 180L310 170L300 170z"
            />
            <path
              style="fill:currentColor; stroke:none;"
              d="M60 180L60 210L70 210L70 220L80 220L80 210L70 210L70 180L60 180M220 190L220 200L210 200L210 220L220 220L220 210L230 210L230 190L220 190M240 190L240 200L250 200L250 190L240 190M310 210L310 220L300 220L300 240L290 240L290 270L300 270L300 280L290 280L290 290L280 290L280 300L270 300L270 290L220 290L220 300L260 300L260 310L280 310L280 320L290 320L290 290L310 290L310 280L320 280L320 250L310 250L310 240L320 240L320 210L310 210z"
            />
            <path
              style="stroke:none;"
              d="M40 240L40 250L60 250L60 240L40 240M120 240L120 290L130 290L130 280L140 280L140 300L130 300L130 310L160 310L160 330L210 330L210 320L170 320L170 290L160 290L160 300L150 300L150 280L140 280L140 270L180 270L180 260L190 260L190 250L180 250L180 240L160 240L160 250L130 250L130 240L120 240z"
            />
            <path
              style="fill:currentColor; stroke:none;"
              d="M160 250L160 260L170 260L170 250L160 250M250 250L250 280L280 280L280 250L250 250z"
            />
            <path
              style="stroke:none;"
              d="M300 250L300 260L310 260L310 250L300 250M40 260L40 330L110 330L110 260L40 260M260 260L260 270L270 270L270 260L260 260z"
            />
            <path
              style="fill:currentColor; stroke:none;"
              d="M50 270L50 320L100 320L100 270L50 270M210 270L210 280L230 280L230 270L210 270z"
            />
            <path
              style="stroke:none;"
              d="M60 280L60 310L90 310L90 280L60 280M180 280L180 290L190 290L190 280L180 280M220 320L220 330L230 330L230 320L220 320z"
            />
          </svg>
        </div>

        ${ShareApp._show() === true
          ? html` <button @click="${ShareApp._share}">Jaa</button> `
          : ''}
      </div>
    `;
  }

  static _show() {
    return true; // navigator.share;
  }

  static _share() {
    if (navigator.share) {
      navigator.share({
        title: 'Uusi sääsovellus',
        text: 'Hei, ajattelin että saattaisit tykätä tästä sovelluksesta, joka näyttää Ilmatieteen laitoksen sään.',
        url: 'https://sääennuste.fi',
      });
    }
  }
}

window.customElements.define(ShareApp.is, ShareApp);
