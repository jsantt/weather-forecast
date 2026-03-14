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
        background: linear-gradient(
          135deg,
          rgba(0, 0, 0, 0.05) 0%,
          rgba(0, 0, 0, 0.02) 100%
        );

        background: var(--background-topmost);
        border-radius: 1.8rem;
        box-shadow: var(--box-shadow);

        padding: 0.25rem;

        position: fixed;
        bottom: max(0.5rem, var(--safe-area-inset-bottom));
        left: 0.5rem;
        right: 0.5rem;

        z-index: var(--z-index-floating-1);

        opacity: 0.98;
      }

      @media only screen and (min-width: 800px) {
        :host {
          max-width: 40rem;
          margin-left: auto;
          margin-right: auto;
        }
      }

      nav {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
        grid-template-rows: auto;
        grid-gap: 4px;

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

        padding: var(--space-s) var(--space-s) var(--space-s) var(--space-s);

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
      :host([showWind]) .wind,
      :host([darkmode]) .darkmode {
        background: var(--background-toggle);
        border-radius: 1.8rem;
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

      .dots {
        font-size: var(--font-size-xl);
        line-height: 0.9;
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
  private _forceShowOthers = false;

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
                  <li>Valitse <span class="dots">...</span></li>
                  <li>
                    Napauta "jaa" -ikonia
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
              <svg class="small-icon" viewBox="0 0 640 640" id="radar">
                <path
                  d="M320 32C337.7 32 352 46.3 352 64L352 66C478.3 81.7 576 189.5 576 320C576 323.8 575.9 327.5 575.8 331.3C575.5 338.2 570.8 344.1 564.1 346C557.4 347.9 550.3 345.3 546.5 339.5C532.1 318.1 507.7 304 480 304C450.7 304 425.1 319.7 411.1 343.3C408.4 347.9 403.5 350.9 398.1 351.1C392.7 351.3 387.6 348.9 384.4 344.6C369.8 324.8 346.4 312 319.9 312C293.4 312 270 324.8 255.4 344.6C252.2 348.9 247.1 351.4 241.7 351.1C236.3 350.8 231.5 347.9 228.7 343.3C214.7 319.7 189.1 304 159.8 304C132.1 304 107.7 318.1 93.3 339.5C89.4 345.2 82.3 347.9 75.7 346C69.1 344.1 64.5 338.2 64.2 331.3C64.1 327.5 64 323.8 64 320C64 189.5 161.7 81.7 288 66L288 64C288 46.3 302.3 32 320 32zM352 392L352 494.6C352 539.6 315.5 576 270.6 576C239.8 576 211.6 558.6 197.8 531L195.5 526.3C187.6 510.5 194 491.3 209.8 483.4C225.6 475.5 244.8 481.9 252.7 497.7L255 502.4C258 508.3 264 512 270.6 512C280.2 512 288 504.2 288 494.6L288 392C288 374.3 302.3 360 320 360C337.7 360 352 374.3 352 392z"
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

        <button @click="${this._toggleDarkMode}" class="darkmode">
          <svg-icon
            class="small-icon darkmode-icon"
            path="assets/image/icons.svg#darkmode"
          ></svg-icon>

          <div class="button-text">tumma</div>
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

        <button @click="${this._toggleFeelsLike}" class="feelsLike">
          <svg-icon
            class="small-icon feelsLike-icon"
            path="assets/image/icons.svg#feelsLike"
          ></svg-icon>
          <div class="button-text">tuntuu</div>
        </button>

        <button @click="${this._toggleWind}" class="wind">
          <svg-icon
            class="small-icon wind-icon"
            path="assets/image/icons.svg#wind"
          ></svg-icon>
          <div class="button-text">tuuli</div>
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

    this.addEventListener('bottom-notification.closed', () => {
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
