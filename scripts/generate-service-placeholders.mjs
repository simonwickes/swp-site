/**
 * Generate placeholder gallery images for all 8 service categories.
 * Each category gets 15 solid-color images with varied aspect ratios
 * to test masonry layout rendering.
 *
 * Usage: node scripts/generate-service-placeholders.mjs
 */

import sharp from "sharp";
import { mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";

const OUTPUT_BASE = "src/assets/images/services";

// Service categories with unique base colors derived from the site palette
const categories = [
  { slug: "outdoor-portraits", color: { r: 107, g: 142, b: 95 } }, // Muted forest green
  { slug: "weddings", color: { r: 190, g: 160, b: 140 } }, // Warm blush
  { slug: "commercial", color: { r: 90, g: 105, b: 130 } }, // Steel blue
  { slug: "landscape", color: { r: 130, g: 155, b: 120 } }, // Sage green
  { slug: "cars", color: { r: 140, g: 100, b: 80 } }, // Warm brown
  { slug: "assignments", color: { r: 120, g: 110, b: 130 } }, // Muted purple
  { slug: "events", color: { r: 170, g: 130, b: 90 } }, // Amber gold
  { slug: "live-performances", color: { r: 150, g: 80, b: 80 } }, // Deep red
];

// Varied aspect ratios for masonry layout testing
// Mix of landscape, portrait, and square
const aspectRatios = [
  { w: 1200, h: 900 }, // 4:3 landscape
  { w: 1200, h: 800 }, // 3:2 landscape
  { w: 900, h: 1200 }, // 3:4 portrait
  { w: 800, h: 1200 }, // 2:3 portrait
  { w: 1000, h: 1000 }, // 1:1 square
  { w: 1200, h: 900 }, // 4:3 landscape
  { w: 800, h: 1200 }, // 2:3 portrait
  { w: 1200, h: 800 }, // 3:2 landscape
  { w: 900, h: 1200 }, // 3:4 portrait
  { w: 1000, h: 1000 }, // 1:1 square
  { w: 1200, h: 900 }, // 4:3 landscape
  { w: 1200, h: 800 }, // 3:2 landscape
  { w: 800, h: 1200 }, // 2:3 portrait
  { w: 900, h: 1200 }, // 3:4 portrait
  { w: 1200, h: 900 }, // 4:3 landscape
];

/**
 * Add subtle variation to a base color for each image
 */
function varyColor(base, index) {
  const offset = (index - 8) * 4;
  return {
    r: Math.max(0, Math.min(255, base.r + offset)),
    g: Math.max(0, Math.min(255, base.g + offset)),
    b: Math.max(0, Math.min(255, base.b + offset)),
  };
}

async function generateImages() {
  let totalGenerated = 0;

  for (const category of categories) {
    const dir = join(OUTPUT_BASE, category.slug);

    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }

    for (let i = 1; i <= 15; i++) {
      const filename = `${String(i).padStart(2, "0")}-placeholder.jpg`;
      const filepath = join(dir, filename);
      const { w, h } = aspectRatios[i - 1];
      const color = varyColor(category.color, i);

      await sharp({
        create: {
          width: w,
          height: h,
          channels: 3,
          background: color,
        },
      })
        .jpeg({ quality: 70 })
        .toFile(filepath);

      totalGenerated++;
    }

    console.log(`  ${category.slug}: 15 images generated`);
  }

  console.log(`\nTotal: ${totalGenerated} placeholder images generated`);
}

generateImages().catch((err) => {
  console.error("Failed to generate placeholders:", err);
  process.exit(1);
});
