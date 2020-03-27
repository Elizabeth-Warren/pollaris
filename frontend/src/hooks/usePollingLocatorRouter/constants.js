
export const isZeroResults = (status) => status === 'ZERO_RESULTS';
export const isGoogleDown = (status) => status !== 'OK';

export const LogErrors = {
  NO_GOOGLE_RESULT: 'GOOGLE_NO_RESULT',
  GOOGLE_UNAVAILABLE: 'GOOGLE_UNAVAILABLE',
  INCOMPLETE_ADDRESS: 'INCOMPLETE_ADDRESS',
};

export default LogErrors;
