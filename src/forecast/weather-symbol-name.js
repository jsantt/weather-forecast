import { css, html, LitElement } from 'lit-element';

class WeatherSymbolName extends LitElement {
  static get is() {
    return 'weather-symbol-name';
  }

  static get styles() {
    return css`
      :host {
        display: block;
        padding-top: 0.5rem;
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

    // see wawa names: https://helda.helsinki.fi/bitstream/handle/10138/37284/PRO_GRADU_BOOK_HERMAN.pdf?sequence=2
    const wawaNames = {
      0: 'selkeää', // also default if no other match
      2: 'puolipilvistä',
      3: 'pilvistä',

      10: 'utua',
      30: 'sumua',
      31: 'sumua',
      32: 'sumua',
      33: 'sumua',
      34: 'sumua',

      40: 'sadetta',
      41: 'heikkoa sadetta',
      42: 'voimakasta sadetta',

      50: 'tihkusadetta',
      51: 'heikkoa tihkusadetta',
      52: 'kohtalaista tihkusadetta',
      53: 'voimakasta tihkusadetta',
      54: 'jäätävää heikkoa tihkusadetta',
      55: 'jäätävää kohtalaista tihkusadetta',
      56: 'jäätävää kovaa tihkusadetta',

      61: 'heikkoa vesisadetta',
      62: 'vesisadetta',
      63: 'voimakasta vesisadetta',

      64: 'jäätävää heikkoa vesisadetta',
      65: 'jäätävää vesisadetta',
      66: 'jäätävää voimakasta vesisadetta',

      67: 'räntäsadetta',
      68: 'voimakasta räntäsadetta',

      70: 'lumisadetta',
      71: 'heikkoa lumisadetta',
      72: 'lumisadetta',
      73: 'voimakasta lumisadetta',

      74: 'heikkoa lumisadetta',
      75: 'lumisadetta',
      76: 'voimakasta lumisadetta',

      77: 'lumisadetta',
      78: 'lumisadetta',

      80: 'heikkoja sadekuuroja',
      81: 'heikkoja sadekuuroja',
      82: 'sadekuuroja',
      83: 'voimakkaita sadekuuroja',
      84: 'voimakkaita sadekuuroja',
      85: 'heikkoja lumikuuroja',
      86: 'lumikuuroja',
      87: 'voimakkaita lumikuuroja',
      89: 'raekuuroja',
    };

    return names[symbolId];
  }
}

window.customElements.define(WeatherSymbolName.is, WeatherSymbolName);
