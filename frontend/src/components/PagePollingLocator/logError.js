import getHeapId from 'wr/utils/getHeapId';

/**
{
  "address_entered": {“city”: “Needham”, “state”: “MA” ...},
 // or: "address_entered": {“search_string”: “123 asdjfhasdf ave”}
  "heap_id": "nx7465n67",
  "status": "INCOMPLETE_ADDRESS",
  “autocomplete_selected”: true/false
}
*/
function logError(status, addressBody, autoCompleteSelected = false) {
  return fetch(`${process.env.POLLARIS_URI}/search/log`, {
    method: 'POST',
    body: JSON.stringify({
      status,
      address_entered: addressBody,
      autocomplete_selected: autoCompleteSelected,
      heap_id: getHeapId(),
    }),
  });
}

export default logError;
