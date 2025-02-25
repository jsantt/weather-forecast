import { css, html, LitElement } from 'lit';

import { getTime } from './data-helpers/time.ts';

import './forecast-data.ts';
import './observation-data.ts';

import './sections/forecast-header/top-bar.ts';
import './sections/forecast-header/location-selector.ts';

import './weather-section.ts';

import './sections/forecast-header/forecast-header.ts';

import './sections/bottom-sheet/bottom-sheet.ts';
import { state } from 'lit/decorators.js';
import { LocationCoordinates } from './sections/forecast-header/station-map.ts';
import('./sections/external-links.js');

import('./sections/sunrise-sunset');
import('./sections/weather-info.ts');

import('./sections/symbol-list.js');
import('./sections/weather-days/weather-days.ts');
import('./sections/share-app.js');
import('./common-components/error-notification.js');
import('./sections/app-copyright.ts');

class WeatherApp extends LitElement {
  static get is() {
    return 'weather-app';
  }

  @state()
  _darkMode: boolean = false;

  @state()
  _firstLoading: boolean = false;

  @state()
  _forecastData?: any[];

  @state()
  _forecastError: boolean = false;

  @state()
  _forecastPlace?: { region: string };

  @state()
  _largeMap: boolean = true;

  @state()
  _loading: boolean = false;

  @state()
  _location?: LocationCoordinates;

  @state()
  _showFeelsLike: boolean = false;

  @state()
  _showWind: boolean = false;

  @state()
  _observationData?: any[];

  @state()
  _observationError: boolean = false;

  static get styles() {
    return css`
      :host {
        --header-background-expand: 1rem;

        display: flex;
        justify-content: center;
      }

      error-notification {
        height: 83%;
      }

      div[hidden] {
        visibility: hidden;
      }

      .by {
        font-size: var(--font-size-s);
        border-radius: 0;
        text-align: center;
        margin-top: var(--space-l);
      }

      .grid-container {
        display: grid;
        grid-template-columns: minmax(330px, 450px);
        gap: var(--space-l);

        max-width: 1500px;

        padding-bottom: 5rem;
        padding-left: var(--margin);
        padding-right: var(--margin);

        padding-top: 1.5rem;
      }

      .grid-header {
        padding-bottom: var(--space-l);
      }

      .grid-item {
        display: grid;
      }

      .grid-map,
      .grid-forecast {
        --padding-panel: 0;
      }

      .grid-copy {
        text-align: center;
      }

      @media only screen and (min-width: 800px) {
        .grid-container {
          grid-template-columns: minmax(350px, 450px) minmax(200px, 250px) !important;
          grid-template-areas:
            'header header'
            'location location'
            'map sun'
            'map sun'
            'map links'
            'map links'
            'map share'
            'forecast share'
            'forecast info'
            'symbols symbols'
            'copy copy';

          padding-top: var(--space-xl);
        }

        .grid-header {
          grid-area: header;
        }

        .grid-location {
          grid-area: location;
          align-self: end;
        }

        .grid-map {
          grid-area: map;
        }

        .grid-forecast {
          grid-area: forecast;
        }

        .grid-sun {
          grid-area: sun;
        }

        .grid-links {
          grid-area: links;
        }

        .grid-info {
          grid-area: info;
        }

        .grid-share {
          grid-area: share;
        }

        .grid-symbols {
          grid-area: symbols;
        }

        .grid-copy {
          grid-area: copy;
        }
      }
      @media only screen and (min-width: 1100px) {
        .grid-container {
          grid-template-columns: minmax(350px, 450px) minmax(200px, 250px) minmax(
              200px,
              250px
            ) !important;
          grid-template-areas:
            'header location location'
            'map info sun'
            'map info links'
            'map info share'
            'forecast forecast forecast'
            'symbols symbols symbols'
            'copy copy copy';

          padding-top: 3rem;
        }
        .grid-header,
        .grid-location {
          padding-bottom: 3rem;
        }
      }
    `;
  }

  render() {
    return html`
      <!-- Observation / weather station data -->
      <observation-data .place="${this._forecastPlace}"> </observation-data>
      <forecast-data .location="${this._location}"> </forecast-data>

      <bottom-sheet
        ?largeMap="${this._largeMap}"
        ?showFeelsLike="${this._showFeelsLike}"
        ?showWind="${this._showWind}"
        ?darkMode="${this._darkMode}"
        @location-selector.location-changed=${(ev: CustomEvent) =>
          this.locationChanged(ev)}
      ></bottom-sheet>

      <div class="grid-container">
        <top-bar class="grid-item grid-header"></top-bar>
        <location-selector
          class="grid-item grid-location"
          .loading="${this._loading}"
          .place="${this._forecastPlace}"
          @location-selector.location-changed=${(ev: CustomEvent) =>
            this.locationChanged(ev)}
        >
        </location-selector>

        <weather-section
          transparent
          blue
          class="grid-item grid-map"
          .padding=${false}
          liftedHeading=${`Klo ${getTime(new Date())} havainnot`}
        >
          <slot name="place"></slot>
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
        </weather-section>

        <weather-section
          pink
          transparent
          class="grid-item grid-forecast"
          liftedHeading="Ilmatieteen laitoksen ennuste"
          ?padding=${false}
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

        <weather-info class="grid-item grid-info"></weather-info>

        <symbol-list class="grid-item grid-symbols"></symbol-list>

        <app-copyright class="grid-item grid-copy"> </app-copyright>
      </div>
    `;
  }

  locationChanged(event: CustomEvent) {
    this._location = { ...event.detail };
  }

  constructor() {
    super();

    if (window.location.href.includes('beta')) {
      window.localStorage.setItem('beta', 'true');
    }

    // forecast data
    this.addEventListener('forecast-data.fetching', () => {
      this._loading = true;
    });

    this.addEventListener('forecast-data.fetch-done', () => {
      this._fetchDone();
      this._loading = false;
      this._firstLoading = false;
    });

    this.addEventListener('forecast-data.new-data', ((event: CustomEvent) => {
      this._forecastError = false;
      this._forecastData = event.detail;
    }) as EventListener);

    this.addEventListener('forecast-data.new-place', ((event: CustomEvent) => {
      this._forecastPlace = event.detail;
    }) as EventListener);

    this.addEventListener('forecast-data.fetch-error', () => {
      this._forecastError = true;
    });

    // observation data

    this.addEventListener('observation-data.new-data', ((
      event: CustomEvent
    ) => {
      this._observationError = false;
      this._observationData = event.detail;
    }) as EventListener);

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

    this.addEventListener('station-map.selected', ((e: CustomEvent) => {
      this._stationSelected(e);
    }) as EventListener);

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
  _stationSelected(event: CustomEvent<number>) {
    if (!this._observationData) {
      return;
    }

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
