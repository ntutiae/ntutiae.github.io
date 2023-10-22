/* eslint-disable eqeqeq */
/* eslint-disable no-undef */
const videos = document.getElementsByClassName('reflections-vid')
const modal = document.getElementsByClassName('modal')
const closebtn = document.getElementsByClassName('modal-close')

function removeHash() {
  setTimeout(() => {
    window.location = window.location.pathname
    // history.pushState(null, null, "");
  }, 150)
}

document.addEventListener('DOMContentLoaded', () => {
  if (window.location.hash != undefined) {
    $(window.location.hash).modal('show')
  }
  for (let i = 0; i < videos.length; i++) {
    closebtn[i].addEventListener('click', removeHash)
    modal[i].addEventListener('click', removeHash)
  }
})
