import { css, html, LitElement } from 'lit-element';

import '../common/svg-icon.js';

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
      .combobox {
        position: relative;
        display: inline-block;
        width: 100%;
      }

      .magnifier {
        fill: var(--color-red-500);
        position: absolute;
        left: 2px;
        top: 2px;
        vertical-align: center;
        width: 36px;
        height: 36px;
        visibility: hidden;
      }
      .refresh {
        fill: var(--color-blue-700);
        position: absolute;
        right: 2px;
        top: 1px;
        width: 32px;
        height: 32px;
        padding: var(--space-s);
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

      label {
        /* hide visually */
        position: absolute !important;
        clip: rect(1px, 1px, 1px, 1px);
        padding: 0 !important;
        border: 0 !important;
        height: 1px !important;
        width: 1px !important;
        overflow: hidden;
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

      #combobox-list {
        background: var(--color-gray-300);

        color: var(--color-gray-600);
        position: absolute;

        z-index: var(--z-index-floating-2);
        /* position the combobox list items to be the same width as the container */
        top: 100%;
        left: 0;
        right: 0;
      }

      /* when navigating through the items using the arrow keys: */
      li[aria-selected='true'],
      li:hover {
        background: var(--color-blue-800);
        color: var(-color-gray-300);
      }

      li[aria-selected='true'] strong,
      li:hover strong {
        background: var(--color-blue-800);
        color: var(--color-white);
      }

      strong {
        color: var(--color-blue-800);
      }
    `;
  }

  render() {
    return html`
      <form autocomplete="off" spellcheck="false">
        <label id="label" for="comboInput">
          Valitse kaupunki
        </label>
        <div
          class="combobox"
          role="combobox"
          aria-owns="combobox-list"
          aria-haspopup="true"
          aria-expanded="${this._open === true ? 'true' : 'false'}"
        >
          <svg-icon
            class="magnifier"
            path="assets/image/icons.svg#magnifier"
          ></svg-icon>
          <input
            id="comboInput"
            type="text"
            name="myCountry"
            .value="${this.currentValue}"
            aria-label="Sää paikassa"
            aria-labelledby="label"
            @click="${this._onInputClick}"
          />
          <svg-icon
            @click="${this._refresh}"
            class="refresh"
            path="assets/image/icons.svg#refresh"
          ></svg-icon>
          ${this._open === true
            ? html`
                <ul
                  @mouseover="${this._clearSelected}"
                  id="combobox-list"
                  aria-labelledBy="label"
                  role="listbox"
                >
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
          this._filteredItems = this.items;
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

  _refresh() {
    if (this.currentValue === '') {
      this.currentValue = this._previousValue;
    }
    this._closeCombobox();

    this._dispatch('combo-box.new-value', this.currentValue);
  }

  _setFocus(itemIndex) {
    this._clearSelected();

    const items = this.shadowRoot.querySelectorAll('li');

    if (items[itemIndex] === undefined) {
      this._focusIndex = -1;
    } else {
      items[itemIndex].setAttribute('aria-selected', 'true');
      items[itemIndex].scrollIntoView(false);
    }
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
  _closeCombobox() {
    this._open = false;
    if (this._combobox.value === '') {
      this.currentValue = this._previousValue;
    }
  }

  _onItemClick(event) {
    const clickedValue = event.target.querySelector('input').value;
    this._dispatch('combo-box.new-value', clickedValue);

    this._closeCombobox();
  }

  _clearSelected() {
    this.shadowRoot.querySelectorAll('li').forEach(item => {
      item.removeAttribute('aria-selected');
    });
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
        const selectedItem = this.shadowRoot.querySelectorAll('li')[
          this._focusIndex
        ];
        if (selectedItem !== undefined) {
          selectedItem.click();
        }

        break;
      case 27:
        this._closeCombobox();
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
