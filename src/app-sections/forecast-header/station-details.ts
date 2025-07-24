import { css, html, LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import { Station } from '../../backend-calls/observation-data/observation-data.ts';

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

      .unit {
        color: var(--color-gray-500);
        font-size: var(--font-size-xs);
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
    `;
  }

  render() {
    return html`
      ${
        this.station?.humidity
          ? html`
              <div class="item">
                <div class="value">
                  ${this.station.humidity} <span class="unit">%</span>
                </div>
                <div class="explanation">ilmankosteus</div>
              </div>
            `
          : ``
      }
      ${
        this.station?.pressure
          ? html`
              <div class="item">
                <div class="value">
                  ${Math.round(this.station.pressure)}
                  <span class="unit">hPa</span>
                </div>
                <div class="explanation">ilmanpaine</div>
              </div>
            `
          : ``
      }
      ${
        this.station?.dewPoint
          ? html`
              <div class="item">
                <div class="value">
                  ${this.station.dewPoint} <span class="unit">°C</span>
                </div>
                <div class="explanation">kastepiste</div>
              </div>
            `
          : ``
      }
      ${
        this.station?.visibility
          ? html`
              <div class="item">
                <div class="value">
                  ${this.station.visibility} <span class="unit">km</span>
                </div>
                <div class="explanation">näkyvyys</div>
              </div>
            `
          : ``
      }
      ${
        this.station && StationDetails._snow(this.station.snow)
          ? html`
              <div class="item">
                <div class="value">
                  ${this.station.snow} <span class="unit">cm</span>
                </div>
                <div class="explanation">lumen syvyys</div>
              </div>
            `
          : ``
      }
      ${
        this.station?.rainExplanation
          ? html`
              <div class="item">
                <div class="value">
                  ${this.station.rainExplanation} <span class="unit">mm/h</span>
                </div>
                <div class="explanation">sateen rankkuus</div>
                <div></div>
              </div>
            `
          : ``
      }
      ${
        this.station?.rain
          ? html`
              <div class="item">
                <div class="value">
                  ${this.station.rain} <span class="unit">mm</span>
                </div>
                <div class="explanation">sade / edeltävä h</div>
              </div>
            `
          : ``
      }
      </div>

      <!--
      <div class="item">
        <div class="value">${this.station?.wawaCode}</div>
        <div class="explanation">wawa</div>
      </div>

      <div class="item">
        <div class="value">${this.station?.cloudiness} / 8</div>
        <div class="explanation">pilvisyys</div>
      </div>

      <div class="item">
        <div class="value">${this.station?.smartSymbol}</div>
        <div class="explanation">symbol</div>
      </div>
    -->
    `;
  }

  static _snow(centimeters: number) {
    return centimeters > -1;
  }

  static _time(dateTime?: Date) {
    if (dateTime === undefined) {
      return '';
    }
    const minutes = dateTime.getMinutes();

    const fullMinutes = minutes < 10 ? `0${minutes}` : minutes;

    return `${dateTime.getHours()}.${fullMinutes}`;
  }

  static _googleMapsURl(latitudeLongitude: string) {
    return `https://www.google.com/maps/search/?api=1&query=${latitudeLongitude}&zoom=12`;
  }
}

window.customElements.define(StationDetails.is, StationDetails);
