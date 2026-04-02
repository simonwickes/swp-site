export interface Service {
  title: string;
  slug: string;
  description: string;
}

export const services: Service[] = [
  {
    title: "Architectural",
    slug: "architectural",
    description:
      "Buildings, interiors, and the spaces we inhabit, captured with an eye for light and structure. From striking real estate listings and inviting business exteriors to landscaped grounds and architectural details, I create images that showcase properties and places at their very best.",
  },
  {
    title: "Assignments",
    slug: "assignments",
    description:
      "Editorial, commercial, and commissioned photography tailored to your brief. From magazine features and brand campaigns to product shots and bespoke creative projects, I bring a reliable eye and flexible approach to every assignment, delivering images that exceed expectations.",
  },
  {
    title: "Events",
    slug: "events",
    description:
      "Charity dinners, corporate gatherings, graduations, rodeos, rock concerts, and public performances captured with professionalism and a storyteller's eye. I move through your event unobtrusively, documenting the key moments, the raw energy on stage, and the atmosphere that brings people together.",
  },
  {
    title: "Portraits",
    slug: "portraits",
    description:
      "Portraits that reveal personality and connection, whether captured in golden-hour sunlight or the controlled environment of a studio. From relaxed family sessions outdoors to polished headshots and creative studio work, every frame is crafted to bring out the best in you.",
  },
  {
    title: "Travel",
    slug: "travel",
    description:
      "The spirit of adventure and the beauty of far-flung places. From classic cars and vintage aircraft to sweeping road-trip vistas and distant destinations, I capture the vehicles, journeys, and landscapes that fuel the urge to explore.",
  },
  {
    title: "Weddings",
    slug: "weddings",
    description:
      "Your wedding day told through honest, heartfelt imagery. From the quiet anticipation of getting ready to the joy of the last dance, I document the emotions, details, and spontaneous moments that make your celebration uniquely yours.",
  },
];

export function getServiceBySlug(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}
