document.addEventListener('DOMContentLoaded', () => {
  AOS.init()

  // navbar
  document.getElementsByClassName(
    'active'
  )[0].parentNode.parentNode.previousSibling.previousSibling.style.opacity = '1'
})
