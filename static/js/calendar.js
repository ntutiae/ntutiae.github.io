import CalendarController from './calendar-controller.js'
import CalendarModel from './calendar-model.js'
import CalendarView from './calendar-view.js'

const main = async () => {
  const model = await CalendarModel.build()
  const view = CalendarView.build()

  await view.refreshDates(model.month, model.dayList)

  const controller = new CalendarController(model, view)
  controller.init()
}

main()
