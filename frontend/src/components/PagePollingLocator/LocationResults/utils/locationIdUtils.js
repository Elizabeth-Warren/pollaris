
export function createLocationId(votingType, id) {
  return `${votingType}-${id}`;
}

export function getPollarisIdfromIdentifier(identifier) {
  return identifier && identifier.split('-')[1];
}

export function getVotingTypefromIdentifier(identifier) {
  return identifier && identifier.split('-')[0];
}

export default {
  createLocationId,
  getPollarisIdfromIdentifier,
  getVotingTypefromIdentifier,
};
