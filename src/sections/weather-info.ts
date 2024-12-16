import { css, html, LitElement } from 'lit';
import '../weather-section';
import '../common-components/svg-icon';

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

      p + p {
        margin-top: var(--space-m);
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
    `;
  }

  render() {
    return html`
      <weather-section green padding liftedHeading="Sääennuste.fi">
        <svg-icon
          medium
          class="info-icon"
          path="assets/image/icons.svg#info"
        ></svg-icon>

        <p>
          Sääennuste kokoaa Ilmatieteen laitoksen havainnot, sääennusteen,
          sadetutkan jne yhteen. Näet tuntikohtaiset sadepylväät, tuuli- sade-
          ja lumimäärät yhdellä vilkaisulla &ndash; myös kännykän ruudulta.
        </p>

        <h3>Sää nyt</h3>
        <p>
          Sää nyt lasketaan lähistön sääasemien tiedoista. Sääasemat näkyvät
          "kartalla" oikeassa suunnassas siten, että päällekkäin meneviä asemia
          on siirretty mahdollisimman vähän. Klikkaamalla sääasemaa, näet kaikki
          asemalta saatavissa olevat tiedot.
        </p>

        <h3>Ilmatieteen laitoksen sää</h3>
        <p>
          Sääennuste perustuu Ilmatieteen laitoksen tarkimpaan ja
          luotettavimpaan
          <a
            href="http://ilmatieteenlaitos.fi/tutkimustoiminta/-/asset_publisher/Dz9C/content/uusin-versio-harmonie-arome-saamallista-parantaa-pilvisyyden-ja-tuulen-ennusteita?redirect=http%3A%2F%2Filmatieteenlaitos.fi%2Ftutkimustoiminta%3Fp_p_id%3D101_INSTANCE_Dz9C%26p_p_lifecycle%3D0%26p_p_state%3Dnormal%26p_p_mode%3Dview%26p_p_col_id%3Dcolumn-2%26p_p_col_count%3D2"
          >
            Harmonie-malliin</a
          >. Ilmatieteen laitos käyttää myös muita malleja, joten ennuste
          saattaa poiketa niistä.
          <i>Tuntuu kuin</i>
          lasketaan Ilmatieteen laitoksen kaavalla.
        </p>

        <h3>Yksityisyys</h3>
        Palvelu ei käytä evästeitä. Sivuston kävijämäärä ja käyttäytyminen
        kerätään käyttäjää tunnistamatta eikä sinun tarvitse hyväksyä turhia
        käyttöehtoja.
        <div slot="footer-left"></div>
        <div slot="footer-right">
          <svg-icon path="assets/image/icons.svg#cookie"></svg-icon>
        </div>

        <h3>Palaute</h3>
        <p>
          Onko jokin rikki, puuttuuko ominaisuus tai onko sinulla idea miten
          parantaisit sovellusta? palaute@saaennuste.fi
        </p>
      </weather-section>
    `;
  }
}

window.customElements.define(WeatherInfo.is, WeatherInfo);
