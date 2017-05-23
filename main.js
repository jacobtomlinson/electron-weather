const {app, BrowserWindow, ipcMain, Tray} = require('electron')
const path = require('path')

const assetsDirectory = path.join(__dirname, 'assets')

let tray = undefined
let window = undefined

process.env.GOOGLE_API_KEY = "AIzaSyAjQz5Scgjt8A-n_PKQWjNiYg-ht2gUJts"

var menubar = require('menubar')
var mb = menubar({
  "icon": path.join(assetsDirectory, 'flagTemplate.png'),
  "width": 350,
  "height": 400
})

mb.on('ready', function ready () {
  console.log('app is ready')
  // your app code here
})

ipcMain.on('weather-updated', (event, weather) => {
  let weatherType = weather.properties.forecast.current.weatherType.value.index
  console.log(weatherType)
  if (weatherType == 0){
    mb.tray.setImage(path.join(assetsDirectory, 'moonTemplate.png'))
  } else if (weatherType == 1){
    mb.tray.setImage(path.join(assetsDirectory, 'sunTemplate.png'))
  } else if (weatherType >= 9 && weatherType <= 27) {
    mb.tray.setImage(path.join(assetsDirectory, 'umbrellaTemplate.png'))
  } else {
    mb.tray.setImage(path.join(assetsDirectory, 'cloudTemplate.png'))
  }
  event.returnValue = true
})


ipcMain.on('system-event', (event, code) => {
  if (code == "quit") {
    app.quit()
  }
})
