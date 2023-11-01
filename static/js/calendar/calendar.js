import CalendarController from './controller/calendar-controller.js'
import CalendarModel from './model/calendar-model.js'
import CalendarView from './view/calendar-view.js'

const main = async () => {
  const model = await CalendarModel.build()
  const view = CalendarView.build()

  const controller = new CalendarController(model, view)
  await controller.init()
}

main()
