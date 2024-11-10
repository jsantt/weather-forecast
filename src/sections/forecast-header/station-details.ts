import { css, html, LitElement } from 'lit';
import { property } from 'lit/decorators.js';

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
        grid-gap: var(--space-l);
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

        color: var(--color-gray-500);
        font-size: var(--font-size-s);

        margin-top: var(--space-m);
        margin-bottom: var(--space-m);

        text-align: right;
      }
    `;
  }

  @property({ type: Object })
  station: any;

  @property({ type: Boolean, reflect: true })
  showFeelsLike?: boolean;

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
              <div class="value">${Math.round(this.station.pressure)} hPa</div>
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
      ${Number.isInteger(this.station.cloudiness)
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

  static _snow(centimeters) {
    return centimeters > -1;
  }

  static _time(dateTime) {
    const minutes = dateTime.getMinutes();

    const fullMinutes = minutes < 10 ? `0${minutes}` : minutes;

    return `${dateTime.getHours()}.${fullMinutes}`;
  }

  static _googleMapsURl(latitudeLongitude) {
    return `https://www.google.com/maps/search/?api=1&query=${latitudeLongitude}&zoom=12`;
  }
}

window.customElements.define(StationDetails.is, StationDetails);
