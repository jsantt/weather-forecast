import { css, html, LitElement } from 'lit-element';
import '../common/error-notification.js';
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

      .content {
        display: grid;
        grid-template-columns: 1fr 1fr;

        align-items: center;
        justify-items: center;

        padding-top: var(--space-l);
        text-align: center;
      }

      .label {
        color: var(--color-white);

        grid-column: 1 / span 2;
        margin-left: auto;
        padding-right: var(--space-l);
        margin-bottom: var(--space-xl);
      }

      .place {
        grid-column: 1 / span 2;
        font-size: var(--font-size-l);
      }

      .temperature {
        justify-self: stretch;
        font-size: var(--font-size-xxl);
        font-weight: var(--font-weight-bold);
        grid-column: 1 / span 2;

        display: flex;
        justify-content: center;
        align-items: center;
      }

      weather-name-wawa {
        grid-column: 1 / span 2;
        margin-bottom: var(--space-xl);
        font-size: var(--font-size-l);
        padding: 0 var(--space-m);
      }

      .item {
        padding: 1rem 0;
      }

      .degree {
        font-size: var(--font-size-l);
        vertical-align: super;
      }

      .rainDetails {
        grid-column: 1 / span 2;
      }
      .value {
        font-size: var(--font-size-m);
        font-weight: var(--font-weight-bold);
      }

      .explanation {
        text-transform: uppercase;
      }

      .windExplanation {
        margin-top: -0.26rem;
      }

      footer {
        display: flex;
        justify-content: space-between;
        align-items: center;

        font-size: var(--font-size-m);
        margin-top: var(--space-xl);
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
    return html`
      <footer-section header="lähin havaintoasema">
        ${this.observationData === undefined || this.observationError
          ? html`
              <error-notification
                errorText="Sääasemalle ei valitettavasti saatu yhteyttä"
              >
              </error-notification>
            `
          : html`
            <div class="content">
              <div class="place">
                ${this.observationData.weatherStation}
              </div>
              <div class="temperature">
                ${
                  this.observationData.temperature
                    ? html`
                        <div>
                          <span>${this.observationData.temperature}°C</span>
                        </div>
                      `
                    : ``
                }
              </div>

              <weather-name-wawa
                .wawaId="${this.observationData.weatherCode}"
                .cloudiness="${this.observationData.cloudiness}"
              >
              </weather-name-wawa>

              ${
                this.observationData.rainExplanation
                  ? html`
                      <div class="item">
                        <div class="value">
                          ${this.observationData.rainExplanation}mm/h
                        </div>
                        <div class="explanation">sateen rankkuus</div>
                        <div></div>
                      </div>
                    `
                  : ``
              }
              ${
                this.observationData.rain
                  ? html`
                      <div>
                        <div class="value">${this.observationData.rain}</div>
                        <div class="explanation">
                          mm sadetta / edeltävä tunti
                        </div>
                      </div>
                    `
                  : ``
              }
              ${
                this.observationData.wind
                  ? html`
                      <div class="item">
                        <wind-icon
                          degrees="${this.observationData.windDirection}"
                          large
                          windSpeed="${this.observationData.wind}"
                          windGustSpeed="${this.observationData.windGust}"
                        >
                        </wind-icon>
                        <div class="explanation windExplanation">
                          10 min keskituuli ja puuskat
                        </div>
                      </div>
                    `
                  : ``
              }
              ${
                this.observationData.humidity
                  ? html`
                      <div class="item">
                        <div class="value">
                          ${this.observationData.humidity}%
                        </div>
                        <div class="explanation">ilmankosteus</div>
                      </div>
                    `
                  : ``
              }
              ${
                this.observationData.pressure
                  ? html`
                      <div class="item">
                        <div class="value">
                          ${this.observationData.pressure} hPa
                        </div>
                        <div class="explanation">ilmanpaine</div>
                      </div>
                    `
                  : ``
              }
              ${
                this.observationData.visibility
                  ? html`
                      <div class="item">
                        <div class="value">
                          ${this.observationData.visibility}m
                        </div>
                        <div class="explanation">näkyvyys</div>
                      </div>
                    `
                  : ``
              }
              ${
                this.observationData.dewPoint
                  ? html`
                      <div class="item">
                        <div class="value">
                          ${this.observationData.dewPoint}°C
                        </div>
                        <div class="explanation">kastepiste</div>
                      </div>
                    `
                  : ``
              }
              ${
                this.observationData.cloudiness
                  ? html`
                      <div class="item">
                        <div class="value">
                          ${this.observationData.cloudiness} / 8
                        </div>
                        <div class="explanation">pilvisyys</div>
                      </div>
                    `
                  : ``
              }
              ${
                WeatherStation._snow(this.observationData.snow)
                  ? html`
                      <div class="item">
                        Lumen syvyys: ${this.observationData.snow} cm
                      </div>
                    `
                  : ``
              }
            </div>
            
              <div slot="footer-left">
                Kello ${WeatherStation._formatTime(
                  this.observationData.time
                )} havainnot
              </div>
              <div slot="footer-right">
                <a href="${WeatherStation._googleMapsURl(
                  this.observationData.latLon
                )}"
                  >sijainti kartalla</a
                >
              </div>
            
            </footer-section>
          `}
      </footer-section>
    `;
  }

  static get properties() {
    return {
      observationData: {
        type: Object,
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
