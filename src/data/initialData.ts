import { WishlistItem, EventDetails, PaymentOption } from '../types';

export const eventDetails: EventDetails = {
  couple: 'Rachel & Michael',
  date: 'November 22, 2025',
  time: '1:00 PM - 4:00 PM EST',
  location: 'Maryland (Location TBD)',
  contact: 'Michael13414@gmail.com'
};

export const paymentOptions: PaymentOption[] = [
  {
    name: 'PayPal',
    identifier: 'rachelvelasco223',
    link: 'https://www.paypal.com/paypalme/rachelvelasco223',
    description: 'Quick and secure payment'
  },
  {
    name: 'Venmo',
    identifier: '@mmart196',
    link: 'https://venmo.com/u/mmart196',
    description: 'Social payments made easy'
  },
  {
    name: 'Cash App',
    identifier: '$michael13414',
    link: 'https://cash.app/$michael13414',
    description: 'Instant money transfers'
  }
];

export const initialWishlistItems: WishlistItem[] = [
  {
    id: '1',
    name: 'Convertible Car Seat',
    price: 199.99,
    category: 'Safety',
    retailer: 'Amazon',
    link: 'https://www.amazon.com/dp/B07WNQBXZP',
    image: 'https://m.media-amazon.com/images/I/71Z5Y9Z6iBL._AC_SX466_.jpg',
    claimed: false
  },
  {
    id: '2',
    name: 'All-Terrain Stroller',
    price: 279.99,
    category: 'Travel',
    retailer: 'Target',
    link: 'https://www.target.com/p/evenflo-pivot-xplore-all-terrain-stroller-wagon/-/A-76646261',
    image: 'https://target.scene7.com/is/image/Target/GUEST_f4d4b8c8-2a8e-4a1c-bd5f-8b3e5e1c2d5e?wid=488&hei=488&fmt=pjpeg',
    claimed: false
  },
  {
    id: '3',
    name: 'Convertible Crib',
    price: 329.99,
    category: 'Furniture',
    retailer: 'Pottery Barn Kids',
    link: 'https://www.potterybarnkids.com/products/kendall-4-in-1-convertible-crib/',
    image: 'https://assets.pbimgs.com/pbimgs/rk/images/dp/wcm/202438/0018/kendall-4-in-1-convertible-crib-c.jpg',
    claimed: false
  },
  {
    id: '4',
    name: 'Smart Baby Monitor',
    price: 159.99,
    category: 'Safety',
    retailer: 'Amazon',
    link: 'https://www.amazon.com/dp/B086DVWZ5P',
    image: 'https://m.media-amazon.com/images/I/71+9x8lVJmL._AC_SX466_.jpg',
    claimed: false
  },
  {
    id: '5',
    name: 'Organic Onesie Set',
    price: 49.99,
    category: 'Clothing',
    retailer: 'Amazon',
    link: 'https://www.amazon.com/dp/B07TXQPZRG',
    image: 'https://m.media-amazon.com/images/I/81qL7+QkBDL._AC_SX466_.jpg',
    claimed: false
  },
  {
    id: '6',
    name: 'Glass Baby Bottle Set',
    price: 69.99,
    category: 'Feeding',
    retailer: 'Target',
    link: 'https://www.target.com/p/lifefactory-4oz-glass-baby-bottles-4pk/-/A-14482816',
    image: 'https://target.scene7.com/is/image/Target/GUEST_a1c5d3e7-9b4f-4c2e-a6d8-7e3f2a1b9c4d?wid=488&hei=488&fmt=pjpeg',
    claimed: false
  },
  {
    id: '7',
    name: 'Muslin Swaddle Set',
    price: 39.99,
    category: 'Bedding',
    retailer: 'Aden & Anais',
    link: 'https://www.adenandanais.com/products/classic-swaddle-4-pack-lovely',
    image: 'https://cdn.shopify.com/s/files/1/0044/7932/6103/products/9320-lovely-muslin-swaddles-4-pack-front.jpg?v=1669067044',
    claimed: false
  },
  {
    id: '8',
    name: 'Changing Station',
    price: 149.99,
    category: 'Furniture',
    retailer: 'Wayfair',
    link: 'https://www.wayfair.com/baby-kids/pdp/delta-children-changing-table-with-storage-bins-W004388234.html',
    image: 'https://secure.img1-cg.wfcdn.com/im/39375045/resize-h755-w755%5Ecompr-r85/1355/135572945/default_name.jpg',
    claimed: false
  },
  {
    id: '9',
    name: 'Knit Baby Blanket',
    price: 89.99,
    category: 'Bedding',
    retailer: 'Etsy',
    link: 'https://www.etsy.com/listing/785432123/organic-cotton-knit-baby-blanket',
    image: 'https://i.etsystatic.com/24567890/r/il/c12345/1234567890/il_fullxfull.1234567890_abcd.jpg',
    claimed: false
  },
  {
    id: '10',
    name: 'High Chair',
    price: 199.99,
    category: 'Feeding',
    retailer: 'BuyBuyBaby',
    link: 'https://www.buybuybaby.com/store/product/abiie-beyond-wooden-high-chair-with-tray/5331634',
    image: 'https://b3h2.scene7.com/is/image/BedBathandBeyond/12345_6789_MAIN?wid=488&hei=488&fmt=pjpeg',
    claimed: false
  }
];
