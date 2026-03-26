<script>
  import { onMount, getContext } from 'svelte'
  import { contextKey } from '../mapbox.js'

  const { getMap, getMapbox } = getContext(contextKey)
  const map = getMap()
  const mapbox = getMapbox()

  function randomColour () {
    return Math.round(Math.random() * 255)
  }

  let {
    lat,
    lng,
    label = 'Marker',
    popupClassName = 'beyonk-mapbox-popup',
    markerOffset = [ 0, 0 ],
    popupOffset = 10,
    color = randomColour(),
    popup = true,
    popupOptions = {},
    markerOptions = {},
    children,
    popupContent
  } = $props()

  let marker = $state()
  let element = $state()
  let elementPopup = $state()

  function move (lng, lat) {
    marker.setLngLat({ lng, lat })
  }

  $effect(() => {
    if (marker) move(lng, lat)
  })

  onMount(() => {
    const namedParams = Object.assign(
      { offset: markerOffset },
      element.hasChildNodes() ? { element } : { color }
    )
    marker = new mapbox.Marker(Object.assign(namedParams, markerOptions))

    if (popup) {
      const namedPopupParams = { offset: popupOffset, className: popupClassName }
      const popupEl = new mapbox.Popup(Object.assign(namedPopupParams, popupOptions))
      if (elementPopup.hasChildNodes()) {
        popupEl.setDOMContent(elementPopup)
      } else {
        popupEl.setText(label)
      }
      marker.setPopup(popupEl)
    }

    marker
      .setLngLat({ lng, lat })
      .addTo(map)

    if (!element.hasChildNodes()) element.remove()

    return () => marker.remove()
  })

  export function getMarker () {
    return marker
  }
</script>

<div bind:this={element}>
  {@render children?.()}
</div>

<div class='popup' bind:this={elementPopup}>
  {@render popupContent?.()}
</div>
