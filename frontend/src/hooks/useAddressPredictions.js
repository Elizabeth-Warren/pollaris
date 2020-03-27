import { useEffect, useRef, useState } from 'react';

function useAddressPredictions(isGoogleLoaded) {
  const [predictions, setPredictions] = useState([]);
  const [input, setInput] = useState('');
  const autocomplete = useRef();

  useEffect(() => {
    if (!autocomplete.current && window.google) {
      autocomplete.current = new window.google.maps.places.AutocompleteService();
    }
  }, [isGoogleLoaded]);

  function getPlacePredictions(predictionInput) {
    if (autocomplete.current && predictionInput) {
      autocomplete.current.getPlacePredictions(
        {
          input: predictionInput,
          types: ['address'],
          componentRestrictions: { country: 'us' },
        },
        (newPredictions) => setPredictions && setPredictions(newPredictions),
      );
    }
  }

  useEffect(() => {
    getPlacePredictions(input);
  }, [input]);

  return {
    input, setInput, predictions,
  };
}

export default useAddressPredictions;
