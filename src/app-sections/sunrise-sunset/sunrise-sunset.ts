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
        font-size: var(--font-size-m);
        container-type: inline-size;
      }

      section {
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-template-columns: 1fr 1fr auto;
        align-items: stretch;
      }

      .uv {
        padding: var(--margin);
        display: grid;
        align-items: center;
        text-align: center;
        gap: var(--space-l);
      }

      @container (max-width: 27rem) {
        section {
          grid-template-columns: 1fr;
        }

        .uv {
          padding: var(--margin) 3rem;
        }
      }

      .uv-label {
        font-size: var(--font-size-s);
      }

      .uv-value {
        font-size: var(--font-size-xxl);
        font-weight: var(--font-weight-bold);
      }

      .times {
        padding: var(--margin);
      }

      .uv-low {
        background-color: var(--color-green);
        color: var(--color-dark);
      }
      .uv-medium {
        background-color: rgb(250, 228, 179);
        color: var(--color-dark);
      }

      .uv-high {
        background-color: rgb(245, 211, 199);
        color: var(--color-dark);
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

      .show-more,
      .show-less {
        font-size: var(--font-size-xs);
      }
      .show-less {
        display: block;
        margin-top: var(--space-l);
      }

      .bold {
        font-weight: var(--font-weight-bold);
      }
    `;
  }

  render() {
    return html`
      <weather-section liftedHeading="Aurinko" yellow>
        <section>
          <div
            class="${classMap({
              uv: true,
              'uv-low': (this.radiation?.uvi ?? 0) < 3,
              'uv-medium':
                (this.radiation?.uvi ?? 0) >= 3 &&
                (this.radiation?.uvi ?? 0) < 5,
              'uv-high': (this.radiation?.uvi ?? 0) >= 5,
            })}"
          >
            <div class="uv-label">
              <div>
                ${this.radiation ? 'UV-Indeksi' : 'UV-indeksi ei saatavilla'}
              </div>
              <div class="uv-place">${this.radiation?.place}</div>
            </div>

            <div class="uv-value">${this.radiation?.uvi}</div>
            <div class="uv-explanation">
              ${SunriseSunset.getUvMessage(this.radiation?.uvi)}
            </div>
          </div>
          <div class="times">
            ${this._expanded === false
              ? html`
                  <div class="grid">
                    <div class="label sunrise-label">
                      ${this._sunrise ? 'Aurinko nousee' : 'Aurinko ei nouse'}
                    </div>
                    <div class="value sunrise-value">${this._sunrise}</div>

                    <div class="label sunset-label">
                      ${this._sunset ? 'Aurinko laskee' : 'Aurinko ei laske'}
                    </div>
                    <div class="value sunset-value">${this._sunset}</div>
                  </div>
                  <a href="#" class="show-more" @click=${this._toggleDetails}
                    >Näytä enemmän</a
                  >
                `
              : html`
                  <div class="details">
                    <div>${this._darkestNight}</div>
                    <div>Pimeintä</div>

                    <div>${this._dawn}</div>
                    <div>Hämärä loppuu</div>

                    <div class="bold">${this._sunrise ?? '-'}</div>
                    <div class="bold">Aurinko nousee</div>

                    <div>${this._solarNoon}</div>
                    <div>Aurinko korkeimmillaan</div>

                    <div class="bold">${this._sunset ?? '-'}</div>
                    <div class="bold">Aurinko laskee</div>

                    <div>${this._dusk}</div>
                    <div>Hämärä alkaa</div>
                  </div>
                  <a href="#" class="show-less" @click=${this._toggleDetails}
                    >Näytä vähemmän
                  </a>
                `}
          </div>
        </section>
      </weather-section>
    `;
  }

  async updated() {
    if (this.location !== undefined) {
      this._updateSunsetSunrise();
    }
  }

  _toggleDetails(e: Event) {
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
      this._sunrise = undefined;
    } else {
      this._sunrise = SunriseSunset._formatTime(times.sunrise);
    }

    if (Number.isNaN(times.sunset.getMinutes())) {
      this._sunset = undefined;
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

  private static getUvMessage(uvi: number | undefined) {
    if (uvi === undefined) {
      return '';
    }

    if (uvi <= 2) {
      return 'UV-säteily on heikkoa, suojautumista ei tarvita';
    }

    if (uvi <= 3) {
      return 'UV-säteily on kohtalaista, harkitse aurinkosuojaa';
    }

    return 'UV-säteily on voimakasta, käytä aurinkosuojaa';
  }
}
window.customElements.define(SunriseSunset.is, SunriseSunset);
