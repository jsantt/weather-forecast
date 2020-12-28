import { css, html, LitElement } from 'lit-element';

import '../common-components/svg-icon.js';
import '../weather-section.js';

class HolidayCalendar extends LitElement {
  static get is() {
    return 'holiday-calendar';
  }

  static get properties() {
    return {
      _days: { type: Array },
    };
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }

      section {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
        grid-template-rows: auto;
        grid-gap: 6px;
        align-items: start;
      }

      .month {
        grid-column: span 7;
        font-weight: var(--font-weight-bold);
        margin-top: var(--space-l);
      }

      .weekday {
        text-transform: uppercase;
        margin-bottom: -1px;
      }

      .day {
        background: var(--color-white);
        border-radius: var(--border-radius);
        text-align: center;
      }

      .today {
        border: 2px solid var(--color-black);
        margin: -2px;
      }

      .holiday {
        background-color: var(--color-yellow-300);
        position: relative;
        margin-bottom: 13px;
      }

      .holiday-text {
        background-color: var(--color-yellow-300);
        position: absolute;
        padding: 0 3px;
        border-radius: var(--border-radius);
        right: 0;
        top: 4px;
      }
    `;
  }

  render() {
    return html`
      <weather-section header="Kalenteri">
        <section>
          ${this._days.map(month => {
            return html` <div class="month">${month.monthName}</div>
              ${month.days.map(day => {
                if (day === undefined) {
                  return html`<div></div>`;
                }
                return html`<div
                  class="day ${day.today ? 'today' : ''} ${day.holiday
                    ? 'holiday'
                    : ''}"
                >
                  <div class="weekday">${day.weekdayName}</div>
                  <div>${day.day}</div>
                  ${day.holiday
                    ? html`<div class="holiday">
                        <div class="holiday-text">
                          Uudenvuodenpäivä
                        </div>
                      </div>`
                    : ''}
                </div>`;
              })}`;
          })}
        </section>

        <div slot="footer-left"></div>
        <div slot="footer-right">
          Näytä koko vuosi
        </div>
      </weather-section>
    `;
  }

  constructor() {
    super();

    // const now = new Date();
    // const startDate = HolidayCalendar._getFirstDayOfMonth(now);

    /* const monthAfterNext = new Date(now.setMonth(now.getMonth() + 2));
     const endDate = HolidayCalendar._getLastDayOfMonth(
      monthAfterNext.getMonth(),
      monthAfterNext.getFullYear()
    ); */

    const months = [
      {
        monthName: 'Marraskuu',
        days: HolidayCalendar._dateRange('2020-11-01', '2020-11-30'),
      },
      {
        monthName: 'Joulukuu',
        days: HolidayCalendar._dateRange('2020-12-01', '2020-12-31'),
      },
      {
        monthName: 'Tammikuu',
        days: HolidayCalendar._dateRange('2021-01-01', '2021-01-31'),
      },
    ];

    console.log(months);

    this._days = months;
  }

  static _dateRange(start, end) {
    const dateArray = [];
    const currentDate = new Date(start);

    // su ma  ti  ke  to  pe  la
    //  0 1   2   3   4   5   6

    //  7 0   1   2   3   4   5

    // if Sunday => 6, else day - 1
    const daysFromMonday =
      currentDate.getDay() === 0 ? 6 : currentDate.getDay() - 1;
    // add empty days to make week start from monday
    for (let i = 0; i < daysFromMonday; i += 1) {
      dateArray.push(undefined);
    }

    while (currentDate <= new Date(end)) {
      dateArray.push({
        rawDate: new Date(currentDate),
        day: currentDate.getDate(),
        weekday: currentDate.getDay(),
        weekdayName: HolidayCalendar._getWeekdayName(currentDate),
      });
      // Use UTC date to prevent problems with time zones and DST
      currentDate.setUTCDate(currentDate.getDate() + 1);
    }

    return dateArray;
  }

  static _getFirstDayOfMonth(date) {
    return new Date(date.getFullYear(), date.getMonth());
  }

  static _getLastDayOfMonth(month, year) {
    return new Date(year, month, 0);
  }

  static _getWeekdayName(date) {
    return date.toLocaleString('fi-FI', { weekday: 'short' });
  }

  static _getMonthName(date) {
    return date.toLocaleString('fi-FI', { month: 'long' });
  }

  static _isToday(date) {
    const now = new Date();
    return (
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    );
  }

  /**
   * free=vapaapäivä, f=liputuspäivä, static=always the same date
   */
  static _publicHolidays() {
    return [
      { d: '2020-01-01', n: 'Uudenvuodenpäivä', free: true, static: true },
      { d: '2020-01-06', n: 'Loppiainen', free: true, static: true },
      { d: '2020-02-05', n: 'J.L.Runebergin päivä', flag: true, static: true },

      { d: '2020-02-28', n: 'Kalevalan päivä', flag: true, static: true },
      {
        d: '2020-03-19',
        n: 'Minna Canthin ja tasa-arvon päivä',
        flag: true,
        static: true,
      },
      { d: '2020-04-12', n: 'Pääsiäissunnuntai', free: true },

      { d: '2020-04-13', n: 'Toinen pääsiäispäivä', free: true },
      {
        d: '2020-04-27',
        n: 'Kansallinen veteraanipäivä',
        flag: true,
        static: true,
      },
      { d: '2020-05-01', n: 'Vappu', free: true, flag: true, static: true },

      { d: '2020-05-09', n: 'Eurooppa-päivä', flag: true, static: true },
      { d: '2020-05-10', n: 'Äitienpäivä', flag: true },
      {
        d: '2020-05-12',
        n: 'J.V. Snellmanin ja suomalaisuuden päivä',
        flag: true,
        static: true,
      },

      { d: '2020-05-17', n: 'Kaatuneiden muistopäivä', flag: true },
      { d: '2020-05-21', n: 'Helatorstai', free: true },
      {
        d: '2020-06-04',
        n: 'Puolustusvoimain lippujuhlan päivä',
        flag: true,
        static: true,
      },

      { d: '2020-05-31', n: 'Helluntai', free: true },
      { d: '2020-06-19', n: 'Juhannusaatto' },
      { d: '2020-06-20', n: 'Juhannus', free: true, flag: true },
      { d: '2020-07-06', n: 'Eino Leinon päivä', flag: true, static: true },

      { d: '2020-10-10', n: 'Aleksis Kiven päivä', flag: true, static: true },
      {
        d: '2020-10-24',
        n: 'yhdistyneiden kansakuntien päivä',
        flag: true,
        static: true,
      },
      { d: '2020-10-31', n: 'Pyhäinpäivä', free: true },

      { d: '2020-11-06', n: 'Ruotsalaisuuden päivä', flag: true, static: true },
      { d: '2020-11-08', n: 'Isänpäivä', flag: true },
      {
        d: '2020-12-06',
        n: 'Itsenäisyyspäivä',
        free: true,
        flag: true,
        static: true,
      },

      {
        d: '2020-12-08',
        n: 'Jean Sibeliuksen päivä',
        flag: true,
        static: true,
      },
      { d: '2020-12-24', n: 'Jouluaatto', static: true },
      { d: '2020-12-25', n: 'Joulupäivä', free: true, static: true },
      { d: '2020-12-26', n: 'Tapaninpäivä', free: true, static: true },
      { d: '2021-01-01', n: 'Uudenvuodenpäivä', free: true, static: true },
      { d: '2021-01-06', n: 'Loppiainen', free: true, static: true },
    ];
  }
}
window.customElements.define(HolidayCalendar.is, HolidayCalendar);
