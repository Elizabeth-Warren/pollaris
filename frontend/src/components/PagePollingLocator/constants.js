
/**
 * Log errors for pollaris, describing errors in google search and autocomplete.
 */
export const LogErrors = {
  NO_GOOGLE_RESULT: 'GOOGLE_NO_RESULT',
  GOOGLE_UNAVAILABLE: 'GOOGLE_UNAVAILABLE',
  INCOMPLETE_ADDRESS: 'INCOMPLETE_ADDRESS',
};

/**
 * Voting Type Enums for pollaris and contentful
 */
export const VotingTypes = {
  VOTE_BY_MAIL: 'vote_by_mail',
};

/**
 * Responses from google maps and autocomplete apis.
 */
export const GoogleResponses = {
  ZERO_RESULTS: 'ZERO_RESULTS',
  OK: 'OK',
};

/**
 * Checking voting type code.
 */
export const isTypeVoteByMail = (type) => type === VotingTypes.VOTE_BY_MAIL;

/**
 * Status functions for auto complete.
 */
export const isZeroResults = (status) => status === GoogleResponses.ZERO_RESULTS;
export const isGoogleDown = (status) => status !== GoogleResponses.OK;


export default LogErrors;
