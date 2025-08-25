export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  category: 'Safety' | 'Travel' | 'Furniture' | 'Clothing' | 'Feeding' | 'Bedding';
  retailer: string;
  link: string;
  image?: string; // Enhanced: Optional image URL
  claimed: boolean; // Enhanced: Claim status
  claimedBy?: string; // Enhanced: Optional name of person who claimed it
  claimedAt?: Date; // Enhanced: When it was claimed
}

export interface EventDetails {
  couple: string;
  date: string;
  time: string;
  location: string;
  contact: string;
}

export interface PaymentOption {
  name: string;
  identifier: string;
  link: string;
  description: string;
}
