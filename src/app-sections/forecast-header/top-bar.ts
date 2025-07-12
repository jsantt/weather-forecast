import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

import '../../common-components/svg-icon.js';
import '../../common-components/weather-heading.ts';
import '../../common-components/weather-paragraph.ts';

@customElement('top-bar')
class TopBar extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
        padding: 0 var(--margin-header) var(--space-l) var(--margin-header);
      }

      header {
        color: var(--color-dark-and-light);

        display: grid;
        align-items: center;
        grid-template-columns: auto 1fr auto;
        grid-template-rows: 1fr;
        grid-template-areas:
          'icon heading language'
          'icon slogan language';

        column-gap: var(--space-m);
      }

      .logo {
        grid-area: icon;
        /* background-image: linear-gradient(60deg, var(--color-green) 0%, var(--color-yellow) 100%);
        */
        background: var(--color-yellow);
        border-radius: 12px;
        padding: var(--space-s);
        width: 32px;
        height: 32px;
      }

      .language {
        grid-area: language;
        align-self: self-start;

        font-size: var(--font-size-s);
        fill: var(--color-dark-and-light);
        text-align: right;
      }

      .heading {
        grid-area: heading;
        line-height: 1;
      }

      .slogan {
        grid-area: slogan;
        margin-top: -0.3rem;
      }

      @media only screen and (min-width: 800px) {
        .icon {
          width: 44px;
          height: 44px;
        }
      }
    `;
  }

  render() {
    return html`<header>
      <svg
        class="logo"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 695 503"
        alt="sääennuste logo"
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

      <weather-heading class="heading">Sääennuste.fi</weather-heading>
      <weather-paragraph class="slogan">
        Nopein tapa tarkastaa sää
      </weather-paragraph>

      <!--div class="language">
        <svg-icon small path="assets/image/icons.svg#caret-down"></svg-icon>
        English
      </div-->
    </header> `;
  }
}

export { TopBar };
