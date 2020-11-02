import { css, html, LitElement } from 'lit-element';

import '../weather-section.js';
import '../common/error-notification.js';
import '../common/svg-icon.js';
import '../forecast/weather-name-wawa.js';

const STATION_MAX_AMOUNT = 7;

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

      .station {
        display: grid;
        grid-template-columns: 5rem 3rem 1fr 2rem;
        grid-template-rows: auto;
        margin-bottom: var(--space-m);
      }

      .name {
        grid-column: span 4;
      }

      .distance {
        float: right;
        color: var(--color-gray-600);
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
        visibility: hidden;
        margin: 0;
        max-height: 0;
      }

      aside {
        border-left: 3px solid var(--color-blue-300);
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: auto;

        padding: 0 0 0 var(--space-l);
        margin: 0 0 var(--space-xl) var(--space-l);

        max-height: 20rem;
        transition: max-height 0.3s ease-out;
        will-change: max-height;
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
    return html` <weather-section header="Lähimmät sääasemat">
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
            <section class="stations">
              ${this.observationData.map((station, index) => {
                if (index >= STATION_MAX_AMOUNT) {
                  return '';
                }
                return html` <div class="station" @click="${() =>
                  this._toggleDetails(index)}">
                  <div class="name">
                    ${station.name} 
                <span class="distance">${station.distance} km</span>
                  </div>
                  <div class="temperature">
                    ${
                      station.temperature
                        ? html`
                            <div>
                              ${this.showFeelsLike === true
                                ? station.feelsLike2 || '-'
                                : Math.round(station.temperature)}<span
                                class="celcius"
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
                }">
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
                          ${station.visibility} km
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
              Asemilta saatavat tiedot vaihtelevat ja ne päivittyvät 10 minuutin
              välein
            </div>
          `}
    </weather-section>`;
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
      showFeelsLike: { type: Boolean, reflect: true },
      showWind: { type: Boolean, reflect: true },
    };
  }

  _toggleDetails(index) {
    const observationDataCopy = this.observationData.map((item, i) => {
      const itemCopy = item;
      if (index !== i) {
        itemCopy.detailsVisible = false;
      }
      return itemCopy;
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
}

window.customElements.define(WeatherStation.is, WeatherStation);
