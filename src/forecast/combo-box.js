import { css, html, LitElement } from 'lit-element';

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
        fill: var(--color-gray-500);
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

        /*background: var(--color-gray-400);*/
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
      .autocomplete-active {
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
      <!--Make sure the form has the autocomplete function switched off:-->
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
            @click="${() => this._onInputClick()}"
          />
        </div>
        <!--input type="submit" /-->
      </form>
    `;
  }

  static get properties() {
    return {
      currentValue: { type: String, reflect: true },
      items: { type: Array },
      key: { type: String, reflect: true },
      loading: { type: Boolean, reflect: true },
      _previousValue: { type: Object, reflect: true },
    };
  }

  constructor() {
    super();

    this.currentFocus;
  }

  firstUpdated() {
    /* initiate the autocomplete function on the "comboInput" element, and pass along the countries array as possible autocomplete values: */
    this.autocomplete(
      this.shadowRoot.getElementById('comboInput'),
      this.items,
      this.key
    );
  }

  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName === 'currentValue') {
        this.shadowRoot.getElementById('comboInput').value = this.currentValue;
      }
    });
  }

  _onInputClick() {
    if (this.currentValue !== undefined && this.currentValue.length > 0) {
      this._previousValue = this.currentValue;
    }
    this.shadowRoot.querySelector('input[type=text]').select();
    // this._dispatch('combo-box.new-value', '');
  }

  _onInputBlur() {
    if (this.currentValue === '' && this._isOpen() === false) {
      this.currentValue = this._previousValue;
    }
  }

  /* is combobox open */
  _isOpen() {
    return this.shadowRoot.querySelector('#autocomplete-list') !== null;
  }

  autocomplete(inp, arr, key) {
    /* the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values: */

    /* execute a function when someone writes in the text field: */
    inp.addEventListener('input', () => {
      let a;
      let b;
      let i;
      const val = this.shadowRoot.querySelector('input').value;
      /* close any already open lists of autocompleted values */
      this.closeAllLists(undefined, inp);
      if (!val) {
        return false;
      }
      this.currentFocus = -1;
      /* create a DIV element that will contain the items (values): */
      a = document.createElement('DIV');
      a.setAttribute('id', `${this.id}autocomplete-list`);
      a.setAttribute('class', 'autocomplete-items');
      /* append the DIV element as a child of the autocomplete container: */
      this.shadowRoot.querySelector('div').appendChild(a);
      /* for each item in the array... */
      for (i = 0; i < arr.length; i += 1) {
        /* check if the item starts with the same letters as the text field value: */
        if (
          arr[i][this.key].substr(0, val.length).toUpperCase() ==
          val.toUpperCase()
        ) {
          /* create a DIV element for each matching element: */
          b = document.createElement('DIV');
          /* make the matching letters bold: */
          b.innerHTML = `<strong>${arr[i][key].substr(0, val.length)}</strong>`;
          b.innerHTML += arr[i][key].substr(val.length);
          /* insert a input field that will hold the current array item's value: */
          b.innerHTML += `<input type='hidden' value='${arr[i][key]}'>`;
          /* execute a function when someone clicks on the item value (DIV element): */
          b.addEventListener('click', event => {
            let clickedValue;
            /* insert the value for the autocomplete text field: */
            if (event.target.querySelector('input') === null) {
              // when clicked to <strong> element
              clickedValue = event.target.parentNode.querySelector('input')
                .value;
            } else {
              clickedValue = event.target.querySelector('input').value;
            }
            this._dispatch('combo-box.new-value', clickedValue);
            /* close the list of autocompleted values,
                (or any other open lists of autocompleted values: */
            this.closeAllLists(undefined, inp);
          });
          a.appendChild(b);
        }
      }
    });
    /* execute a function presses a key on the keyboard: */
    inp.addEventListener('keydown', e => {
      let x = this.shadowRoot.getElementById(`${this.id}autocomplete-list`);
      if (x) x = x.getElementsByTagName('div');
      if (e.keyCode == 40) {
        /* If the arrow DOWN key is pressed,
          increase the this.currentFocus variable: */
        this.currentFocus += 1;
        /* and and make the current item more visible: */
        this.addActive(x);
      } else if (e.keyCode == 38) {
        // up
        /* If the arrow UP key is pressed,
          decrease the this.currentFocus variable: */
        this.currentFocus--;
        /* and and make the current item more visible: */
        this.addActive(x);
      } else if (e.keyCode == 13) {
        /* If the ENTER key is pressed, prevent the form from being submitted, */
        e.preventDefault();
        if (this.currentFocus > -1) {
          /* and simulate a click on the "active" item: */
          if (x) x[this.currentFocus].click();
        }
      }
    });
  }

  addActive(x) {
    /* a function to classify an item as "active": */
    if (!x) return false;
    /* start by removing the "active" class on all items: */
    this.removeActive(x);
    if (this.currentFocus >= x.length) this.currentFocus = 0;
    if (this.currentFocus < 0) this.currentFocus = x.length - 1;
    /* add class "autocomplete-active": */
    x[this.currentFocus].classList.add('autocomplete-active');
  }

  removeActive(x) {
    /* a function to remove the "active" class from all autocomplete items: */
    for (let i = 0; i < x.length; i++) {
      x[i].classList.remove('autocomplete-active');
    }
  }

  closeAllLists(elmnt, inp) {
    /* close all autocomplete lists in the document,
    except the one passed as an argument: */
    const x = this.shadowRoot.querySelectorAll('.autocomplete-items');
    for (let i = 0; i < x.length; i += 1) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
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
}

window.customElements.define(ComboBox.is, ComboBox);
