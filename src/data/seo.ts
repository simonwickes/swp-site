export interface SiteInfo {
  name: string;
  url: string;
  description: string;
  city: string;
  state: string;
  country: string;
  contactPageUrl: string;
  logoUrl: string;
}

export const siteInfo: SiteInfo = {
  name: "Simon Wickes Photography",
  url: "https://simonwickes.com",
  description:
    "Professional photographer in Arizona specializing in portraits, weddings, commercial, and landscape photography.",
  city: "Phoenix",
  state: "AZ",
  country: "US",
  contactPageUrl: "https://simonwickes.com/contact/",
  logoUrl: "https://simonwickes.com/og-default.jpg",
};

// TODO: Update these social profile URLs before launch
export const socialProfiles: string[] = [
  "https://instagram.com/simonwickes",
  "https://facebook.com/simonwickesphotography",
];

// TODO: Customize service areas to match actual coverage
export const serviceAreas: string[] = [
  "Phoenix",
  "Scottsdale",
  "Tempe",
  "Mesa",
  "Chandler",
  "Gilbert",
];

// TODO: Add your GA4 measurement ID (G-XXXXXXXXXX format)
export const GA_MEASUREMENT_ID: string = "";

export function getSiteInfo(): SiteInfo {
  return siteInfo;
}
