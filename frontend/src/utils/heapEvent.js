export const EventNames = Object.freeze({
  IMPRESSION_DONATION_ASK: 'donation_ask_interruptor_impression',
  IMPRESSION_EMAIL_ACQUISITION: 'email_acquisition_interruptor_impression',
  IMPRESSION_RELATED_CONTENT: 'related_content_module_impression',
  IMPRESSION_MOBILIZATION: 'Mobilization Interruptor Impression',
  ACTBLUE_DONATION_MODAL_OPEN: 'Actblue Donation Modal Open',
  ACTBLUE_DONATION_MODAL_CLOSE: 'Actblue Donation Modal Close',
  ACTBLUE_DONATION_MODAL_ERROR: 'Actblue Donation Modal Error',
  ACTBLUE_DONATION_MODAL_CONTRIBUTION: 'Actblue Donation Modal Contribution',
  SUBMITTED_FORM: 'Submitted Form',
});

export function heapAddUserProperties(payload) {
  if (process.env.NODE_ENV === 'development') {
    console.log('Custom Heap User Properties', payload);
  }

  const { heap } = window;

  if (typeof heap !== 'undefined') {
    heap.addUserProperties(payload);
  }
}

export default function heapEvent(name, payload = {}) {
  if (process.env.NODE_ENV === 'development') {
    console.log('Custom Heap Event', name, payload);
  }

  const { heap } = window;

  if (typeof heap === 'object') {
    const stringifiedPayload = Object.entries(payload).reduce((obj, [key, value]) => ({
      ...obj,
      [key]: typeof value === 'object' ? JSON.stringify(value) : value,
    }), {});
    heap.track(name, stringifiedPayload);
  }
}
