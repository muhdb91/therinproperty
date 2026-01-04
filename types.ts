
export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  beds: number;
  baths: number;
  carParks: number;
  propertyType: string;
  lotType: string;
  sqft: number;
  imageUrl: string;
  extraImages?: string[];
  status: 'Available' | 'Sold' | 'Pending';
}

export interface AdItem {
  id: string;
  imageUrl: string;
  title: string;
  link: string;
}

export interface Lead {
  id: string;
  propertyId: string;
  propertyName: string;
  name: string;
  phone: string;
  email: string;
  agentReferral: string;
  countryState: string;
  timestamp: string;
  status: 'New' | 'Contacted' | 'Closed' | 'Lost';
}

export interface SiteConfig {
  siteName: string;
  agentNo: string;
  phone: string;
  footerText: string;
  aboutText: string;
  adsEnabled: boolean;
  ads: AdItem[];
  notificationEmail: string;
}

export type ViewState = 'public' | 'admin' | 'property-detail' | 'gallery' | 'about' | 'contact';
