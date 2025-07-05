import { css, html, LitElement } from 'lit';

import { state } from 'lit/decorators.js';
import { LocationCoordinates } from '../forecast-header/station-map.ts';
import { Forecast } from '../../backend-calls/forecast-data/forecast-data.ts';
import {
  Place,
  Station,
} from '../../backend-calls/observation-data/observation-data.ts';
import {
  updateJsonLdObservations,
  updateJsonSiteInfo,
} from '../json-ld/json-ld-updater.ts';

import '../../backend-calls/forecast-data/forecast-data.ts';
import '../../backend-calls/observation-data/observation-data.ts';
import '../forecast-header/top-bar.ts';
import '../forecast-header/location-selector.ts';
import '../weather-section/weather-section.ts';
import '../forecast-header/forecast-header.ts';
import '../bottom-sheet/bottom-sheet.ts';
import {
  getRadiationData,
  Radiation,
} from '../../backend-calls/observation-data/radiation-data.ts';

import('../external-links/external-links.js');
import('../sunrise-sunset/sunrise-sunset.ts');
import('../weather-info/weather-info.ts');
import('../../app-sections/symbol-list/symbol-list.ts');
import('../weather-days/weather-days.ts');

import('../../common-components/error-notification.js');
import('../app-copyright/app-copyright.ts');

class WeatherApp extends LitElement {
  static get is() {
    return 'weather-app';
  }

  @state()
  _darkMode: boolean = false;

  @state()
  _firstLoading: boolean = false;

  @state()
  _forecast?: Forecast[];

  @state()
  _forecastError: boolean = false;

  @state()
  _forecastPlace?: Place;

  @state()
  _showDetails: boolean = false;

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

  @state()
  _radiation?: Radiation;

  static get styles() {
    return css`
      :host {
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
        border-radius: 0;
        font-size: var(--font-size-s);

        line-height: 0.9;
        text-align: center;
        margin-top: var(--space-l);
        margin-bottom: var(--space-m);
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
          grid-template-areas:
            'header header'
            'location sun'
            'map sun'
            'map links'
            'map info'
            'map info'
            'forecast info'
            'forecast info'
            'forecast info'
            'symbols symbols'
            'copy copy';

          padding-top: var(--space-xl);
        }

        .grid-header {
          grid-area: header;
          padding-bottom: var(--space-m);
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

        .grid-symbols {
          grid-area: symbols;
        }

        .grid-copy {
          grid-area: copy;
        }
      }
      @media only screen and (min-width: 1100px) {
        .grid-container {
          max-width: 1000px;
          grid-template-columns: 6fr 4fr 4fr !important;
          grid-template-areas:
            'header header header '
            'location sun links'
            'map sun links'
            'map info info  '
            'map info info '
            'forecast info info '
            'forecast info info '
            'symbols symbols symbols '
            'copy copy copy ';
        }
      }
    `;
  }

  private onFetchDone() {
    this._firstLoading = false;
    this._loading = false;
    this._firstLoading = false;
  }

  private onNewData(event: CustomEvent<Forecast[]>) {
    this._forecastError = false;
    this._forecast = event.detail;
  }

  render() {
    return html`
      <!-- Observation / weather station data -->
      <observation-data .place="${this._forecastPlace}"> </observation-data>
      <forecast-data
        .location="${this._location}"
        @forecast-data.fetching=${() => {
          this._loading = true;
        }}
        @forecast-data.fetch-done=${this.onFetchDone}
        @forecast-data.new-data=${((event: CustomEvent<Forecast[]>) => {
          this.onNewData(event);
        }) as EventListener}
        @forecast-data.new-place=${((event: CustomEvent) => {
          this._forecastPlace = event.detail;
        }) as EventListener}
        @forecast-data.fetch-error=${() => {
          this._forecastError = true;
        }}
      >
      </forecast-data>

      <bottom-sheet
        ?showDetails="${this._showDetails}"
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
        >
          <slot name="place"></slot>
          <forecast-header
            ?showDetails="${this._showDetails}"
            ?loading="${this._loading}"
            .location="${this._location}"
            .observationData="${this._observationData}"
            ?observationError="${this._observationError}"
            ?showFeelsLike="${this._showFeelsLike}"
            ?showWind="${this._showWind}"
          >
          </forecast-header>
          <div class="by">
            <div>Ilmatieteen laitoksen avoin data</div>

            <object
              width="130"
              height="39"
              data="./assets/image/il-avoin-data-logo-rgb.svg"
              aria-label="Ilmatieteen laitoksen avoin data logo"
            ></object>
          </div>
        </weather-section>

        <weather-section
          pink
          transparent
          class="grid-item grid-forecast"
          liftedHeading="Meteorologin ennuste"
          ?padding=${false}
        >
          <!-- today, tomorrow and a day after tomorrow -->
          <slot name="header"></slot>

          <weather-days
            .forecast="${this._forecast}"
            ?showFeelsLike="${this._showFeelsLike}"
            ?showWind="${this._showWind}"
          >
          </weather-days>
        </weather-section>

        <sunrise-sunset
          class="grid-item grid-sun"
          .location="${this._location}"
          .radiation=${this._radiation}
        ></sunrise-sunset>

        <external-links
          class="grid-item grid-links"
          .region="${this._forecastPlace !== undefined
            ? this._forecastPlace.region
            : undefined}"
        ></external-links>

        <weather-info class="grid-item grid-info"></weather-info>

        <symbol-list class="grid-item grid-symbols"></symbol-list>

        <app-copyright class="grid-item grid-copy"> </app-copyright>
      </div>
    `;
  }

  async locationChanged(event: CustomEvent) {
    this._location = { ...event.detail };

    if (this._location) {
      this._radiation = await getRadiationData(this._location);
      //updateJsonLdRadiation(this._radiation)
    }
  }

  constructor() {
    super();

    if (location.href.includes('localhost')) {
      localStorage.setItem('umami.disabled', '1');
    }

    if (window.location.href.includes('beta')) {
      window.localStorage.setItem('beta', 'true');
    }

    // observation data

    this.addEventListener('observation-data.new-data', ((
      event: CustomEvent<Station[]>
    ) => {
      this._observationError = false;
      this._observationData = event.detail;
      updateJsonSiteInfo();
      updateJsonLdObservations(event.detail);
    }) as EventListener);

    this.addEventListener('observation-data.fetch-error', (() => {
      this._observationError = true;
    }) as EventListener);

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
    this._showDetails = !this._showDetails;
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
