/* eslint-disable no-undef */
// eslint-disable-next-line import/no-unresolved, import/no-absolute-path
import 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.min.mjs'

pdfjsLib.GlobalWorkerOptions.workerSrc =
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.worker.min.mjs'

class PDFViewer {
  constructor(canvas) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.container = document.querySelector(canvas.getAttribute('container'))
    this.lastBtn = document.querySelector(canvas.getAttribute('lastBtn'))
    this.nextBtn = document.querySelector(canvas.getAttribute('nextBtn'))
    this.src = canvas.getAttribute('src')

    this.page = 1

    this.scale = 1

    this.build()
  }

  async build() {
    this.pdfDoc = await pdfjsLib.getDocument(this.src).promise

    this.lastBtn.onclick = async () => {
      if (this.page === 1) return
      this.nextBtn.classList.remove('disabled')

      this.page--

      if (this.page === 1) this.lastBtn.classList.add('disabled')

      await this.update()
    }

    this.nextBtn.onclick = async () => {
      if (this.page >= this.pdfDoc.numPages) return
      this.lastBtn.classList.remove('disabled')

      this.page += 1

      if (this.page === this.pdfDoc.numPages)
        this.nextBtn.classList.add('disabled')

      await this.update()
    }

    // eslint-disable-next-line no-restricted-globals
    addEventListener('resize', async () => {
      await this.update(true /* isResize */)
    })

    await this.update()
  }

  getScale(width) {
    const baseWidth = this.container.offsetWidth

    return baseWidth >= width ? 1 : baseWidth / width
  }

  setStyle(viewport) {
    const baseHeight = viewport.height * this.scale
    const baseWidth = viewport.width * this.scale

    this.canvas.width = viewport.width
    this.canvas.height = viewport.height
    this.canvas.style = `height: ${baseHeight}px;width: ${baseWidth}px;`

    this.container.style = `height: ${baseHeight}px;`

    // eslint-disable-next-line prettier/prettier
    this.nextBtn.style = `margin-left: ${baseWidth - this.nextBtn.offsetWidth}px;`

    this.container.querySelectorAll('svg').forEach((ele) => {
      ele.setAttribute('width', `${this.nextBtn.offsetWidth * 0.9}px`)
    })
  }

  renderCanvas(page) {
    const viewport = page.getViewport({
      scale: 1,
    })

    this.setStyle(viewport, this.scale)

    page.render({
      canvasContext: this.ctx,
      viewport,
    })
  }

  async getPage() {
    const result = this.pdfDoc.getPage(this.page)

    return result
  }

  async update(isResize) {
    const page = await this.getPage()

    if (isResize && this.scale === this.getScale(page.view[2])) return

    this.scale = this.getScale(page.view[2])
    this.renderCanvas(page)
  }
}

;[...document.querySelectorAll('#pdf-canvas')].map((ele) => new PDFViewer(ele))
