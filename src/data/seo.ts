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
  city: "Prescott",
  state: "AZ",
  country: "US",
  contactPageUrl: "https://simonwickes.com/contact/",
  logoUrl: "https://simonwickes.com/og-default.jpg",
};

export const socialProfiles: string[] = [
  "https://www.instagram.com/simonwickes",
  // Add Facebook URL when available
];

export const serviceAreas: string[] = [
  "Prescott",
  "Prescott Valley",
  "Dewey",
  "Sedona",
  "Flagstaff",
  "Yavapai County",
];

export const GA_MEASUREMENT_ID: string = "G-6F43WS1L0Y";

export function getSiteInfo(): SiteInfo {
  return siteInfo;
}
