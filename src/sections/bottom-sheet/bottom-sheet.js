import { css, html, LitElement } from 'lit-element';

import { isSafari, isPortableApple, isWebView } from './browser-detector.js';
import { isState, setState, STATE } from '../../common-utils/state.js';

import {
  track,
  INSTALL_CLICKED,
  INSTALL_CANCELLED,
  INSTALLED,
  GEOLOCATE,
} from '../../common-utils/tracker.js';
import './bottom-notification.js';
import '../../common-components/svg-icon.js';

class BottomSheet extends LitElement {
  static get is() {
    return 'bottom-sheet';
  }

  static get styles() {
    return css`
      :host {
        --color: var(--color-blue-700);

        display: block;
        background: var(--color-gray-300);

        border-top-left-radius: 0.75rem;
        border-top-right-radius: 0.75rem;

        border-top: 1px solid var(--color-gray-300);
        box-shadow: var(--box-shadow-upwards);

        margin-left: var(--space-m);
        margin-right: var(--space-m);

        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;

        z-index: var(--z-index-floating-1);
      }

      nav {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
        grid-template-rows: auto;

        max-width: 500px;
        margin: 0 auto;
      }

      button {
        background: none;
        border: none;
        color: var(--color);

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-end;

        fill: var(--color);
        font-family: var(--font-family-primary);
        font-size: var(--font-size-s);
        font-weight: var(--font-weight-bold);

        height: 100%;

        text-align: center;
        margin: 0 auto;
        padding: var(--space-s);

        /* prevent double tab zooming on bottom bar component*/
        touch-action: manipulation;

        width: 100%;
      }

      button:hover {
        cursor: pointer;
      }

      button:focus {
        outline: none;
      }

      button:active .locate-icon {
        filter: none;
      }

      :host([showFeelsLike]) .feelsLike,
      :host([showWind]) .wind {
        border-top: 3px solid var(--color-blue-700);
      }

      :host([showFeelsLike]) .feelsLike-icon,
      :host([showWind]) .wind-icon {
        margin-top: -3px;
      }

      .locate-icon {
        position: absolute;
        bottom: 1.3rem;
        left: 0;

        filter: drop-shadow(0px 3px 4px rgba(0, 0, 0, 0.3));
        transition: all var(--transition-time) var(--transition-cubic-bezier);
      }

      :host([_locating]) .locate-icon {
        top: -100px;
        transform: scale(2);
      }

      .small-icon {
        fill: var(--color-blue-700);

        filter: drop-shadow(rgba(0, 0, 0, 0.3) 0px 3px 4px);

        height: 20px;
        width: 20px;
        padding: var(--space-s) var(--space-s) 0 var(--space-s);
      }

      .error {
        color: var(--color-blue-700);
        font-size: var(--font-size-m);
        font-weight: var(--font-weight-boldest);
        padding: var(--space-m) var(--space-m) var(--space-l) var(--space-m);
        text-align: center;

        border-top-left-radius: 0.75rem;
        border-top-right-radius: 0.75rem;
      }

      .position-anchor {
        position: relative;
      }

      .notification {
        background: var(--color-red-500);
        border-radius: 50%;

        color: var(--color-white);
        font-size: var(--font-size-xs);

        width: 1rem;
        height: 1rem;

        padding-bottom: 1px;

        position: absolute;
        top: 0;
        right: -0.35rem;
      }
    `;
  }

  render() {
    return html`
      <bottom-notification
        .errorText=${this._notification}
        ?showInstall=${this._installAdOpen}
        ?ios="${this._ios}"
      >
      </bottom-notification>

      <nav>
        ${this._installButtonVisible === false
          ? html` <button @click="${this._toggleMapSize}">
              ${this.largeMap === true
                ? html`
                    <svg
                      class="small-icon"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 448 512"
                    >
                      <path
                        fill="currentColor"
                        d="M4.686 427.314L104 328l-32.922-31.029C55.958 281.851 66.666 256 88.048 256h112C213.303 256 224 266.745 224 280v112c0 21.382-25.803 32.09-40.922 16.971L152 376l-99.314 99.314c-6.248 6.248-16.379 6.248-22.627 0L4.686 449.941c-6.248-6.248-6.248-16.379 0-22.627zM443.314 84.686L344 184l32.922 31.029c15.12 15.12 4.412 40.971-16.97 40.971h-112C234.697 256 224 245.255 224 232V120c0-21.382 25.803-32.09 40.922-16.971L296 136l99.314-99.314c6.248-6.248 16.379-6.248 22.627 0l25.373 25.373c6.248 6.248 6.248 16.379 0 22.627z"
                      />
                    </svg>
                  `
                : html`
                    <svg-icon
                      class="small-icon"
                      path="assets/image/icons.svg#expand"
                    ></svg-icon>
                  `}
              <div class="button-text">havainnot</div>
            </button>`
          : html`
              <button @click="${this._showInstallAd}">
                <div class="position-anchor">
                  <svg-icon
                    class="small-icon"
                    path="assets/image/icons.svg#add"
                  ></svg-icon>
                  ${this._installBadgeVisible === true
                    ? html` <div class="notification">1</div>`
                    : ''}
                </div>

                <div class="button-text">asenna</div>
              </button>
            `}

        <button @click="${this._toggleFeelsLike}" class="feelsLike">
          <svg-icon
            class="small-icon feelsLike-icon"
            path="assets/image/icons.svg#feelsLike"
          ></svg-icon>
          <div class="button-text">tuntuu</div>
        </button>

        <button @click="${this._geolocate}">
          <div class="position-anchor">
            <svg-icon
              class="locate-icon"
              path="assets/image/icons.svg#locate"
            ></svg-icon>
            <div class="button-text">paikanna</div>
          </div>
        </button>

        <button @click="${this._toggleWind}" class="wind">
          <svg-icon
            class="small-icon wind-icon"
            path="assets/image/icons.svg#wind"
          ></svg-icon>
          <div class="button-text">tuuli</div>
        </button>

        <button @click="${BottomSheet._radar}">
          <svg class="small-icon" viewBox="0 0 576 512" id="radar">
            <path
              d="M575.7 280.8C547.1 144.5 437.3 62.6 320 49.9V32c0-17.7-14.3-32-32-32s-32 14.3-32 32v17.9C138.3 62.6 29.5 144.5.3 280.8c-2.2 10.1 8.5 21.3 18.7 11.4 52-55 107.7-52.4 158.6 37 5.3 9.5 14.9 8.6 19.7 0 20.2-35.4 44.9-73.2 90.7-73.2 58.5 0 88.2 68.8 90.7 73.2 4.8 8.6 14.4 9.5 19.7 0 51-89.5 107.1-91.4 158.6-37 10.3 10 20.9-1.3 18.7-11.4zM256 301.7V432c0 8.8-7.2 16-16 16-7.8 0-13.2-5.3-15.1-10.7-5.9-16.7-24.1-25.4-40.8-19.5-16.7 5.9-25.4 24.2-19.5 40.8 11.2 31.9 41.6 53.3 75.4 53.3 44.1 0 80-35.9 80-80V301.6c-9.1-7.9-19.8-13.6-32-13.6-12.3.1-22.4 4.8-32 13.7z"
            />
          </svg>
          <div class="button-text">sadetutka</div>
        </button>
      </nav>
    `;
  }

  static get properties() {
    return {
      largeMap: {
        type: Boolean,
      },
      showFeelsLike: {
        type: Boolean,
        reflect: true,
      },
      showWind: {
        type: Boolean,
        reflect: true,
      },
      _error: {
        type: String,
      },
      _locating: {
        type: Boolean,
        reflect: true,
      },
      _deferredPrompt: { type: Object },
      _installButtonVisible: { type: Boolean, reflect: true },
      _installBadgeVisible: { type: Boolean, reflect: true },
      _installAdOpen: { type: Boolean, reflect: true },
      _ios: { type: Boolean, reflect: true },
      _notification: { type: String, reflect: true },
    };
  }

  constructor() {
    super();

    this._forceShowIos = false;
    this._forceShowOthers = false;

    this._ios = (isPortableApple() && isSafari()) || this._forceShowIos;

    if (isState(null)) {
      // setState(STATE.SHOW_INSTALL_BADGE);
      this._scheduleInstallBadge();
    }

    this._installButtonVisible =
      this._showIosInstructions() || this._forceShowOthers;

    // install button for Android, Edge and Chrome
    window.addEventListener('beforeinstallprompt', event => {
      // prevent install prompt so it can be triggered later
      event.preventDefault();
      this._deferredPrompt = event;
      this._installButtonVisible = true;
    });

    this.addEventListener('bottom-notification.closed', e => {
      if (e.detail.iosInstructions === true) {
        this._installAdOpen = false;

        setState(STATE.INSTALL_BADGE_DISMISSED);
        this._installBadgeVisible = false;
      } else {
        this._notification = undefined;
        this._scheduleInstallBadge();
      }
    });

    this.addEventListener('install-button.clicked', () => {
      this._install();
    });
  }

  _scheduleInstallBadge() {
    if (this._showIosInstructions() || this._deferredPrompt != null) {
      setState(STATE.SHOW_INSTALL_BADGE);
      setTimeout(() => {
        this._installBadgeVisible = true;
      }, 10 * 1000);
    } else {
      setState(STATE.INSTALL_BADGE_DISMISSED);
    }
  }

  _showInstallAd() {
    track(INSTALL_CLICKED);

    this._installAdOpen = true;

    if (this._showIosInstructions() === true) {
      BottomSheet._scrollTop();
    }
  }

  _install() {
    if (this._deferredPrompt == null) {
      return;
    }

    // Show the install prompt.
    this._deferredPrompt.prompt();

    // Log the result
    this._deferredPrompt.userChoice.then(choice => {
      if (choice.outcome === 'dismissed') {
        track(INSTALL_CANCELLED);
      } else {
        track(INSTALLED);
      }

      // Reset the deferred prompt variable, since
      // prompt() can only be called once.
      this._deferredPrompt = null;

      // Hide the install button.
      this._installButtonVisible = false;

      setState(STATE.INSTALL_BADGE_DISMISSED);
    });
  }

  _showIosInstructions() {
    if (this._forceShowIos) {
      return true;
    }

    // if already installed
    if (navigator.standalone) {
      return false;
    }

    return isPortableApple() === true && isSafari() === true;
  }

  static _radar() {
    document.location.href = 'https://sataako.fi';
  }

  _toggleFeelsLike() {
    this._dispatchEvent('forecast-header.toggle-feels-like');
  }

  _toggleMapSize() {
    BottomSheet._scrollTop();
    this._dispatchEvent('bottom-sheet.toggleMapSize');
  }

  _toggleWind() {
    this._dispatchEvent('forecast-header.toggle-wind');
  }

  _geolocate() {
    this._notification = undefined;
    this._locating = true;
    setTimeout(() => {
      this._locating = false;
    }, 300);

    this._dispatchEvent('location-selector.locate-started');
    track(GEOLOCATE);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          this._dispatchEvent(
            'location-selector.location-changed',
            BottomSheet._formPlaceObject(
              position.coords.latitude,
              position.coords.longitude
            )
          );
        },
        () => {
          this._dispatchEvent('location-selector.locate-error', {
            text: 'salli paikannus nähdäksesi paikkakuntasi sää',
          });
          if (isWebView()) {
            this._notification =
              'avaa ulkoisessa selaimessa salliaksesi paikannus';
          } else {
            this._notification =
              'salli paikannus/sijainti selaimesi asetuksista';
          }
        }
      );
    } else {
      this._dispatchEvent('location-selector.locate-error', {
        text: 'paikantaminen epäonnistui, yritä uudelleen',
      });
      this._notification = 'paikantaminen epäonnistui, yritä uudelleen';
    }
  }

  _dispatchEvent(name, payload) {
    const event = new CustomEvent(name, {
      detail: payload,
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }

  static _formPlaceObject(lat, lon) {
    const coordinates = `${lat},${lon}`;
    return { city: undefined, coordinates, lat, lon };
  }

  static _scrollTop() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }
}

window.customElements.define(BottomSheet.is, BottomSheet);
