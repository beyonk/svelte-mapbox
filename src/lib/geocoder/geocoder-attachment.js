import { load } from '../asset-loader.js'

export default function geocoderAttachment (options, { onresults, onresult, onloading, onerror, onclear, onready }) {
  return (element) => {
    let geocoderInstance

    const resources = [
      { type: 'script', value: `//api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-geocoder/${options.version}/mapbox-gl-geocoder.min.js`, id: 'byk-gc-js' }
    ]

    const customStylesheetUrl = options.customStylesheetUrl
    if (customStylesheetUrl) {
      resources.push({ type: 'link', value: customStylesheetUrl, id: 'byk-gcsu-css' })
    } else {
      resources.push({ type: 'link', value: `//api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-geocoder/${options.version}/mapbox-gl-geocoder.css`, id: 'byk-gc-css' })
    }

    load(resources, () => {
      geocoderInstance = new window.MapboxGeocoder(options)
      geocoderInstance.addTo(`#${element.id}`)
      if (options.value) {
        geocoderInstance.setInput(options.value)
      }

      geocoderInstance.on('results', (ev) => {
        onresults?.(ev)
      })
      geocoderInstance.on('result', (ev) => {
        console.log('result', onresult, ev)
        onresult?.(ev)
      })
      geocoderInstance.on('loading', (ev) => {
        onloading?.(ev)
      })
      geocoderInstance.on('error', (ev) => {
        onerror?.(ev)
      })
      geocoderInstance.on('clear', (ev) => {
        onclear?.(ev)
      })
      geocoderInstance.on('load', (ev) => {
        onready?.({ ...ev, geocoder: geocoderInstance })
      })
    })

    return () => {
      geocoderInstance && geocoderInstance.remove && geocoderInstance.remove()
    }
  }
}
