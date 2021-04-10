import { css, html, LitElement } from 'lit-element';

import '../../common-components/smooth-expand.js';
import '../../common-components/svg-icon.js';

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

      .refresh {
        fill: var(--color-blue-650);
        position: absolute;
        right: 2px;
        top: 4px;
        width: 32px;
        height: 32px;
        padding: var(--space-s);
      }

      :host([_loadingPlus]) .refresh {
        animation: spin 1s infinite linear;
        transform-origin: center center;
      }

      :host([_loadingPlus]) input[type='text'],
      :host([_loadingPlus]) .refresh {
        color: var(--color-gray-600);
        fill: var(--color-gray-600);
      }

      @keyframes spin {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
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
        background: var(--color-gray-300);
        border: none;
        border-radius: 30px;
        box-shadow: var(--box-shadow);

        color: var(--color-blue-800);
        font-size: var(--font-size-l);
        font-family: var(--font-family-primary);
        font-weight: var(--font-weight-bold);

        margin: 0;
        min-width: 15rem;
        padding: 0.425rem var(--space-l);
        text-align: center;

        transition: padding var(--transition-time),
          border-radius 0.15s ease var(--transition-time);
        /*user-select: none;
        -webkit-user-select: none;*/
        -webkit-appearance: none;
      }

      :host([_open]) input[type='text'] {
        border-radius: var(--border-radius);
        padding-left: 2rem;
        padding-right: 2rem;
        transition: padding var(--transition-time);
      }

      input[type='text']:focus {
        border: 2px solid #d6dde554;
        outline: none;
      }

      smooth-expand {
        --transition: max-height var(--transition-time);

        margin-top: -3px;
        position: absolute;

        z-index: var(--z-index-floating-2);
        /* position the combobox list items to be the same width as the container */
        top: 100%;
        left: 0;
        right: 0;

        background: var(--color-gray-300);

        color: var(--color-gray-600);
      }

      /* when navigating through the items using the arrow keys: */
      li[aria-selected='true'],
      li:hover {
        background: var(--color-blue-650);
        color: var(-color-gray-300);
      }

      li[aria-selected='true'] strong,
      li:hover strong {
        background: var(--color-blue-800);
        color: var(--color-white);
      }

      strong {
        color: var(--color-blue-650);
      }
    `;
  }

  render() {
    return html`
      <form autocomplete="off" spellcheck="false">
        <label id="label" for="comboInput"> Valitse kaupunki </label>
        <div
          class="combobox"
          role="combobox"
          aria-owns="combobox-list"
          aria-haspopup="true"
          aria-expanded="${this._open === true ? 'true' : 'false'}"
        >
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
            path="${this._open === true
              ? 'assets/image/icons.svg#close'
              : 'assets/image/icons.svg#refresh'}"
          ></svg-icon>
          <smooth-expand ?expanded="${this._open}">
            <ul
              @mouseover="${this._clearSelected}"
              id="combobox-list"
              aria-labelledBy="label"
              role="listbox"
            >
              ${this._filteredItems.map(item => {
                return html` <li tabindex="-1" @click="${this._onItemClick}">
                  ${this._highlightMatch(item.city)}
                  <input type="hidden" .value="${item.city}" />
                </li>`;
              })}
            </ul>
          </smooth-expand>
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
      // loading plus some delay, as users might not otherwise notice the loading
      _loadingPlus: { type: Boolean, reflect: true },
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
        } else {
          this._closeCombobox();
        }
      }

      if (propName === 'loading') {
        if (this.loading === true) {
          this._loadingPlus = this.loading;
        } else {
          setTimeout(() => {
            this._loadingPlus = this.loading;
          }, 1000);
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
    let clickedElement = event.target.querySelector('input');
    if (clickedElement === null) {
      clickedElement = event.target.parentElement.querySelector('input');
    }

    this._dispatch('combo-box.new-value', clickedElement.value);

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
        this._focusIndex -= 1;
        this._setFocus(this._focusIndex);
        break;

      case 13: {
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
      }
      case 27:
        this._closeCombobox();
        break;
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
