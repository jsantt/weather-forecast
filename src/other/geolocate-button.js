import { css, html, LitElement } from 'lit-element';

class GeolocateButton extends LitElement {
  static get is() {
    return 'geolocate-button';
  }

  static get styles() {
    return css`
      :host {
        --color-locate: var(--color-blue-300);

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        touch-action: none;
        user-select: none;

        position: fixed;

        top: calc(100vh - 5rem);
        z-index: 101;
      }
      :host(:hover) {
        cursor: pointer;
      }
      svg {
        filter: drop-shadow(0px 3px 4px rgba(0, 0, 0, 0.3));
      }

      .locate-icon-shadow {
        fill: var(--color-white);
      }

      .locate-text {
        color: var(--color-blue-700);
        font-size: var(--font-size-s);
        font-weight: var(--font-weight-boldest);
        margin-top: -2rem;
        z-index: 1;
        margin-left: 0.1rem;

        touch-action: none;
        user-select: none;
      }
      svg.loading {
        bottom: 4rem;
      }
    `;
  }
  render() {
    return html`
      ${this.loading === true
        ? ''
        : html` <svg
              @click="${this._geolocate}"
              width="80"
              height="80"
              viewbox="0 0 32 32"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g>
                <title>paikanna</title>
                <ellipse
                  stroke="#f5f5f5"
                  stroke-width="0"
                  fill="#fff"
                  cx="15.94793"
                  cy="17.3763"
                  id="svg_1"
                  rx="15"
                  ry="15"
                />
                <path
                  class="locate-icon"
                  stroke-width="0"
                  stroke="#fff"
                  fill="#ed332b"
                  d="m16.18757,0.12498c-3.69724,0 -6.68752,2.99028 -6.68752,6.68752c0,5.01564 6.68752,12.41967 6.68752,12.41967s6.68752,-7.40403 6.68752,-12.41967c0,-3.69724 -2.99028,-6.68752 -6.68752,-6.68752zm0,9.07591c-1.3184,0 -2.38839,-1.07 -2.38839,-2.38839s1.07,-2.38839 2.38839,-2.38839s2.38839,1.07 2.38839,2.38839s-1.07,2.38839 -2.38839,2.38839z"
                />
              </g>
            </svg>
            <div class="locate-text">paikanna</div>`}
    `;
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
        (position) => {
          const coordinates =
            position.coords.latitude + ',' + position.coords.longitude;
          const url =
            position.coords.latitude + '-' + position.coords.longitude;

          this._dispatchEvent(
            'location-selector.location-changed',
            this._formPlaceObject(coordinates)
          );
        },
        (error) => {
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

  _formPlaceObject(coordinates) {
    return { city: undefined, coordinates: coordinates };
  }
}

window.customElements.define(GeolocateButton.is, GeolocateButton);
