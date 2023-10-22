import CalendarController from './borrowing-controller.js'
import CalendarModel from './borrowing-model.js'
import CalendarView from './borrowing-view.js'

const main = async () => {
  const model = await CalendarModel.build()
  const view = CalendarView.build()

  await view.refreshDates(model.month, model.dayList)

  const controller = new CalendarController(model, view)
  controller.init()
}

main()
