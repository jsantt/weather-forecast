import { css, html, LitElement } from 'lit';

import '../weather-section';
import '../common-components/svg-icon';
import '../common-components/wind-icon';

import { symbolName } from '../data-helpers/weather-symbol-name';

class SymbolList extends LitElement {
  static get is() {
    return 'symbol-list';
  }

  static get styles() {
    return css`
      :host {
        display: block;
        color: var(--color-dark-and-light);
      }

      section {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: var(--space-xl);
        padding: 0 var(--space-l);
      }

      svg-icon {
        display: block;
      }

      wind-icon {
        display: block;
      }
    `;
  }

  render() {
    return html`<weather-section padding liftedHeading="Symbolien selitykset">
      <section>
        ${Object.entries(symbolName).map(([key, value]) => {
          return html`<div>
            
            <img
              src="${`assets/image/smart/light/${key}.svg`}"
            ></img>
            <img
              src="${`assets/image/smart/light/${Number(key) + 100}.svg`}"
            ></img
            ><div>${value} ${key}</div>
          </div>`;
        })}
        <div>
          <wind-icon degrees="0" windSpeed="5" windGustSpeed="9"> </wind-icon
          >Pohjoistuuli 5 m/s, puuskissa 9 m/s
        </div>
      </section>
    </weather-section>`;
  }
}

window.customElements.define(SymbolList.is, SymbolList);
