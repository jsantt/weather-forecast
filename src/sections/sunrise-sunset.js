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
        color: var(--color-blue-500);
      }

      a:visited,
      a:hover {
        color: var(--color-blue-700);
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
        grid-template-columns: 1fr 1fr;
        grid-template-rows: auto auto;

        grid-template-areas:
          'sunrise-header   sunset-header'
          'sunrise-value    sunset-value';

        margin-bottom: var(--space-m);
      }

      .sunrise-header {
        grid-area: sunrise-header;
      }

      .sunset-header {
        grid-area: sunset-header;
      }

      .sunrise-value {
        grid-area: sunrise-value;
      }

      .sunset-value {
        grid-area: sunset-value;
      }

      .sunrise-value,
      .sunset-value {
        font-size: var(--font-size-xxl);
        font-weight: var(--font-weight-bold);
      }

      [slot='footer-right'] {
        white-space: nowrap;
      }
    `;
  }

  render() {
    return html`
      <weather-section header="Aurinko">
        <div class="grid">
          <div class="sunrise">Aurinko nousee</div>
          <div class="sunrise-value">${this._sunrise}</div>

          <div class="sunset">Aurinko laskee</div>
          <div class="sunset-value">${this._sunset}</div>
        </div>
        <div class="text">
          ${this._solarNoon} aurinko korkeimmillaan<br />
          ${this._darkestNight} aurinko matalimmillaan<br />
        </div>

        <div slot="footer-left">
          <a href="#" @click="${e => this._toggleDetails(e)}">
            ${this._expanded ? 'näytä vähemmän' : 'näytä lisää'}
          </a>
          <smooth-expand ?expanded="${this._expanded}">
            <div>
              <br />
              <div>${this._nightEnd} yö loppuu</div>
              <div>${this._nauticalDawn} hämärä alkaa</div>
              <div>${this._sunrise} aurinko nousee</div>
              <div>${this._goldenHourEnd} aamun kultainen hetki päättyy</div>
              <br />

              <div>${this._solarNoon} aurinko korkeimmillaan</div>
              <br />
              <div>${this._goldenHour} illan kultainen hetki alkaa</div>
              <div>${this._sunsetStart} auringon lasku alkaa</div>
              <div>${this._sunset} aurinko laskee</div>
              <div>${this._dusk} hämärä alkaa</div>
              <div>${this._nauticalDusk} tähtitieteellinen hämärä alkaa</div>
              <div>${this._night} yö alkaa</div>
              <br />
              <div>${this._darkestNight} aurinko matalimmillaan (pimeintä)</div>
            </div>
          </smooth-expand>
        </div>
        ${this._expanded
          ? ''
          : html` <div slot="footer-right">
              <svg-icon
                class="uv-index-svg"
                path="assets/image/icons.svg#uvIndex"
              ></svg-icon>
              <a href="https://www.ilmatieteenlaitos.fi/uvi-ennuste">
                UV-indeksi
              </a>
            </div>`}
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
    const minutes = time.getMinutes();
    const fullMinutes = minutes < 10 ? `0${minutes}` : minutes;

    return `${time.getHours()}.${fullMinutes}`;
  }
}
window.customElements.define(SunriseSunset.is, SunriseSunset);
