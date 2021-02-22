import { css, html, LitElement } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map';

import '../common-components/svg-icon.js';
import '../weather-section.js';

class HolidayCalendar extends LitElement {
  static get is() {
    return 'holiday-calendar';
  }

  static get properties() {
    return {
      _months: { type: Array },
    };
  }

  static get styles() {
    return css`
      * {
        box-sizing: border-box;
      }

      :host {
        display: block;

        --day-border-radius: 8px;
      }

      button {
        all: unset;
        padding: var(--space-s) 0;
      }

      .expandable {
        align-items: start;
        display: grid;
        grid-template-columns: 2fr 2fr 2fr 2fr 2fr 2fr 2fr 2fr;
        grid-template-rows: auto;
        grid-gap: 8px;

        padding: var(--space-m) var(--space-m) var(--space-l) var(--space-l);
      }

      .month {
        font-size: var(--font-size-s);
        font-weight: var(--font-weight-bold);
        margin-top: var(--space-s);
        margin-bottom: var(--space-s);
        text-transform: uppercase;
      }

      .weekday {
        /*background: var(--color-gray-300);*/

        font-size: var(--font-size-xs);
        padding-top: var(--space-s);
      }

      .day {
        background: var(--color-white);
        border-radius: var(--day-border-radius);
        text-align: center;
      }

      .day.holiday {
        margin-bottom: 16px;
      }

      .date {
        font-weight: var(--font-weight-bold);
        padding-bottom: var(--space-s);
      }

      .holiday .date {
        font-weight: var(--font-weight-bold);
        text-decoration: underline;
      }

      .today {
        background: var(--color-yellow-300);
        font-weight: var(--font-weight-bold);
        border: 2px solid var(--color-blue-600);
        margin: -2px;
      }

      .past {
        background: none;
      }

      .past .weekday {
        display: none;
      }

      .flag {
        height: 14px;
        position: absolute;
        left: -14px;
        top: 18px;
      }

      .sunday .date,
      .free .date,
      .red {
        color: var(--color-red-300);
        text-decoration: underline;
      }

      .holiday {
        position: relative;
      }

      .holiday-text {
        background: var(--color-white);
        font-size: var(--font-size-xs);
        position: absolute;
        left: -3px;
        top: 0;
        padding-left: 3px;
        white-space: nowrap;
      }

      .day:hover {
        background: var(--color-white);
      }

      .holiday-text:hover {
        background: var(--color-white);
        border-radius: var(--border-radius);
        font-weight: 900;
        padding: var(--space-s);
        margin: calc(-1 * var(--space-s));

        text-decoration: underline;
        z-index: 2;
      }

      .sunday .holiday-text {
        right: 0px;
        left: initial;
      }

      .week-number,
      .week-number .weekday {
        background: none !important;
      }

      .week-number .date {
        color: var(--color-gray-600);
        font-size: var(--font-size-s);
      }
      .week-number .weekday {
        color: var(--color-gray-600);
      }

      .week-text {
        font-size: var(--font-size-xs);
      }
    `;
  }

  render() {
    return html`
      <weather-section>
        <section>
          ${this._months.map((month, index) => {
            return html` <button
                @click="${() => this._toggleExpand(index)}"
                oma="true"
                class="month"
              >
                ${month.monthName}
              </button>
              <smooth-expand ?expanded="${month.expanded}">
                <div class="expandable">
                  <!-- MONTHS -->
                  ${month.days.map(day => {
                    if (day === undefined) {
                      // empty days to keep mondays to be leftmost
                      return html`<div></div>`;
                    }

                    // DAYS
                    return html`              
                  <div
                    class="day ${classMap({
                      free: day.holiday !== undefined && day.holiday.free,
                      today: day.today,
                      holiday: day.holiday,
                      past: day.past,
                      weekend: day.weekend,
                      sunday: day.weekdayName === 'su',
                    })}"
                  >
                  <!-- WEEKDAY -->
                  <div class="weekday">
                    ${day.weekdayName}
                  </div>

                  <!-- DATE -->
                  <div class="date">
                    ${
                      day.holiday !== undefined && day.holiday.flag
                        ? html` <svg-icon
                            class="flag"
                            path="assets/image/icons.svg#flag"
                          ></svg-icon>`
                        : ''
                    }${day.day}
                      </div>
                    ${
                      day.holiday !== undefined
                        ? html`<!-- POSSIBLE HOLIDAY TEXT-->
                            <div class="holiday">
                              <div class="holiday-text">
                                ${day.holiday.n}
                              </div>
                            </div>`
                        : ''
                    }
                  </div>
                  ${
                    day.weekdayName === 'su'
                      ? html`<div
                          class="day week-number ${classMap({
                            past: day.past,
                          })}"
                        >
                          <div class="weekday">&nbsp;</div>
                          <div class="date">
                            <span class="week-text">vk</span> ${day.weekNumber}
                          </div>
                        </div>`
                      : ''
                  } 
                </div>
                `;
                  })}
                </div>
              </smooth-expand>`;
          })}
        </section>

        <div slot="footer-left"></div>
        <div slot="footer-right">
          Vakiintuneet vapaapäivät ovat merkitty
          <span class="red">punaisella</span>
        </div>
      </weather-section>
    `;
  }

  constructor() {
    super();

    const now = new Date();

    const months = [];

    for (let i = -1; i < 11; i += 1) {
      const previousMonth = HolidayCalendar._getFirstDayOfMonth(now, i);
      months.push({
        monthName: HolidayCalendar._getMonthName(previousMonth),
        days: HolidayCalendar._dateRange(
          previousMonth,
          HolidayCalendar._getLastDayOfMonth(previousMonth)
        ),
        expanded: i >= 0 && i <= 1,
      });
    }

    this._months = months;
  }

  _toggleExpand(index) {
    const months = [...this._months];
    months[index].expanded = !months[index].expanded;

    this._months = months;
  }

  static _dateRange(start, end) {
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
        weekend: currentDate.getDay() === 0 || currentDate.getDay() === 6,
        weekNumber: HolidayCalendar._getWeekNumber(currentDate),
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dateArray;
  }

  static _getFirstDayOfMonth(date, addMonths) {
    return new Date(date.getFullYear(), date.getMonth() + addMonths);
  }

  static _getLastDayOfMonth(date) {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
  }

  static _getWeekdayName(date) {
    return date.toLocaleString('fi-FI', { weekday: 'short' });
  }

  static _getMonthName(date) {
    let year = '';
    if (date.getMonth() === 0 || date.getMonth() === 11) {
      year = `${date.getFullYear()} `;
    }

    return `${date.toLocaleString('fi-FI', { month: 'long' })} ${year}`;
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
    const holidays = [
      ...HolidayCalendar._publicHolidays(),
      ...HolidayCalendar._staticHolidays('2020'),
      ...HolidayCalendar._staticHolidays('2021'),
    ];

    return holidays.find(holiday => {
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

  static _staticHolidays(year) {
    return [
      { d: `${year}-01-01`, n: 'Uudenvuodenpäivä', free: true },
      { d: `${year}-01-06`, n: 'Loppiainen', free: true },
      {
        d: `${year}-02-05`,
        n: 'J.L.Runebergin päivä',
        flag: true,
      },
      {
        d: `${year}-02-14`,
        n: 'Ystävänpäivä',
      },
      { d: `${year}-02-28`, n: 'Kalevalan päivä', flag: true },
      {
        d: `${year}-03-08`,
        n: 'Naistenpäivä',
      },
      {
        d: `${year}-03-19`,
        n: 'Minna Canthin ja tasa-arvon päivä',
        flag: true,
      },
      {
        d: `${year}-04-09`,
        n: 'Mikael Agrikolan päivä, suomen kielen päivä',
        flag: true,
      },
      {
        d: `${year}-04-27`,
        n: 'Kansallinen veteraanipäivä',
        flag: true,
      },
      { d: `${year}-05-01`, n: 'Vappu', free: true, flag: true },
      { d: `${year}-05-09`, n: 'Eurooppa-päivä', flag: true },
      {
        d: `${year}-05-12`,
        n: 'J.V. Snellmanin ja suomalaisuuden päivä',
        flag: true,
      },
      {
        d: `${year}-06-04`,
        n: 'Puolustusvoimain lippujuhlan päivä',
        flag: true,
      },
      { d: `${year}-07-06`, n: 'Eino Leinon päivä', flag: true },
      {
        d: `${year}-10-10`,
        n: 'Aleksis Kiven päivä',
        flag: true,
      },
      {
        d: `${year}-10-24`,
        n: 'YK:n päivä',
        flag: true,
      },
      {
        d: `${year}-11-06`,
        n: 'Ruotsalaisuuden päivä',
        flag: true,
      },
      {
        d: `${year}-11-20`,
        n: 'Lapsen oikeuksien päivä',
        flag: true,
      },
      {
        d: `${year}-12-06`,
        n: 'Itsenäisyyspäivä',
        free: true,
        flag: true,
      },
      {
        d: `${year}-12-08`,
        n: 'Jean Sibeliuksen päivä',
        flag: true,
      },
      { d: `${year}-12-24`, n: 'Jouluaatto', free: true },
      { d: `${year}-12-25`, n: 'Joulupäivä', free: true },
      { d: `${year}-12-26`, n: 'Tapaninpäivä', free: true },
      { d: `${year}-12-31`, n: 'Uudenvuodenaatto', free: true },
    ];
  }

  /**
   * free=vapaapäivä, f=liputuspäivä, static=always the same date
   */
  static _publicHolidays() {
    return [
      { d: '2020-04-12', n: 'Pääsiäissunnuntai', free: true },
      { d: '2020-04-13', n: 'Toinen pääsiäispäivä', free: true },
      { d: '2020-05-10', n: 'Äitienpäivä', flag: true },
      { d: '2020-05-17', n: 'Kaatuneiden muistopäivä', flag: true },
      { d: '2020-05-21', n: 'Helatorstai', free: true },
      { d: '2020-05-31', n: 'Helluntai', free: true },
      { d: '2020-06-19', n: 'Juhannusaatto', free: true },
      { d: '2020-06-20', n: 'Juhannus', free: true, flag: true },
      { d: '2020-10-31', n: 'Pyhäinpäivä', free: true },
      { d: '2020-11-08', n: 'Isänpäivä', flag: true },

      { d: '2021-02-14', n: 'Laskiaisunnuntai' },
      { d: '2021-02-16', n: 'Laskiaistiistai' },

      { d: '2021-04-02', n: 'Pitkäperjantai', free: true },
      { d: '2021-04-04', n: 'Pääsiäissunnuntai', free: true },
      { d: '2021-04-05', n: 'Toinen pääsiäispäivä', free: true },

      { d: '2021-05-09', n: 'Äitienpäivä', flag: true },
      { d: '2021-05-13', n: 'Helatorstai', free: true },
      { d: '2021-05-16', n: 'Kaatuneiden muistopäivä', flag: true },

      { d: '2021-05-23', n: 'Helluntai', free: true },

      { d: '2021-06-25', n: 'Juhannusaatto', free: true },
      { d: '2021-06-26', n: 'Juhannus', free: true, flag: true },

      { d: '2021-11-06', n: 'Pyhäinpäivä', free: true, flag: true },
      { d: '2021-11-14', n: 'Isänpäivä', flag: true },
    ];
  }
}
window.customElements.define(HolidayCalendar.is, HolidayCalendar);
