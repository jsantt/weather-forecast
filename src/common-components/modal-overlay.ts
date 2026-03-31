import { css, html, LitElement, PropertyValues } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';

@customElement('modal-overlay')
export class ModalOverlay extends LitElement {
  @property({ type: Boolean }) open = false;

  @query('dialog') private dialog!: HTMLDialogElement;

  static styles = css`
    dialog {
      border: none;s
      z-index: var(--z-index-floating-2);
    }

    dialog::backdrop {
      background: rgba(0, 0, 0, 0.5);
    }
  `;

  updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);
    if (changedProperties.has('open') && this.dialog) {
      if (this.open) {
        this.dialog.showModal();
      } else {
        this.dialog.close();
      }
    }
  }

  render() {
    return html`
      <dialog class="overlay" @close="${this.handleClose}">
        <slot></slot>
      </dialog>
    `;
  }

  private handleClose() {
    this.open = false;
    this.dispatchEvent(
      new CustomEvent('modal-overlay.close', {
        bubbles: true,
        composed: true,
      })
    );
  }
}
