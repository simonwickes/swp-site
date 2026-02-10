export interface FAQItem {
  question: string;
  answer: string;
  category: "booking" | "process";
}

export const faqItems: FAQItem[] = [
  // Booking & Pricing questions
  {
    question: "How far in advance should I book?",
    answer:
      "For weddings and large events, I recommend booking 3-6 months ahead to secure your date. Portrait sessions and smaller shoots can often be arranged with shorter notice, but popular times like autumn weekends fill up quickly.",
    category: "booking",
  },
  {
    question: "How do you structure your pricing?",
    answer:
      "Every project is different, so I provide custom quotes based on the scope of work, location, and your specific needs. I offer a free initial consultation to understand what you are looking for and provide a transparent quote with no hidden fees.",
    category: "booking",
  },
  {
    question: "Do you require a deposit?",
    answer:
      "Yes, I ask for a 30% deposit to secure your date, with the balance due shortly before the session or event. This ensures your date is reserved and allows me to prepare properly for your shoot.",
    category: "booking",
  },
  {
    question: "What is your cancellation or rescheduling policy?",
    answer:
      "Life happens, and I try to be flexible. Rescheduling is usually straightforward with reasonable notice. For weather-dependent outdoor shoots, I will always work with you to find an alternative date or sheltered location.",
    category: "booking",
  },
  {
    question: "Do you travel for shoots?",
    answer:
      "Absolutely. I cover the local area and am available for destination work across the UK and beyond. Travel costs are discussed upfront and included in your quote so there are no surprises.",
    category: "booking",
  },
  {
    question: "What happens if the weather is bad for an outdoor shoot?",
    answer:
      "I keep a close eye on the forecast and will be in touch if conditions look challenging. We can reschedule, find sheltered locations, or embrace the drama of moody weather - some of my favourite shots have come from overcast skies.",
    category: "booking",
  },
  {
    question: "How do I book a session?",
    answer:
      "Simply fill out the contact form with details about what you have in mind - the type of shoot, rough dates, and any ideas or inspiration. I will get back to you within 24-48 hours to arrange a consultation and discuss next steps.",
    category: "booking",
  },

  // Process & Deliverables questions
  {
    question: "How long until I receive my photos?",
    answer:
      "Turnaround depends on the project scope. Portrait sessions are typically ready within 2 weeks, while weddings and larger events take 3-4 weeks. I will always give you a clear timeline when booking so you know what to expect.",
    category: "process",
  },
  {
    question: "How many photos will I receive?",
    answer:
      "The number varies by session type. Portrait sessions typically yield 30-50 edited images, weddings 300-500, and events 100-200. I focus on quality over quantity, delivering a curated collection of my best work from your shoot.",
    category: "process",
  },
  {
    question: "Do you provide raw or unedited images?",
    answer:
      "I do not provide raw files. Every image I deliver is professionally edited and colour-graded to ensure it meets my quality standards and represents the best of your session.",
    category: "process",
  },
  {
    question: "Can I print the photos myself?",
    answer:
      "Yes, you receive full-resolution digital files with a personal use licence, so you are free to print them wherever you choose. I also include a guide with recommendations for getting the best print quality.",
    category: "process",
  },
  {
    question: "What should I wear or how should I prepare?",
    answer:
      "Preparation tips vary by shoot type, so after booking I send a personalised prep guide covering wardrobe suggestions, location details, and what to expect on the day. The key is to be comfortable and feel like yourself.",
    category: "process",
  },
  {
    question: "Do you offer photo albums or prints?",
    answer:
      "My focus is on delivering beautiful digital images through a password-protected online gallery. If you would like printed products, I am happy to recommend trusted print partners who will do justice to your photos.",
    category: "process",
  },
  {
    question: "What equipment do you use?",
    answer:
      "I shoot with professional full-frame cameras and a range of high-quality lenses suited to each situation. For weddings and events, I always bring backup equipment to ensure nothing is left to chance.",
    category: "process",
  },
  {
    question: "How do I receive my final images?",
    answer:
      "Your images are delivered through a password-protected online gallery where you can view, share, and download them at full resolution. The gallery remains active for at least six months, giving you plenty of time to access your photos.",
    category: "process",
  },
];

export function getFAQByCategory(
  category: FAQItem["category"]
): FAQItem[] {
  return faqItems.filter((item) => item.category === category);
}
