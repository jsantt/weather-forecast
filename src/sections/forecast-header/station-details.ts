import { css, html, LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import { Station } from '../../observation-data.ts';
import { getWeatherObservation } from '../../data-helpers/weather-symbol-name.ts';

class StationDetails extends LitElement {
  static get is() {
    return 'station-details';
  }

  @property({ type: Object })
  station?: Station;

  @property({ type: Boolean, reflect: true })
  showFeelsLike?: boolean;

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
        font-weight: 400;
      }

      .explanation {
        color: var(--color-gray-500);
      }

      .value {
        color: var(--color-light);
      }

      .description {
        grid-column: span 3;
        text-align: left;
        margin-top: var(--space-m);
        margin-bottom: var(--space-s);
      }

      .description .value {
        font-weight: 300;
      }

      .updated-time {
        grid-column: 1 / -1;

        color: var(--color-gray-500);
        font-size: var(--font-size-s);

        text-align: right;
      }
    `;
  }

  render() {
    if (!this.station) {
      return;
    }

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
      <!--
      ${Number.isInteger(this.station.cloudiness)
        ? html`
            <div class="item">
              <div class="value">${this.station.cloudiness} / 8</div>
              <div class="explanation">pilvisyys</div>
            </div>
          `
        : ``}
      -->
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
      <div class="item description">
        <div class="value">
          ${getWeatherObservation(
            this.station.wawaCode,
            this.station.cloudiness
          )}
        </div>
        <div class="explanation"></div>
      </div>
      <!--
      ${this.station.wawaCode !== undefined
        ? html`
            <div class="item">
              <div class="value">${this.station.wawaCode}</div>
              <div class="explanation">wawa</div>
            </div>
          `
        : ``}
      ${this.station.smartSymbol !== undefined
        ? html`
            <div class="item">
              <div class="value">${this.station.smartSymbol}</div>
              <div class="explanation">symbol</div>
            </div>
          `
        : ``}
        -->
      <div class="item updated-time"></div>
    `;
  }

  static _snow(centimeters: number) {
    return centimeters > -1;
  }

  static _time(dateTime: Date) {
    const minutes = dateTime.getMinutes();

    const fullMinutes = minutes < 10 ? `0${minutes}` : minutes;

    return `${dateTime.getHours()}.${fullMinutes}`;
  }

  static _googleMapsURl(latitudeLongitude: string) {
    return `https://www.google.com/maps/search/?api=1&query=${latitudeLongitude}&zoom=12`;
  }
}

window.customElements.define(StationDetails.is, StationDetails);
