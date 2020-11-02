import { css, html, LitElement } from 'lit-element';

import '../common/svg-icon.js';
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

      .sunrise-svg,
      .sunset-svg {
        width: 39px;
        height: 27px;
      }

      .text {
        font-size: var(--font-size-m);
      }
    `;
  }

  render() {
    return html`
      <weather-section header="Aurinko">
        <div class="sun">
          <div class="sunrise">
            <svg-icon
              class="sunrise-svg"
              path="assets/image/icons.svg#sunrise"
            ></svg-icon>
            ${this._sunrise}
          </div>

          <div>
            <svg-icon
              class="sunset-svg"
              path="assets/image/icons.svg#sunset"
            ></svg-icon>
            ${this._sunset}
          </div>
        </div>

        <div class="text">
          ${this._solarNoon} aurinko korkeimmillaan<br />
          ${this._darkestNight} pimeintä (aurinko matalimmillaan)<br />
        </div>

        <div slot="footer-left"></div>
        <div slot="footer-right">
          <svg-icon
            class="uv-index-svg"
            path="assets/image/icons.svg#uvIndex"
          ></svg-icon>
          <a href="https://www.ilmatieteenlaitos.fi/uvi-ennuste">
            UV-indeksi
          </a>
        </div>
      </weather-section>
    `;
  }

  static get properties() {
    return {
      location: { type: Object },
      _sunrise: { type: String },
      _sunset: { type: String },
      _solarNoon: { type: String },
      _darkestNight: { type: String },
    };
  }

  updated() {
    if (this.location !== undefined) {
      this._updateSunsetSunrise();
    }
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
  }

  static _formatTime(time) {
    const minutes = time.getMinutes();
    const fullMinutes = minutes < 10 ? `0${minutes}` : minutes;

    return `${time.getHours()}.${fullMinutes}`;
  }
}
window.customElements.define(SunriseSunset.is, SunriseSunset);
