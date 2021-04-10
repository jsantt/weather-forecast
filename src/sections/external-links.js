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
      div + div {
        margin-top: var(--space-m);
      }

      svg,
      svg-icon {
        fill: var(--color-blue-700);
      }

      a:link {
        color: var(--color-blue-500);
      }

      a:visited,
      a:hover {
        color: var(--color-blue-700);
      }
    `;
  }

  render() {
    return html`
      <weather-section header="Katso myös">
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            enable-background="new 0 0 24 24"
            height="20"
            viewBox="0 0 24 24"
            width="20"
          >
            <g>
              <rect fill="none" height="20" width="20" />
              <path
                d="M13.28,8.5l0.76,0.58l0.92-0.23L13,14.8V8.29L13.28,8.5z M9.03,8.86L11,14.8V8.29L10.72,8.5L9.96,9.09 L9.03,8.86z"
                opacity=".3"
              />
              <path
                d="M14.5,6.92L13,5.77V3.88V3.4c0-0.26,0.22-0.48,0.5-0.48c0.28,0,0.5,0.21,0.5,0.48V4h2V3.4C16,2.07,14.88,1,13.5,1 C12.12,1,11,2.07,11,3.4v0.48v1.89L9.5,6.92L6,6.07l5.05,15.25C11.2,21.77,11.6,22,12,22s0.8-0.23,0.95-0.69L18,6.07L14.5,6.92z M13.28,8.5l0.76,0.58l0.92-0.23L13,14.8V8.29L13.28,8.5z M9.96,9.09l0.76-0.58L11,8.29v6.51L9.03,8.86L9.96,9.09z"
              />
            </g>
          </svg>
          <a href="https://www.sataako.fi"> sadetutka </a>
        </div>

        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="20"
            viewBox="0 0 24 24"
            width="20"
          >
            <path d="M0 0h24v24H0V0z" fill="none" />
            <path d="M17 10h-4l3-8H7v11h3v9z" />
          </svg>
          <a href="https://map.blitzortung.org/?y#8/60.469/24.786"
            >ukkostutka</a
          >
        </div>

        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            enable-background="new 0 0 24 24"
            height="20"
            viewBox="0 0 24 24"
            width="20"
          >
            <g><rect fill="none" height="20" width="20" /></g>
            <g>
              <g>
                <path
                  d="M7.46,9.46C5.68,11.25,5.55,14.04,7.03,16c1.53-2.54,3.73-4.64,6.37-6c-2.26,1.91-3.95,4.44-4.88,7.32 C9.27,17.75,10.11,18,11,18c1.34,0,2.59-0.52,3.54-1.46c1.74-1.74,2.81-6.57,3.26-10.33C14.04,6.65,9.21,7.72,7.46,9.46z"
                  opacity=".3"
                />
                <path
                  d="M6.05,8.05c-2.73,2.73-2.73,7.17,0,9.9C7.42,19.32,9.21,20,11,20s3.58-0.68,4.95-2.05C19.43,14.47,20,4,20,4 S9.53,4.57,6.05,8.05z M14.54,16.54C13.59,17.48,12.34,18,11,18c-0.89,0-1.73-0.25-2.48-0.68c0.92-2.88,2.62-5.41,4.88-7.32 c-2.63,1.36-4.84,3.46-6.37,6c-1.48-1.96-1.35-4.75,0.44-6.54C9.21,7.72,14.04,6.65,17.8,6.2C17.35,9.96,16.28,14.79,14.54,16.54z"
                />
              </g>
            </g>
          </svg>
          <a href="https://www.norkko.fi/">Siitepölytiedote</a>
        </div>
        <div>
          <svg-icon
            small
            path="assets/image/icons.svg#longTimeWeather"
          ></svg-icon>

          <a href="https://www.ilmatieteenlaitos.fi/paikallissaa"
            >10&nbsp;vrk&nbsp;sää</a
          >
        </div>
      </weather-section>
    `;
  }
}
window.customElements.define(ExternalLinks.is, ExternalLinks);
