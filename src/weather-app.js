import { css, html, LitElement } from 'lit';

import { getTime } from './data-helpers/time.ts';

import './forecast-data';
import './observation-data';

import './sections/forecast-header/top-bar.ts';

import './weather-section';

import './sections/forecast-header/forecast-header';

import './sections/bottom-sheet/bottom-sheet';
import('./sections/external-links');

import('./sections/sunrise-sunset');

import('./sections/symbol-list');
import('./sections/weather-days/weather-days');
import('./sections/share-app');
import('./common-components/error-notification');

class WeatherApp extends LitElement {
  static get is() {
    return 'weather-app';
  }

  static get styles() {
    return css`
      :host {
        --header-background-expand: 1rem;

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
      }

      a:link {
        color: var(--color-primary);
      }

      a:visited,
      a:hover {
        color: var(--color-primary);
      }

      svg {
        fill: var(--color-primary);
        margin-right: var(--space-s);
      }

      .info-icon {
        float: left;
        margin: var(--space-m) var(--space-l) var(--space-s) var(--space-m);
      }

      .locate-button-container {
        position: relative;
        width: 100%;
        display: flex;
        justify-content: center;
      }

      h2,
      h3 {
        font-size: var(--font-size-m);
      }

      .grid-container {
        display: grid;
        gap: var(--space-xl) var(--space-l);
        grid-template-columns: 1fr;

        max-width: 600px;

        padding: var(--padding-body);
        padding-bottom: 5rem;
      }

      .grid-item {
        display: grid;
      }

      .grid-map {
        grid-column-start: 1;
        grid-column-end: -1;
      }

      .grid-forecast {
        grid-column-start: 1;
        grid-column-end: -1;
      }

      .grid-copy {
        text-align: center;
        grid-column-start: 1;
        grid-column-end: -1;
      }

      .grid-symbols {
        grid-column-start: 1;
        grid-column-end: -1;
      }

      @media only screen and (min-width: 700px) {
        .grid-container {
          grid-template-columns: 1fr 1fr;
          max-width: 600px;
        }

        .grid-info {
          grid-column: span 2;
        }
      }

      @media only screen and (min-width: 1000px) {
        .grid-container {
          grid-template-columns: 1fr 1fr 1fr;
          max-width: 1000px;
        }

        .grid-map {
          grid-column-start: 1;
          grid-column-end: 3;
        }

        .grid-forecast {
          grid-column-start: 3;
          grid-column-end: 4;
        }
      }
    `;
  }

  render() {
    return html`
      <!-- Observation / weather station data -->
      <observation-data .place="${this._forecastPlace}"> </observation-data>

      <forecast-data .location="${this._location}"> </forecast-data>

      <top-bar></top-bar>
      <bottom-sheet
        ?largeMap="${this._largeMap}"
        ?showFeelsLike="${this._showFeelsLike}"
        ?showWind="${this._showWind}"
        ?darkMode="${this._darkMode}"
      ></bottom-sheet>

      <div class="grid-container" ?hidden="${this._firstLoading}">
        <weather-section
          yellow
          class="grid-item grid-map"
          .padding=${false}
          liftedHeading=${`Sää klo ${getTime(new Date())}`}
        >
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
              `}
        </weather-section>

        <weather-section
          pink
          class="grid-item grid-forecast"
          liftedHeading="Ennuste"
        >
          <!-- today, tomorrow and a day after tomorrow -->
          <slot name="header"></slot>

          <weather-days
            .forecastData="${this._forecastData}"
            .location="${this._location}"
            ?showFeelsLike="${this._showFeelsLike}"
            ?showWind="${this._showWind}"
          >
          </weather-days>

          <div class="by">
            <object
              data="./assets/image/il-avoin-data-logo-rgb.svg"
              width="100"
              height="30"
            ></object>
          </div>
          <div slot="footer-left"></div>
          <div slot="footer-right"></div>
        </weather-section>

        <sunrise-sunset
          class="grid-item grid-sun"
          .location="${this._location}"
        ></sunrise-sunset>

        <external-links
          class="grid-item grid-links"
          .region="${this._forecastPlace !== undefined
            ? this._forecastPlace.region
            : undefined}"
        ></external-links>

        <share-app class="grid-item grid-share"></share-app>

        <!--weather-section
          class="grid-item grid-cookies"
          padding
          liftedHeading="Kerätyt tiedot"
          pink
        >
          Palvelu ei käytä evästeitä. Sivuston kävijämäärä ja käyttäytyminen
          kerätään käyttäjää tunnistamatta eikä sinun tarvitse klikkailla
          turhia.
          <div slot="footer-left"></div>
          <div slot="footer-right">
            <svg-icon path="assets/image/icons.svg#cookie"></svg-icon>
          </div>
        </weather-section-->

        <!--public-holidays class="section section--calendar"></public-holidays-->
        <!--holiday-calendar class="section section--calendar"></holiday-calendar-->

        <weather-section
          class="grid-item grid-info"
          green
          padding
          liftedHeading="Sääennuste.fi"
        >
          <svg-icon
            medium
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

          <h3>Yksityisyys</h3>
          Palvelu ei käytä evästeitä. Sivuston kävijämäärä ja käyttäytyminen
          kerätään käyttäjää tunnistamatta eikä sinun tarvitse hyväksyä turhia
          käyttöehtoja.
          <div slot="footer-left"></div>
          <div slot="footer-right">
            <svg-icon path="assets/image/icons.svg#cookie"></svg-icon>
          </div>

          <h3>Palaute</h3>
          <p>
            Onko jokin rikki, puuttuuko ominaisuus tai onko sinulla idea miten
            parantaisit sovellusta? palaute@saaennuste.fi
          </p>
        </weather-section>

        <symbol-list class="grid-item grid-symbols"></symbol-list>

        <weather-section class="grid-item grid-copy" padding>
          <svg-icon path="assets/image/icons.svg#copyright"></svg-icon>
          <div>Säädata ja symbolit Ilmatieteen laitos</div>
        </weather-section>
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
