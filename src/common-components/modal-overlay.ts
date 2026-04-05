import { css, html, LitElement, PropertyValues } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';

@customElement('modal-overlay')
export class ModalOverlay extends LitElement {
  @property({ type: Boolean }) open = false;

  /**
   * Preserve content in the modal when it's closed. This can be used to keep the state of the content, for example form inputs, when the modal is closed. By default, the content is removed from the DOM when the modal is closed.
   */
  @property({ type: Boolean }) preserveContent = false;

  @query('dialog') private dialog!: HTMLDialogElement;

  static styles = css`
    dialog {
      background: var(--modal-overlay-background, var(--background-topmost));
      border: none;
      border-radius: 1.5rem;

      margin-top: var(--space-l);
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
      ${this.open
        ? html`<dialog class="overlay" @close="${this.handleClose}">
            <slot></slot>
          </dialog>`
        : this.preserveContent
        ? html` <slot></slot> `
        : null}
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
