import { css, html, LitElement } from 'lit-element';

import '../common/svg-icon.js';
/**
 * Based on https://www.w3schools.com/howto/howto_js_autocomplete.asp
 */
class ComboBox extends LitElement {
  static get is() {
    return 'combo-box';
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }

      ::selection {
        background-color: var(--color-yellow-500);
      }

      ul {
        list-style-type: none;
        padding: 0;
        margin: 0;
        max-height: 500px;
        overflow-y: auto;
      }

      li {
        padding: var(--space-m) var(--space-s);
        margin: 0;
      }

      /*the container must be positioned relative:*/
      .autocomplete {
        position: relative;
        display: inline-block;
        width: 100%;
      }

      svg {
        display: inline-block;
        fill: var(--color-red-500);
        position: absolute;
        left: 2px;
        top: 2px;
        vertical-align: center;
      }

      :host([loading]) svg {
        animation: swing ease-in-out 2s infinite alternate;
        transform-origin: 24px 24px;
      }

      :host([loading]) input[type='text'] {
        color: var(--color-gray-500);
      }

      @keyframes swing {
        0% {
          transform: rotate(15deg);
        }
        100% {
          transform: rotate(-15deg);
        }
      }

      input[type='text'] {
        background-color: rgba(245, 245, 245, 0.93);

        background: var(--color-gray-400);
        border: none;
        border-radius: var(--border-radius);

        color: var(--color-blue-800);
        padding: var(--space-s) var(--space-l);
        font-size: var(--font-size-l);
        font-family: var(--font-family-primary);
        font-weight: var(--font-weight-bold);
        text-align: center;

        transition: padding 0.5s ease;
        /*user-select: none;
        -webkit-user-select: none;*/
      }

      input[type='text']:focus {
        border: 2px solid #d6dde554;
        padding-left: 3rem;
        padding-right: 3rem;
        outline: none;

        transition: padding 0.5s ease;
      }

      .autocomplete-items {
        background: var(--color-gray-300);

        color: var(--color-gray-600);
        position: absolute;

        z-index: var(--z-index-floating-2);
        /*position the autocomplete items to be the same width as the container:*/
        top: 100%;
        left: 0;
        right: 0;
      }

      .autocomplete-items div {
        padding: 10px;
        cursor: pointer;
      }

      /*when hovering an item:*/
      .autocomplete-items div:hover {
        background: var(--color-blue-800);
        color: var(-color-gray-300);
      }

      .autocomplete-items div:hover strong {
        color: var(--color-white);
      }

      /* when navigating through the items using the arrow keys: */
      li[selected] {
        background: var(--color-blue-800);
        color: var(-color-gray-300);
      }

      .autocomplete-active strong {
        background: var(--color-blue-800);
        color: var(--color-white);
      }

      strong {
        color: var(--color-black);
      }
    `;
  }

  render() {
    return html`
      <form autocomplete="off" spellcheck="false">
        <div class="autocomplete">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="36"
            viewBox="0 0 24 24"
            width="36"
          >
            <path d="M0 0h24v24H0V0z" fill="none" />
            <path
              d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
            />
          </svg>

          <input
            id="comboInput"
            type="text"
            name="myCountry"
            .value="${this.currentValue}"
            aria-label="Sää paikassa"
            @click="${this._onInputClick}"
          />
          ${this._open === true
            ? html`
                <ul id="autocomplete-list" class="autocomplete-items">
                  ${this._filteredItems.map(item => {
                    return html` <li
                      tabindex="-1"
                      @click="${this._onItemClick}"
                    >
                      ${this._highlightMatch(item.city)}
                      <input type="hidden" value="${item.city}" />
                    </li>`;
                  })}
                </ul>
              `
            : ''}
        </div>
      </form>
      <!-- example output -->
      <!--form autocomplete="off" spellcheck="false">
        <div class="autocomplete">
          <input
            id="comboInput"
            type="text"
            name="myCountry"
            aria-label="Sää paikassa"
          />
          <ul id="autocomplete-list" class="autocomplete-items">
            <li tabindex="-1">
              <strong>E</strong>spoo<input type="hidden" value="Espoo" />
            </li>
            <li tabindex="-1" class="autocomplete-active">
              <strong>E</strong>ckerö<input type="hidden" value="Eckerö" />
            </li>
          </ul>
        </div>
      </form-->
    `;
  }

  static get properties() {
    return {
      currentValue: { type: String, reflect: true },
      items: { type: Array },
      key: { type: String, reflect: true },
      loading: { type: Boolean, reflect: true },
      _filteredItems: { type: Array },
      _focusIndex: { type: Number, reflect: true },
      _open: { type: Boolean, reflect: true },
      _previousValue: { type: Object },
    };
  }

  constructor() {
    super();
    this._filteredItems = [];
  }

  firstUpdated() {
    this._combobox.addEventListener('input', () => {
      const inputValue = this._combobox.value;
      this._filteredItems = this._filterItems(inputValue);
      this._openCombobox();
    });

    this._combobox.addEventListener('keydown', event => {
      this._onKeyPress(event);
    });
  }

  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName === 'currentValue') {
        this._combobox.value = this.currentValue;

        if (this.currentValue === '') {
          this._openCombobox();

          this._focusIndex = -1;
        }
      }
    });
  }

  _onInputClick() {
    if (this.currentValue !== undefined && this.currentValue.length > 0) {
      this._previousValue = this.currentValue;
    }
    this._dispatch('combo-box.clicked');
  }

  _setFocus(itemIndex) {
    const items = this.shadowRoot.querySelectorAll('li');

    if (itemIndex < 0 || itemIndex > this._filteredItems.length) {
    }

    items[itemIndex].setAttribute('selected', 'true');
    items[itemIndex - 1].removeAttribute('selected');
    items[itemIndex + 1].removeAttribute('selected');
  }

  _filterItems(filterText) {
    const filtered = this.items.filter(item => {
      return (
        item.city.substr(0, filterText.length).toLowerCase() ===
        filterText.toLowerCase()
      );
    });

    return filtered;
  }

  _highlightMatch(city) {
    const inputValue = this._combobox.value;

    return html`<strong>${city.substr(0, inputValue.length)}</strong
      >${city.substr(inputValue.length)}`;
  }

  _openCombobox() {
    this._open = true;
  }

  _onItemClick(event) {
    const clickedValue = event.target.querySelector('input').value;
    this._dispatch('combo-box.new-value', clickedValue);

    this._open = false;
  }

  /**
   * Handle keyboard navigation
   * @param {*} event
   */
  _onKeyPress(event) {
    switch (event.keyCode) {
      case 40 /* arrow DOWN */:
        this._focusIndex += 1;

        this._setFocus(this._focusIndex);
        break;

      case 38 /* arrow UP */:
        this._focusIndex--;
        this._setFocus(this._focusIndex);
        break;

      case 13:
        /* If the ENTER key is pressed, prevent the form from being submitted, */
        event.preventDefault();

        // and simulate a click on the "focused" item
        this.shadowRoot.querySelectorAll('li')[this._focusIndex].click();

        break;
      case 27:
        console.log('TODO close on ESC character');
      default:
    }
  }

  _dispatch(eventName, message) {
    const event = new CustomEvent(eventName, {
      detail: message,
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }

  get _combobox() {
    return this.shadowRoot.getElementById('comboInput');
  }
}

window.customElements.define(ComboBox.is, ComboBox);
