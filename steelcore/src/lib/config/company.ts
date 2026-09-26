export interface CompanyConfig {
  name: string;
  shortName: string;
  tagline: string;
  industry: string;
  establishedYear: number;
  location: string;
  fullAddress: string;
  plantAddress: string;
  phone: string;
  phoneAlt: string;
  email: string;
  rfqEmail: string;
  cin: string;
  gstin: string;
  stats: {
    yearsExperience: string;
    projectsDelivered: string;
    industrialProducts: string;
    industriesServed: string;
    annualTonnage: string;
    clientSatisfaction: string;
  };
  certifications: string[];
}

export const COMPANY_CONFIG: CompanyConfig = {
  name: "STEELCORE INDUSTRIES",
  shortName: "STEELCORE",
  tagline: "Precision. Strength. Engineering.",
  industry: "Steel & Aluminium Manufacturing & Heavy Industrial Fabrication",
  establishedYear: 2008,
  location: "India",
  fullAddress: "Plot 42-48, Sector 10, MIDC Heavy Industrial Area, Chakan, Pune, Maharashtra 410501, India",
  plantAddress: "Plant 1: MIDC Chakan, Pune | Plant 2: Sanand Industrial Estate, Ahmedabad, Gujarat",
  phone: "+91 98230 12345",
  phoneAlt: "+91 20 6789 0100",
  email: "info@steelcoreindustries.com",
  rfqEmail: "rfq@steelcoreindustries.com",
  cin: "U27100PN2008PTC132456",
  gstin: "27AAACS1234F1Z8",
  stats: {
    yearsExperience: "15+",
    projectsDelivered: "500+",
    industrialProducts: "20+",
    industriesServed: "10+",
    annualTonnage: "120,000 MT",
    clientSatisfaction: "99.4%",
  },
  certifications: [
    "ISO 9001:2015 Quality Management",
    "ISO 14001:2015 Environmental System",
    "ISO 45001:2018 Occupational Health & Safety",
    "BIS Certified Structural Steels (IS 2062)",
  ],
};
