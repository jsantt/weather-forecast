import { css, html, LitElement } from 'lit';

import '../weather-section';
import '../common-components/svg-icon';

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
        grid-template-columns: auto 4rem;
        grid-template-rows: auto;
      }

      .icon-container {
        background: var(--color-green);
        padding: var(--space-l);
        margin: auto;
      }

      svg,
      svg-icon {
        fill: var(--color-blue);
      }

      svg-icon[path*='new-window'] {
        fill: none;
      }

      .link {
        display: grid;
        align-items: center;

        font-size: var(--font-size-m);
        height: 100%;
        width: 100%;
        padding: 0 var(--space-l);
      }

      a:link {
        color: var(--color-dark-and-light);

        text-decoration: none;
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
      <weather-section gray liftedHeading="Säätietoja muualla">
        <nav>
          <div class="link">
            <a href="https://www.ilmatieteenlaitos.fi/uvi-ennuste">
              <span>UV-indeksi</span>

              <svg-icon
                x-small
                path="assets/image/icons.svg#new-window"
              ></svg-icon>
            </a>
          </div>

          <div class="icon-container icon-container--sun">
            <svg-icon medium path="assets/image/icons.svg#uvIndex"></svg-icon>
          </div>

          <div class="link">
            <a href="https://www.norkko.fi/">
              <span>siitepölytiedote</span>
            </a>
          </div>

          <div class="icon-container">
            <svg-icon medium path="assets/image/icons.svg#pollen"></svg-icon>
          </div>

          <div class="link">
            <a
              href="${this.region &&
              this.region !== 'Finland' &&
              this.region.split(' ').length <= 1
                ? `https://www.ilmatieteenlaitos.fi/saa/${this.region}/`
                : 'https://www.ilmatieteenlaitos.fi/paikallissaa'}"
            >
              <span>10&nbsp;vrk&nbsp;sää</span>
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

          <div class="icon-container icon-container-weather">
            <svg-icon
              medium
              path="assets/image/icons.svg#longTimeWeather"
            ></svg-icon>
          </div>
        </nav>
      </weather-section>
    `;
  }
}
window.customElements.define(ExternalLinks.is, ExternalLinks);
