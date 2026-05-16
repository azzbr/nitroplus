export type VehicleMake = {
  slug: string;
  label: string;
  models: ReadonlyArray<string>;
};

/**
 * Curated list of common makes/models for the GCC market.
 * Order within each make is "popular first" — useful for the empty
 * datalist preview the browser shows when the field is focused.
 * Customers can still type any value — datalist suggestions are non-binding.
 */
export const VEHICLE_MAKES: ReadonlyArray<VehicleMake> = [
  // Japanese
  {
    slug: "toyota",
    label: "Toyota",
    models: [
      "Land Cruiser", "Hilux", "Prado", "Fortuner", "Corolla", "Camry",
      "Yaris", "RAV4", "Supra", "GR86", "GR Corolla", "GR Yaris",
      "4Runner", "Tacoma", "Tundra", "Sequoia", "FJ Cruiser",
    ],
  },
  {
    slug: "nissan",
    label: "Nissan",
    models: [
      "Patrol", "Pathfinder", "X-Trail", "Altima", "Maxima", "Sentra",
      "GT-R", "370Z", "350Z", "Z (400Z)", "Skyline", "Navara",
      "Frontier", "Titan", "Armada", "Juke", "Kicks",
    ],
  },
  {
    slug: "honda",
    label: "Honda",
    models: ["Civic", "Civic Type R", "Accord", "CR-V", "HR-V", "Pilot", "Odyssey", "S2000", "NSX", "Ridgeline"],
  },
  {
    slug: "mazda",
    label: "Mazda",
    models: ["Mazda3", "Mazda6", "CX-5", "CX-9", "CX-30", "MX-5 Miata", "RX-7", "RX-8"],
  },
  {
    slug: "subaru",
    label: "Subaru",
    models: ["WRX", "STI", "Impreza", "Forester", "Outback", "Legacy", "BRZ", "Crosstrek"],
  },
  {
    slug: "mitsubishi",
    label: "Mitsubishi",
    models: ["Lancer", "Lancer Evolution", "Pajero", "Outlander", "ASX", "Eclipse Cross", "L200", "Triton"],
  },
  {
    slug: "lexus",
    label: "Lexus",
    models: ["LX", "GX", "LC", "RC", "IS", "ES", "GS", "RX", "NX", "UX", "LS", "LFA"],
  },
  {
    slug: "infiniti",
    label: "Infiniti",
    models: ["Q50", "Q60", "Q70", "QX50", "QX60", "QX70", "QX80", "G37", "G35"],
  },
  {
    slug: "suzuki",
    label: "Suzuki",
    models: ["Jimny", "Swift", "Vitara", "Grand Vitara", "Baleno", "Ciaz"],
  },

  // American
  {
    slug: "ford",
    label: "Ford",
    models: [
      "Mustang", "F-150", "F-250", "F-350", "F-450", "Bronco", "Bronco Sport",
      "Raptor", "Ranger", "Explorer", "Edge", "Expedition", "Escape", "Maverick", "GT",
    ],
  },
  {
    slug: "chevrolet",
    label: "Chevrolet",
    models: ["Camaro", "Corvette", "Silverado", "Tahoe", "Suburban", "Colorado", "Trailblazer", "Equinox", "Blazer", "Traverse"],
  },
  {
    slug: "gmc",
    label: "GMC",
    models: ["Sierra", "Yukon", "Yukon XL", "Canyon", "Hummer EV", "Terrain", "Acadia"],
  },
  {
    slug: "dodge",
    label: "Dodge",
    models: ["Challenger", "Charger", "Durango", "Ram 1500", "Ram 2500", "Ram 3500", "Hellcat", "Demon", "Hornet", "Viper"],
  },
  {
    slug: "jeep",
    label: "Jeep",
    models: [
      "Wrangler", "Wrangler Rubicon", "Wrangler 392", "Grand Cherokee",
      "Cherokee", "Renegade", "Compass", "Gladiator", "Wagoneer", "Grand Wagoneer",
    ],
  },
  { slug: "chrysler", label: "Chrysler", models: ["300", "Pacifica"] },
  {
    slug: "cadillac",
    label: "Cadillac",
    models: ["Escalade", "CT4", "CT5", "CT5-V Blackwing", "XT4", "XT5", "XT6", "CTS-V", "Lyriq"],
  },
  {
    slug: "lincoln",
    label: "Lincoln",
    models: ["Navigator", "Aviator", "Nautilus", "Corsair"],
  },
  {
    slug: "tesla",
    label: "Tesla",
    models: ["Model S", "Model 3", "Model X", "Model Y", "Cybertruck", "Roadster"],
  },

  // German
  {
    slug: "mercedes-benz",
    label: "Mercedes-Benz",
    models: [
      "G-Class", "G63 AMG", "G500", "S-Class", "E-Class", "C-Class", "A-Class",
      "GLA", "GLB", "GLC", "GLE", "GLS", "AMG GT", "SL", "CLA", "CLS",
      "EQS", "EQE", "Maybach S",
    ],
  },
  {
    slug: "bmw",
    label: "BMW",
    models: [
      "M3", "M4", "M5", "M8", "M2", "1 Series", "2 Series", "3 Series",
      "4 Series", "5 Series", "6 Series", "7 Series", "8 Series",
      "X1", "X3", "X4", "X5", "X6", "X7", "XM", "M340i", "Z4",
      "i4", "i7", "iX",
    ],
  },
  {
    slug: "audi",
    label: "Audi",
    models: [
      "RS3", "RS4", "RS5", "RS6", "RS7", "RS Q8", "R8", "TT",
      "A3", "A4", "A5", "A6", "A7", "A8", "Q3", "Q5", "Q7", "Q8",
      "S3", "S4", "S5", "S6", "S7", "S8", "e-tron", "e-tron GT",
    ],
  },
  {
    slug: "porsche",
    label: "Porsche",
    models: ["911", "911 Turbo", "911 GT3", "911 GT3 RS", "718 Cayman", "718 Boxster", "Cayenne", "Panamera", "Macan", "Taycan"],
  },
  {
    slug: "volkswagen",
    label: "Volkswagen",
    models: ["Golf", "Golf R", "Golf GTI", "Polo", "Passat", "Tiguan", "Touareg", "Atlas", "Jetta", "ID.4", "Beetle"],
  },
  {
    slug: "mini",
    label: "MINI",
    models: ["Cooper", "Cooper S", "Cooper John Cooper Works", "Countryman", "Clubman"],
  },

  // British
  {
    slug: "land-rover",
    label: "Land Rover",
    models: ["Defender", "Discovery", "Discovery Sport", "Freelander"],
  },
  {
    slug: "range-rover",
    label: "Range Rover",
    models: ["Range Rover", "Range Rover Sport", "Range Rover Velar", "Range Rover Evoque"],
  },
  {
    slug: "jaguar",
    label: "Jaguar",
    models: ["F-Type", "XE", "XF", "XJ", "F-Pace", "E-Pace", "I-Pace"],
  },
  {
    slug: "aston-martin",
    label: "Aston Martin",
    models: ["DB11", "DB12", "Vantage", "DBS", "DBX", "Vanquish", "Rapide"],
  },
  {
    slug: "bentley",
    label: "Bentley",
    models: ["Continental GT", "Continental GTC", "Flying Spur", "Bentayga", "Mulsanne"],
  },
  {
    slug: "rolls-royce",
    label: "Rolls-Royce",
    models: ["Ghost", "Phantom", "Wraith", "Dawn", "Cullinan", "Spectre"],
  },
  {
    slug: "mclaren",
    label: "McLaren",
    models: ["720S", "750S", "GT", "Artura", "765LT", "P1", "Senna", "Speedtail", "570S", "600LT"],
  },
  {
    slug: "lotus",
    label: "Lotus",
    models: ["Emira", "Elise", "Exige", "Evora", "Eletre", "Emeya"],
  },

  // Italian
  {
    slug: "ferrari",
    label: "Ferrari",
    models: ["296 GTB", "296 GTS", "F8", "SF90", "812", "Roma", "Portofino", "488", "F12", "LaFerrari", "458", "Purosangue"],
  },
  {
    slug: "lamborghini",
    label: "Lamborghini",
    models: ["Huracán", "Aventador", "Revuelto", "Urus", "Gallardo", "Murciélago"],
  },
  {
    slug: "maserati",
    label: "Maserati",
    models: ["Ghibli", "Quattroporte", "Levante", "GranTurismo", "MC20", "Grecale"],
  },
  {
    slug: "alfa-romeo",
    label: "Alfa Romeo",
    models: ["Giulia", "Stelvio", "Tonale", "4C"],
  },
  { slug: "fiat", label: "Fiat", models: ["500", "Panda", "Tipo"] },

  // Korean
  {
    slug: "hyundai",
    label: "Hyundai",
    models: ["Sonata", "Elantra", "Tucson", "Santa Fe", "Palisade", "Kona", "Accent", "Veloster", "i30 N", "IONIQ 5", "IONIQ 6"],
  },
  {
    slug: "kia",
    label: "Kia",
    models: ["Sportage", "Sorento", "Telluride", "Stinger", "K5", "Rio", "Carnival", "EV6"],
  },
  {
    slug: "genesis",
    label: "Genesis",
    models: ["G70", "G80", "G90", "GV60", "GV70", "GV80"],
  },

  // Chinese
  { slug: "byd", label: "BYD", models: ["Atto 3", "Han", "Tang", "Seal", "Dolphin"] },
  { slug: "mg", label: "MG", models: ["MG3", "MG4", "MG5", "ZS", "HS", "RX5", "Cyberster"] },
  { slug: "chery", label: "Chery", models: ["Tiggo 4", "Tiggo 7", "Tiggo 8", "Arrizo"] },
  { slug: "geely", label: "Geely", models: ["Coolray", "Emgrand", "Tugella", "Atlas"] },

  // French
  { slug: "peugeot", label: "Peugeot", models: ["208", "308", "3008", "5008", "2008"] },
  { slug: "renault", label: "Renault", models: ["Clio", "Megane", "Captur", "Duster", "Koleos"] },
  { slug: "citroen", label: "Citroën", models: ["C3", "C4", "C5"] },

  // Swedish
  {
    slug: "volvo",
    label: "Volvo",
    models: ["XC40", "XC60", "XC90", "S60", "S90", "V60", "EX30", "EX90"],
  },
  {
    slug: "polestar",
    label: "Polestar",
    models: ["Polestar 1", "Polestar 2", "Polestar 3", "Polestar 4"],
  },
];

const CURRENT_YEAR = new Date().getFullYear();
const OLDEST_YEAR = 1980;

/** Year list, newest first (so the focus-empty datalist preview leads with current). */
export const VEHICLE_YEARS: ReadonlyArray<string> = Array.from(
  { length: CURRENT_YEAR + 1 - OLDEST_YEAR + 1 },
  (_, i) => String(CURRENT_YEAR + 1 - i)
);

export function getMakeByLabel(label: string): VehicleMake | undefined {
  if (!label) return undefined;
  const target = label.trim().toLowerCase();
  return VEHICLE_MAKES.find((m) => m.label.toLowerCase() === target);
}
