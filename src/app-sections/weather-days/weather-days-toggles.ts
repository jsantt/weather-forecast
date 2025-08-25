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
    .toggles {
      background: var(--background-middle);
      border-radius: var(--border-radius);
      display: grid;
      gap: var(--space-m);
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
  `;

  private _emitToggle(eventName: string, value: boolean) {
    this.dispatchEvent(
      new CustomEvent(eventName, {
        detail: value,
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    return html`
      <div class="toggles">
        <div class="info">Valitse näytettävät lisätiedot (beta)</div>
        <switch-toggle
          ?checked=${this.showRainProbability}
          @switch-toggle.change=${(e: { detail: boolean }) =>
            this._emitToggle('toggle-rain-probability', e.detail)}
          >Sateen todennäköisyys</switch-toggle
        >

        <switch-toggle
          ?checked=${this.showThunderProbability}
          @switch-toggle.change=${(e: { detail: boolean }) =>
            this._emitToggle('toggle-thunder-probability', e.detail)}
          >Ukkosen todennäköisyys</switch-toggle
        >

        <switch-toggle
          ?checked=${this.showWind}
          @switch-toggle.change=${(e: { detail: boolean }) =>
            this._emitToggle('toggle-wind', e.detail)}
          >Tuuli</switch-toggle
        >
        <p class="description">
          Tuulen nopeus ilmoitetaan 10 minuutin keskiarvona. Puuskatuulen
          nopeutena käytetään 10 minuutin aikana mitatun kolmen sekunnin
          suurinta nopeutta. Heikossa tuulessa (alle 3,4m/s): vain lehdet
          heiluvat. Kohtalaisessa tuulessa (3,4-7,9m/s) oksat heiluvat ja
          kevyitä esineitä voi liikkua. Kovassa tuulessa (8,0-13,8m/s) pienet
          puut taipuvat, kevyt irtoava tavara voi kulkea maata pitkin.
          Myrskytuuli (yli 20,8m/s) voi kaataa puita ja aiheuttaa vahinkoa
          rakenteille.
        </p>

        <switch-toggle
          ?checked=${this.showPressure}
          @switch-toggle.change=${(e: { detail: boolean }) =>
            this._emitToggle('toggle-pressure', e.detail)}
          >Ilmanpaine</switch-toggle
        >
        <p class="description">
          Korkeapaine tarkoittaa aluetta, jossa ilmanpaine on ympäristöä
          korkeampi. Korkeapaineessa ilma laskee alaspäin, kuivuu ja
          lämmetessään estää pilvien muodostumista, minkä vuoksi sää on usein
          selkeä ja poutainen. Matalapaine taas on alue, jossa ilmanpaine on
          ympäristöä matalampi. Siinä ilma nousee ylöspäin, jäähtyy ja vesihöyry
          tiivistyy pilviksi, mikä johtaa pilvisyyteen, sateisiin ja tuulisiin
          säihin. Matalapaineet tuovat siis epävakaisempaa ja vaihtelevampaa
          säätä.
        </p>
        <switch-toggle
          ?checked=${this.showHumidity}
          @switch-toggle.change=${(e: { detail: boolean }) =>
            this._emitToggle('toggle-humidity', e.detail)}
          >Suhteellinen ilmankosteus</switch-toggle
        >
        <p class="description">
          Suhteellinen ilmankosteus ilmaisee prosentteina, kuinka paljon vettä
          ilma sisältää suhteessa siihen, kuinka paljon se voi maksimissaan
          sisältää kyseisessä lämpötilassa. Korkea ilmankosteus voi tiivistyä
          pilviksi ja sateeksi. Se estää hien haihtumista ja saa ilman tuntumaan
          lämpimämmältä.
        </p>
      </div>
    `;
  }
}
