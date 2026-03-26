import { load } from '../asset-loader.js'
import { bindEvents } from '../event-bindings.js'

export default function geocoderAttachment (options) {
  return (element) => {
    let geocoderInstance
    let unbind = () => {}

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
      unbind = bindEvents(geocoderInstance, handlers, false, element)
    })

    return () => {
      unbind()
      geocoderInstance && geocoderInstance.remove && geocoderInstance.remove()
    }
  }
}

const handlers = {
  results: (el, ev) => {
    return [ 'results', ev ]
  },
  result: (el, ev) => {
    return [ 'result', ev ]
  },
  loading: (el, ev) => {
    return [ 'loading', ev ]
  },
  error: (el, ev) => {
    return [ 'error', ev ]
  },
  clear: (el, ev) => {
    return [ 'clear', ev ]
  },
  load: el => {
    return [ 'ready', { geocoder: el } ]
  }
}
