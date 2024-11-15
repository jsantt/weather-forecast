import { css, html, LitElement } from 'lit';

import './sections/meta-info/json-ld.js';
import './forecast-data';
import './observation-data';

import './weather-section';
import './common-components/error-notification';
import './sections/forecast-header/forecast-header';

import './sections/bottom-sheet/bottom-sheet';
import './sections/external-links';

import './sections/public-holidays';
import './sections/sunrise-sunset';
import './sections/symbol-list';

import './sections/weather-days/weather-days';
import './sections/share-app';

class WeatherApp extends LitElement {
  static get is() {
    return 'weather-app';
  }

  static get styles() {
    return css`
      :host {
        --header-background-expand: 3.5rem;

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
        margin-top: var(--space-m);
      }

      .by {
        font-weight: var(--font-weight-bold);
        font-size: var(--font-size-s);
        border-radius: 0;
        text-align: center;
        padding-top: var(--space-xl);
      }

      .container {
        display: grid;
        justify-items: stretch;
        align-items: stretch;

        grid-gap: var(--space-l);
        grid-template-columns: auto;
        grid-template-areas:
          'forecast'
          'sun'
          'links'
          'share'
          'info'
          'cookies'
          'copy'
          'symbols';
      }

      @media only screen and (min-width: 430px) {
        .container {
          margin: 0 var(--space-l) var(--space-l) var(--space-l);
          padding-top: var(--space-l);
        }

        .section {
          border-radius: var(--border-radius);
        }
      }

      @media only screen and (min-width: 431px) and (max-width: 685px) {
        .container {
          margin-left: 8%;
          margin-right: 8%;
        }
      }

      @media only screen and (min-width: 686px) {
        .container {
          grid-template-columns: minmax(300px, 400px) minmax(270px, 350px);
          grid-auto-rows: minmax(0px, auto);

          grid-template-areas:
            'forecast sun'
            'forecast links'
            'forecast share'
            'forecast info'
            'cookies  info'
            'copy     copy'
            'symbols  symbols';
        }
      }

      @media only screen and (min-width: 1024px) {
        .container {
          margin-left: 4rem;
        }
      }

      .section {
        background-color: var(--background-panel);
        border-radius: none;
        margin: 0;
        max-width: none;
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
        background: transparent;
        /*box-shadow: var(--box-shadow);*/
      }

      .section--sun {
        --padding: var(--space-l) var(--space-l) 0 var(--space-l);

        grid-area: sun;

        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' version='1.1' viewBox='-16 14 37 37' preserveAspectRatio='slice none'%3E%3Cpolygon fill='%23fbecb6' points='18.5,7.032 20.703,11.237 24.828,8.891 24.406,13.618 29.146,13.875 26.236,17.625 30.086,20.403 25.609,21.985 27.346,26.401 22.727,25.313 21.797,29.968 18.5,26.554 15.201,29.968 14.273,25.313 9.654,26.401 11.389,21.985 6.914,20.403 10.762,17.625 7.854,13.875 12.592,13.618 12.172,8.891 16.297,11.237'%3E%3C/polygon%3E%3Ccircle fill='%23fbecb6' stroke='%23FFFFFF' stroke-width='1.3028' cx='18.499' cy='18.363' r='6.362'%3E%3C/circle%3E%3C/svg%3E");
        background-position: right top;
        background-repeat: no-repeat;
        background-size: 400px auto;
        background-blend-mode: var(--sun-background-blend);
      }

      .section--calendar {
        grid-area: calendar;
      }

      .section--informationOnService {
        grid-area: info;
      }

      .section--share {
        grid-area: share;
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
        background: transparent;
        grid-area: symbols;
      }

      a:link {
        color: var(--color-primary);
      }

      a:visited,
      a:hover {
        color: var(--color-primary);
      }

      .logo {
        margin-top: var(--space-s);
      }

      svg {
        fill: var(--color-primary);
        margin-right: var(--space-s);
      }

      .info-icon {
        float: left;
        margin: var(--space-m) var(--space-l) var(--space-s) var(--space-m);
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

      h2,
      h3 {
        font-size: var(--font-size-m);
      }
    `;
  }

  render() {
    return html`
      <!-- Observation / weather station data -->
      <observation-data .place="${this._forecastPlace}"> </observation-data>

      <forecast-data .location="${this._location}"> </forecast-data>

      <div class="container" ?hidden="${this._firstLoading}">
        <weather-section class="section section--forecast">
          <slot name="place"></slot>

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
                  ?observationError="${this._observationError}"
                  ?showFeelsLike="${this._showFeelsLike}"
                  ?showWind="${this._showWind}"
                >
                </forecast-header>

                <!-- today, tomorrow and a day after tomorrow -->
                <slot name="header"></slot>

                <weather-days
                  .forecastData="${this._forecastData}"
                  .location="${this._location}"
                  ?showFeelsLike="${this._showFeelsLike}"
                  ?showWind="${this._showWind}"
                >
                </weather-days>
              `}
          <bottom-sheet
            ?largeMap="${this._largeMap}"
            ?showFeelsLike="${this._showFeelsLike}"
            ?showWind="${this._showWind}"
            ?darkMode="${this._darkMode}"
          ></bottom-sheet>

          <div class="by">
            Ilmatieteen laitoksen sää yhdellä vilkaisulla<br />
            <img
              class="logo"
              alt="fmi logo"
              src="./assets/image/FMI0DATA_small.png"
            />
          </div>
          <div slot="footer-left"></div>
          <div slot="footer-right"></div>
        </weather-section>

        <external-links
          .region="${this._forecastPlace !== undefined
            ? this._forecastPlace.region
            : undefined}"
          class="section section--links"
        ></external-links>

        <sunrise-sunset
          class="section section--sun"
          .location="${this._location}"
        ></sunrise-sunset>

        <!--public-holidays class="section section--calendar"></public-holidays-->
        <!--holiday-calendar class="section section--calendar"></holiday-calendar-->

        <weather-section class="section section--informationOnService">
          <h2>Sääennuste</h2>
          <svg-icon
            class="info-icon"
            path="assets/image/icons.svg#info"
          ></svg-icon>

          <p>
            Sääennuste kokoaa Ilmatieteen laitoksen havainnot, sääennusteen,
            sadetutkan jne yhteen. Näet tuntikohtaiset sadepylväät, tuuli- sade-
            ja lumimäärät yhdellä vilkaisulla &ndash; myös kännykän ruudulta.
          </p>

          <h3>Sää nyt</h3>
          <p>
            Sää nyt lasketaan lähistön sääasemien tiedoista. Sääasemat näkyvät
            "kartalla" oikeassa suunnassas siten, että päällekkäin meneviä
            asemia on siirretty mahdollisimman vähän. Klikkaamalla sääasemaa,
            näet kaikki asemalta saatavissa olevat tiedot.
          </p>

          <h3>Ilmatieteen laitoksen sää</h3>
          <p>
            Sääennuste perustuu Ilmatieteen laitoksen tarkimpaan ja
            luotettavimpaan
            <a
              href="http://ilmatieteenlaitos.fi/tutkimustoiminta/-/asset_publisher/Dz9C/content/uusin-versio-harmonie-arome-saamallista-parantaa-pilvisyyden-ja-tuulen-ennusteita?redirect=http%3A%2F%2Filmatieteenlaitos.fi%2Ftutkimustoiminta%3Fp_p_id%3D101_INSTANCE_Dz9C%26p_p_lifecycle%3D0%26p_p_state%3Dnormal%26p_p_mode%3Dview%26p_p_col_id%3Dcolumn-2%26p_p_col_count%3D2"
            >
              Harmonie-malliin</a
            >. Ilmatieteen laitos käyttää myös muita malleja, joten ennuste
            saattaa poiketa niistä.
            <i>Tuntuu kuin</i>
            lasketaan Ilmatieteen laitoksen kaavalla.
          </p>

          <h3>Palaute</h3>
          <p>
            Onko jokin rikki, puuttuuko ominaisuus tai onko sinulla idea miten
            parantaisit sovellusta? Olen kaikista palautteista kiitollinen!
          </p>

          <div slot="footer-left"></div>
          <div slot="footer-right">
            palaute@saaennuste.fi
            <svg-icon path="assets/image/icons.svg#email"></svg-icon>
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
          Palvelu ei käytä evästeitä. Sivuston kävijämäärä ja käyttäytyminen
          kerätään käyttäjää tunnistamatta.
          <div slot="footer-left"></div>
          <div slot="footer-right">
            <svg-icon path="assets/image/icons.svg#cookie"></svg-icon>
          </div>
        </weather-section>

        <share-app class="section section--share"></share-app>

        <weather-section class="section section--copyright">
          <svg-icon path="assets/image/icons.svg#copyright"></svg-icon>
          <div>Säädata ja symbolit Ilmatieteen laitos</div>
        </weather-section>

        <symbol-list class="section section--symbols"></symbol-list>
      </div>
    `;
  }

  static get properties() {
    return {
      _currentPlace: {
        type: Object,
      },
      _darkMode: {
        type: Boolean,
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

    if (window.location.href.includes('beta')) {
      window.localStorage.setItem('beta', true);
    }

    this._firstLoading = true;
    this._forecastError = false;

    this._showWind = false;
    this._showFeelsLike = false;
    this._darkMode = false;

    // user changes location
    this.addEventListener('location-selector.location-changed', (event) => {
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

    this.addEventListener('forecast-data.new-data', (event) => {
      this._forecastError = false;
      this._forecastData = event.detail;
    });

    this.addEventListener('forecast-data.new-place', (event) => {
      this._forecastPlace = event.detail;
    });

    this.addEventListener('forecast-data.fetch-error', () => {
      this._forecastError = true;
    });

    // observation data

    this.addEventListener('observation-data.new-data', (event) => {
      this._observationError = false;
      this._observationData = event.detail;
    });

    this.addEventListener('observation-data.fetch-error', () => {
      this._observationError = true;
    });

    this.addEventListener('forecast-header.toggle-wind', () => {
      this._showWind = !this._showWind;
    });

    this.addEventListener('bottom-sheet.toggle-wind', () => {
      this._showWind = !this._showWind;
    });

    this.addEventListener('bottom-sheet.toggle-darkmode', () => {
      this._darkMode = !this._darkMode;
    });

    this.addEventListener('forecast-header.toggle-feels-like', () => {
      this._showFeelsLike = !this._showFeelsLike;
    });

    this.addEventListener('station-map.selected', (e) => {
      this._stationSelected(e);
    });

    this.addEventListener('bottom-sheet.toggleMapSize', () => {
      this._toggleMapSize();
    });

    if (
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      this._darkMode = true;
    }
  }

  _fetchDone() {
    this._firstLoading = false;
  }

  /**
   * Mark selected station for observation data
   * @param {Object} event
   * @param {Number} event.detail selected station index
   *
   */
  _stationSelected(event) {
    const observationsCopy = this._observationData.map((observation) => {
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

    const hourForecast = data.filter((item) => {
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
