import { css, html, LitElement } from 'lit-element';

class StationDetails extends LitElement {
  static get is() {
    return 'station-details';
  }

  static get styles() {
    return css`
      :host {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        grid-template-rows: auto;
        grid-gap: var(--space-m);
        padding: var(--space-m);
      }

      @media only screen and (min-width: 430px) {
        :host {
          grid-template-columns: 1fr 1fr 1fr 1fr;
        }
      }

      .item {
        line-height: 1;
      }

      .value {
        font-size: var(--font-size-m);
        font-weight: var(--font-weight-bold);
      }

      .explanation,
      .value {
        color: var(--color-secondary);
      }

      weather-name-wawa {
        grid-column: span 3;
        text-align: left;
        margin-bottom: var(--space-s);
      }

      .updated-time {
        grid-column: 1 / -1;
        text-align: right;
        padding-top: var(--space-m);
      }
    `;
  }

  render() {
    return html`
      ${this.station.humidity
        ? html`
            <div class="item">
              <div class="value">${this.station.humidity} %</div>
              <div class="explanation">ilmankosteus</div>
            </div>
          `
        : ``}
      ${this.station.pressure
        ? html`
            <div class="item">
              <div class="value">${this.station.pressure} hPa</div>
              <div class="explanation">ilmanpaine</div>
            </div>
          `
        : ``}
      ${this.station.dewPoint
        ? html`
            <div class="item">
              <div class="value">${this.station.dewPoint} °C</div>
              <div class="explanation">kastepiste</div>
            </div>
          `
        : ``}
      ${this.station.cloudiness
        ? html`
            <div class="item">
              <div class="value">${this.station.cloudiness} / 8</div>
              <div class="explanation">pilvisyys</div>
            </div>
          `
        : ``}
      ${this.station.visibility
        ? html`
            <div class="item">
              <div class="value">${this.station.visibility} km</div>
              <div class="explanation">näkyvyys</div>
            </div>
          `
        : ``}
      ${StationDetails._snow(this.station.snow)
        ? html`
            <div class="item">
              <div class="value">${this.station.snow} cm</div>
              <div class="explanation">lumen syvyys</div>
            </div>
          `
        : ``}
      ${this.station.rainExplanation
        ? html`
            <div class="item">
              <div class="value">${this.station.rainExplanation} mm/h</div>
              <div class="explanation">sateen rankkuus</div>
              <div></div>
            </div>
          `
        : ``}
      ${this.station.rain
        ? html`
            <div class="item">
              <div class="value">${this.station.rain} mm</div>
              <div class="explanation">sade / edeltävä h</div>
            </div>
          `
        : ``}

      <div class="item updated-time">
        päivitetty klo ${StationDetails._time(this.station.timestamp)}
      </div>
    `;
  }

  static get properties() {
    return {
      station: {
        type: Object,
      },
      showFeelsLike: {
        type: Boolean,
        reflect: true,
      },
    };
  }

  static _snow(centimeters) {
    return centimeters > -1;
  }

  static _time(dateTime) {
    const minutes = dateTime.getMinutes();

    const fullMinutes = minutes < 10 ? `0${minutes}` : minutes;

    return `${dateTime.getHours()}.${fullMinutes}`;
  }
}

window.customElements.define(StationDetails.is, StationDetails);
