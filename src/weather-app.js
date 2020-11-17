import { css, html, LitElement } from 'lit-element';

import './forecast-data.js';
import './observation-data.js';
import './weather-section.js';

import './common-components/error-notification.js';
import './common-components/weather-analytics.js';

import './sections/install-app.js';
import './sections/forecast-header/forecast-header.js';
import './sections/bottom-bar/bottom-bar.js';
import './sections/external-links.js';
import './sections/public-holidays.js';
import './sections/sunrise-sunset.js';
import './sections/symbol-list.js';
import './sections/weather-days/weather-days.js';
import './sections/weather-station.js';

import './sections/share-app.js';

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
      p + p {
        margin-bottom: var(--space-m);
      }

      .by {
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
        color: var(--color-blue-700);
      }

      .container {
        display: grid;
        justify-items: stretch;
        align-items: stretch;

        grid-gap: var(--space-s);
        grid-template-columns: auto;
        grid-template-areas:
          'forecast'
          'sun'
          'observations'
          'calendar'
          'info'
          'links'
          'cookies'
          'symbols'
          'copy';
      }

      @media only screen and (min-width: 430px) {
        .container {
          grid-gap: var(--space-l);
          margin: 0 var(--space-l) var(--space-l) var(--space-l);
          padding-top: var(--space-l);
        }
      }

      @media only screen and (min-width: 768px) {
        .container {
          /* golden ratio */
          grid-template-columns: 500fr 500fr 618fr;
          grid-auto-rows: minmax(0px, auto);

          grid-template-areas:
            'forecast forecast  sun'
            'forecast forecast  observations'
            'forecast forecast  observations'
            'calendar calendar  info'
            'calendar calendar  links'
            'calendar calendar  cookies'
            'symbols  symbols symbols'
            'copy     copy      copy';
        }
      }

      .section {
        background: var(--color-white);
        border-radius: none;
        margin: 0;
        max-width: none;
      }

      @media only screen and (min-width: 430px) {
        .section {
          border-radius: var(--border-radius);
        }
      }

      .section--forecast {
        --padding: 0;

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

      .section--symbols {
        grid-area: symbols;
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
        background: transparent;
        text-align: center;
        margin-bottom: var(--space-xl);
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

      <install-app></install-app>
      <div class="container" ?hidden="${this._firstLoading}">
        <weather-section class="section section--forecast">
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
                  ?largeMap="${this._largeMap}"
                  ?loading="${this._loading}"
                  .location="${this._location}"
                  .place="${this._forecastPlace}"
                  .observationData="${this._observationData}"
                  ?showFeelsLike="${this._showFeelsLike}"
                  ?showWind="${this._showWind}"
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
          <bottom-bar
            ?showFeelsLike="${this._showFeelsLike}"
            ?showWind="${this._showWind}"
          ></bottom-bar>

          <div class="by">
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
            <svg-icon path="assets/image/icons.svg#longTimeWeather"></svg-icon>

            <a href="https://www.ilmatieteenlaitos.fi/paikallissaa"
              >10&nbsp;vrk&nbsp;sää</a
            >
          </div>
        </weather-section>

        <weather-station
          class="section section--observations"
          .location="${this._location}"
          .observationData="${this._observationData}"
          ?observationError="${this._observationError}"
          ?showFeelsLike="${this._showFeelsLike}"
          ?showWind="${this._showWind}"
        >
        </weather-station>

        <external-links class="section section--links"></external-links>

        <sunrise-sunset
          class="section section--sun"
          .location="${this._location}"
        ></sunrise-sunset>

        <public-holidays class="section section--calendar"></public-holidays>

        <weather-section
          class="section section--informationOnService"
          header="Tietoja palvelusta"
        >
          <svg-icon
            class="info-icon"
            path="assets/image/icons.svg#info"
          ></svg-icon>

          <p>
            Saaennuste.fi on nopein ja paras sääsovellus. Näet yhdellä
            vilkaisulla sekä tämän hetkisen sään kaikilta lähistön
            havaintoasemilta että lähipäivien tuntikohtaisen ennustuksen.
          </p>

          <p>
            Ennuste perustuu luotettavaan ja tarkkaan Ilmatieteen laitoksen
            <a
              href="http://ilmatieteenlaitos.fi/tutkimustoiminta/-/asset_publisher/Dz9C/content/uusin-versio-harmonie-arome-saamallista-parantaa-pilvisyyden-ja-tuulen-ennusteita?redirect=http%3A%2F%2Filmatieteenlaitos.fi%2Ftutkimustoiminta%3Fp_p_id%3D101_INSTANCE_Dz9C%26p_p_lifecycle%3D0%26p_p_state%3Dnormal%26p_p_mode%3Dview%26p_p_col_id%3Dcolumn-2%26p_p_col_count%3D2"
            >
              Harmonie-malliin</a
            >.
          </p>
          <p>
            Havaintoasemat ovat "kartalla" oikeilla paikoillaan siten, että
            päällekkäin meneviä asemia on siirretty mahdollisimman vähän.
          </p>
          <p>
            "Tuntuu kuin" lasketaan Ilmatieteen laitoksen kaavalla, joka ottaa
            huomioon tuulen nopeuden ja ilman kosteuden
          </p>

          <div slot="footer-left"></div>
          <div slot="footer-right">
            <svg-icon path="assets/image/icons.svg#email"></svg-icon>
            palaute@saaennuste.fi
          </div>
        </weather-section>

        <!--weather-section class="section section--feedback" header="Palaute">
          Puuttuuko sääpalvelusta jokin ominaisuus tai onko sinulla idea miten
          parantaisit sovellusta? Ota yhteyttä!

          <div slot="footer-left"></div>
          <div slot="footer-right">
            <svg-icon path="assets/image/icons.svg#email"></svg-icon>
            palaute@saaennuste.fi
          </div>
        </weather-section-->

        <weather-section
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
        </weather-section>

        <weather-section class="section section--copyright">
          <svg-icon path="assets/image/icons.svg#copyright"></svg-icon>
          <div>Design / toteutus Jani Säntti</div>
          <div>Säädata ja symbolit Ilmatieteen laitos</div>

          <share-app></share-app>
        </weather-section>

        <symbol-list class="section section--symbols"></symbol-list>
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
      _largeMap: {
        type: Boolean,
      },
      _loading: {
        type: Boolean,
      },
      _location: {
        type: Object,
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

    this.addEventListener('station-map.selected', e =>
      this._stationSelected(e)
    );

    this.addEventListener('bottom-bar.toggleMapSize', () => {
      this._toggleMapSize();
    });
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

  /**
   * Mark selected station for observation data
   * @param {Object} event
   * @param {Number} event.detail selected station index
   *
   */
  _stationSelected(event) {
    const observationsCopy = this._observationData.map(observation => {
      const obs = { ...observation };
      obs.selectedStation = false;
      return obs;
    });

    observationsCopy[event.detail].selectedStation = true;

    this._observationData = observationsCopy;
  }

  _toggleMapSize() {
    this._largeMap = !this._largeMap;
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
