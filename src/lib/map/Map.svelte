<script>
  import { setContext, untrack } from 'svelte'
  import { contextKey } from '../mapbox.js'
  import mapAttachment from './map-attachment.js'
  import { EventQueue } from '../queue.svelte.js'

  let {
    version = 'v3.20.0',
    center = [ 0, 0 ],
    zoom = $bindable(9),
    zoomRate = 1,
    wheelZoomRate = 1,
    options = {},
    accessToken,
    customStylesheetUrl = false,
    style = 'mapbox://styles/mapbox/streets-v11',
    children,
    onready,
    ondragend,
    ondrag,
    onmoveend,
    onzoomstart,
    onzoom,
    onzoomend,
    ...rest
  } = $props()

  let map = $state()
  let mapbox = $state()

  setContext(contextKey, {
    getMap: () => map,
    getMapbox: () => mapbox
  })

  const optionsWithDefaults = $derived.by(() => Object.assign({
    accessToken,
    style,
    center,
    zoom,
    zoomRate,
    wheelZoomRate,
    version,
    customStylesheetUrl,
    ...options
  }))

  const queue = new EventQueue()

  function init (detail) {
    map = detail.map
    mapbox = detail.mapbox
    queue.start(map)

    map.on('zoomend', (e) => {
      zoom = map.getZoom()
    })

    onready?.({ map, mapbox })
  }

  $effect(() => {
    return () => {
      queue.stop()
      map = undefined
    }
  })

  $effect(() => {
    zoom && setZoom(zoom)
  })

  export function fitBounds (bbox, data = {}) {
    queue.send('fitBounds', [ bbox, data ])
  }

  export function flyTo (destination, data = {}) {
    queue.send('flyTo', [ destination, data ])
  }

  export function resize () {
    queue.send('resize')
  }

  export function setCenter (coords, data = {}) {
    queue.send('setCenter', [ coords, data ])
  }

  export function setZoom (value, data = {}) {
    queue.send('setZoom', [ value, data ])
  }

  export function addControl (control, position = 'top-right') {
    queue.send('addControl', [ control, position ])
  }

  export function getMap () {
    return map
  }

  export function getMapbox () {
    return mapbox
  }
</script>

<div
  {@attach mapAttachment(
      optionsWithDefaults,
      { onready: init, ondragend, ondrag, onmoveend, onzoomstart, onzoom, onzoomend }
    )}
  {...rest}
  role="presentation"
>
  {#if map}
    {@render children?.()}
  {/if}
</div>

<style>
  div {
    width: 100%;
    height: 100%;
  }
</style>
