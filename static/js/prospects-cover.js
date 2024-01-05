/* eslint-disable no-undef */

// eslint-disable-next-line import/no-unresolved, import/no-absolute-path
import 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.min.mjs'

// eslint-disable-next-line import/no-unresolved, import/no-absolute-path
import isMobile from '/js/device-manager.js'

pdfjsLib.GlobalWorkerOptions.workerSrc =
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.worker.min.mjs'
;[...document.querySelectorAll('img')].forEach(async (ele) => {
  const canvas = document.createElement('canvas')
  const canvasContext = canvas.getContext('2d')

  const filename = ele.getAttribute('pdf')
  if (!filename) return

  if (isMobile()) {
    ele.remove()
    return
  }

  const url = `/file/${filename}`

  const pdfDoc = await pdfjsLib.getDocument(url).promise
  const page = await pdfDoc.getPage(1)

  const viewport = page.getViewport({
    scale: 1,
  })

  canvas.width = viewport.width
  canvas.height = viewport.height

  await page.render({
    canvasContext,
    viewport,
  }).promise

  const imgURL = canvas.toDataURL()
  ele.setAttribute('src', imgURL)
})
