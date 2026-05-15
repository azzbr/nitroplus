/* eslint-disable */
// One-shot ingest: read scraped products + images from C:\Users\PC\Scrape DP,
// filter to ~500 mappable items distributed across our 16 part categories,
// clean descriptions, copy chosen images into public/products, write
// src/data/products.json.
// Run with: node scripts/ingest-products.js

const fs = require("fs");
const path = require("path");

const SCRAPE_DIR = "C:/Users/PC/Scrape DP";
const NITROPLUS_DIR = path.resolve(__dirname, "..");
const SOURCE_PRODUCTS = path.join(SCRAPE_DIR, "products.json");
const TARGET_PRODUCTS = path.join(NITROPLUS_DIR, "src/data/products.json");
const TARGET_IMAGES = path.join(NITROPLUS_DIR, "public/products");

const TOTAL_CAP = 500;
const PER_CATEGORY_CAP = 60;

const CATEGORY_MAP = {
  // engines / forced induction
  "Pistons & Piston Rings": "engines-forced-induction",
  Camshafts: "engines-forced-induction",
  "Connecting Rods": "engines-forced-induction",
  "Valve Springs": "engines-forced-induction",
  "Engine Valves": "engines-forced-induction",
  Bearings: "engines-forced-induction",
  Lifters: "engines-forced-induction",
  Retainers: "engines-forced-induction",
  "Engine & Components": "engines-forced-induction",
  "Cylinder Head Gasket": "engines-forced-induction",
  "Head Gaskets & Seals": "engines-forced-induction",
  "Turbochargers & Superchargers": "engines-forced-induction",
  "Turbo Manifolds": "engines-forced-induction",
  Wastegate: "engines-forced-induction",
  "Intercooler Piping Kit": "engines-forced-induction",
  "Oiling Systems": "engines-forced-induction",
  // fuel / induction
  "Fuel Injection": "fuel-induction",
  "Air & Fuel Delivery": "fuel-induction",
  "Throttle Body": "fuel-induction",
  "Intake Manifolds": "fuel-induction",
  "Fuel Pump & Regulators": "fuel-induction",
  "Fuel Pump Carrier": "fuel-induction",
  "Fuel Rail": "fuel-induction",
  "Fuel Cells & Tanks": "fuel-induction",
  "Nitrous System": "fuel-induction",
  "Nitrous Bottles": "fuel-induction",
  "Nitrous Kits": "fuel-induction",
  "Bottle Brackets": "fuel-induction",
  "Water/Methanol Injection": "fuel-induction",
  // exhaust
  "Headers & Downpipes": "exhaust",
  Exhaust: "exhaust",
  "Exhaust Cutout Valve": "exhaust",
  "Flexible Pipes": "exhaust",
  Pipes: "exhaust",
  // drivetrain
  "Transmission & Drivetrain": "drivetrain",
  "Performance Clutches": "drivetrain",
  "Clutch Center Hubs": "drivetrain",
  "Release Bearings": "drivetrain",
  Flywheels: "drivetrain",
  "Input Shafts": "drivetrain",
  "Transmission Gears": "drivetrain",
  // brakes
  "Brake System": "brakes",
  Handbrake: "brakes",
  "Handbrake Oil Tank": "brakes",
  // cooling / fluids
  "Water Pumps": "cooling-fluids",
  Coolant: "cooling-fluids",
  "Thermostats & Fillers": "cooling-fluids",
  "Overflow Tanks & Catch Cans": "cooling-fluids",
  "Electric Fans": "cooling-fluids",
  "Engine Oils": "cooling-fluids",
  "Oil Filters": "cooling-fluids",
  Additives: "cooling-fluids",
  // electrical
  Battery: "electrical",
  "Battery Brackets": "electrical",
  "Battery Charger": "electrical",
  "Wiring Harness Cables": "electrical",
  "Ignitions & Electrical": "electrical",
  "Ignition Coils": "electrical",
  Sensors: "electrical",
  "OBD II": "electrical",
  "Analog Gauges": "electrical",
  "Fuel Pressure Gauge": "electrical",
  "Tire Pressure Gauge": "electrical",
  // wheels / tires
  Tires: "wheels-tires",
  // suspension
  "Chassis & Suspension": "suspension",
  // body / exterior
  "Paint & Finishing": "body-exterior",
  "Hood Pin Kit": "body-exterior",
  "Leather Crackle": "body-exterior",
  "Wrinkle Finish": "body-exterior",
  "Spider Webs Effect": "body-exterior",
  // interior
  Seats: "interior",
  Seatbelt: "interior",
  "Steering Wheels": "interior",
  // general / fittings
  "Fittings & Hoses": "general-parts",
  "Fuel Hose & Water Hose": "general-parts",
  Clamps: "general-parts",
  Washers: "general-parts",
  Boots: "general-parts",
};

const SKIP_CATEGORIES = new Set([
  "All Products",
  "Just a moment...",
  "Safety Equipment",
  "Fire-Retardant Clothing",
  "Helmets",
  "Gloves",
  "Racing Suit",
  "Racing Jacket",
  "Racing Pants",
  "Polos",
  "Drag Chute",
  "Lanyards",
  "Tools & Shop Equipments",
  "Other Tools",
  "Electrical Testing Tools",
  "Timing Lights",
  "Practice Trees",
  "Valve Spring Testers",
  "Piston Ring Filers",
]);

const VEHICLE_KEYWORDS = {
  "american-muscle": [
    /\bmustang\b/i,
    /\bcamaro\b/i,
    /\bcorvette\b/i,
    /\bchallenger\b/i,
    /\bcharger\b/i,
    /\bhellcat\b/i,
    /\bf-?150\b/i,
    /\b(chevy|chevrolet)\b/i,
    /\bdodge\b/i,
    /\bLT[1-9]\b/,
    /\bLS[1-9]\b/,
    /\btrans am\b/i,
  ],
  "european-sport": [
    /\bBMW\b/,
    /\bM[3-5]\b/,
    /\bmercedes\b/i,
    /\bamg\b/i,
    /\baudi\b/i,
    /\b911\b/,
  ],
  "jdm-asian": [
    /\bskyline\b/i,
    /\bGT-?R\b/,
    /\bsupra\b/i,
    /\bRX-?[78]\b/,
    /\bevo\b/i,
    /\blancer\b/i,
    /\bwrx\b/i,
    /\bsti\b/i,
    /\bcivic\b/i,
    /\btype\s?r\b/i,
    /\bNSX\b/,
    /\bhonda\b/i,
    /\btoyota\b/i,
    /\blexus\b/i,
    /\bnissan\b/i,
    /\bmazda\b/i,
    /\bsubaru\b/i,
    /\bmitsubishi\b/i,
  ],
  "4x4-offroad": [
    /\bpatrol\b/i,
    /\bland\s?cruiser\b/i,
    /\bwrangler\b/i,
    /\bjeep\b/i,
    /\bdefender\b/i,
    /\bbronco\b/i,
    /\braptor\b/i,
  ],
  "luxury-premium": [/\brange\s?rover\b/i, /\bbentley\b/i, /\brolls\b/i],
  "exotics-supercars": [
    /\bferrari\b/i,
    /\blamborghini\b/i,
    /\bmclaren\b/i,
    /\baston\s?martin\b/i,
    /\bmaserati\b/i,
    /\bporsche\b/i,
  ],
  "ev-hybrid": [/\btesla\b/i, /\blucid\b/i, /\bpolestar\b/i],
  "heavy-machinery": [/\bcaterpillar\b/i, /\bkomatsu\b/i, /\bexcavator\b/i],
};

const NOISE_PATTERNS = [
  /SKU:\s*\d+/gi,
  /https?:\/\/\S+/g,
  /\(\d+\s*reviews?\)/gi,
  /ADD TO CART/gi,
  /BUY NOW/gi,
  /Add to wishlist/gi,
  /Contact Us/gi,
  /Terms and Conditions/gi,
  /VAT Included/gi,
  /[\d,]+(?:\.\d+)?\s*AED/gi,
  /Shipping:\s*\d+-\d+\s*Business Days/gi,
  /Not Available For Sale/gi,
  /This combination does not exist\.?/gi,
];

function kebab(s) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function makeSlug(name, sku) {
  const base = kebab(name).slice(0, 60).replace(/-$/, "");
  return `${base}-${sku}`;
}

function cleanDescription(desc, name) {
  if (!desc) return name;
  let cleaned = desc;
  for (const pat of NOISE_PATTERNS) cleaned = cleaned.replace(pat, " ");

  const overviewIdx = cleaned.search(/\b(OVERVIEW|Overview|Description)\b/);
  if (overviewIdx >= 0) {
    cleaned = cleaned.slice(overviewIdx).replace(/^\b(OVERVIEW|Overview|Description)\b/, "").trim();
  }

  if (cleaned.toLowerCase().startsWith(name.toLowerCase())) {
    cleaned = cleaned.slice(name.length).trim();
  }

  cleaned = cleaned.replace(/\s+/g, " ").trim();

  if (cleaned.length > 800) {
    cleaned = cleaned.slice(0, 800).replace(/\s+\S*$/, "") + "…";
  }

  if (cleaned.length < 30) return name;
  return cleaned;
}

function inferVehicleSlugs(name) {
  const slugs = [];
  for (const [vehSlug, patterns] of Object.entries(VEHICLE_KEYWORDS)) {
    for (const pat of patterns) {
      if (pat.test(name)) {
        if (!slugs.includes(vehSlug)) slugs.push(vehSlug);
        break;
      }
    }
  }
  return slugs;
}

function mapCategory(categories) {
  for (const cat of categories || []) {
    if (CATEGORY_MAP[cat]) return CATEGORY_MAP[cat];
  }
  return null;
}

console.log("Loading source products...");
const source = JSON.parse(fs.readFileSync(SOURCE_PRODUCTS, "utf8"));
console.log(`  Source: ${source.length} products\n`);

console.log("Filtering candidates...");
const candidates = [];
for (const p of source) {
  if (!p.local_images || !p.local_images.length) continue;
  const partSlug = mapCategory(p.categories);
  if (!partSlug) continue;
  if (p.categories.every((c) => SKIP_CATEGORIES.has(c))) continue;

  const cleanedDesc = cleanDescription(p.description, p.name);
  if (cleanedDesc.length < 20) continue;

  const imageRel = p.local_images[0].replace(/\\/g, "/");
  candidates.push({
    slug: makeSlug(p.name, p.sku),
    name: p.name,
    description: cleanedDesc,
    partSlug,
    vehicleSlugs: inferVehicleSlugs(p.name),
    image: `/products/${path.basename(imageRel)}`,
    _sourceImage: imageRel,
    _descLen: cleanedDesc.length,
  });
}
console.log(`  Candidates: ${candidates.length}\n`);

// Bucket by part, sort each bucket by desc-richness (longer = better signal), apply per-cat cap
const byPart = {};
for (const c of candidates) {
  if (!byPart[c.partSlug]) byPart[c.partSlug] = [];
  byPart[c.partSlug].push(c);
}
for (const items of Object.values(byPart)) {
  items.sort((a, b) => b._descLen - a._descLen);
}

// Round-robin to TOTAL_CAP, respecting PER_CATEGORY_CAP
const bucketCounts = {};
const selected = [];
let round = 0;
while (selected.length < TOTAL_CAP && round < PER_CATEGORY_CAP) {
  let addedThisRound = false;
  for (const partSlug of Object.keys(byPart)) {
    const cnt = bucketCounts[partSlug] || 0;
    if (cnt >= PER_CATEGORY_CAP) continue;
    const item = byPart[partSlug][round];
    if (!item) continue;
    selected.push(item);
    bucketCounts[partSlug] = cnt + 1;
    addedThisRound = true;
    if (selected.length >= TOTAL_CAP) break;
  }
  if (!addedThisRound) break;
  round++;
}
console.log(`  Selected: ${selected.length}\n`);

console.log("Distribution by part category:");
const dist = {};
for (const p of selected) dist[p.partSlug] = (dist[p.partSlug] || 0) + 1;
Object.entries(dist)
  .sort((a, b) => b[1] - a[1])
  .forEach(([k, v]) => console.log(`  ${String(v).padStart(4)}  ${k}`));

console.log("\nDistribution by vehicle slug (where inferred):");
const vdist = {};
for (const p of selected) {
  if (!p.vehicleSlugs.length) {
    vdist["(none)"] = (vdist["(none)"] || 0) + 1;
  } else {
    for (const v of p.vehicleSlugs) vdist[v] = (vdist[v] || 0) + 1;
  }
}
Object.entries(vdist)
  .sort((a, b) => b[1] - a[1])
  .forEach(([k, v]) => console.log(`  ${String(v).padStart(4)}  ${k}`));

console.log("\nCopying images...");
if (!fs.existsSync(TARGET_IMAGES)) fs.mkdirSync(TARGET_IMAGES, { recursive: true });
let copied = 0;
let missing = 0;
for (const p of selected) {
  const src = path.join(SCRAPE_DIR, p._sourceImage);
  const dst = path.join(TARGET_IMAGES, path.basename(p._sourceImage));
  if (fs.existsSync(src)) {
    if (!fs.existsSync(dst)) fs.copyFileSync(src, dst);
    copied++;
  } else {
    missing++;
  }
}
console.log(`  Copied: ${copied} | Missing source: ${missing}\n`);

const finalProducts = selected.map(({ _sourceImage, _descLen, ...rest }) => rest);

const dataDir = path.dirname(TARGET_PRODUCTS);
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
fs.writeFileSync(TARGET_PRODUCTS, JSON.stringify(finalProducts, null, 2));
console.log(`✓ Wrote ${finalProducts.length} products to src/data/products.json`);
