import isMobile from './device-manager.js'

export default class CalendarController {
  constructor(model, view) {
    this.model = model
    this.view = view

    this.backBtn = view.header.backBtn
    this.forwardBtn = view.header.forwardBtn
    this.refreshBtn = view.header.refreshBtn
  }

  init() {
    this.backBtn.onclick = () => {
      this.backBtnOnClick()
    }
    this.forwardBtn.onclick = () => {
      this.forwardBtnOnClick()
    }
    this.refreshBtn.onclick = () => {
      this.refreshBtnOnClick()
    }

    window.addEventListener(
      'resize',
      () => {
        this.resize()
      },
      true
    )
  }

  backBtnOnClick() {
    this.model.addMonth(-1)
    this.view.refreshDates(this.model.month, this.model.dayList)

    this.btnChange()
  }

  forwardBtnOnClick() {
    this.model.addMonth(1)
    this.view.refreshDates(this.model.month, this.model.dayList)

    this.btnChange()
  }

  async refreshBtnOnClick() {
    this.allBtnDisable()

    await this.view.putLoading()
    await this.model.refresh()

    this.view.refreshDates(this.model.month, this.model.dayList)

    this.btnChange()
  }

  allBtnDisable() {
    this.backBtn.disabled = true
    this.forwardBtn.disabled = true
    this.refreshBtn.disabled = true
  }

  btnChange() {
    this.forwardBtn.disabled = false
    this.backBtn.disabled = false

    if (this.model.month % 12 === (new Date().getMonth() - 1) % 12)
      this.backBtn.disabled = true
    if (this.model.month % 12 === (new Date().getMonth() + 3) % 12)
      this.forwardBtn.disabled = true

    this.refreshBtn.disabled = false
  }

  resize() {
    if (this.mobile !== isMobile()) {
      this.mobile = !this.mobile

      if (this.mobile) {
        this.view.calendar.style = 'transform-origin: top left;scale: 0.7;'
        this.view.calendarInterface.style = ''
      } else {
        this.view.calendar.style = ''
        this.view.calendarInterface.style = 'width: 90%;'
      }

      this.view.refreshDates(this.model.month, this.model.dayList)
    }
  }
}