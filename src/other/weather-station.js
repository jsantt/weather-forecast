import { css, html, LitElement } from 'lit-element';
import '../common/error-notification.js';
import '../common/svg-icon.js';
import '../forecast/weather-name-wawa.js';

import './footer-section.js';
import './station-map.js';

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

      station-map {
        margin: 0 -1rem var(--space-l) -1rem;
      }

      .station {
        display: grid;
        grid-template-columns: 5rem 3rem 1fr 2rem;
        grid-template-rows: auto;
        margin-bottom: var(--space-m);
      }

      .name {
        grid-column: span 4;
      }

      weather-name-wawa {
        align-self: center;
        font-style: italic;
        padding: 0 var(--space-l);
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

      /* Accordion (observation details) styles */

      .hidden {
        display: none;
      }

      aside {
        border-left: 3px solid var(--color-blue-300);
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: auto;

        padding: 0 0 0 var(--space-l);
        margin: 0 0 var(--space-xl) var(--space-l);
      }

      .item {
        line-height: 1;
        margin: var(--space-m);
      }

      .value {
        font-size: var(--font-size-l);
        font-weight: var(--font-weight-bold);
      }
    `;
  }

  render() {
    return html` <footer-section header="Lähimmät sääasemat">
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
            <station-map
              .location="${this.location}"
              .observationData=${this.observationData}
            ></station-map>
            <section class="stations">
              ${this.observationData.map((station, index) => {
                return html` <div class="station" @click="${() =>
                  this._toggleDetails(index)}">
                  <div class="name">
                    ${station.name} ${station.latLon}
                  </div>
                  <div class="temperature">
                    ${
                      station.temperature
                        ? html`
                            <div>
                              ${station.temperature}<span class="celcius"
                                >°C</span
                              >
                            </div>
                          `
                        : ``
                    }
                  </div>
                  <svg-icon
                    path="assets/image/weather-symbols.svg#weatherSymbol${
                      station.weatherCode3
                    }"
                  ></svg-icon>

                  <weather-name-wawa
                    .wawaId="${station.wawaCode}"
                    .cloudiness="${station.cloudiness}"
                  >
                  </weather-name-wawa>
                  ${
                    station.wind
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
                      : ``
                  }
                </div>
                <aside class="${
                  station.detailsVisible === false ? 'hidden' : ''
                }">${console.log(station.detailsVisible)}
                ${
                  station.cloudiness
                    ? html`
                        <div class="item">
                          <div class="value">
                            ${station.cloudiness} / 8
                          </div>
                          <div class="explanation">pilvisyys</div>
                        </div>
                      `
                    : ``
                }
                ${
                  station.rainExplanation
                    ? html`
                        <div class="item">
                          <div class="value">
                            ${station.rainExplanation} mm/h
                          </div>
                          <div class="explanation">sateen rankkuus</div>
                          <div></div>
                        </div>
                      `
                    : ``
                }
              ${
                station.rain
                  ? html`
                      <div>
                        <div class="value">${station.rain} mm</div>
                        <div class="explanation">
                          sadetta / edeltävä h
                        </div>
                      </div>
                    `
                  : ``
              }
             
              ${
                station.humidity
                  ? html`
                      <div class="item">
                        <div class="value">
                          ${station.humidity} %
                        </div>
                        <div class="explanation">ilmankosteus</div>
                      </div>
                    `
                  : ``
              }
              ${
                station.pressure
                  ? html`
                      <div class="item">
                        <div class="value">
                          ${station.pressure} hPa
                        </div>
                        <div class="explanation">ilmanpaine</div>
                      </div>
                    `
                  : ``
              }
              ${
                station.visibility
                  ? html`
                      <div class="item">
                        <div class="value">
                          ${station.visibility} m
                        </div>
                        <div class="explanation">näkyvyys</div>
                      </div>
                    `
                  : ``
              }
              ${
                station.dewPoint
                  ? html`
                      <div class="item">
                        <div class="value">
                          ${station.dewPoint} °C
                        </div>
                        <div class="explanation">kastepiste</div>
                      </div>
                    `
                  : ``
              }
       
              ${
                WeatherStation._snow(station.snow)
                  ? html`
                      <div class="item">
                        <div class="value">
                          ${station.snow} cm
                        </div>
                        <div class="explanation">Lumen syvyys</div>
                      </div>
                    `
                  : ``
              }
              </aside>
            </div>
                
                
                `;
              })}
            </section>
            <div slot="footer-left"></div>
            <div slot="footer-right">
              asemilta saatavat tiedot vaihtelevat
            </div>
          `}
    </footer-section>`;
  }

  static get properties() {
    return {
      location: {
        type: Object,
      },
      observationData: {
        type: Array,
      },
      observationError: {
        type: Boolean,
      },
    };
  }

  _toggleDetails(index) {
    const observationDataCopy = [...this.observationData];
    observationDataCopy.forEach((item, i) => {
      if (index !== i) {
        item.detailsVisible = false;
      }
    });

    observationDataCopy[index].detailsVisible = !observationDataCopy[index]
      .detailsVisible;
    this.observationData = observationDataCopy;
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
