import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import '../../common-components/switch-toggle.ts';

@customElement('weather-days-toggles')
export class WeatherDaysToggles extends LitElement {
  @property({ type: Boolean }) showWind = false;
  @property({ type: Boolean }) showRainProbability = true;
  @property({ type: Boolean }) showThunderProbability = true;
  @property({ type: Boolean }) showPressure = false;
  @property({ type: Boolean }) showHumidity = false;

  static styles = css`
    .close {
      text-align: right;
    }

    .toggles {
      border-radius: var(--border-radius);
      display: grid;
      gap: var(--space-l);

      max-width: 500px;

      padding: var(--space-l);
    }
    .info {
      font-weight: var(--font-weight-bold);
      padding-bottom: var(--space-s);
    }
    .description {
      font-size: var(--font-size-xs);
      margin: 0 0 var(--space-l) 0;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .close-icon {
      color: var(--color-dark-and-light);
      fill: var(--color-dark-and-light);

      width: 40px;
      height: 40px;
      padding: var(--space-s);
    }
  `;

  render() {
    return html`
      <div class="modal">
        <div class="toggles">
          <div class="header">
            <div class="info">Valitse näytettävät lisätiedot (beta)</div>
            <div class="close">
              <svg-icon
                @click="${() =>
                  this.closeModal('weather-day-toggles.close-modal')}"
                class="close-icon"
                path="assets/image/icons.svg#close"
              ></svg-icon>
            </div>
          </div>
          <switch-toggle
            ?checked=${this.showRainProbability}
            @switch-toggle.change=${(e: { detail: boolean }) =>
              this.emitToggle('toggle-rain-probability', e.detail)}
            >Sateen todennäköisyys</switch-toggle
          >

          <switch-toggle
            ?checked=${this.showThunderProbability}
            @switch-toggle.change=${(e: { detail: boolean }) =>
              this.emitToggle('toggle-thunder-probability', e.detail)}
            >Ukkosen todennäköisyys</switch-toggle
          >

          <switch-toggle
            ?checked=${this.showWind}
            @switch-toggle.change=${(e: { detail: boolean }) =>
              this.emitToggle('toggle-wind', e.detail)}
            >Tuuli</switch-toggle
          >
          <p class="description">
            Tuulen nopeus ilmoitetaan 10 minuutin keskiarvona. Puuskatuulen
            nopeutena käytetään 10 minuutin aikana mitatun kolmen sekunnin
            suurinta nopeutta. Heikossa tuulessa (alle 3,4 m/s): vain lehdet
            heiluvat. Kohtalaisessa tuulessa (3,4-7,9 m/s) oksat heiluvat ja
            kevyitä esineitä voi liikkua. Kovassa tuulessa (8,0-13,8 m/s) pienet
            puut taipuvat, kevyt irtoava tavara voi kulkea maata pitkin.
            Myrskytuuli (yli 20,8 m/s) voi kaataa puita ja aiheuttaa vahinkoa
            rakenteille.
          </p>

          <switch-toggle
            ?checked=${this.showPressure}
            @switch-toggle.change=${(e: { detail: boolean }) =>
              this.emitToggle('toggle-pressure', e.detail)}
            >Ilmanpaine</switch-toggle
          >
          <p class="description">
            Korkeapaine tarkoittaa aluetta, jossa ilmanpaine on ympäristöä
            korkeampi. Korkeapaineessa ilma laskee alaspäin, kuivuu ja
            lämmetessään estää pilvien muodostumista, minkä vuoksi sää on usein
            selkeä ja poutainen. Matalapaine taas on alue, jossa ilmanpaine on
            ympäristöä matalampi. Siinä ilma nousee ylöspäin, jäähtyy ja
            vesihöyry tiivistyy pilviksi, mikä johtaa pilvisyyteen, sateisiin ja
            tuulisiin säihin. Matalapaineet tuovat siis epävakaisempaa ja
            vaihtelevampaa säätä.
          </p>
          <switch-toggle
            ?checked=${this.showHumidity}
            @switch-toggle.change=${(e: { detail: boolean }) =>
              this.emitToggle('toggle-humidity', e.detail)}
            >Suhteellinen ilmankosteus</switch-toggle
          >
          <p class="description">
            Suhteellinen ilmankosteus ilmaisee prosentteina, kuinka paljon vettä
            ilma sisältää suhteessa siihen, kuinka paljon se voi maksimissaan
            sisältää kyseisessä lämpötilassa. Korkea ilmankosteus voi tiivistyä
            pilviksi ja sateeksi. Se estää hien haihtumista ja saa ilman
            tuntumaan lämpimämmältä.
          </p>
        </div>
      </div>
    `;
  }

  private emitToggle(eventName: string, value: boolean) {
    this.dispatchEvent(
      new CustomEvent(eventName, {
        detail: value,
        bubbles: true,
        composed: true,
      })
    );
  }

  private closeModal(eventName: string) {
    this.dispatchEvent(
      new CustomEvent(eventName, {
        bubbles: true,
        composed: true,
      })
    );
  }
}
