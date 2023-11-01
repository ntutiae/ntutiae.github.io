import * as dateUtil from '../../date-util.js'

const MORNING = 'morning'
const AFTERNOON = 'afternoon'
const EVENING = 'evening'

export default class CalendarStatusModel {
  constructor({ record, period }) {
    if (!record) {
      this.period = period
      this.timeName = CalendarStatusModel.getTimeName(period)
      this.type = 'idle'
      this.content = '閒置'

      return
    }

    this.period = record.period
    this.timeName = CalendarStatusModel.getTimeName(this.period)

    const vaild =
      record.memberSign &&
      record.leaderSign &&
      (record.teacherSign || record.period !== 'evening')

    const pasted = CalendarStatusModel.isPasted(record.date)

    if (!vaild && !pasted) {
      this.type = 'apply'
      this.content = '審核中'
    } else if (!vaild && pasted) {
      this.type = 'idle'
      this.content = '閒置'
    } else if (vaild && !pasted) {
      this.type = 'used'
      this.content = '占用中'
    } else if (vaild && pasted && !record.hasImage) {
      this.type = 'waiting'
      this.content = '缺照片'
    } else if (vaild && pasted && record.hasImage) {
      this.type = 'complate'
      this.content = '完成'
    }
  }

  static isPasted(date) {
    const now = dateUtil.getDateStr()

    return Number(now) > Number(date)
  }

  static getTimeName(period) {
    switch (period) {
      case MORNING:
        return '上午'

      case AFTERNOON:
        return '下午'

      case EVENING:
        return '晚上'

      default:
        return null
    }
  }
}
