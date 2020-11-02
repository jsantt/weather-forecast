import { css, html, LitElement } from 'lit-element';

class TimeNow extends LitElement {
  static get is() {
    return 'time-now';
  }

  static get styles() {
    return css`
      :host {
        display: block;
        margin-left: -1rem;
        width: 100%;
        margin-top: var(--space-m);
        margin-bottom: -0.25rem;
      }

      .time {
        color: var(--color-white);
        fill: var(--color-white);
        white-space: nowrap;
        font-size: var(--font-size-m);

        background-color: var(--color-tertiary);
        display: inline-block;
        padding: 0 var(--space-l) 0 var(--space-m);
        border-top-left-radius: 1.25rem;
        border-top-right-radius: 1.25rem;
        vertical-align: bottom;
      }

      .visually-hidden {
        position: absolute !important;
        clip: rect(1px, 1px, 1px, 1px);
        padding: 0 !important;
        border: 0 !important;
        height: 1px !important;
        width: 1px !important;
        overflow: hidden;
      }
    `;
  }

  render() {
    return html`
      <div class="time" style="${this._timeMargin}">
        <svg style="width:12px;height:12px" viewBox="0 0 24 24">
          <path
            d="M12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22C6.47,22 2,17.5 2,12A10,10 0 0,1 12,2M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z"
          ></path>
        </svg>
        <span class="visually-hidden">Kello</span>
        ${this.timeNow}
      </div>
    `;
  }

  static get properties() {
    return {
      updateTime: {
        type: Boolean,
        reflect: true,
      },
      _timeMargin: {
        type: String,
      },
      timeNow: {
        type: String,
      },
    };
  }

  updated() {
    this._updateTime();
  }

  _calculateMargin() {
    const hours = new Date().getHours();

    const visualCorrection = -3;
    const margin = ((hours - 1) / 24) * 100 + visualCorrection;

    const correctLeftOverflow = Math.max(10, margin);
    const correctRightOverflow = Math.min(correctLeftOverflow, 80);

    this._timeMargin = `margin-left:${correctRightOverflow}%`;
  }

  _timeNow() {
    const now = new Date();
    const minutes = now.getMinutes();

    const fullMinutes = minutes < 10 ? `0${minutes}` : minutes;

    const time = `${now.getHours()}.${fullMinutes}`;
    this.timeNow = time;
  }

  _updateTime() {
    this._calculateMargin();
    this._timeNow();
  }
}

window.customElements.define(TimeNow.is, TimeNow);
