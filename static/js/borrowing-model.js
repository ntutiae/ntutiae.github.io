import * as request from './request.js'
import * as dateUtil from './date-util.js'
import CalendarDayModel from './borrowing-dayModel.js'

const API =
  'https://script.google.com/macros/s/AKfycbxbhboysUkD4bZCO9qmgPZbFCjC8-5rEHnFDhneVDDJ1AnFV4TqNN5q-tUoUlBgUeVgKw/exec'

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

    const recordList = await CalendarModel.getRecordList()

    const holidays = await CalendarDayModel.getHolidayList(year, month)

    const result = new CalendarModel(holidays, year, month, recordList)

    return result
  }

  getDayList() {
    return dateUtil
      .getDaysInMonth(this.year, this.month)
      .map((monthDate) =>
        this.getDayStatus(
          dateUtil.getDateStrFromNumber(this.year, this.month, monthDate),
          monthDate
        )
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
    const { year, month } = dateUtil.getDateJSON()

    const recordList = await CalendarModel.getRecordList()

    const holidays = await CalendarDayModel.getHolidayList(year, month)

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
    let recordList = await request.GET({
      url: API,
      toJSON: true,
    })

    recordList = recordList.map((record) => ({
      date: record[0],
      period: CalendarModel.getPeriodId(record[1]),
      memberSign: record[2],
      leaderSign: record[3],
      hasImage: record[4],
      teacherSign: record[5],
    }))

    return recordList
  }

  static getPeriodId(name) {
    if (name.startsWith('上午')) {
      return 'morning'
    }
    if (name.startsWith('下午')) {
      return 'afternoon'
    }
    return 'evening'
  }
}
