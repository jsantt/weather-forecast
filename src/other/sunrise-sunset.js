import { css, html, LitElement } from 'lit-element';

import '../common/svg-icon.js';
import './footer-section.js';
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

      svg-icon {
        --height: 24px;
        --width: 24px;
        fill: var(--color-blue-700);
      }
    `;
  }

  render() {
    return html`
      <footer-section header="Aurinko">
        <div class="sun">
          <div class="sunrise">
            <svg width="40" height="27" xmlns="http://www.w3.org/2000/svg">
              <g>
                <rect
                  fill="none"
                  id="canvas_background"
                  height="29"
                  width="42"
                  y="-1"
                  x="-1"
                />
              </g>

              <g>
                <g id="weatherSymbol1">
                  <polygon
                    id="svg_1"
                    points="25.37457847595215,7.4070011377334595 27.577577590942383,11.612001061439514 31.702577590942383,9.266000390052795 31.280576705932617,13.993000626564026 36.020578384399414,14.250000596046448 33.110578536987305,18.000000596046448 36.9605770111084,20.778000473976135 32.48357582092285,22.36000120639801 34.22057914733887,26.775999665260315 29.60157585144043,25.688000321388245 28.671579360961914,30.343001008033752 25.37457847595215,26.929001450538635 22.075578689575195,30.343001008033752 21.1475772857666,25.688000321388245 16.52857780456543,26.775999665260315 18.26357650756836,22.36000120639801 13.788578033447266,20.778000473976135 17.636577606201172,18.000000596046448 14.728578567504883,14.250000596046448 19.466577529907227,13.993000626564026 19.04657745361328,9.266000390052795 23.171579360961914,11.612001061439514 "
                    fill="#ffa800"
                  />
                  <circle
                    id="svg_2"
                    r="6.362"
                    cy="18.738"
                    cx="25.37357"
                    stroke-width="1.3028"
                    stroke="#FFFFFF"
                    fill="#ffa800"
                  />
                </g>
                <ellipse
                  stroke="#fff"
                  ry="15.10393"
                  rx="17.90605"
                  id="svg_4"
                  cy="36.53806"
                  cx="19.43741"
                  fill="#3f976e"
                />
                <path
                  d="m3.03391,15.93057l4.8437,-7.18066l4.8437,7.18066l-2.42185,0l0,7.2152l-4.8437,0l0,-7.2152l-2.42185,0z"
                  stroke-width="0"
                />
              </g>
            </svg>
            ${this._sunrise}
          </div>

          <div>
            <svg width="39" height="27" xmlns="http://www.w3.org/2000/svg">
              <g>
                <rect
                  fill="none"
                  id="canvas_background"
                  height="29"
                  width="41"
                  y="-1"
                  x="-1"
                />
              </g>

              <g>
                <path
                  id="svg_3"
                  d="m27.65561,16.49653l4.8437,7.25316l4.8437,-7.25316l-2.42185,0l0,-7.28806l-4.8437,0l0,7.28806l-2.42185,0z"
                  stroke-width="0"
                />
                <g id="svg_8">
                  <polygon
                    id="svg_6"
                    points="13.624427795410156,12.156871795654297 15.827423095703125,16.361873626708984 19.952423095703125,14.015871047973633 19.530426025390625,18.74287223815918 24.270431518554688,18.9998722076416 21.360427856445312,22.7498722076416 25.210426330566406,25.52787208557129 20.733428955078125,27.109872817993164 22.470428466796875,31.52587127685547 17.851425170898438,30.4378719329834 16.921424865722656,35.092872619628906 13.624427795410156,31.678874969482422 10.325424194335938,35.092872619628906 9.397430419921875,30.4378719329834 4.778430938720703,31.52587127685547 6.513427734375,27.109872817993164 2.038433074951172,25.52787208557129 5.8864288330078125,22.7498722076416 2.978435516357422,18.9998722076416 7.7164306640625,18.74287223815918 7.296424865722656,14.015871047973633 11.421432495117188,16.361873626708984 "
                    fill="#ffa800"
                  />
                  <circle
                    id="svg_7"
                    r="6.362"
                    cy="23.48787"
                    cx="13.62343"
                    stroke-width="1.3028"
                    stroke="#FFFFFF"
                    fill="#ffa800"
                  />
                </g>
                <ellipse
                  stroke="#fff"
                  ry="15.10393"
                  rx="17.90605"
                  id="svg_9"
                  cy="35.28807"
                  cx="18.56174"
                  fill="#3f976e"
                />
              </g>
            </svg>

            ${this._sunset}
          </div>
        </div>

        ${this._solarNoon} aurinko korkeimmillaan<br />
        ${this._darkestNight} pimeintä (aurinko matalimmillaan)<br />

        <div slot="footer-left"></div>
        <div slot="footer-right">
          <svg-icon path="assets/image/icons.svg#uvIndex"></svg-icon>
          <a href="https://www.ilmatieteenlaitos.fi/uvi-ennuste">
            UV-indeksi
          </a>
        </div>
      </footer-section>
    `;
  }

  static get properties() {
    return {
      coordinates: { type: String },
      _sunrise: { type: String },
      _sunset: { type: String },
      _solarNoon: { type: String },
      _darkestNight: { type: String },
    };
  }

  updated() {
    if (this.coordinates !== undefined) {
      this._updateSunsetSunrise();
    }
  }

  _updateSunsetSunrise() {
    const coordinatesArray = this.coordinates.split(',');
    const latitude = coordinatesArray[0];
    const longitude = coordinatesArray[1];

    const times = SunCalc.getTimes(new Date(), latitude, longitude);
    if (Number.isNaN(times.sunrise.getMinutes())) {
      this._sunrise = 'ei tänään';
    } else {
      this._sunrise = this._formatTime(times.sunrise);
    }

    if (Number.isNaN(times.sunset.getMinutes())) {
      this._sunset = 'ei huomenna';
    } else {
      this._sunset = this._formatTime(times.sunset);
    }

    this._solarNoon = this._formatTime(times.solarNoon);
    this._darkestNight = this._formatTime(times.nadir);
  }

  _formatTime(time) {
    const minutes = time.getMinutes();
    const fullMinutes = minutes < 10 ? `0${minutes}` : minutes;

    return `${time.getHours()}.${fullMinutes}`;
  }
}
window.customElements.define(SunriseSunset.is, SunriseSunset);
