function findValue(addressComponents, wordLength) {
  return componentType =>
    (addressComponents.find(({ types }) => types.includes(componentType)) ||
      {})[wordLength]
}

function matchMapToValue(addressComponents, wordLength) {
  return (prev, [requiredKey, googleComponentTypes]) => {
    const resultField = googleComponentTypes
      .map(findValue(addressComponents, wordLength))
      .join('')

    return resultField
      ? {
          ...prev,
          [requiredKey]: resultField,
        }
      : prev
  }
}

function parseGoogleAddressComponent(
  responseBody,
  googleToTypeMapping,
  wordLength = 'short_name'
) {
  const coords = {}
  const resultFields = Object.entries(googleToTypeMapping).reduce(
    matchMapToValue(responseBody.address_components, wordLength),
    {}
  )

  if (responseBody.geometry) {
    coords.latitude = responseBody.geometry.location.lat()
    coords.longitude = responseBody.geometry.location.lng()
  }

  return {
    ...resultFields,
    ...coords,
  }
}

export default parseGoogleAddressComponent
