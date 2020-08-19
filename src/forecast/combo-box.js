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
      /*the container must be positioned relative:*/
      .autocomplete {
        position: relative;
        display: inline-block;
      }

      input {
        border: none;
        background-color: transparent;
        color: var(--color-white);
        padding: var(--space-s) 0;
        font-size: var(--font-size-xl);
        font-family: var(--font-family-primary);
        text-align: center;
        width: 100%;
      }

      input:focus {
        border-bottom: 1px solid var(--color-gray-500);
        outline: none;
      }

      .autocomplete-items {
        background: var(--color-gray-300);

        color: var(--color-gray-600);
        position: absolute;

        z-index: 99;
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
      <form autocomplete="off">
        <div class="autocomplete">
          <input
            id="myInput"
            type="text"
            name="myCountry"
            .value="${this.value}"
            aria-label="Sää paikassa"
            @blur="${() => this._onInputBlur()}"
            @click="${() => this._onInputClick()}"
          />
        </div>
        <!--input type="submit" /-->
      </form>
    `;
  }

  static get properties() {
    return {
      value: { type: Object },
      items: { type: Array },
      key: { type: String },
      _previousValue: { type: Object },
    };
  }

  constructor() {
    super();

    this.currentFocus;
  }

  firstUpdated() {
    /* initiate the autocomplete function on the "myInput" element, and pass along the countries array as possible autocomplete values: */
    this.autocomplete(
      this.shadowRoot.getElementById('myInput'),
      this.items,
      this.key
    );
  }

  _onInputClick() {
    this._previousValue = this.shadowRoot.querySelector('input');
    this._dispatch('combo-box.new-value', { name: '' });

    this.autocomplete(
      this.shadowRoot.getElementById('myInput'),
      this.items,
      this.key
    );
  }

  _onInputBlur() {
    const input = this.shadowRoot.querySelector('input');
    if (input.value === undefined || input.value.name === '') {
      input.value = this._previousValue;
    }
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
      for (i = 0; i < arr.length; i = i + 1) {
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
            /* insert the value for the autocomplete text field: */
            inp.value = event.target.querySelector('input').value;
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
        this.currentFocus = this.currentFocus + 1;
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
    for (let i = 0; i < x.length; i = i + 1) {
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
