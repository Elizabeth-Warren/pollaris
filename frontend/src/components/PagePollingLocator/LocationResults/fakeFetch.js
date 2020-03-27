const FIXTURE = {
  errors: [],
  home_address: {
    street_number: '133',
    street: 'Polk St',
    city: 'San Francisco',
    state: 'CA',
    zip5: '94102',
    zip9: '94102XXXX',
    county: 'San Francisco',
    latitude: 37.77781,
    longitude: -122.418465,
  },
  pollaris_search_id: '36282548563850101196',
  polling_locations: [
    {
      location_id: 4779469863456287918,
      location_name: 'City Beer Store',
      address: '1148 Mission St',
      city: 'San Francisco',
      state_code: 'CA',
      zip: '94103',
      dates_hours: '7:00 PM',
      latitude: null,
      longitude: null,
    },
    {
      location_id: 4779469863456287919,
      location_name: 'Barebottle Brewing Company',
      address: '1525 Cortland Ave',
      city: 'San Francisco',
      state_code: 'CA',
      zip: '94110',
      dates_hours: '7:00 PM',
      latitude: null,
      longitude: null,
    },
    {
      location_id: 4779469863456287920,
      location_name: "Rusty's Southern",
      address: '750 Ellis St',
      city: 'San Francisco',
      state_code: 'CA',
      zip: '94109',
      dates_hours: '7:00 PM',
      latitude: null,
      longitude: null,
    },
  ],
  early_vote_locations: [
    {
      location_id: 4779469863456287918,
      location_name: 'The Mill',
      address: '736 Divisadero St',
      city: 'San Francisco',
      state_code: 'CA',
      zip: '94117',
      dates_hours: '7:00 PM',
      latitude: null,
      longitude: null,
    },
  ],
  precinct: {
    van_precinct_id: 947534,
    state_code: 'CA',
    county: 'San Francisco',
    fips: '19139',
    precinct_code: 'SF04',
  },
  match_type: 'MATCH_ADDRESS',
}

export default function resolveFixtureAfter2Seconds() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(FIXTURE)
    }, 2000)
  })
}
