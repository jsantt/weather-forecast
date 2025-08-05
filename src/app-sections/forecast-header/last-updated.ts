import { LitElement, html, css, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

@customElement('last-updated')
export class LastUpdated extends LitElement {
  static styles = css`
    :host {
      display: inline-block;
    }
  `;

  @property({ type: Object })
  lastUpdated?: Date;

  @state()
  private minutesAgo?: number = undefined;

  private timerId: number | undefined;

  connectedCallback() {
    super.connectedCallback();
    this.updateMinutesAgo();
    this.startTimer();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.stopTimer();
  }

  protected willUpdate(changedProps: PropertyValues<this>) {
    if (changedProps.has('lastUpdated')) {
      this.updateMinutesAgo();
      this.restartTimer();
    }
  }

  private updateMinutesAgo() {
    if (this.lastUpdated === undefined) {
      return undefined;
    }
    const now = Date.now();
    const diff = Math.max(0, now - this.lastUpdated.getTime());
    this.minutesAgo = Math.floor(diff / 60000);
  }

  private startTimer() {
    this.stopTimer();
    this.timerId = window.setInterval(() => {
      if (this.minutesAgo !== undefined) {
        this.minutesAgo += 1;
      }
    }, 60000);
  }

  private stopTimer() {
    clearInterval(this.timerId);
    this.timerId = undefined;
  }

  private restartTimer() {
    this.updateMinutesAgo();
    this.startTimer();
  }

  render() {
    if (this.minutesAgo === undefined) {
      return null;
    }
    return html`
      <span class="last-updated">
        ${this.minutesAgo === 0
          ? 'Nyt'
          : html`${this.minutesAgo} minuutti${this.minutesAgo === 1 ? '' : 'a'}
            sitten`}
      </span>
    `;
  }
}
