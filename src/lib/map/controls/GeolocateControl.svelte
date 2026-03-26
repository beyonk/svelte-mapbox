<script>
  import { getContext, onMount, untrack } from 'svelte'
  import { contextKey } from '../../mapbox.js'
  import { bindEvents } from '../../event-bindings.js'

  const { getMap, getMapbox } = getContext(contextKey)
  const map = getMap()
  const mapbox = getMapbox()

  let { position = 'top-left', options = {}, ...rest } = $props()

  let dispatcher = $state()

  const handlers = {
    error: (el, ev) => [ 'error', ev ],
    geolocate: (el, ev) => [ 'geolocate', ev ],
    outofmaxbounds: (el, ev) => [ 'outofmaxbounds', ev ],
    trackuserlocationend: (el, ev) => [ 'trackuserlocationend', ev ],
    trackuserlocationstart: (el, ev) => [ 'trackuserlocationstart', ev ]
  }

  const geolocate = new mapbox.GeolocateControl(untrack(() => options))
  map.addControl(geolocate, untrack(() => position))

  onMount(() => {
    return bindEvents(geolocate, handlers, mapbox, dispatcher)
  })

  export function trigger () {
    geolocate.trigger()
  }
</script>

<div bind:this={dispatcher} {...rest}></div>

<style>
  div { display: none; }
</style>
