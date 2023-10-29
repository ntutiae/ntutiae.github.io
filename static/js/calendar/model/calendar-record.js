import * as request from '../../request.js'
import { API } from '../config.js'

const getPeriodId = (name) => {
  if (name.startsWith('上午')) {
    return 'morning'
  }
  if (name.startsWith('下午')) {
    return 'afternoon'
  }
  if (name.startsWith('晚上')) {
    return 'evening'
  }
  return null
}

const getRecord = async () => {
  const recordList = await request.GET({
    url: API,
    toJSON: true,
  })

  const recordData = {}

  recordList.forEach((record) => {
    const date = record[0]
    if (!recordData[date]) recordData[date] = []

    const period = getPeriodId(record[1])
    if (period === null) return

    recordData[date].push({
      date,
      period,
      memberSign: record[2],
      leaderSign: record[3],
      hasImage: record[4],
      teacherSign: record[5],
    })
  })

  return recordData
}

export default getRecord
