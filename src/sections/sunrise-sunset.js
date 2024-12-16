import { css, html, LitElement } from 'lit';

import '../common-components/smooth-expand';
import '../common-components/svg-icon';
import '../weather-section';
import { SunCalc } from '../data-helpers/suncalc-es6-fork.js';

class SunriseSunset extends LitElement {
  static get is() {
    return 'sunrise-sunset';
  }

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
        grid-template-columns: auto 1fr;
        grid-template-rows: auto auto;

        grid-template-areas:
          'sunset-value   sunset-label'
          'sunrise-value    sunrise-label';

        align-items: baseline;

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
        font-size: var(--font-size-m);

        padding-left: var(--space-m);
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

        justify-self: end;
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
        <div slot="header-right">
          ${SunriseSunset._getDay()} | vk ${SunriseSunset._getWeek()}
        </div>
        <div class="grid">
          <div class="sunset-value">${this._sunset}</div>
          <div class="sunset-label">aurinko laskee</div>

          <div class="sunrise-value">${this._sunrise}</div>
          <div class="sunrise-label">aurinko nousee</div>
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

  static get properties() {
    return {
      location: { type: Object },
      _darkestNight: { type: String },
      _dawn: { type: String },
      _goldenHour: { type: String },
      _goldenHourEnd: { type: String },
      _expanded: { type: Boolean },
      _nauticalDawn: { type: String },
      _nauticalDusk: { type: String },
      _night: { type: String },
      _nightEnd: { type: String },
      _sunrise: { type: String },
      _sunset: { type: String },
      _sunsetStart: { type: String },
      _solarNoon: { type: String },
    };
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

  static _getDay() {
    const now = new Date();
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    };
    const locale = 'fi-FI';

    return now.toLocaleDateString(locale, options);
  }

  static _getWeek() {
    const dt = new Date();
    const tdt = new Date(dt.valueOf());
    const dayn = (dt.getDay() + 6) % 7;
    tdt.setDate(tdt.getDate() - dayn + 3);
    const firstThursday = tdt.valueOf();
    tdt.setMonth(0, 1);
    if (tdt.getDay() !== 4) {
      tdt.setMonth(0, 1 + ((4 - tdt.getDay() + 7) % 7));
    }
    return 1 + Math.ceil((firstThursday - tdt) / 604800000);
  }
}
window.customElements.define(SunriseSunset.is, SunriseSunset);
