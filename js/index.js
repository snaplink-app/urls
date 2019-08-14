const LAG = (700)
const SECONDS = 5
let REDIRECT_DATA = {}
let TIMEOUT = null

const createYours = () => {
  window.location.href = "https://snaplink.app"
}

const loadUser = () => {
  $.ajax({
    url: (SNAP.API_PATH + "/live/load/" + (window.location.pathname.toString().replace(/\//g,"").trim() || SNAP.ERROR_CODE) + "/"),
    success: (data) => {
      if (data.username) {
        REDIRECT_DATA = data
        $(document).ready(() => {
          document.getElementById("username").innerHTML = data.username
          let img = (document.getElementById("image") || document.getElementsByClassName("logo")[0])
          img.onload = () => {
            document.getElementById("add").className += " countdown"
            img.onclick = redirect
            document.onblur = noThanks
            document.body.style.opacity = 1;
            TIMEOUT = setTimeout(redirect,((SECONDS * 1000) - (LAG / 2)))
          }
          img.src = ("https://app.snapchat.com/web/deeplink/snapcode?bitmoji=enable&type=SVG&username=" + data.username)
        })
      }
      else {
        setLocation(data)
      }
    }
  })
}

const setLocation = (data) => {
  window.location.replace(data.location)
  if (data.alternate && !SNAP.utils.Mobile()) {
    window.setTimeout(() => {
      if (document.hasFocus()) {
        window.location.href = data.alternate
      }
    },LAG)
  }
}

const redirect = () => {
  noThanks()
  setLocation(REDIRECT_DATA)
}

const noThanks = () => {
  clearTimeout(TIMEOUT)
  document.getElementById("add").className += " cancelled"
}

if (location.protocol != "https:") {
  window.location.replace("https:" + window.location.href.substring(window.location.protocol.length))
}
else {
  loadUser()
}
