import { css, html, LitElement } from 'lit-element';

class GeolocateButton extends LitElement {
  static get is() {
    return 'geolocate-button';
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }
      /*:host {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        touch-action: none;
        user-select: none;
      }
      :host(:hover) {
        cursor: pointer;
      }
      */
      /*
      .locate-text {
        color: var(--color-blue-700);
        font-weight: var(--font-weight-boldest);
        margin-top: -2rem;
        z-index: var(--z-index-1);
        margin-left: 0.1rem;

        touch-action: none;
        user-select: none;
      }
      svg.loading {
        bottom: 4rem;
      }*/
    `;
  }

  render() {
    return html` <slot></slot> `;
  }

  static get properties() {
    return {
      hide: {
        loading: Boolean,
      },
    };
  }

  _geolocate() {
    this._dispatchEvent('location-selector.locate-started');

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          this._dispatchEvent(
            'location-selector.location-changed',
            GeolocateButton._formPlaceObject(
              position.coords.latitude,
              position.coords.longitude
            )
          );
        },
        () => {
          this._dispatchEvent('location-selector.locate-error', {
            text: 'salli paikannus nähdäksesi paikkakuntasi sää',
          });
        }
      );
    } else {
      this._dispatchEvent('location-selector.locate-error', {
        text: 'paikantaminen epäonnistui, yritä uudelleen',
      });
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
}

window.customElements.define(GeolocateButton.is, GeolocateButton);
