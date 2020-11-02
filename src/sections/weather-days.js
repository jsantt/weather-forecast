import { css, html, LitElement } from 'lit-element';

import '../forecast/weather-day.js';

class WeatherDays extends LitElement {
  static get is() {
    return 'weather-days';
  }

  static get styles() {
    return css`
      :host {
        display: block;
        margin-top: calc(-1 * var(--header-background-expand));
      }
      .visually-hidden {
        position: absolute !important;
        clip: rect(1px, 1px, 1px, 1px);
        padding: 0 !important;
        border: 0 !important;
        height: 1px !important;
        width: 1px !important;
        overflow: hidden;
      }
    `;
  }

  render() {
    return html`
      <h3 class="visually-hidden">sää tänään</h3>
      <weather-day
        class="weatherGrid"
        dayNumber="1"
        .minTemperature="${this._minTemperature}"
        .showFeelsLike="${this.showFeelsLike}"
        .showWind="${this.showWind}"
        .dayData="${this._todayData}"
      ></weather-day>

      <h3 class="visually-hidden">sää huomenna</h3>
      <weather-day
        class="weatherGrid"
        dayNumber="2"
        .minTemperature="${this._minTemperature}"
        .showFeelsLike="${this.showFeelsLike}"
        .showWind="${this.showWind}"
        .dayData="${this._day2Data}"
      ></weather-day>

      <h3 class="visually-hidden">sää ylihuomenna</h3>
      <weather-day
        class="weatherGrid"
        dayNumber="3"
        .minTemperature="${this._minTemperature}"
        .showFeelsLike="${this.showFeelsLike}"
        .showWind="${this.showWind}"
        .dayData="${this._day3Data}"
      ></weather-day>
    `;
  }

  static get properties() {
    return {
      forecastData: {
        type: Array,
      },

      showFeelsLike: {
        type: Boolean,
        reflect: true,
      },

      showWind: {
        type: Boolean,
        reflect: true,
      },

      _todayData: {
        type: Array,
      },

      _day2Data: {
        type: Array,
      },

      _day3Data: {
        type: Array,
      },

      _minTemperature: {
        type: Number,
        reflect: true,
      },
    };
  }

  constructor() {
    super();
    this._todayData = [];
    this._day2Data = [];
    this._day3Data = [];
  }

  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName === 'forecastData' && this.forecastData !== undefined) {
        this._todayData = WeatherDays._sliceToday(this.forecastData);
        this._day2Data = WeatherDays._sliceDay2(this.forecastData);
        this._day3Data = WeatherDays._sliceDay3(this.forecastData);
        this._minTemperature = WeatherDays._minTemp(this.forecastData);
      }
    });
  }

  // for computed properties

  static _sliceToday(data) {
    return data.slice(0, 24);
  }

  static _sliceDay2(data) {
    return data.slice(24, 48);
  }

  static _sliceDay3(data) {
    return data.slice(48, 72);
  }

  static _minTemp(data) {
    const min = data.reduce((previous, current) => {
      const currentTemp = Number.isNaN(current.temperature)
        ? Number.MAX_VALUE
        : current.temperature;
      return previous.temperature < currentTemp ? previous : current;
    });
    return min.temperature;
  }
}

window.customElements.define(WeatherDays.is, WeatherDays);
