import logging

import googlemaps


def geocode(address, key):
    res = raw_geocode(address, key)
    if not res:
        return None

    first_res = res[0]

    if "geometry" not in first_res:
        logging.info(f"No geometry for address: {address}")
        return None

    location = first_res["geometry"].get("location")

    if not location:
        logging.info(f"No location for address: {address}")
        return None

    return location


def geocode_to_components(address, key):
    """Geocodes address into standard US address components."""
    res = raw_geocode(address, key)
    if not res:
        return None

    return _parse_google_api_response_components(res[0])


def raw_geocode(address, key):
    gmaps = googlemaps.Client(key=key, retry_timeout=10)
    res = gmaps.geocode(address)
    if not res:
        logging.info(f"No results geocoding address: {address}")
        return None
    return res


def _parse_google_api_response_components(response):
    """Parse Google maps "address_components" into more compact json.
    Assumes US address.
    Input format described at
    https://developers.google.com/places/web-service/details#PlaceDetailsResponses
    """
    address_components = response["address_components"]
    mapping = {
        "street_number": "street_number",
        "street": "route",
        "city": "locality",
        "county": "administrative_area_level_2",
        "state": "administrative_area_level_1",
        "postal_code": "postal_code",
        "postal_code_suffix": "postal_code_suffix",
    }
    result = {}
    for key in mapping:
        try:
            d = next(c for c in address_components if c["types"][0] == mapping[key])
            value = d["short_name"]  # short_name matches with our data
        except StopIteration:
            value = None
        result[key] = value
    if result.get("postal_code_suffix"):
        result["zip9"] = result["postal_code"] + result.pop("postal_code_suffix")
    result["zip5"] = result.pop("postal_code")

    result["google_place_id"] = response.get("place_id")
    if response.get("geometry") and response.get("geometry").get("location"):
        loc = response.get("geometry").get("location")
        result["latitude"] = loc.get("lat")
        result["longitude"] = loc.get("lng")

    return result


def find_place(address, key):
    gmaps = googlemaps.Client(key=key)
    res = gmaps.find_place(address, "textquery")
    if res["status"] != "OK":
        logging.info(f"Places lookup failed: {address}")
        return None
    candidates = res["candidates"]
    if not res:
        logging.info(f"No results in places search of address: {address}")
        return None
    return gmaps.place(candidates[0]["place_id"])
