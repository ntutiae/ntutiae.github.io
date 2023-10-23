import * as request from './request.js'

const API =
  'https://script.google.com/macros/s/AKfycbxbhboysUkD4bZCO9qmgPZbFCjC8-5rEHnFDhneVDDJ1AnFV4TqNN5q-tUoUlBgUeVgKw/exec'

export default class CalendarRecordModel {
  static async build() {
    const recordList = await request.GET({
      url: API,
      toJSON: true,
    })

    const recordData = recordList.map((record) => ({
      date: record[0],
      period: CalendarRecordModel.getPeriodId(record[1]),
      memberSign: record[2],
      leaderSign: record[3],
      hasImage: record[4],
      teacherSign: record[5],
    }))

    return recordData
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
