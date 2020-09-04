import { css, html, LitElement } from 'lit-element';

class WeatherSymbolName extends LitElement {
  static get is() {
    return 'weather-symbol-name';
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }

      h2 {
        font-size: var(--font-size-l);
        font-weight: var(--font-weight-normal);
      }
    `;
  }

  render() {
    return html`<h2>${WeatherSymbolName._symbolName(this.symbolId)}</h2> `;
  }

  static get properties() {
    return {
      symbolId: {
        type: Number,
      },
    };
  }

  static _symbolName(symbolId) {
    const names = {
      1: 'selkeää',
      2: 'puolipilvistä',
      3: 'pilvistä',
      21: 'heikkoja sadekuuroja',
      22: 'sadekuuroja',
      23: 'voimakkaita sadekuuroja',
      31: 'heikkoa vesisadetta',
      32: 'vesisadetta',
      33: 'voimakasta vesisadetta',
      41: 'heikkoja lumikuuroja',
      42: 'lumikuuroja',
      43: 'voimakkaita lumikuuroja',
      51: 'heikkoa lumisadetta',
      52: 'lumisadetta',
      53: 'voimakasta lumisadetta',
      61: 'ukkoskuuroja',
      62: 'voimakkaita ukkoskuuroja',
      63: 'ukkosta',
      64: 'voimakasta ukkosta',
      71: 'heikkoja räntäkuuroja',
      72: 'räntäkuuroja',
      73: 'voimakkaita räntäkuuroja',
      81: 'heikkoa räntäsadetta',
      82: 'räntäsadetta',
      83: 'voimakasta räntäsadetta',
      91: 'utua',
      92: 'sumua',
    };

    return names[symbolId];
  }
}

window.customElements.define(WeatherSymbolName.is, WeatherSymbolName);
