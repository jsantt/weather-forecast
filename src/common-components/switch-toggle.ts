import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('switch-toggle')
export class SwitchToggle extends LitElement {
  @property({ type: Boolean, reflect: true })
  checked = false;

  static styles = css`
    :host {
      display: inline-block;
    }
    label {
      display: flex;
      align-items: center;
      gap: 0.5em;
    }
    input[type='checkbox'] {
      accent-color: var(--switch-toggle-accent, #0078d4);
    }
  `;

  render() {
    return html`
      <label>
        <input
          type="checkbox"
          switch
          ?checked=${this.checked}
          @change=${this._onChange}
        />
        <slot></slot>
      </label>
    `;
  }

  private _onChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.dispatchEvent(
      new CustomEvent('switch-toggle.change', {
        detail: input.checked,
        bubbles: true,
        composed: true,
      })
    );
  }
}
