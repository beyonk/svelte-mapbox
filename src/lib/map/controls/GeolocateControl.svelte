<script>
  import { getContext, onMount, untrack } from 'svelte'
  import { contextKey } from '../../mapbox.js'

  const { getMap, getMapbox } = getContext(contextKey)
  const map = getMap()
  const mapbox = getMapbox()

  let { position = 'top-left', options = {}, onerror, ongeolocate, onoutofmaxbounds, ontrackuserlocationend, ontrackuserlocationstart, ...rest } = $props()

  let dispatcher = $state()

  const geolocate = new mapbox.GeolocateControl(untrack(() => options))
  map.addControl(geolocate, untrack(() => position))

  onMount(() => {
    geolocate.on('error', onerror)
    geolocate.on('geolocate', ongeolocate)
    geolocate.on('outofmaxbounds', onoutofmaxbounds)
    geolocate.on('trackuserlocationend', ontrackuserlocationend)
    geolocate.on('trackuserlocationstart', ontrackuserlocationstart)
  })

  export function trigger () {
    geolocate.trigger()
  }
</script>

<div bind:this={dispatcher} {...rest}></div>

<style>
  div { display: none; }
</style>
