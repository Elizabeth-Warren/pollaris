import getLocationName from './getLocationName';

describe('getLocationNameUtility', () => {
  it('returns interpolated string with location name prefix', () => {
    expect(
      getLocationName(
        'MA125',
        { customLocationNamePrefix: '{{PRECINCT_CODE}} - ' },
        { location_name: 'BOYS & GIRLS CLUB OF GREATER CONCORD' },
      ),
    ).toBe('MA125 - BOYS & GIRLS CLUB OF GREATER CONCORD');
  });

  it('returns only location name if location prefix is not provided', () => {
    expect(
      getLocationName(
        'MA125',
        { },
        { location_name: 'BOYS & GIRLS CLUB OF GREATER CONCORD' },
      ),
    ).toBe('BOYS & GIRLS CLUB OF GREATER CONCORD');
  });

  it('returns location name if precinct info is not provided', () => {
    expect(
      getLocationName(
        undefined,
        { customLocationNamePrefix: '{{PRECINCT_CODE}} - ' },
        { location_name: 'BOYS & GIRLS CLUB OF GREATER CONCORD' },
      ),
    ).toBe('BOYS & GIRLS CLUB OF GREATER CONCORD');
  });
});
