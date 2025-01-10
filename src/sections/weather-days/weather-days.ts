import { css, html, LitElement } from 'lit';

import './weather-day';
import './weather-day-compact';

import { ForecastDay } from '../../forecast-data.ts';
import { property, state } from 'lit/decorators.js';

class WeatherDays extends LitElement {
  static get is() {
    return 'weather-days';
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }
    `;
  }

  @state()
  days: boolean[] = [
    true,
    true,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ];

  private toggle(index: number) {
    console.log('toggled', index, this.days);

    const copy = [...this.days];
    copy[index] = !copy[index];

    this.days = copy;
  }

  render() {
    return html`
      ${this.days.map((day, index) => {
        if (day) {
          return html`<weather-day
            @click=${() => this.toggle(index)}
            class="weatherGrid"
            dayNumber=${index + 1}
            .location="${this.location}"
            .minTemperature="${this._minTemperature}"
            .showFeelsLike="${this.showFeelsLike}"
            .showWind="${this.showWind}"
            .dayData="${WeatherDays._sliceDay(this.forecastData, index + 1)}"
          ></weather-day> `;
        } else {
          return html`<weather-day-compact
            @click=${() => this.toggle(index)}
            class="weatherGrid"
            dayNumber=${index + 1}
            .location="${this.location}"
            .minTemperature="${this._minTemperature}"
            .showFeelsLike="${this.showFeelsLike}"
            .showWind="${this.showWind}"
            .dayData="${WeatherDays._sliceDay(this.forecastData, index + 1)}"
          ></weather-day-compact> `;
        }
      })}
    `;
  }

  @property({ type: Array })
  forecastData?: ForecastDay[];

  @property({ type: Object })
  location?: object;

  @property({ type: Boolean, reflect: true })
  showFeelsLike: boolean = false;

  @property({ type: Boolean, reflect: true })
  showWind: boolean = false;

  @state()
  _day1Data = [];
  _day2Data = [];
  _day3Data = [];
  _day4Data = [];
  _day5Data = [];
  _day6Data = [];
  _day7Data = [];
  _day8Data = [];
  _day9Data = [];
  _day10Data = [];

  _minTemperature?: number;

  updated(changedProperties) {
    changedProperties.forEach((_oldValue, propName) => {
      if (propName === 'forecastData' && this.forecastData !== undefined) {
        this._day1Data = WeatherDays._sliceDay(this.forecastData, 1);
        this._day2Data = WeatherDays._sliceDay(this.forecastData, 2);
        this._day3Data = WeatherDays._sliceDay(this.forecastData, 3);
        this._day4Data = WeatherDays._sliceDay(this.forecastData, 4);
        this._day5Data = WeatherDays._sliceDay(this.forecastData, 5);
        this._day6Data = WeatherDays._sliceDay(this.forecastData, 6);
        this._day7Data = WeatherDays._sliceDay(this.forecastData, 7);
        this._day8Data = WeatherDays._sliceDay(this.forecastData, 8);
        this._day9Data = WeatherDays._sliceDay(this.forecastData, 9);
        this._day10Data = WeatherDays._sliceDay(this.forecastData, 10);

        this._minTemperature = WeatherDays._minTemp(this.forecastData);
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
