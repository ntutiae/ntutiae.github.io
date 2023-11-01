import * as dateUtil from '../../date-util.js'
import CalendarDateModel from './calendar-date.js'
import getRecord from './calendar-record.js'

export default class CalendarModel {
  constructor(holidays, year, month, recordList) {
    this.date = new Date()

    this.year = year
    this.month = month
    this.holidays = holidays
    this.recordList = recordList

    this.dayList = this.getDayList()
  }

  static async build() {
    const { year, month } = dateUtil.getDateJSON()

    const { recordList, holidays } = await CalendarModel.getStaticData(
      year,
      month
    )

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
    const day = new CalendarDateModel(this, date, monthDate, this.holidays)

    if (day.type === 'empty' || day.type === 'holiday') return day

    this.recordList[date]?.forEach((record) => day.setStatus(record))

    day.autoFill()

    return day
  }

  async refresh() {
    const { recordList, holidays } = await CalendarModel.getStaticData(
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

    this.date.setMonth(this.month - 1)
    this.month = this.date.getMonth() + 1

    this.dayList = this.getDayList()
  }

  static async getStaticData(year, month) {
    const [recordList, holidays] = await Promise.all([
      getRecord(),
      CalendarDateModel.getHolidayList(year, month),
    ])

    return { recordList, holidays }
  }
}
