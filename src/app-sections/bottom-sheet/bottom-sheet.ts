import { css, html, LitElement } from 'lit';

import { isSafari, isPortableApple, isWebView } from './browser-detector';
import { isState, setState, STATE } from './state';

import {
  track,
  INSTALL_CLICKED,
  INSTALL_CANCELLED,
  INSTALLED,
  GEOLOCATE,
} from './tracker';
import './bottom-notification';
import '../../common-components/svg-icon';
import { property } from 'lit/decorators.js';

class BottomSheet extends LitElement {
  static get is() {
    return 'bottom-sheet';
  }

  static get styles() {
    return css`
      :host {
        display: block;
        background: var(--background-topmost);
        box-shadow: var(--box-shadow-upwards);

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
        color: var(--color-dark-and-light);

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-end;

        font-family: inherit;
        font-optical-sizing: inherit;
        font-weight: inherit;
        font-style: inherit;
        font-variation-settings: inherit;

        fill: var(--color-dark-and-light);

        font-size: var(--font-size-s);

        height: 100%;

        text-align: center;
        margin: 0 auto;

        padding: var(--space-s) var(--space-s)
          max(var(--space-s), var(--safe-area-inset-bottom)) var(--space-s);

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
        border-top: 4px solid var(--color-dark-and-light);
      }

      :host([showFeelsLike]) .feelsLike-icon,
      :host([showWind]) .wind-icon {
        margin-top: -4px;
      }

      .locate-icon {
        position: absolute;
        bottom: 1.3rem;

        filter: drop-shadow(0px 3px 4px rgba(0, 0, 0, 0.3));
        transition: all var(--transition-time) var(--transition-cubic-bezier);
      }

      :host([_locating]) .locate-icon {
        top: -100px;
        transform: scale(2);
      }

      .small-icon {
        fill: var(--color-dark-and-light);

        filter: drop-shadow(rgba(0, 0, 0, 0.3) 0px 3px 4px);

        height: 20px;
        width: 20px;
        padding: var(--space-s) var(--space-s) 0 var(--space-s);
      }

      .position-anchor {
        position: relative;
        display: flex;
        justify-content: center;
      }

      .notification {
        background: var(--color-red-500);
        border-radius: 50%;

        color: var(--color-gray-100);
        font-size: var(--font-size-xs);

        width: 1rem;
        height: 1rem;

        padding-bottom: 1px;

        position: absolute;
        top: 0;
        right: -0.35rem;
      }

      header {
        margin: 0;
        font-size: var(--font-size-s);
        padding-bottom: var(--space-l);
      }

      svg-icon {
        color: var(--color-dark-and-light);
      }

      .home-icon {
        stroke: var(--color-dark-and-light);
      }

      ol {
        line-height: 1.8;
        margin: var(--space-s) var(--space-l) var(--space-s) 0;
        padding: 0 0 0 var(--space-l);
      }

      @media only screen and (min-width: 400px) {
        button {
          padding-bottom: 0;
        }
        ol {
          margin-top: var(--space-m);
          margin-bottom: var(--space-m);
        }
      }
    `;
  }

  @property({ type: Boolean })
  showDetails?: boolean;

  @property({ type: Boolean, reflect: true })
  showFeelsLike?: boolean;

  @property({ type: Boolean, reflect: true })
  showWind?: boolean;

  @property({ type: Boolean, reflect: true })
  darkMode?: boolean = false;

  @property({ type: String })
  _error?: string;

  @property({ type: Boolean, reflect: true })
  _locating?: boolean;

  @property({ type: Object })
  _deferredPrompt?: object;

  @property({ type: Boolean, reflect: true })
  _installButtonVisible?: boolean;

  @property({ type: Boolean, reflect: true })
  _installBadgeVisible?: boolean;

  @property({ type: Boolean, reflect: true })
  _installPromptOpen?: boolean;

  @property({ type: Boolean, reflect: true })
  _ios?: boolean;

  @property({ type: String, reflect: true })
  _notification?: string;

  private _forceShowIos = false;
  private _forceShowOthers = true;

  render() {
    return html`
      ${this._notification
        ? html`<bottom-notification @bottom-notification.closed=${this.onClose}>
            <div class="error">${this._notification}</div>
          </bottom-notification>`
        : null}
      ${this._installPromptOpen
        ? html`<bottom-notification
            ?fix-to-top=${this._ios && this._installPromptOpen}
            @bottom-notification.closed=${this.onClose}
          >
            <header>
              Lisää sääennuste.fi kotivalikkoon tai työpöydälle ja käytä sitä
              kuin tavallista sovellusta! Asennus on nopeaa, eikä sovellus käytä
              evästeitä tai kerää yksilöiviä tietoja. Voit myös poistaa sen
              tavallisen sovelluksen tapaan.
            </header>
            ${!this._ios
              ? html` <install-button> Lisää nyt</install-button>`
              : ''}
            ${this._ios
              ? html` <ol>
                  <li>
                    Napauta sivun alalaidasta
                    <svg-icon
                      class="home-icon"
                      path="assets/image/icons.svg#iosShare"
                      medium
                    ></svg-icon>
                  </li>
                  <li>vieritä alaspäin</li>
                  <li>
                    valitse "Lisää Koti-valikkoon"
                    <svg-icon
                      path="assets/image/icons.svg#add-home"
                      small
                    ></svg-icon>
                  </li>
                </ol>`
              : ''}</bottom-notification
          >`
        : null}

      <nav>
        ${this._installButtonVisible === false
          ? html`<button @click="${BottomSheet._radar}">
              <svg class="small-icon" viewBox="0 0 576 512" id="radar">
                <path
                  d="M575.7 280.8C547.1 144.5 437.3 62.6 320 49.9V32c0-17.7-14.3-32-32-32s-32 14.3-32 32v17.9C138.3 62.6 29.5 144.5.3 280.8c-2.2 10.1 8.5 21.3 18.7 11.4 52-55 107.7-52.4 158.6 37 5.3 9.5 14.9 8.6 19.7 0 20.2-35.4 44.9-73.2 90.7-73.2 58.5 0 88.2 68.8 90.7 73.2 4.8 8.6 14.4 9.5 19.7 0 51-89.5 107.1-91.4 158.6-37 10.3 10 20.9-1.3 18.7-11.4zM256 301.7V432c0 8.8-7.2 16-16 16-7.8 0-13.2-5.3-15.1-10.7-5.9-16.7-24.1-25.4-40.8-19.5-16.7 5.9-25.4 24.2-19.5 40.8 11.2 31.9 41.6 53.3 75.4 53.3 44.1 0 80-35.9 80-80V301.6c-9.1-7.9-19.8-13.6-32-13.6-12.3.1-22.4 4.8-32 13.7z"
                />
              </svg>
              <div class="button-text">sadetutka</div>
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

                <div class="button-text">Sovellus</div>
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
        <button @click="${this._toggleDarkMode}" class="darkmode">
          <svg-icon
            class="small-icon darkmode-icon"
            path="assets/image/icons.svg#darkmode"
          ></svg-icon>

          <div class="button-text">tumma</div>
        </button>
      </nav>
    `;
  }
  constructor() {
    super();

    this._ios = (isPortableApple() && isSafari()) || this._forceShowIos;

    if (isState(null)) {
      // setState(STATE.SHOW_INSTALL_BADGE);
      this._scheduleInstallBadge();
    }

    this._installButtonVisible =
      this._showIosInstructions() || this._forceShowOthers;

    // install button for Android, Edge and Chrome
    window.addEventListener('beforeinstallprompt', (event) => {
      // prevent install prompt so it can be triggered later
      event.preventDefault();
      this._deferredPrompt = event;
      this._installButtonVisible = true;
    });

    this.addEventListener('bottom-notification.closed', (e) => {
      if (this._ios && this._installPromptOpen) {
        this._installPromptOpen = false;

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

  private onClose() {
    if (this._installPromptOpen) {
      this._installPromptOpen = false;
      setState(STATE.INSTALL_BADGE_DISMISSED);
      this._installBadgeVisible = false;
    } else {
      this._notification = undefined;
      this._scheduleInstallBadge();
    }
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.darkMode === true) {
      this._toggleDarkMode();
    }
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

    this._installPromptOpen = true;

    if (this._showIosInstructions() === true) {
      BottomSheet._scrollTop();
    }
  }

  _install() {
    if (this._deferredPrompt == null) {
      return;
    }

    // Show the install prompt.
    (this._deferredPrompt as any).prompt();

    // Log the result
    (this._deferredPrompt as any).userChoice.then((choice) => {
      if (choice.outcome === 'dismissed') {
        track(INSTALL_CANCELLED);
      } else {
        track(INSTALLED);
      }

      // Reset the deferred prompt variable, since
      // prompt() can only be called once.
      this._deferredPrompt = undefined;

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
    if (
      (navigator as any).standalone ||
      window.matchMedia('(display-mode: standalone)')?.matches
    ) {
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

  _toggleDarkMode() {
    this._dispatchEvent('bottom-sheet.toggle-darkmode');
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
        (position) => {
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
            text: 'Salli paikannus nähdäksesi paikkakuntasi sää',
          });
          if (isWebView()) {
            this._notification =
              'Avaa ulkoisessa selaimessa salliaksesi paikannus';
          } else {
            this._notification =
              'Salli paikannus/sijainti selaimesi asetuksista. Sijaintitietoa käytetään vain paikannukseen ja tietoa ei tallenneta.';
          }
        }
      );
    } else {
      this._dispatchEvent('location-selector.locate-error', {
        text: 'Paikantaminen epäonnistui, yritä uudelleen',
      });
      this._notification = 'Paikantaminen epäonnistui, yritä uudelleen';
    }
  }

  _dispatchEvent(
    name: string,
    payload?:
      | {
          city?: undefined;
          coordinates?: string;
          lat?: any;
          lon?: any;
          text?: string;
        }
      | undefined
  ) {
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
