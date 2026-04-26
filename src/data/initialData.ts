import { EventDetails } from '../types';

export const eventDetails: EventDetails = {
  couple: 'Eric Martinez',
  date: 'Saturday, May 16, 2026',
  time: '10:00 AM EST',
  location: 'Prince of Peace Catholic Church, 12800 NW 6th St, Miami, FL 33182',
  contact: 'Michael13414@gmail.com'
};

export const ceremonyDetails = {
  name: 'Prince of Peace Catholic Church',
  address: '12800 NW 6th St, Miami, FL 33182',
  time: '10:00 AM',
  date: 'Saturday, May 16, 2026',
  mapLink: 'https://maps.google.com/?q=Prince+of+Peace+Catholic+Church+12800+NW+6th+St+Miami+FL'
};

export const receptionDetails = {
  name: 'Royal Ballrooms Event Roma',
  address: '1405 SW 107th Ave #212C, Miami, FL 33174',
  time: '11:30 AM',
  date: 'Saturday, May 16, 2026',
  mapLink: 'https://maps.google.com/?q=Royal+Ballrooms+Event+Roma+1405+SW+107th+Ave+Miami+FL'
};

export const rsvpDeadline = 'May 7, 2026';

// Stubs for backward compatibility
export const venueLink = ceremonyDetails.mapLink;
export const amazonWishlistUrl = '';
export const paymentOptions: any[] = [];
export const initialWishlistItems: any[] = [];
