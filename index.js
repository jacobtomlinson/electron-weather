const {ipcRenderer, shell} = require('electron')

document.addEventListener('click', (event) => {
  if (event.target.href) {
    // Open links in external browser
    shell.openExternal(event.target.href)
    event.preventDefault()
  } else if (event.target.classList.contains('js-refresh-action')) {
    updateWeather()
  } else if (event.target.classList.contains('js-quit-action')) {
    ipcRenderer.send('system-event', "quit")
  }
})

const toTitleCase = (str) => {
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

const getGeoLocation = () => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject)
  })
}

const getWeather = (position) => {
  const location = `${position.coords.latitude},${position.coords.longitude}`
  console.log(`Getting weather for ${location}`)
  const url = `https://shlmog4lwa.execute-api.eu-west-1.amazonaws.com/dev/datapoint?location=${location}`

  return window.fetch(url).then((response) => {
    return response.json()
  })
}

const updateView = (weather) => {
  const currently = weather.properties.forecast.current

  document.querySelector('.js-summary').textContent = currently.weatherType.value.description
  document.querySelector('.js-update-time').textContent = `${new Date(currently.time).toLocaleTimeString()}`
  document.querySelector('.js-location').textContent = toTitleCase(weather.properties.site.name)

  document.querySelector('.js-temperature').textContent = `${Math.round(currently.temperature.value)}° C`
  document.querySelector('.js-apparent').textContent = `${Math.round(currently.feelsLikeTemperature.value)}° C`

  document.querySelector('.js-wind').textContent = `${Math.round(currently.windSpeed.value)} mph`
  document.querySelector('.js-wind-direction').textContent = currently.windDirection.value

  document.querySelector('.js-uv').textContent = `${Math.round(currently.maxUVIndex.value.index)}`
  document.querySelector('.js-humidity').textContent = `${Math.round(currently.screenRelativeHumidity.value)}%`

  document.querySelector('.js-visibility').textContent = `${currently.visibility.value.description.split("-")[0].trim()}`
  document.querySelector('.js-precipitation-chance').textContent = `${currently.precipitationProbability.value}%`
}

const updateWeather = () => {
  getGeoLocation().then(getWeather).then((weather) => {
    // Use local time
    weather.properties.forecast.current.time = Date.now()

    console.log('Got weather', weather)

    ipcRenderer.send('weather-updated', weather)
    updateView(weather)
    previousWeather = weather
  })
}

// Update initial weather when loaded
document.addEventListener('DOMContentLoaded', updateWeather)
