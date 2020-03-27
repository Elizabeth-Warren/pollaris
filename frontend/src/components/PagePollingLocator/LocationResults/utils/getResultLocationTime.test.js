
import getResultLocationTime from './getResultLocationTime';

describe('getLocationNameUtility', () => {
  it('returns interpolated string with location name prefix', () => {
    expect(
      getResultLocationTime(
        '7:00 AM - 7:00 PM',
        '{{DATES_HOURS}}, on Saturday',
      ),
    ).toBe('7:00 AM - 7:00 PM, on Saturday');
  });

  it('returns pollaris date_time if prefix is undefined', () => {
    expect(
      getResultLocationTime(
        '7:00 AM - 7:00 PM',
      ),
    ).toBe('7:00 AM - 7:00 PM');
  });
});
