export interface Service {
  title: string;
  slug: string;
  description: string;
}

export const services: Service[] = [
  {
    title: "Outdoor Portraits",
    slug: "outdoor-portraits",
    description:
      "Natural light portraits set against beautiful outdoor backdrops. Whether you are looking for a relaxed family session in golden-hour meadows or a striking individual portrait with dramatic scenery, every frame is crafted to capture genuine personality and connection.",
  },
  {
    title: "Weddings",
    slug: "weddings",
    description:
      "Your wedding day told through honest, heartfelt imagery. From the quiet anticipation of getting ready to the joy of the last dance, I document the emotions, details, and spontaneous moments that make your celebration uniquely yours.",
  },
  {
    title: "Commercial",
    slug: "commercial",
    description:
      "Professional imagery that elevates your brand and tells your story. From product photography and team headshots to lifestyle campaigns, I work closely with you to create visuals that resonate with your audience and set you apart.",
  },
  {
    title: "Landscape",
    slug: "landscape",
    description:
      "Sweeping vistas, intimate details, and the quiet beauty of the natural world. My landscape work captures the mood and atmosphere of a place, from dramatic coastal cliffs to serene woodland paths, creating images you can lose yourself in.",
  },
  {
    title: "Cars",
    slug: "cars",
    description:
      "Automotive photography that captures the character and craftsmanship of remarkable machines. Whether it is a classic restoration, a modern supercar, or a beloved daily driver, I bring out the lines, textures, and personality that make each vehicle special.",
  },
  {
    title: "Assignments",
    slug: "assignments",
    description:
      "Editorial and commissioned photography tailored to your brief. From magazine features and press coverage to bespoke creative projects, I bring a reliable eye and flexible approach to every assignment, delivering images that exceed expectations.",
  },
  {
    title: "Events",
    slug: "events",
    description:
      "Corporate gatherings, charity galas, product launches, and milestone celebrations captured with professionalism and a storyteller's eye. I move through your event unobtrusively, documenting the key moments and the atmosphere that brings people together.",
  },
  {
    title: "Live Performances",
    slug: "live-performances",
    description:
      "The raw energy, emotion, and atmosphere of live music frozen in time. From intimate acoustic sets to festival stages, I capture the connection between performers and their audience, delivering images that let you feel the music all over again.",
  },
];

export function getServiceBySlug(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}
