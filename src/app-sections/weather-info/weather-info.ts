import { css, html, LitElement } from 'lit';
import '../weather-section/weather-section';
import '../../common-components/svg-icon.js';
import('../share-app/share-app.js');

class WeatherInfo extends LitElement {
  static get is() {
    return 'weather-info';
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }

      .grid {
        display: grid;
        grid-template-rows: auto auto;
        height: 100%;
      }

      .text {
        padding-bottom: var(--space-l);
      }

      p {
        margin: 0;
      }

      p:last-of-type {
        margin-bottom: var(--space-m);
      }

      h3 {
        font-size: var(--font-size-m);
        font-weight: var(--font-weight-bold);
        margin-top: var(--space-xl);
        margin-bottom: 0;
      }

      a:link {
        color: var(--color-dark-and-light);
      }

      a:visited,
      a:hover {
        color: var(--color-dark-and-light);
      }

      .info-icon {
        fill: var(--color-dark-and-light);
        float: left;
        margin: var(--space-m) var(--space-l) var(--space-s) var(--space-m);
      }
      .no-bottom-margin {
        margin-bottom: 0rem;
      }
    `;
  }

  render() {
    return html`
      <weather-section pink padding liftedHeading="Sääennuste.fi">
        <div class="grid">
          <div class="text">
            <svg-icon
              medium
              class="info-icon"
              path="assets/image/icons.svg#info"
            ></svg-icon>

            <p>
              Sääennuste &ndash; Ilmatieteen laitoksen luotettava ennuste. Näet
              sään nyt, ilmanpaineen, ilmankosteuden, uv-ennusteen sekä
              virallisen meteorologin tuntiennusteen yhdellä silmäyksellä.
            </p>

            <h3>Sää nyt</h3>
            <p>
              Pelkistetty kartta näyttää kaikki lähistön
              <a href="https://www.ilmatieteenlaitos.fi/havaintoasemat"
                >Ilmatieteen laitoksen sääasemat</a
              >
              kerralla ja kertoo virallisesti mitatun lämpötilan ja sään. Tiedät
              luotettavasti, jos lähistöllä sataa. Sääasemat päivittävät
              tietonsa 1&ndash;10 minuutin välein.
            </p>

            <h3>Yksityisyys</h3>
            Palvelu ei käytä evästeitä. Sivuston kävijämäärä ja käyttäytyminen
            kerätään käyttäjää tunnistamatta, joten sinun tarvitse hyväksyä
            turhia käyttöehtoja.

            <h3>Palaute</h3>
            <p>
              Onko jokin rikki, puuttuuko ominaisuus tai onko sinulla idea miten
              parantaisit sovellusta? Ota yhteyttä palaute@saaennuste.fi.
            </p>
          </div>

          <share-app></share-app>
        </div>
      </weather-section>
    `;
  }
}

window.customElements.define(WeatherInfo.is, WeatherInfo);
