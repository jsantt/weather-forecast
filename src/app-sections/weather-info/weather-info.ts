import { css, html, LitElement } from 'lit';
import '../weather-section/weather-section';
import '../../common-components/svg-icon';
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
      <weather-section gray padding liftedHeading="Sääennuste.fi">
        <svg-icon
          medium
          class="info-icon"
          path="assets/image/icons.svg#info"
        ></svg-icon>

        <p>
          Saaennuste.fi esittää Ilmatieteen laitoksen havainnot ja meteorologin
          virallisen ennusteen paremmassa muodossa. Näet yleiskuvan ja
          tarpeelliset yksityiskohdat vähemmällä klikkailulla - myös kännykän
          pieneltä ruudulta.
        </p>

        <h3>Havainnot</h3>
        <p>
          Havainnot "kartalla" näyttää lähistön sääasemien tiedot "kartalla"
          oikeassa suunnassa siten, että päällekkäin meneviä asemia on siirretty
          mahdollisimman vähän.
        </p>

        <h3>Yksityisyys</h3>
        Palvelu ei käytä evästeitä. Sivuston kävijämäärä ja käyttäytyminen
        kerätään käyttäjää tunnistamatta, joten sinun tarvitse hyväksyä turhia
        käyttöehtoja.
        <div slot="footer-left"></div>
        <div slot="footer-right">
          <svg-icon path="assets/image/icons.svg#cookie"></svg-icon>
        </div>

        <h3>Palaute</h3>
        <p>
          Onko jokin rikki, puuttuuko ominaisuus tai onko sinulla idea miten
          parantaisit sovellusta? Ota yhteyttä palaute@saaennuste.fi.
        </p>

        <share-app></share-app>
      </weather-section>
    `;
  }
}

window.customElements.define(WeatherInfo.is, WeatherInfo);
