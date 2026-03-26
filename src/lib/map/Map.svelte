<script>
  import { setContext, untrack } from 'svelte'
  import { contextKey } from '../mapbox.js'
  import mapAttachment from './map-attachment.js'
  import { EventQueue } from '../queue.svelte.js'

  let {
    map = $bindable(null),
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
    ...rest
  } = $props()

  let mapbox = $state()


  const optionsWithDefaults = {
    accessToken,
    style,
    center,
    zoom,
    zoomRate,
    wheelZoomRate,
    version,
    customStylesheetUrl,
    map,
    ...options
  }

  setContext(contextKey, {
    getMap: () => map,
    getMapbox: () => mapbox
  })

  const queue = new EventQueue()

  function init (e) {
    map = e.detail.map
    mapbox = e.detail.mapbox
    queue.start(map)
    onready?.()

    map.on('zoomend', (e) => {
      zoom = map.getZoom()
    })
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
  {@attach mapAttachment(optionsWithDefaults)}
  onready={init}
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
