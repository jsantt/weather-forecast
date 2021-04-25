import { css, html, LitElement } from 'lit-element';

import '../weather-section.js';
import '../common-components/svg-icon.js';

class ExternalLinks extends LitElement {
  static get is() {
    return 'external-links';
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }
      nav {
        display: grid;
        grid-template-columns: auto 2.75rem;
        grid-template-rows: auto;
        grid-gap: var(--space-l);
      }

      .icon-container {
        background: var(--color-blue-300);
        border-top-right-radius: var(--border-radius);
        border-bottom-right-radius: var(--border-radius);
        padding: var(--space-l) var(--space-m);
        margin: auto;
      }

      svg,
      svg-icon {
        fill: var(--color-blue-700);
      }

      svg-icon[path*='new-window'] {
        fill: var(--color-blue-500);
      }

      .link {
        background: var(--color-white-transparent);
        display: grid;
        align-items: center;
        height: 100%;
        width: 100%;
        padding: 0 var(--space-l);
      }

      a:link {
        color: var(--color-blue-500);
        font-weight: var(--font-weight-bold);
        text-decoration: none;
      }

      a span {
        margin-right: var(--space-s);
      }

      a:visited,
      a:hover {
        color: var(--color-blue-700);
      }
    `;
  }

  render() {
    return html`
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
            <span>Siitepölytiedote</span>
            <svg-icon
              x-small
              path="assets/image/icons.svg#new-window"
            ></svg-icon>
          </a>
        </div>

        <div class="icon-container">
          <svg-icon medium path="assets/image/icons.svg#pollen"></svg-icon>
        </div>

        <div class="link">
          <a href="https://www.ilmatieteenlaitos.fi/paikallissaa">
            <span>10&nbsp;vrk&nbsp;sää</span>
            <svg-icon
              x-small
              path="assets/image/icons.svg#new-window"
            ></svg-icon>
          </a>
        </div>

        <div class="icon-container icon-container-weather">
          <svg-icon
            medium
            path="assets/image/icons.svg#longTimeWeather"
          ></svg-icon>
        </div>
      </nav>
    `;
  }
}
window.customElements.define(ExternalLinks.is, ExternalLinks);
