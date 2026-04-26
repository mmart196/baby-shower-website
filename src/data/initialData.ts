import { EventDetails, WishlistItem, PaymentOption } from '../types';

export const eventDetails: EventDetails = {
  couple: 'Baby Martinez',
  date: 'May 17th, 2025',
  time: '11:00 AM EST',
  location: 'St. John the Baptist Catholic Church, 123 Main St, Silver Spring, MD',
  contact: 'Michael13414@gmail.com'
};

// Baptism venue link (Google Maps or church website)
export const venueLink = 'https://maps.google.com/?q=St+John+the+Baptist+Church+Silver+Spring+MD';

// Stubs for backward compatibility (not used for baptism site)
export const amazonWishlistUrl = '';
export const paymentOptions: PaymentOption[] = [];
export const initialWishlistItems: WishlistItem[] = [];
