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

        --day-border-radius: 8px;
      }

      section {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
        grid-template-rows: auto;
        grid-gap: 8px;
        align-items: start;

        max-width: 300px;
      }

      .month {
        grid-column: span 7;
        font-size: var(--font-size-m);
        font-weight: var(--font-weight-bold);
        margin-top: var(--space-l);
      }

      .weekday {
        background: var(--color-gray-300);

        font-size: var(--font-size-xs);
        text-transform: uppercase;
        margin-bottom: -1px;
      }

      .day {
        background: var(--color-white);
        border-radius: var(--day-border-radius);

        text-align: center;
      }

      .date {
        font-weight: var(--font-weight-bold);
        padding: var(--space-s) 0;
      }

      .holiday .date {
        font-weight: var(--font-weight-bold);
        border: 1px solid var(--color-blue-800);
        border-radius: 50%;
      }

      .today {
        background: var(--color-yellow-300);
        font-weight: var(--font-weight-bold);
      }

      .past {
        background: none;
      }

      .holiday {
        position: relative;
        margin-bottom: 5px;
      }

      .holiday-text {
        background: var(--color-white);
        font-size: var(--font-size-xs);
        position: absolute;
        padding: 0 3px;
        border-radius: var(--border-radius);
        left: 0px;
        top: -4px;

        white-space: nowrap;
      }

      .sunday {
        right: 0px;
        left: initial;
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
                    : ''} ${day.past ? 'past' : ''}"
                >
                  <div class="weekday">
                    ${day.past ? '' : day.weekdayName}
                  </div>
                  <div class="date">${day.day}</div>
                  ${day.holiday !== undefined
                    ? html`<div class="holiday">
                        <div
                          class="holiday-text ${day.weekdayName === 'su'
                            ? 'sunday'
                            : ''}"
                        >
                          ${day.holiday.n}
                        </div>
                      </div>`
                    : ''}
                </div>`;
              })}`;
          })}
        </section>

        <div slot="footer-left"></div>
        <div slot="footer-right"></div>
      </weather-section>
    `;
  }

  constructor() {
    super();

    const now = new Date();

    const months1 = [];
    if (now.getDate() < 8) {
      const previousMonth = HolidayCalendar._getFirstDayOfMonth(now, -1);
      months1.push({
        monthName: HolidayCalendar._getMonthName(previousMonth),
        days: HolidayCalendar._dateRange(
          previousMonth,
          HolidayCalendar._getLastDayOfMonth(previousMonth)
        ),
      });
    }

    const currentMonth = HolidayCalendar._getFirstDayOfMonth(now);
    months1.push({
      monthName: HolidayCalendar._getMonthName(currentMonth),
      days: HolidayCalendar._dateRange(
        currentMonth,
        HolidayCalendar._getLastDayOfMonth(currentMonth)
      ),
    });

    if (now.getDate() >= 8) {
      const nextMonth = HolidayCalendar._getFirstDayOfMonth(now, 1);
      months1.push({
        monthName: HolidayCalendar._getMonthName(nextMonth),
        days: HolidayCalendar._dateRange(
          nextMonth,
          HolidayCalendar._getLastDayOfMonth(nextMonth)
        ),
      });
    }

    this._days = months1;
  }

  static _dateRange(start, end) {
    console.log(start, end);
    const dateArray = [];
    const currentDate = new Date(start.getTime());

    // if Sunday => 6, else day - 1
    const daysFromMonday =
      currentDate.getDay() === 0 ? 6 : currentDate.getDay() - 1;
    // add empty days to make week start from monday
    for (let i = 0; i < daysFromMonday; i += 1) {
      dateArray.push(undefined);
    }

    while (currentDate.getTime() <= end.getTime()) {
      dateArray.push({
        rawDate: new Date(currentDate),
        day: currentDate.getDate(),
        holiday: HolidayCalendar._getHoliday(currentDate),
        past: HolidayCalendar._isPast(currentDate),
        today: HolidayCalendar._isToday(currentDate),
        weekday: currentDate.getDay(),
        weekdayName: HolidayCalendar._getWeekdayName(currentDate),
        weekNumber: HolidayCalendar._getWeekNumber(currentDate),
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dateArray;
  }

  static _getFirstDayOfMonth(date, addMonths = 0) {
    return new Date(date.getFullYear(), date.getMonth() + addMonths);
  }

  static _getLastDayOfMonth(date) {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
  }

  static _getWeekdayName(date) {
    return date.toLocaleString('fi-FI', { weekday: 'short' });
  }

  static _getMonthName(date) {
    return date.toLocaleString('fi-FI', { month: 'long' });
  }

  static _isPast(date) {
    const now = new Date();
    return HolidayCalendar._isToday(date) === false && date < now;
  }

  static _isToday(date) {
    const now = new Date();

    return HolidayCalendar._sameDay(now, date);
  }

  static _sameDay(date1, date2) {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  }

  static _getHoliday(date) {
    return HolidayCalendar._publicHolidays().find(holiday => {
      const hol = new Date(holiday.d);
      return HolidayCalendar._sameDay(date, hol);
    });
  }

  static _getWeekNumber(dt) {
    const tdt = new Date(dt.valueOf());
    const dayn = (dt.getDay() + 6) % 7;
    tdt.setDate(tdt.getDate() - dayn + 3);
    const firstThursday = tdt.valueOf();
    tdt.setMonth(0, 1);
    if (tdt.getDay() !== 4) {
      tdt.setMonth(0, 1 + ((4 - tdt.getDay() + 7) % 7));
    }
    return 1 + Math.ceil((firstThursday - tdt) / 604800000);
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
