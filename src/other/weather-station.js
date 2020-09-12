import { css, html, LitElement } from 'lit-element';
import '../common/error-notification.js';
import '../common/svg-icon.js';
import '../forecast/weather-name-wawa.js';
import './footer-section.js';

class WeatherStation extends LitElement {
  static get is() {
    return 'weather-station';
  }

  static get styles() {
    return css`
      :host {
        color: var(--color-blue-800);

        display: block;
      }

      section {
        display: grid;
        grid-template-columns: 5rem 3rem 1fr 2rem;
        grid-template-rows: auto;
        margin-bottom: var(--space-m);
      }

      .place {
        grid-column: span 4;
      }

      weather-name-wawa {
        font-style: italic;
        padding: 0 var(--space-l);
      }

      h1,
      h2,
      h3 {
        font-weight: var(--font-weight-normal);
        margin: 0;

        padding: 0;
      }

      h1 {
        font-size: var(--font-size-m);
        line-height: 1;
      }

      .beta {
        font-size: var(--font-size-s);
        font-style: italic;
        vertical-align: super;
      }

      h2 {
        font-size: var(--font-size-x);
        line-height: 1.1;
      }
      h3 {
        font-size: var(--font-size-s);
        line-height: 1.5;
      }

      .label {
        color: var(--color-white);

        grid-column: 1 / span 2;
        margin-left: auto;
        padding-right: var(--space-l);
        margin-bottom: var(--space-xl);
      }
      svg-icon {
        height: 52px;
        width: 52px;
      }

      .temperature {
        font-size: var(--font-size-xxl);
        font-weight: var(--font-weight-bold);
      }

      .celcius {
        font-size: var(--font-size-m);
        vertical-align: top;
      }

      .degree {
        font-size: var(--font-size-l);
        vertical-align: super;
      }

      div[slot] {
        text-transform: uppercase;
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
    return html` <footer-section header="Lähimmät havaintoasemat">
      ${this.observationData === undefined ||
      this.observationData[0] === undefined ||
      this.observationError
        ? html`
            <error-notification
              errorText="Sääasemalle ei valitettavasti saatu yhteyttä"
            >
            </error-notification>
          `
        : html`
            <div class="content">
              ${this.observationData.map(station => {
                return html` <section>
                  <div class="place">
                    ${station.name}
                  </div>
                  <div class="temperature">
                    ${station.temperature
                      ? html`
                          <div>
                            ${station.temperature}<span class="celcius"
                              >°C</span
                            >
                          </div>
                        `
                      : ``}
                  </div>
                  <svg-icon
                    path="assets/image/weather-symbols.svg#weatherSymbol${station.weatherCode3}"
                  ></svg-icon>

                  <weather-name-wawa
                    .wawaId="${station.wawaCode}"
                    .cloudiness="${station.cloudiness}"
                  >
                  </weather-name-wawa>
                  ${station.wind
                    ? html`
                        <div class="item">
                          <wind-icon
                            .degrees="${station.windDirection}"
                            .windSpeed="${station.wind}"
                            .windGustSpeed="${station.windGust}"
                          >
                          </wind-icon>
                        </div>
                      `
                    : ``}
                </section>`;
              })}
            </div>
          `}
    </footer-section>`;
  }

  static get properties() {
    return {
      observationData: {
        type: Array,
      },
      observationError: {
        type: Boolean,
      },
    };
  }

  static _formatTime(time) {
    const parsedTime = new Date(time);

    const minutes = parsedTime.getMinutes();
    const fullMinutes = minutes < 10 ? `0${minutes}` : minutes;

    return `${parsedTime.getHours()}.${fullMinutes}`;
  }

  static _googleMapsURl(latitudeLongitude) {
    return `https://www.google.com/maps/search/?api=1&query=${latitudeLongitude}&zoom=12`;
  }

  static _snow(centimeters) {
    return centimeters > -1;
  }

  /* Formula from https://stackoverflow.com/questions/18883601/function-to-calculate-distance-between-two-coordinates */

  static _distance(lat1, lon1, lat2, lon2) {
    const R = 6371; // km
    const dLat = WeatherStation._toRadian(lat2 - lat1);
    const dLon = WeatherStation._toRadian(lon2 - lon1);
    const latitude1 = WeatherStation._toRadian(lat1);
    const latitude2 = WeatherStation._toRadian(lat2);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) *
        Math.sin(dLon / 2) *
        Math.cos(latitude1) *
        Math.cos(latitude2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return d;
  }

  // Converts numeric degrees to radians
  static _toRadian(degrees) {
    return (degrees * Math.PI) / 180;
  }
}

window.customElements.define(WeatherStation.is, WeatherStation);
