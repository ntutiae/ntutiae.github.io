import CalendarDateView from './borrowing-dateView.js'
import CalendarHeaderView from './borrowing-headerView.js'
import isMobile from './device-manager.js'
import * as elementManager from './element-manager.js'

export default class CalendarView {
  constructor(calendar, calendarInterface) {
    this.calendarInterface = calendarInterface
    this.calendar = calendar
    this.mobile = isMobile()

    this.header = new CalendarHeaderView()
    this.backBtn = null
    this.forwardBtn = null

    this.month = null
    this.dayList = null

    if (!this.mobile) this.computerSetup()
    else this.mobileSetup()
  }

  static build() {
    const calendar = document.querySelector('.calendar')
    const calendarInterface = document.querySelector('#interface')

    const result = new CalendarView(calendar, calendarInterface)

    return result
  }

  computerSetup() {
    this.calendarInterface.style = 'width: 90%'
  }

  mobileSetup() {
    this.calendar.style = 'transform-origin: top left;scale: 0.7;'
  }

  async putLoading() {
    await CalendarView.removeDates()

    elementManager.createElement({
      tag: 'span',
      classes: ['foot'],
      childs: [
        elementManager.createElement({
          tag: 'span',
          classes: ['loader'],
        }),
      ],
      appendTo: this.calendar,
    })
  }

  async refreshDates(month, dayList) {
    await CalendarView.removeDates()
    CalendarView.removeLoading()

    if (!this.header.exist) this.header.render(month)
    this.header.setMonth(month)

    dayList.forEach((day) => {
      const date = new CalendarDateView()

      if (day.type === 'empty') date.classAdd('hidden')

      date.setTitle(day.monthDate)

      if (day.type === 'holiday') date.setHolidayReason(day.reason)

      if (day.type === 'borrowing') date.setStatus(day)

      date.appendToCalendar()
    })
  }

  static removeLoading() {
    const loading = document.querySelector('.foot')
    if (loading) loading.remove()
  }

  static async removeDates() {
    const dateElements = [...document.querySelectorAll('.date')]
    dateElements.forEach((ele) => ele.classList.add('hide'))

    await CalendarView.sleep(200)

    dateElements.forEach((ele) => ele.remove())
  }

  static sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve(1), ms)
    })
  }
}
