import { css, html, LitElement } from 'lit-element';

import '../weather-section.js';
import '../common-components/svg-icon.js';
import '../common-components/wind-icon.js';

import { symbolName } from '../data-helpers/weather-symbol-name.js';

class SymbolList extends LitElement {
  static get is() {
    return 'symbol-list';
  }

  static get styles() {
    return css`
      :host {
        display: block;
        color: var(--color-blue-800);
      }
    `;
  }

  render() {
    return html`<weather-section header="Käytetyt symbolit">
      ${Object.entries(symbolName).map(([key, value]) => {
        return html` <svg-icon
            path="${`assets/image/weather-symbols.svg#weatherSymbol${key}`}"
          ></svg-icon
          >${value}<br />`;
      })}
      <wind-icon degrees="0" windSpeed="5" windGustSpeed="9"> </wind-icon
      >Pohjoistuuli 5 m/s, puuskissa 9 m/s
    </weather-section>`;
  }
}

window.customElements.define(SymbolList.is, SymbolList);
