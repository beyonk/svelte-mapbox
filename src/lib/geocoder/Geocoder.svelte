<script>
  import geocoderAttachment from './geocoder-attachment.js'

  let {
    accessToken,
    options = {},
    version = 'v5.1.0',
    types = [ 'country', 'region', 'postcode', 'district', 'place', 'locality', 'neighborhood', 'address' ],
    placeholder = 'Search',
    value = null,
    customStylesheetUrl = false,
    geocoder = $bindable(),
    onresults,
    onresult,
    onloading,
    onerror,
    onclear,
    onload,
    ...rest
  } = $props()

  const fieldId = 'bsm-' + Math.random().toString(36).substring(6)

  const optionsWithDefaults = $derived.by(() => Object.assign({
    version,
    accessToken,
    types: types.join(','),
    placeholder,
    customStylesheetUrl,
    value
  }, options))

  function init (detail) {
    geocoder = detail.geocoder
  }
</script>

<div
  id={fieldId}
  {@attach geocoderAttachment(optionsWithDefaults, { onresults, onresult, onloading, onerror, onclear, onload })}
  onready={init}
  {...rest}
></div>

<style>
  div {
    padding: 0;
  }
</style>
