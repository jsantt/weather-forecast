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
        color: var(--color-primary);
      }

      section {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(75px, 1fr));
        grid-gap: var(--space-l);
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
            <svg-icon
              path="${`assets/image/weather-symbols.svg#weatherSymbol${key}`}"
            ></svg-icon>
            <svg-icon
              path="${`assets/image/weather-symbols.svg#weatherSymbol${key}-night`}"
            ></svg-icon
            >${value}
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
