import { css, html, LitElement } from 'lit';
import { SunCalc } from './suncalc-es6-fork.js';
import { LocationCoordinates } from '../forecast-header/station-map.js';
import '../../common-components/expand-icon.js';

import { property, state } from 'lit/decorators.js';
import { Radiation } from '../../backend-calls/observation-data/radiation-data.js';
import { classMap } from 'lit/directives/class-map.js';

class SunriseSunset extends LitElement {
  static get is() {
    return 'sunrise-sunset';
  }

  @property({ type: Object })
  location?: LocationCoordinates;

  @property({ type: Object })
  radiation?: Radiation;

  @state()
  _darkestNight?: string;

  @state()
  _dawn?: string;

  @state()
  _dusk?: string;

  @state()
  _goldenHour?: string;

  @state()
  _goldenHourEnd?: string;

  @state()
  _expanded: boolean = false;

  @state()
  _nauticalDawn?: string;

  @state()
  _nauticalDusk?: string;

  @state()
  _night?: string;

  @state()
  _nightEnd?: string;

  @state()
  _sunrise?: string;

  @state()
  _sunset?: string;

  @state()
  _sunsetStart?: string;

  @state()
  _solarNoon?: string;

  static get styles() {
    return css`
      :host {
        /* to stretch inside grid */
        display: grid;
        font-size: var(--font-size-m);
      }

      .arrow-svg {
        fill: var(--color-dark-and-light);
        height: 36px;
      }

      .sun {
        display: flex;
        margin-bottom: 1rem;
      }

      .sunrise {
        margin-right: 2rem;
      }

      a:link {
        color: var(--color-light-and-dark);
        text-decoration: none;
      }

      .expand {
        display: flex;
        justify-items: center;
        padding: var(--space-m) 0;
      }

      expand-icon {
        color: var(--color-secondary-dark-and-light);
        padding-right: 0.75rem;
        margin-left: auto;
      }

      a:visited,
      a:hover {
        color: var(--color-dark-and-light);
      }

      .text {
        margin-top: var(--space-l);
      }

      .grid {
        display: grid;
        align-items: center;
        grid-template-columns: auto 1fr;
        grid-template-rows: auto auto;

        grid-template-areas:
          'sunrise-label sunrise-label'
          'sunrise-value sunrise-value'
          'sunset-label  sunset-label'
          'sunset-value  sunset-value'
          'expand        expand';

        gap: var(--space-s) var(--space-l);
      }

      .sunrise-label {
        grid-area: sunrise-label;
      }

      .sunset-label {
        grid-area: sunset-label;
      }

      .label {
        font-size: var(--font-size-s);
      }

      .sunrise-value {
        grid-area: sunrise-value;
      }

      .sunset-value {
        grid-area: sunset-value;
      }

      .value,
      .value {
        font-size: var(--font-size-xl);
        font-weight: var(--font-weight-bold);
      }

      .expand {
        grid-area: expand;
      }

      .details {
        display: grid;
        grid-template-columns: auto 1fr;
        grid-template-rows: auto auto;
        grid-gap: var(--space-s);
      }

      .uv-value {
        display: inline-block;
        margin: var(--space-s) 0;
        padding: var(--space-s);
        border-radius: 0.5rem;
      }

      .uv-low {
        background-color: var(--color-green);
      }
      .uv-medium {
        background-color: var(--color-yellow);
      }

      .uv-high {
        background-color: var(--color-pink);
      }

      .more-space {
        margin-bottom: var(--space-l);
      }

      .hide {
        display: none;
      }
    `;
  }

  render() {
    return html`
      <weather-section liftedHeading="Aurinko" padding yellow>
      <div class="label hide">UV-indeksi (${this.radiation?.place})</div>
      <div class="${classMap({
        hide: true,
        value: true,
        'uv-value': true,
        'uv-low': (this.radiation?.uvi ?? 0) < 3,
        'uv-medium':
          (this.radiation?.uvi ?? 0) >= 3 && (this.radiation?.uvi ?? 0) < 4,
        'uv-high': (this.radiation?.uvi ?? 0) >= 5,
      })}">${this.radiation?.uvi}</div>
      <smooth-expand ?expanded="${!this._expanded}">
      <div class="details">
        <div class="grid">
          <div class="value sunrise-value">${this._sunrise}</div>
          <div class="label sunrise-label">Aurinko nousee</div>
       
          <div class="value sunset-value">${this._sunset}</div>
          <div class="label sunset-label">Aurinko laskee</div>
           
        </div>
        </div></smooth-expand>
          <smooth-expand ?expanded="${this._expanded}">
            <div class="details">

              <div>${this._darkestNight}</div>
              <div>aurinko matalimmillaan (pimeintä)</div>

              <div>${this._dawn}</div>
              <div>hämärä loppuu</div>

              <div>${this._sunrise}</div>
              <div class="more-space">aurinko nousee</div>

              

              <div>${this._solarNoon}</div>
              <div class="more-space">aurinko korkeimmillaan</div>

             
              <div>${this._sunset}</div>
              <div>aurinko laskee</div>

              <div>${this._dusk}</div>
              <div class="more-space">hämärä alkaa</div>

       
            </div>
          </smooth-expand>

          <a href="#" class="expand" @click="${(e) => this._toggleDetails(e)}">
           ${this._expanded ? `Näytä vähemmän` : `Näytä lisää`}<expand-icon
            ?open="${this._expanded}"
          ></expand-icon>
          </a>

        </div>
      </weather-section>
    `;
  }

  async updated() {
    if (this.location !== undefined) {
      this._updateSunsetSunrise();
    }
  }

  _toggleDetails(e) {
    e.preventDefault();
    this._expanded = !this._expanded;
  }

  _updateSunsetSunrise() {
    if (!this.location) {
      return;
    }

    const times = SunCalc.getTimes(
      new Date(),
      this.location.lat,
      this.location.lon
    );
    if (Number.isNaN(times.sunrise.getMinutes())) {
      this._sunrise = 'ei tänään';
    } else {
      this._sunrise = SunriseSunset._formatTime(times.sunrise);
    }

    if (Number.isNaN(times.sunset.getMinutes())) {
      this._sunset = 'ei huomenna';
    } else {
      this._sunset = SunriseSunset._formatTime(times.sunset);
    }

    this._solarNoon = SunriseSunset._formatTime(times.solarNoon);
    this._darkestNight = SunriseSunset._formatTime(times.nadir);

    this._goldenHour = SunriseSunset._formatTime(times.goldenHour);
    this._goldenHourEnd = SunriseSunset._formatTime(times.goldenHourEnd);

    this._solarNoon = SunriseSunset._formatTime(times.solarNoon);

    this._sunsetStart = SunriseSunset._formatTime(times.sunsetStart);

    this._dusk = SunriseSunset._formatTime(times.dusk);
    this._night = SunriseSunset._formatTime(times.night);
    this._nightEnd = SunriseSunset._formatTime(times.nightEnd);
    this._nauticalDawn = SunriseSunset._formatTime(times.nauticalDawn);
    this._nauticalDusk = SunriseSunset._formatTime(times.nauticalDusk);
    this._dawn = SunriseSunset._formatTime(times.dawn);
  }

  static _formatTime(time) {
    if (time.toString() === 'Invalid Date') {
      return '-';
    }

    const minutes = time.getMinutes();
    const fullMinutes = minutes < 10 ? `0${minutes}` : minutes;

    return `${time.getHours()}.${fullMinutes}`;
  }
}
window.customElements.define(SunriseSunset.is, SunriseSunset);
