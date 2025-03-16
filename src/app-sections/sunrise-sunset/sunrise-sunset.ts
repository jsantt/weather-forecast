import { css, html, LitElement } from 'lit';
import { SunCalc } from './suncalc-es6-fork.js';
import { LocationCoordinates } from '../forecast-header/station-map.ts';
import { property, state } from 'lit/decorators.js';

class SunriseSunset extends LitElement {
  static get is() {
    return 'sunrise-sunset';
  }

  @property({ type: Object })
  location?: LocationCoordinates;

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

      .expand-icon {
        height: 16px;
        width: 16px;
        margin-right: var(--space-m);
        transition: transform var(--transition-time) ease;
      }

      .expand-icon--open {
        transform: scaleY(-1);
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
          'sunrise-value   sunrise-value'
          'sunset-label    sunset-label'
          'sunset-value    sunset-value';

        gap: var(--space-s) var(--space-l);

        margin-bottom: 1.5rem;
      }

      .sunrise-label {
        grid-area: sunrise-label;
      }

      .sunset-label {
        grid-area: sunset-label;
      }

      .sunrise-label,
      .sunset-label {
        font-size: var(--font-size-s);
      }

      .sunrise-value {
        grid-area: sunrise-value;
      }

      .sunset-value {
        grid-area: sunset-value;
      }

      .sunrise-value,
      .sunset-value {
        font-size: var(--font-size-xl);
        font-weight: var(--font-weight-bold);
      }

      .details {
        display: grid;
        grid-template-columns: auto 1fr;
        grid-template-rows: auto auto;
        grid-gap: var(--space-s);
        margin-bottom: var(--space-l);
      }

      .more-space {
        margin-bottom: var(--space-m);
      }
    `;
  }

  render() {
    return html`
      <weather-section liftedHeading="Aurinko" padding yellow>
        <div class="grid">
          <div class="sunrise-value">${this._sunrise}</div>
          <div class="sunrise-label">Aurinko nousee</div>
       
          <div class="sunset-value">${this._sunset}</div>
          <div class="sunset-label">Aurinko laskee</div>
        </div>
          <smooth-expand ?expanded="${this._expanded}">
            <div class="details">
              <div>${this._nightEnd}</div>
              <div>yö loppuu</div>

              <div>${this._dawn}</div>
              <div>hämärä loppuu</div>

              <div>${this._sunrise}</div>
              <div>aurinko nousee</div>

              <div>${this._goldenHourEnd}</div>
              <div class="more-space">kultainen hetki päättyy</div>

              <div>${this._solarNoon}</div>
              <div class="more-space">aurinko korkeimmillaan</div>

              <div>${this._goldenHour}</div>
              <div>kultainen hetki alkaa</div>

              <div>${this._sunset}</div>
              <div>aurinko laskee</div>

              <div>${this._dusk}</div>
              <div>hämärä alkaa</div>

              <div>${this._night}</div>
              <div class="more-space">yö alkaa</div>

              <div>${this._darkestNight}</div>
              <div>aurinko matalimmillaan (pimeintä)</div>
            </div>
          </smooth-expand>
        </div>
        <a href="#" @click="${(e) => this._toggleDetails(e)}">
          <svg-icon
            class="expand-icon ${this._expanded ? 'expand-icon--open' : ''}"
            path="assets/image/icons.svg#caret-down"
          ></svg-icon>
          ${this._expanded ? `Näytä vähemmän` : `Näytä lisää`}
        </a>
      </weather-section>
    `;
  }

  updated() {
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
