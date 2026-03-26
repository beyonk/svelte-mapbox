<script>
  import { getContext, untrack } from 'svelte'
  import { contextKey } from '../../mapbox.js'

  const { getMap, getMapbox } = getContext(contextKey)
  const map = getMap()
  const mapbox = getMapbox()

  let { position = 'top-right', options = {} } = $props()

  const nav = new mapbox.NavigationControl(untrack(() => options))
  map.addControl(nav, untrack(() => position))
</script>
