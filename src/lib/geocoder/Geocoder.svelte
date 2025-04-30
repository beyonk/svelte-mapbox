<div
  id={fieldId}
  use:action={optionsWithDefaults}
  on:ready={init}
  on:results
  on:result
  on:loading
  on:error
  on:clear
  on:load
></div>

<script>
  import { createEventDispatcher } from 'svelte'
  import action from './geocoder-action.js'

  export let accessToken
  export let options = {}
  export let version = 'v5.0.3'
  export let types = [ 'country', 'region', 'postcode', 'district', 'place', 'locality', 'neighborhood', 'address' ]
  export let placeholder = 'Search'
  export let value = null
  export let customStylesheetUrl = false
  export let geocoder

  /**
   * Allows you to provide the mapbox geocoder, in case it isn't possible to access it globally
   */
  export let MapboxGeocoder = undefined

  const dispatch = createEventDispatcher()
  const fieldId = 'bsm-' + Math.random().toString(36).substring(6)

  const optionsWithDefaults = Object.assign({
    version,
    accessToken,
    types: types.join(','),
    placeholder,
    customStylesheetUrl,
    value,
    MapboxGeocoder
  }, options)

  function init ({ detail }) {
    geocoder = detail.geocoder
    dispatch('ready')
  }
</script>

<style>
  div {
    padding: 0;
  }
</style>