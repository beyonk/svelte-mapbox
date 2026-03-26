import { load } from '../asset-loader.js'

export default function mapAttachment (options = {}, { ondragend, ondrag, onmoveend, onzoomstart, onzoom, onzoomend, onready }) {
  return (element) => {
    let map

    function init (options) {
      window.mapboxgl.accessToken = options.accessToken
      const el = new window.mapboxgl.Map(options)

      el.on('dragend', () => {
        ondragend?.({ center: el.getCenter() })
      })
      el.on('drag', () => {
        ondrag?.({ center: el.getCenter() })
      })
      el.on('moveend', () => {
        onmoveend?.({ center: el.getCenter() })
      })
      el.on('zoomstart', () => {
        onzoomstart?.({ zoom: el.getZoom() })
      })
      el.on('zoom', () => {
        onzoom?.({ zoom: el.getZoom() })
      })
      el.on('zoomend', () => {
        onzoomend?.({ zoom: el.getZoom() })
      })
      el.on('load', () => {
        onready?.({ map: el, mapbox: window.mapboxgl })
      })
    }

    const resources = [
      { type: 'script', attr: 'src', value: `//api.mapbox.com/mapbox-gl-js/${options.version}/mapbox-gl.js`, id: 'byk-gl-js' },
      { type: 'link', attr: 'href', value: `//api.mapbox.com/mapbox-gl-js/${options.version}/mapbox-gl.css`, id: 'byk-gl-css' }
    ]

    const customStylesheetUrl = options.customStylesheetUrl
    if (customStylesheetUrl) {
      resources.push({ type: 'link', attr: 'href', value: customStylesheetUrl, id: 'byk-mcsu-css' })
    }

    let unbind = () => {}
    load(resources, () => {
      unbind = init({ ...options, container: element })
    })

    return {
      destroy () {
        unbind()
        map && map.remove && map.remove()
      }
    }
  }
}
