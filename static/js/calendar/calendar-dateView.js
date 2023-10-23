import * as elementManager from '../element-manager.js'

export default class CalendarDateView {
  constructor(view) {
    this.view = view
    this.calendar = document.querySelector('.calendar')

    this.element = elementManager.createElement({
      tag: 'span',
      classes: ['date'],
      style: !view.mobile ? 'aspect-ratio: 1.2;' : null,
    })
  }

  classAdd(className) {
    this.element.classList.add(className)
  }

  appendChild(child) {
    this.element.appendChild(child)
  }

  setTitle(monthDate) {
    elementManager.createElement({
      tag: 'span',
      classes: ['title'],
      style: !this.view.mobile ? 'margin-right: auto;padding-left: 10px;' : '',
      innerHTML: String(monthDate),
      appendTo: this.element,
    })

    this.classAdd('show')
  }

  setHolidayReason(reason) {
    elementManager.createElement({
      tag: 'div',
      classes: ['content'],
      innerHTML: reason,
      appendTo: this.element,
    })

    this.classAdd('disabled-date')
  }

  setStatus(day) {
    this.classAdd('date')

    this.morning = this.createStatusElement(day.morning)
    this.afternoon = this.createStatusElement(day.afternoon)
    this.evening = this.createStatusElement(day.evening)
  }

  createStatusElement({ type, period, content, urlDateStr }) {
    return elementManager.createElement({
      tag: 'a',
      classes: ['status', type],
      innerHTML: `${CalendarDateView.getTimeName(period)} ${content}`,
      href:
        type === 'idle'
          ? CalendarDateView.getFormURL(urlDateStr, period)
          : null,
      target: '_blank',
      rel: 'noopener noreferrer',

      appendTo: this.element,
    })
  }

  appendToCalendar() {
    this.calendar.appendChild(this.element)
  }

  static getTimeName(timeId) {
    if (timeId === 'morning') return '上午'
    if (timeId === 'afternoon') return '下午'
    if (timeId === 'evening') return '晚上'

    return null
  }

  static getFormURL(date, timeId) {
    let time = null

    if (timeId === 'morning') time = '上午 9:00～12:00'
    else if (timeId === 'afternoon') time = '下午 13:00～17:00'
    else if (timeId === 'evening') time = '晚上 19:00~22:00'

    return `https://docs.google.com/forms/d/e/1FAIpQLSeWdLOfKln8piSEORmrpXM86wGsx6HPtVC1OEWbQiYo7GDlNw/viewform?usp=pp_url&entry.540117387=${date}&entry.37487545=${time}`
  }
}
