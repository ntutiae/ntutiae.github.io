import * as request from './request.js'
import * as dateUtil from './date-util.js'
import CalendarStatusModel from './calendar-statusModel.js'

const getTaiwanCalendarUrl = (year) =>
  `https://cdn.jsdelivr.net/gh/ruyut/TaiwanCalendar/data/${year}.json`

export default class CalendarDayModel {
  constructor(model, date, monthDate, holidays) {
    this.holidays = holidays
    this.monthDate = monthDate

    this.urlDateStr = dateUtil.getDateStrFromNumber(
      model.year,
      model.month,
      monthDate,
      '-'
    )

    this.setDayType(date)
  }

  setDayType(date) {
    if (!date) {
      this.type = 'empty'
      return
    }

    const filteredHoliday = this.holidays.filter(
      (record) => record.date === date
    )

    if (filteredHoliday.length) {
      this.type = 'holiday'
      this.reason = filteredHoliday[0].description || '　　　　　'
    } else this.type = 'borrowing'
  }

  setStatus(record) {
    const status = new CalendarStatusModel({ record })

    this[status.period] = status
  }

  autoFill() {
    if (!this.morning)
      this.morning = new CalendarStatusModel({ period: 'morning' })

    if (!this.afternoon)
      this.afternoon = new CalendarStatusModel({ period: 'afternoon' })

    if (!this.evening)
      this.evening = new CalendarStatusModel({ period: 'evening' })
  }

  static async getHolidayList(year, month) {
    let dat = await CalendarDayModel.getTaiwanCalendar(year)

    if (month > 10)
      dat = dat.concat(await CalendarDayModel.getTaiwanCalendar(year + 1))

    if (month < 3)
      dat = dat.concat(await CalendarDayModel.getTaiwanCalendar(year - 1))

    const holiday = dat.filter(
      (d) =>
        d.isHoliday || d.week === '五' || d.week === '六' || d.week === '日'
    )

    return holiday
  }

  static async getTaiwanCalendar(year) {
    const dat = await request.GET({
      url: getTaiwanCalendarUrl(year),
      toJSON: true,
    })
    return dat
  }
}
