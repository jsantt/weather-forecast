import { css, html, LitElement } from 'lit-element';

// no lazy loading at the moment, consider taking into use
import './common/lazy-resources.js';

import './forecast/location-selector.js';

import './common/error-notification.js';
import './forecast/forecast-header.js';
import './forecast/weather-days.js';
import './forecast-data.js';

import './other/add-to-homescreen.js';
import './other/sunrise-sunset.js';
import './other/public-holidays.js';

import './other/bottom-bar.js';
import './other/external-links.js';
import './other/footer-section.js';
import './other/share-app.js';

class WeatherApp extends LitElement {
  static get is() {
    return 'weather-app';
  }

  static get styles() {
    return css`
      :host {
        --header-background-expand: 3rem;

        display: block;
      }

      error-notification {
        height: 83%;
      }

      div[hidden] {
        visibility: hidden;
      }

      p {
        margin: 0;
      }

      .container {
        max-width: 49.5rem;
        margin: 0 auto 5rem auto;
        /* padding to fix a bug. 1px padding corrects space color */
        padding-top: 1.25rem;
      }

      .section {
        margin: var(--space-m);
      }

      .provider {
        font-weight: var(--font-weight-bold);
        border-radius: 0;
        text-align: center;
      }

      .section--sun,
      .section--calendar,
      .section--informationOnService,
      .section--feedback,
      .section--cookies,
      .section--observations {
        background-color: var(--color-white);
        color: var(--color-blue-700);
      }

      .section--forecast,
      .section--links {
        background: var(--color-gray-300);
      }

      @media only screen and (min-width: 33rem) {
        .section {
          max-width: 30rem;
          margin-left: auto;
          margin-right: auto;
        }
      }

      @media only screen and (min-width: 48rem) {
        .container {
          display: grid;
          grid-gap: var(--space-l);

          /* golden ratio */
          grid-template-columns: 500fr 500fr 618fr;
          grid-auto-rows: minmax(10px, auto);

          grid-template-areas:
            '........ ........   install'
            'forecast forecast  sun'
            'forecast forecast  observations'
            'forecast forecast  observations'
            'calendar calendar  info'
            'calendar calendar  links'
            'calendar calendar  cookies'
            'copy     copy      copy';

          padding-top: 1rem;
        }
        .section {
          margin: 0;
          max-width: none;
        }

        .section--install {
          grid-area: install;
          padding-bottom: 0;
        }

        .section--forecast {
          grid-area: forecast;
        }

        .section--observations {
          grid-area: observations;
        }

        .section--links {
          grid-area: links;
        }

        .section--sun {
          grid-area: sun;
        }

        .section--calendar {
          grid-area: calendar;
        }

        .section--informationOnService {
          grid-area: info;
        }

        .section--copyright {
          grid-area: copy;
        }

        .section--feedback {
          grid-area: feedback;
        }

        .section--cookies {
          grid-area: cookies;
        }
      }

      a:link {
        color: var(--color-blue-500);
      }

      a:visited,
      a:hover {
        color: var(--color-blue-700);
      }

      .logo {
        margin-top: var(--space-s);
      }

      svg {
        fill: var(--color-blue-700);
        margin-right: var(--space-s);
      }

      .info-icon {
        float: left;
        margin: var(--space-m) var(--space-m) var(--space-s) var(--space-m);
      }

      .section--copyright {
        text-align: center;
      }

      .locate-button-container {
        position: relative;
        width: 100%;
        display: flex;
        justify-content: center;
      }

      svg-icon {
        height: 24px;
        width: 24px;
        fill: var(--color-blue-700);
      }
    `;
  }

  render() {
    return html`
      <weather-analytics key="UA-114081578-1"></weather-analytics>

      <!-- Observation / weather station data -->
      <observation-data .place="${this._forecastPlace}"> </observation-data>

      <forecast-data .location="${this._location}"> </forecast-data>

      <div class="container" ?hidden="${this._firstLoading}">
        <add-to-homescreen class="section section--install"></add-to-homescreen>
        <main class="section section--forecast">
          <slot id="place"></slot>

          ${this._forecastError === true
            ? html`
                <error-notification
                  errorText="Säätietojen haku epäonnistui"
                  id="errorNotification"
                >
                </error-notification>
              `
            : html`
                <forecast-header
                  ?loading="${this._loading}"
                  .location="${this._location}"
                  .place="${this._forecastPlace}"
                  .observationData="${this._observationData}"
                >
                </forecast-header>

                <!-- today, tomorrow and a day after tomorrow -->
                <slot id="header"></slot>

                <weather-days
                  .forecastData="${this._forecastData}"
                  ?showFeelsLike="${this._showFeelsLike}"
                  ?showWind="${this._showWind}"
                >
                </weather-days>
              `}
          <footer-section class="provider">
            <div>
              <p>
                Sääennuste by Ilmatieteen laitos | avoin data
              </p>
              <img
                class="logo"
                alt="fmi logo"
                src="./assets/image/FMI0DATA_small.png"
              />
            </div>
            <div slot="footer-left"></div>
            <div slot="footer-right">
              <svg-icon
                path="assets/image/icons.svg#longTimeWeather"
              ></svg-icon>

              <a href="https://www.ilmatieteenlaitos.fi/paikallissaa"
                >10&nbsp;vrk&nbsp;sää</a
              >
            </div>
          </footer-section>
          <bottom-bar
            ?showFeelsLike="${this._showFeelsLike}"
            ?showWind="${this._showWind}"
          ></bottom-bar>
        </main>

        <weather-station
          class="section section--observations"
          .location="${this._location}"
          .observationData="${this._observationData}"
          ?observationError="${this._observationError}"
        >
        </weather-station>

        <external-links class="section section--links"></external-links>

        <sunrise-sunset
          class="section section--sun"
          .location="${this._location}"
        ></sunrise-sunset>

        <public-holidays class="section section--calendar"></public-holidays>

        <footer-section
          class="section section--informationOnService"
          header="Tietoja palvelusta"
        >
          <svg-icon
            class="info-icon"
            path="assets/image/icons.svg#info"
          ></svg-icon>

          Saaennuste.fi on nopein ja paras sääsovellus. Löydät Helsingin, Espoon
          ja muiden kaupunkien lisäksi myös tarkan täsmäsään 2.5km alueelle.
          Ennuste perustuu luotettavaan ja tarkkaan Ilmatieteen laitoksen
          <a
            href="http://ilmatieteenlaitos.fi/tutkimustoiminta/-/asset_publisher/Dz9C/content/uusin-versio-harmonie-arome-saamallista-parantaa-pilvisyyden-ja-tuulen-ennusteita?redirect=http%3A%2F%2Filmatieteenlaitos.fi%2Ftutkimustoiminta%3Fp_p_id%3D101_INSTANCE_Dz9C%26p_p_lifecycle%3D0%26p_p_state%3Dnormal%26p_p_mode%3Dview%26p_p_col_id%3Dcolumn-2%26p_p_col_count%3D2"
          >
            Harmonie-malliin</a
          >.
          <div slot="footer-left"></div>
          <div slot="footer-right">
            <svg-icon path="assets/image/icons.svg#email"></svg-icon>
            palaute@saaennuste.fi
          </div>
        </footer-section>

        <!--footer-section class="section section--feedback" header="Palaute">
          Puuttuuko sääpalvelusta jokin ominaisuus tai onko sinulla idea miten
          parantaisit sovellusta? Ota yhteyttä!

          <div slot="footer-left"></div>
          <div slot="footer-right">
            <svg-icon path="assets/image/icons.svg#email"></svg-icon>
            palaute@saaennuste.fi
          </div>
        </footer-section-->

        <footer-section
          class="section section--cookies"
          header="Kerätyt tiedot"
        >
          Parantaaksemme käyttökokemusta, käytämme
          <a
            href="https://policies.google.com/technologies/partner-sites?hl=fi"
          >
            Googlen analytiikkatyökalun</a
          >
          tarvitsemia evästeitä sivuston kävijämäärän ja käyttäytymisen
          seuraamiseen
          <div slot="footer-left"></div>
          <div slot="footer-right">
            <svg-icon path="assets/image/icons.svg#cookie"></svg-icon>
          </div>
        </footer-section>

        <footer-section class="section section--copyright">
          <svg-icon path="assets/image/icons.svg#copyright"></svg-icon>
          <div>Design / toteutus Jani Säntti</div>
          <div>Säädata ja symbolit Ilmatieteen laitos</div>

          <share-app></share-app>
        </footer-section>
      </div>
    `;
  }

  static get properties() {
    return {
      _currentFeelsLike: {
        type: Number,
      },
      _currentPlace: {
        type: Object,
      },
      _currentSymbol: {
        type: Number,
      },
      _currentTemperature: {
        type: Number,
      },
      _currentWind: {
        type: Number,
      },
      _currentWindDirection: {
        type: Number,
      },
      _currentWindGust: {
        type: Number,
      },
      _firstLoading: {
        type: Boolean,
      },
      _forecastData: {
        type: Array,
      },
      _forecastError: {
        type: Boolean,
      },
      _forecastPlace: {
        type: Object,
      },
      _loading: {
        type: Boolean,
      },
      _showFeelsLike: {
        type: Boolean,
      },
      _showWind: {
        type: Boolean,
      },
      _observationData: {
        type: Array,
      },
      _observationError: {
        type: Boolean,
      },
      _location: {
        type: Object,
      },
    };
  }

  constructor() {
    super();

    this._firstLoading = true;
    this._forecastError = false;

    this._showWind = false;
    this._showFeelsLike = false;

    // user changes location
    this.addEventListener('location-selector.location-changed', event => {
      this._location = { ...event.detail };
    });

    // forecast data
    this.addEventListener('forecast-data.fetching', () => {
      this._loading = true;
    });

    this.addEventListener('forecast-data.fetch-done', () => {
      this._fetchDone();
      this._loading = false;
      this._firstLoading = false;
    });

    this.addEventListener('forecast-data.new-data', event => {
      this._forecastError = false;
      this._forecastData = event.detail;
    });

    this.addEventListener('forecast-data.new-place', event => {
      this._forecastPlace = event.detail;
    });

    this.addEventListener('forecast-data.fetch-error', () => {
      this._forecastError = true;
    });

    // observation data

    this.addEventListener('observation-data.new-data', event => {
      this._observationError = false;
      this._observationData = event.detail;
    });

    this.addEventListener('observation-data.fetch-error', () => {
      this._observationError = true;
    });

    this.addEventListener('forecast-header.toggle-wind', () => {
      this._showWind = !this._showWind;
    });

    this.addEventListener('forecast-header.toggle-feels-like', () => {
      this._showFeelsLike = !this._showFeelsLike;
    });
  }

  connectedCallback() {
    super.connectedCallback();

    /* if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('service-worker.js', { scope: '/' });
    } */
  }

  _fetchDone() {
    this._firstLoading = false;

    const weatherNowData = WeatherApp._getWeatherNow(this._forecastData);

    this._currentFeelsLike = weatherNowData.feelsLike;
    this._currentSymbol = weatherNowData.symbol;
    this._currentTemperature = weatherNowData.temperature;

    this._currentWind = weatherNowData.wind;
    this._currentWindDirection = weatherNowData.windDirection;
    this._currentWindGust = weatherNowData.windGust;
  }

  static _getWeatherNow(data) {
    if (data === undefined) {
      return {};
    }

    const time = WeatherApp._nextIsoHour();

    if (data === undefined) {
      return {};
    }

    const hourForecast = data.filter(item => {
      return item.time === time;
    })[0];

    return hourForecast;
  }

  static _nextIsoHour() {
    const timeNow = new Date();

    timeNow.setHours(timeNow.getHours() + 1);
    timeNow.setMinutes(0, 0, 0);

    return `${timeNow.toISOString().split('.')[0]}Z`;
  }
}

window.customElements.define(WeatherApp.is, WeatherApp);
