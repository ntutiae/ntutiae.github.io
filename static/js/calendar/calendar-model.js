import * as dateUtil from '../date-util.js'
import CalendarDayModel from './calendar-dayModel.js'
import CalendarRecordModel from './calendar-recordModel.js'

export default class CalendarModel {
  constructor(holidays, year, month, recordList) {
    this.year = year
    this.month = month
    this.holidays = holidays
    this.recordList = recordList

    this.dayList = this.getDayList()
  }

  static async build() {
    const { year, month } = dateUtil.getDateJSON()

    const recordList = await CalendarRecordModel.build()

    const holidays = await CalendarDayModel.getHolidayList(year, month)

    const result = new CalendarModel(holidays, year, month, recordList)

    return result
  }

  getDateStr(monthDate) {
    return dateUtil.getDateStrFromNumber(this.year, this.month, monthDate)
  }

  getDayList() {
    return dateUtil
      .getDaysInMonth(this.year, this.month)
      .map((monthDate) =>
        this.getDayStatus(this.getDateStr(monthDate), monthDate)
      )
  }

  getDayStatus(date, monthDate) {
    const day = new CalendarDayModel(this, date, monthDate, this.holidays)

    if (day.type === 'empty' || day.type === 'holiday') return day

    const filtredList = this.recordList.filter((record) => record.date === date)

    filtredList.forEach((record) => day.setStatus(record))
    day.autoFill()

    return day
  }

  async refresh() {
    const recordList = await CalendarRecordModel.build()

    const holidays = await CalendarDayModel.getHolidayList(
      this.year,
      this.month
    )

    this.recordList = recordList
    this.holidays = holidays

    this.dayList = this.getDayList()
  }

  addMonth(num) {
    if (this.month === 12 && num > 0) this.year += 1
    if (this.month === 1 && num < 0) this.year -= 1

    this.month += num

    this.month = new Date(this.year, this.month - 1).getMonth() + 1

    this.dayList = this.getDayList()
  }

  static async getRecordList() {
    const result = await CalendarRecordModel.build()
    return result
  }
}
