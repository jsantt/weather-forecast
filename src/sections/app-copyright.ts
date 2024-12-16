import { css, html, LitElement } from 'lit';
import '../weather-section';
import '../common-components/svg-icon';

class AppCopyright extends LitElement {
  static get is() {
    return 'app-copyright';
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }

      svg-icon {
        fill: var(--color-dark-and-light);
      }
    `;
  }

  render() {
    return html`
      <weather-section padding>
        <svg-icon path="assets/image/icons.svg#copyright"></svg-icon>
        <div>Säädata ja symbolit Ilmatieteen laitos</div>
      </weather-section>
    `;
  }
}

window.customElements.define(AppCopyright.is, AppCopyright);
