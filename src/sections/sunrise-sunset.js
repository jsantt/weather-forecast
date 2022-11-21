import { css, html, LitElement } from 'lit-element';

import '../common-components/smooth-expand.js';
import '../common-components/svg-icon.js';
import '../weather-section.js';
import 'suncalc';

class SunriseSunset extends LitElement {
  static get is() {
    return 'sunrise-sunset';
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }

      .arrow-svg {
        fill: var(--color-gray-600);
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
        color: var(--color-primary);
        text-decoration: none;
      }

      a:visited,
      a:hover {
        color: var(--color-primary);
      }

      .uv-index-svg {
        height: 24px;
        width: 24px;
        fill: var(--color-blue-700);
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
        margin-top: var(--space-l);
        margin-bottom: -0.5rem;
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

        margin-top: var(--space-m);
      }

      .more-space {
        margin-bottom: var(--space-m);
      }

      [slot='footer-right'] {
        white-space: nowrap;
      }
    `;
  }

  render() {
    return html`
      <weather-section>
        <div class="grid">
          <div class="sunset-value">${this._sunset}</div>
          <div class="sunset-label">aurinko laskee</div>

          <div class="sunrise-value">${this._sunrise}</div>
          <div class="sunrise-label">aurinko nousee</div>
        </div>

        <div slot="footer-left">
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
        <div slot="footer-right">
          <a href="#" @click="${e => this._toggleDetails(e)}">
            ${this._expanded ? 'näytä vähemmän' : 'näytä lisää'}
          </a>
        </div>
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
    const times = window.SunCalc.getTimes(
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
