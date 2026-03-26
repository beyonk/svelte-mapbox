<script>
  import { getContext, untrack } from 'svelte'
  import { contextKey } from '../../mapbox.js'

  const { getMap, getMapbox } = getContext(contextKey)
  const map = getMap()
  const mapbox = getMapbox()

  let { position = 'bottom-right', options = {} } = $props()

  const optionsWithDefaults = untrack(() => Object.assign({
    maxWidth: 80,
    unit: 'metric'
  }, options))

  const scale = new mapbox.ScaleControl(optionsWithDefaults)
  map.addControl(scale, untrack(() => position))
</script>
