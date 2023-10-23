import * as elementManager from '../element-manager.js'

export default class CalendarHeaderView {
  constructor() {
    this.exist = false
    this.header = document.querySelector('.calendar-header')
    this.backBtn = null
    this.forwardBtn = null
    this.textBase = null
    this.refreshBtn = null
  }

  render(month) {
    if (this.exist) return

    this.backBtn = elementManager.createElement({
      tag: 'button',
      childs: [
        elementManager.createElement({
          tag: 'span',
          classes: ['material-symbols-outlined'],
          innerHTML: 'arrow_back_ios',
        }),
      ],
    })

    this.textBase = elementManager.createElement({
      tag: 'span',
      innerHTML: `${month} 月`,
    })

    this.forwardBtn = elementManager.createElement({
      tag: 'button',
      childs: [
        elementManager.createElement({
          tag: 'span',
          classes: ['material-symbols-outlined'],
          innerHTML: 'arrow_forward_ios',
        }),
      ],
    })

    this.refreshBtn = elementManager.createElement({
      tag: 'button',
      classes: ['refresh-btn'],
      childs: [
        elementManager.createElement({
          tag: 'span',
          classes: ['material-symbols-outlined'],
          innerHTML: 'refresh',
        }),
      ],
    })

    elementManager.createElement({
      tag: 'span',
      classes: ['header-btns'],
      childs: [this.backBtn, this.textBase, this.forwardBtn, this.refreshBtn],
      appendTo: this.header,
    })

    this.exist = true
  }

  setMonth(month) {
    this.textBase.innerHTML = `${month} 月`
  }
}
