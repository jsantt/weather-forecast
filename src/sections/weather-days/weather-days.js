import { css, html, LitElement } from 'lit';

import './weather-day.js';

class WeatherDays extends LitElement {
  static get is() {
    return 'weather-days';
  }

  static get styles() {
    return css`
      :host {
        display: block;
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
        .location="${this.location}"
        .minTemperature="${this._minTemperature}"
        .showFeelsLike="${this.showFeelsLike}"
        .showWind="${this.showWind}"
        .dayData="${this._todayData}"
      ></weather-day>

      <h3 class="visually-hidden">sää huomenna</h3>
      <weather-day
        class="weatherGrid"
        dayNumber="2"
        .location="${this.location}"
        .minTemperature="${this._minTemperature}"
        .showFeelsLike="${this.showFeelsLike}"
        .showWind="${this.showWind}"
        .dayData="${this._day2Data}"
      ></weather-day>

      <h3 class="visually-hidden">sää ylihuomenna</h3>
      <weather-day
        class="weatherGrid"
        dayNumber="3"
        .location="${this.location}"
        .minTemperature="${this._minTemperature}"
        .showFeelsLike="${this.showFeelsLike}"
        .showWind="${this.showWind}"
        .dayData="${this._day3Data}"
      ></weather-day>

      <weather-day
        class="weatherGrid"
        dayNumber="4"
        .location="${this.location}"
        .minTemperature="${this._minTemperature}"
        .showFeelsLike="${this.showFeelsLike}"
        .showWind="${this.showWind}"
        .dayData="${this._day4Data}"
      ></weather-day>

      <weather-day
        class="weatherGrid"
        dayNumber="5"
        .location="${this.location}"
        .minTemperature="${this._minTemperature}"
        .showFeelsLike="${this.showFeelsLike}"
        .showWind="${this.showWind}"
        .dayData="${this._day5Data}"
      ></weather-day>

      <weather-day
        class="weatherGrid"
        dayNumber="6"
        .location="${this.location}"
        .minTemperature="${this._minTemperature}"
        .showFeelsLike="${this.showFeelsLike}"
        .showWind="${this.showWind}"
        .dayData="${this._day6Data}"
      ></weather-day>

      <weather-day
        class="weatherGrid"
        dayNumber="7"
        .location="${this.location}"
        .minTemperature="${this._minTemperature}"
        .showFeelsLike="${this.showFeelsLike}"
        .showWind="${this.showWind}"
        .dayData="${this._day7Data}"
      ></weather-day>

      <weather-day
        class="weatherGrid"
        dayNumber="8"
        .location="${this.location}"
        .minTemperature="${this._minTemperature}"
        .showFeelsLike="${this.showFeelsLike}"
        .showWind="${this.showWind}"
        .dayData="${this._day8Data}"
      ></weather-day>

      <weather-day
        class="weatherGrid"
        dayNumber="9"
        .location="${this.location}"
        .minTemperature="${this._minTemperature}"
        .showFeelsLike="${this.showFeelsLike}"
        .showWind="${this.showWind}"
        .dayData="${this._day9Data}"
      ></weather-day>

      <weather-day
        class="weatherGrid"
        dayNumber="10"
        .location="${this.location}"
        .minTemperature="${this._minTemperature}"
        .showFeelsLike="${this.showFeelsLike}"
        .showWind="${this.showWind}"
        .dayData="${this._day10Data}"
      ></weather-day>
    `;
  }

  static get properties() {
    return {
      forecastData: {
        type: Array,
      },

      location: {
        type: Object,
        reflect: true,
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
    this._day5Data = [];
    this._day6Data = [];
    this._day7Data = [];
    this._day8Data = [];
    this._day9Data = [];
    this._day10Data = [];
  }

  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName === 'forecastData' && this.forecastData !== undefined) {
        this._todayData = WeatherDays._sliceDay(this.forecastData, 1);
        this._day2Data = WeatherDays._sliceDay(this.forecastData, 2);
        this._day3Data = WeatherDays._sliceDay(this.forecastData, 3);
        this._day4Data = WeatherDays._sliceDay(this.forecastData, 4);
        this._day5Data = WeatherDays._sliceDay(this.forecastData, 5);
        this._day6Data = WeatherDays._sliceDay(this.forecastData, 6);
        this._day7Data = WeatherDays._sliceDay(this.forecastData, 7);
        this._day8Data = WeatherDays._sliceDay(this.forecastData, 8);
        this._day9Data = WeatherDays._sliceDay(this.forecastData, 9);
        this._day10Data = WeatherDays._sliceDay(this.forecastData, 10);

        this._minTemperature = WeatherDays._minTemp(this.forecastData, 8);
      }
    });
  }

  // for computed properties

  static _sliceDay(data, dayNumber) {
    return data.slice((dayNumber - 1) * 24, dayNumber * 24);
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
