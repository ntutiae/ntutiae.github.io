import CalendarController from './calendar-controller.js'
import CalendarModel from './calendar-model.js'
import CalendarView from './calendar-view.js'

const main = async () => {
  const model = await CalendarModel.build()
  const view = CalendarView.build()

  const controller = new CalendarController(model, view)
  await controller.init()
}

main()
