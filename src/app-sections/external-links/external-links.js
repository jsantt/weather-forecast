import { css, html, LitElement } from 'lit';

import '../weather-section/weather-section';
import '../../common-components/svg-icon';

class ExternalLinks extends LitElement {
  static get is() {
    return 'external-links';
  }

  static get styles() {
    return css`
      :host {
        /* to stretch inside grid */
        display: grid;
      }

      nav {
        display: grid;
        grid-template-columns: 3rem auto;
        grid-template-rows: auto;
        grid-row-gap: var(--space-l);
      }

      svg,
      svg-icon {
        fill: var(--color-dark-and-light);
      }

      svg-icon[path*='new-window'] {
        fill: none;
      }

      .link {
        display: grid;
        align-items: center;

        font-size: var(--font-size-s);
        height: 100%;
        width: 100%;
      }

      a:link {
        color: var(--color-dark-and-light);
      }

      a span {
        margin-right: var(--space-s);
      }

      a:visited,
      a:hover {
        color: var(--color-dark-and-light);
      }
    `;
  }

  static get properties() {
    return {
      region: {
        type: String,
      },
    };
  }

  render() {
    return html`
      <weather-section gray padding liftedHeading="Säätietoja muualla">
        <nav>
          <div class="icon-container icon-container--sun">
            <svg-icon medium path="assets/image/icons.svg#uvIndex"></svg-icon>
          </div>

          <div class="link">
            <a href="https://www.ilmatieteenlaitos.fi/uvi-ennuste">
              <span>UV-indeksi</span>
            </a>
          </div>

          <div class="icon-container">
            <svg-icon medium path="assets/image/icons.svg#pollen"></svg-icon>
          </div>

          <div class="link">
            <a href="https://www.norkko.fi/">
              <span>siitepölytiedote</span>
            </a>
          </div>

          <div class="icon-container icon-container-weather">
            <svg-icon
              medium
              path="assets/image/icons.svg#longTimeWeather"
            ></svg-icon>
          </div>

          <div class="link">
            <a href="https://www.ilmatieteenlaitos.fi/revontulet-ja-avaruussaa">
              <span>revontulet</span>
            </a>
          </div>
        </nav>
      </weather-section>
    `;
  }
}
window.customElements.define(ExternalLinks.is, ExternalLinks);
