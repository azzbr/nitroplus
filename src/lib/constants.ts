export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const COMPANY_INFO = {
  NAME: "Nitro Plus Trading",
  LICENSE: "UAE General Trade License",
  PHONE: "",
  EMAIL: "",
  WHATSAPP_NUMBER: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "",
} as const;

export const VEHICLE_CATEGORIES = [
  { slug: "4x4-offroad", label: "4×4 / Off-road", description: "Land Cruiser, Wrangler, Patrol, Defender, Raptor, Bronco, G-Class" },
  { slug: "american-muscle", label: "American Muscle & Performance", description: "Mustang, Camaro, Challenger, Charger, Corvette, Hellcat" },
  { slug: "luxury-premium", label: "Luxury & Premium", description: "Mercedes-Benz, BMW, Audi, Lexus, Range Rover, Bentley" },
  { slug: "exotics-supercars", label: "Exotics & Supercars", description: "Ferrari, Lamborghini, McLaren, Porsche, Aston Martin" },
  { slug: "european-sport", label: "European Sport", description: "BMW M, Mercedes-AMG, Audi RS, Porsche 911" },
  { slug: "jdm-asian", label: "JDM & Asian Performance", description: "GT-R, Supra, RX-7, Evo, WRX/STI, Civic Type R" },
  { slug: "heavy-machinery", label: "Heavy Machinery & Commercial", description: "Trucks, construction equipment, fleet vehicles" },
  { slug: "classic-vintage", label: "Classic & Vintage", description: "Restoration, OEM and NOS parts, period-correct rebuilds" },
  { slug: "ev-hybrid", label: "Electric & Hybrid", description: "Tesla, Lucid, Polestar, EV aftermarket" },
  { slug: "standard-passenger", label: "Standard Passenger", description: "Daily drivers across all major brands" },
] as const;

export const PART_CATEGORIES = [
  { slug: "wheels-tires", label: "Wheels & Tires" },
  { slug: "suspension", label: "Suspension & Steering" },
  { slug: "engines-forced-induction", label: "Engines & Forced Induction" },
  { slug: "drivetrain", label: "Drivetrain & Transmission" },
  { slug: "exhaust", label: "Exhaust Systems" },
  { slug: "brakes", label: "Brakes" },
  { slug: "cooling-fluids", label: "Cooling & Fluids" },
  { slug: "fuel-induction", label: "Fuel & Induction" },
  { slug: "electrical", label: "Electrical & Electronics" },
  { slug: "ecu-tuning", label: "ECU Tuning & Engine Management" },
  { slug: "lighting", label: "Lighting" },
  { slug: "body-exterior", label: "Body & Exterior" },
  { slug: "off-road-accessories", label: "Off-Road Accessories" },
  { slug: "interior", label: "Interior" },
  { slug: "general-parts", label: "General Replacement Parts" },
  { slug: "sourcing", label: "Sourcing & Special Orders" },
] as const;