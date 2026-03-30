import { css, html, LitElement, PropertyValues } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';

@customElement('modal-overlay')
export class ModalOverlay extends LitElement {
  @property({ type: Boolean }) open = false;

  @query('dialog') private dialog!: HTMLDialogElement;

  static styles = css`
    :host {
      display: none;
    }

    :host([open]) {
      display: block;
    }

    .overlay {
      background-color: rgba(0, 0, 0, 0.7);
      padding: var(--space-l);

      position: fixed;
      right: 0;
      bottom: 0;
      left: 0;
      top: 0;

      overflow-y: auto;
      z-index: var(--z-index-floating-2);
    }

    :host([open]) .overlay {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .content {
      max-width: 500px;
    }

    :host([open]) .content {
      width: 100%;
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
        <div class="content" @click="${this.handleContentClick}">
          <slot></slot>
        </div>
      </dialog>
    `;
  }

  private handleContentClick(event: Event) {
    event.stopPropagation();
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
