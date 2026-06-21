"use client";

export interface CsvFile {
  id: string;
  name: string;
  rowCount: number;
  headers: string[];
  rows: Record<string, string>[];
  createdAt: string;
}

// Deterministic seed helper
function seededRandom(seed: number) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

const firstNames = ["Lina", "Jack", "Albert", "Mary", "Silas", "Joe", "David", "Grace", "Samuel", "Tari", "Kalo", "Bong"];
const lastNames = ["Vira", "Tasso", "Molisa", "Sande", "Bule", "Garae", "Kalsakau", "Vocor", "Lini", "Willy", "Tabi", "Harry"];

const PROVINCES = ["Shefa", "Sanma", "Malampa", "Penama", "Tafea", "Torba"];
const DISTRICTS: Record<string, string[]> = {
  Shefa: ["Port Vila", "Efate Rural", "Epi", "Shepherds"],
  Sanma: ["Luganville", "South Santo", "West Santo", "North Santo"],
  Malampa: ["North Ambrym", "South Ambrym", "Norsup", "Lamap"],
  Penama: ["East Ambae", "West Ambae", "Pentecost", "Maewo"],
  Tafea: ["West Tanna", "North Tanna", "Lenakel", "Futuna"],
  Torba: ["Sola", "Mota Lava", "Torres"],
};

const SHELTER_MATERIALS = ["Thatch & Bamboo", "Timber & Corrugated Iron", "Concrete Block", "Tarpaulin & Timber"];
const INCOME_SOURCES = ["Subsistence farming", "Copra sales", "Kava selling", "Wage labor", "Fisheries", "Market vendor"];
const VULNERABILITY_GROUPS = ["None", "Single Parent", "Elderly Head of Household", "Disabled Member", "Chronic Illness"];
const DAMAGE_TYPES = ["Roofing blown away", "Severe Flooding", "Landslide blockage", "Structural collapse", "Minor wind damage"];
const URGENT_NEEDS = ["Tarpaulins, Water", "Food rations, Hygiene kits", "Medical kits, Shelter toolkits", "Water purification tablets"];
const WATER_SOURCES = ["Piped network", "Rainwater tank", "Borehole", "Water trucking", "Shared spring"];
const ORGANIZATIONS = ["IOM Vanuatu", "Vanuatu Red Cross", "World Vision", "ADRA", "Save the Children", "Care International"];
const SECTORS = ["Shelter & NFIs", "WASH", "Health", "Food Security", "Education", "Protection"];

export const ASSESSMENT_SCHEMAS: Record<string, {
  headers: string[];
  generateRow: (index: number, year: number) => Record<string, string>;
}> = {
  asm_01: {
    headers: ["Center ID", "Center Name", "Province", "District", "Capacity (People)", "Current Population", "Status", "Last Updated"],
    generateRow: (idx, yr) => {
      const pIdx = Math.floor(seededRandom(idx + yr + 1) * PROVINCES.length);
      const prov = PROVINCES[pIdx];
      const dists = DISTRICTS[prov] || ["Central"];
      const dist = dists[Math.floor(seededRandom(idx + yr + 2) * dists.length)];
      
      const centerNames = ["Anabrou School", "Korman Stadium", "Freshwota School", "Saratamata Hall", "Nduindui Church", "Lenakel College", "Sola Gym"];
      const cName = centerNames[idx % centerNames.length] + ` (EC-${idx + 1})`;
      
      const capacity = Math.floor(100 + seededRandom(idx + yr + 3) * 900);
      const occupancyRate = 0.3 + seededRandom(idx + yr + 4) * 0.6;
      const pop = Math.floor(capacity * occupancyRate);
      const status = pop >= capacity ? "Full" : pop > 0 ? "Active" : "Inactive";
      const day = String(1 + Math.floor(seededRandom(idx + yr + 5) * 28)).padStart(2, "0");
      
      return {
        "Center ID": `EC-${yr}-${100 + idx}`,
        "Center Name": cName,
        "Province": prov,
        "District": dist,
        "Capacity (People)": String(capacity),
        "Current Population": String(pop),
        "Status": status,
        "Last Updated": `${yr}-06-${day}`,
      };
    }
  },
  asm_02: {
    headers: ["Community ID", "Village Name", "Province", "Households Affected", "Major Damage Type", "Urgent Needs", "Contact Person", "Verification Status"],
    generateRow: (idx, yr) => {
      const pIdx = Math.floor(seededRandom(idx + yr + 1) * PROVINCES.length);
      const prov = PROVINCES[pIdx];
      const villageNames = ["Mele", "Pango", "Erakor", "Fanafo", "Port Olry", "Bunlap", "Loltong", "Litslits", "Isangel"];
      const vName = villageNames[idx % villageNames.length] + ` Area ${idx + 1}`;
      
      const hhAffected = Math.floor(10 + seededRandom(idx + yr + 2) * 120);
      const damage = DAMAGE_TYPES[idx % DAMAGE_TYPES.length];
      const needs = URGENT_NEEDS[idx % URGENT_NEEDS.length];
      const contact = `${firstNames[idx % firstNames.length]} ${lastNames[idx % lastNames.length]}`;
      const statuses = ["Verified", "Pending", "In Progress"];
      const status = statuses[Math.floor(seededRandom(idx + yr + 3) * statuses.length)];
      
      return {
        "Community ID": `COMM-${yr}-${200 + idx}`,
        "Village Name": vName,
        "Province": prov,
        "Households Affected": String(hhAffected),
        "Major Damage Type": damage,
        "Urgent Needs": needs,
        "Contact Person": contact,
        "Verification Status": status,
      };
    }
  },
  asm_03: {
    headers: ["Area Council ID", "Area Council Name", "Severity Level", "Displaced Households", "Food Security Status", "Water Access Status", "Road Accessibility"],
    generateRow: (idx, yr) => {
      const acNames = ["Vermali", "Malo/Aore", "South Santo", "North Ambrym", "West Ambae", "North Pentecost", "Maewo", "South Tanna"];
      const acName = acNames[idx % acNames.length];
      const severities = ["Critical", "High", "Medium", "Low"];
      const severity = severities[Math.floor(seededRandom(idx + yr + 1) * severities.length)];
      const displaced = Math.floor(20 + seededRandom(idx + yr + 2) * 480);
      
      const foods = ["Severe shortage", "Moderate shortage", "Sufficient"];
      const waters = ["Contaminated source", "Limited supply", "Clean water available"];
      const roads = ["Blocked by landslide", "4WD Only", "Fully accessible", "Flooded crossing"];
      
      return {
        "Area Council ID": `AC-${yr}-${300 + idx}`,
        "Area Council Name": acName,
        "Severity Level": severity,
        "Displaced Households": String(displaced),
        "Food Security Status": foods[idx % foods.length],
        "Water Access Status": waters[idx % waters.length],
        "Road Accessibility": roads[idx % roads.length],
      };
    }
  },
  asm_04: {
    headers: ["Site ID", "Location Name", "Latitude", "Longitude", "Families Count", "Latrines Count", "Water Source", "Primary Need"],
    generateRow: (idx, yr) => {
      const sites = ["Epauto SDA", "Youth Centre", "Tebakor Church", "Korman Gym B", "Saratamata Field", "Sola School Site"];
      const site = sites[idx % sites.length] + ` Site ${idx + 1}`;
      const lat = (-17.733 - seededRandom(idx + yr + 1) * 3).toFixed(4);
      const lng = (168.321 + seededRandom(idx + yr + 2) * 2).toFixed(4);
      const families = Math.floor(15 + seededRandom(idx + yr + 3) * 150);
      const latrines = Math.max(1, Math.floor(families / 8));
      
      return {
        "Site ID": `DTM-${yr}-${400 + idx}`,
        "Location Name": site,
        "Latitude": lat,
        "Longitude": lng,
        "Families Count": String(families),
        "Latrines Count": String(latrines),
        "Water Source": WATER_SOURCES[idx % WATER_SOURCES.length],
        "Primary Need": "Shelter & WASH Support",
      };
    }
  },
  asm_05: {
    headers: ["Profile ID", "Head of Household", "Family Size", "Shelter Material", "Main Income Source", "Vulnerability Group", "Date Interviewed"],
    generateRow: (idx, yr) => {
      const contact = `${firstNames[idx % firstNames.length]} ${lastNames[idx % lastNames.length]}`;
      const fSize = Math.floor(3 + seededRandom(idx + yr + 1) * 8);
      const day = String(1 + Math.floor(seededRandom(idx + yr + 2) * 28)).padStart(2, "0");
      
      return {
        "Profile ID": `PROF-${yr}-${500 + idx}`,
        "Head of Household": contact,
        "Family Size": String(fSize),
        "Shelter Material": SHELTER_MATERIALS[idx % SHELTER_MATERIALS.length],
        "Main Income Source": INCOME_SOURCES[idx % INCOME_SOURCES.length],
        "Vulnerability Group": VULNERABILITY_GROUPS[idx % VULNERABILITY_GROUPS.length],
        "Date Interviewed": `${yr}-05-${day}`,
      };
    }
  },
  asm_06: {
    headers: ["Village Code", "Village Name", "Total Population", "Houses Count", "Primary School Status", "Health Aid Post", "Main Water Source"],
    generateRow: (idx, yr) => {
      const villages = ["Bunlap", "Loltong", "Baie Barrier", "Sola", "Lamap", "Litslits", "Mele", "Fanafo"];
      const vName = villages[idx % villages.length];
      const houses = Math.floor(40 + seededRandom(idx + yr + 1) * 160);
      const pop = Math.floor(houses * (4.5 + seededRandom(idx + yr + 2) * 1.5));
      const schools = ["Functional", "Damaged", "None"];
      const health = ["Yes - functional", "Yes - damaged", "No"];
      
      return {
        "Village Code": `VIL-${yr}-${600 + idx}`,
        "Village Name": vName,
        "Total Population": String(pop),
        "Houses Count": String(houses),
        "Primary School Status": schools[idx % schools.length],
        "Health Aid Post": health[idx % health.length],
        "Main Water Source": WATER_SOURCES[idx % WATER_SOURCES.length],
      };
    }
  },
  asm_07: {
    headers: ["Service ID", "Organization Name", "Sector", "Target Location", "Beneficiaries Reached", "Delivery Status", "Reporting Date"],
    generateRow: (idx, yr) => {
      const org = ORGANIZATIONS[idx % ORGANIZATIONS.length];
      const sector = SECTORS[idx % SECTORS.length];
      const locations = ["Efate", "Espiritu Santo", "Pentecost", "Ambae", "Tanna", "Maewo", "Malekula"];
      const loc = locations[idx % locations.length];
      const ben = Math.floor(100 + seededRandom(idx + yr + 1) * 4900);
      const status = ["Completed", "Ongoing", "Delayed"][idx % 3];
      const day = String(1 + Math.floor(seededRandom(idx + yr + 2) * 28)).padStart(2, "0");
      
      return {
        "Service ID": `SERV-${yr}-${700 + idx}`,
        "Organization Name": org,
        "Sector": sector,
        "Target Location": loc,
        "Beneficiaries Reached": String(ben),
        "Delivery Status": status,
        "Reporting Date": `${yr}-06-${day}`,
      };
    }
  },
  asm_08: {
    headers: ["Household ID", "Family Name", "Origin Village", "Relocation Site", "Land Tenure Agreement", "Relocation Status", "Support Received"],
    generateRow: (idx, yr) => {
      const fName = lastNames[idx % lastNames.length];
      const origins = ["Ambae Crater Area", "Pentecost Cliffside", "Mele Riverbank", "Tanna Volcano Zone"];
      const origin = origins[idx % origins.length];
      const relocSites = ["Maewo Relocation Site A", "Efate Off-Grid Settlement", "Santo East New Settlement"];
      const site = relocSites[idx % relocSites.length];
      const tenure = ["Customary Lease", "Government Assigned Land", "Informal Agreement", "Purchased Freehold"][idx % 4];
      const status = ["Settled", "In Progress", "Planning"][idx % 3];
      const support = ["Shelter Kit + Cash Grant", "Food Rations & Water Tank", "Building Toolkits", "None"][idx % 4];
      
      return {
        "Household ID": `HH-${yr}-${800 + idx}`,
        "Family Name": fName,
        "Origin Village": origin,
        "Relocation Site": site,
        "Land Tenure Agreement": tenure,
        "Relocation Status": status,
        "Support Received": support,
      };
    }
  }
};

// Seeding function: returns default versions (2021, 2022, 2023 data) for an assessment
export function getSeededVersionsForAssessment(asmId: string): CsvFile[] {
  const schema = ASSESSMENT_SCHEMAS[asmId] || ASSESSMENT_SCHEMAS.asm_01;
  const years = [2021, 2022, 2023];
  
  return years.map((year) => {
    const rowCount = 10 + (year % 2021) * 3; // 10, 13, 16 rows respectively
    const rows: Record<string, string>[] = [];
    for (let i = 0; i < rowCount; i++) {
      rows.push(schema.generateRow(i, year));
    }
    
    // Formatting the assessment name display prefix
    let cleanName = "Evacuation Centre Data";
    if (asmId === "asm_02") cleanName = "Community Damage Data";
    else if (asmId === "asm_03") cleanName = "Area Council Rapid Data";
    else if (asmId === "asm_04") cleanName = "Displacement Tracking Matrix";
    else if (asmId === "asm_05") cleanName = "Displacement Profile";
    else if (asmId === "asm_06") cleanName = "Baseline Village Assessment";
    else if (asmId === "asm_07") cleanName = "Service Monitoring Data";
    else if (asmId === "asm_08") cleanName = "Durable Solutions Relocation";

    return {
      id: `${asmId}_${year}`,
      name: `${cleanName} - ${year} Data.csv`,
      rowCount: rows.length,
      headers: schema.headers,
      rows,
      createdAt: new Date(`${year}-12-31T23:59:59Z`).toISOString()
    };
  });
}

// LocalStorage Persistence Helpers
const STORAGE_KEY_PREFIX = "decm_assessment_csv_";

export function getFilesForAssessment(asmId: string): CsvFile[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(STORAGE_KEY_PREFIX + asmId);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error("Failed to parse stored CSV files, resetting", e);
    }
  }
  
  // Seed default data
  const seeded = getSeededVersionsForAssessment(asmId);
  saveFilesForAssessment(asmId, seeded);
  return seeded;
}

export function saveFilesForAssessment(asmId: string, files: CsvFile[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY_PREFIX + asmId, JSON.stringify(files));
}

// Merge CSV files
export function mergeFiles(asmId: string, fileIds: string[], newFileName: string, removeDuplicates = true): CsvFile {
  const allFiles = getFilesForAssessment(asmId);
  const selectedFiles = allFiles.filter(f => fileIds.includes(f.id));
  
  if (selectedFiles.length === 0) {
    throw new Error("No files selected for merging");
  }
  
  // Combine all rows and headers
  // For the same assessment, they will share headers.
  // If not, we take the union of headers.
  const headersSet = new Set<string>();
  selectedFiles.forEach(f => f.headers.forEach(h => headersSet.add(h)));
  const mergedHeaders = Array.from(headersSet);
  
  let mergedRows: Record<string, string>[] = [];
  selectedFiles.forEach(f => {
    // Clone rows to avoid mutation issues
    f.rows.forEach(r => {
      mergedRows.push({ ...r });
    });
  });
  
  // Deduplicate exact row contents (excepting ID keys if they are primary)
  if (removeDuplicates) {
    const seen = new Set<string>();
    mergedRows = mergedRows.filter(row => {
      // Create a unique hash representing all values except ID
      const hashableValues = Object.entries(row)
        .filter(([key]) => !key.toLowerCase().includes("id") && !key.toLowerCase().includes("code"))
        .map(([_, val]) => val)
        .join("||");
      
      if (seen.has(hashableValues)) {
        return false;
      }
      seen.add(hashableValues);
      return true;
    });
  }

  const mergedFile: CsvFile = {
    id: `merged_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    name: newFileName.endsWith(".csv") ? newFileName : `${newFileName}.csv`,
    rowCount: mergedRows.length,
    headers: mergedHeaders,
    rows: mergedRows,
    createdAt: new Date().toISOString()
  };
  
  const updatedFiles = [...allFiles, mergedFile];
  saveFilesForAssessment(asmId, updatedFiles);
  
  return mergedFile;
}

// Simple but robust CSV parser that handles quotes and newlines
export function parseCsvText(text: string): { headers: string[]; rows: Record<string, string>[] } {
  const lines: string[][] = [];
  let row: string[] = [];
  let inQuotes = false;
  let entry = "";

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    const next = text[i + 1];

    if (inQuotes) {
      if (c === '"') {
        if (next === '"') {
          entry += '"';
          i++; // Skip the duplicate quote
        } else {
          inQuotes = false;
        }
      } else {
        entry += c;
      }
    } else {
      if (c === '"') {
        inQuotes = true;
      } else if (c === ',') {
        row.push(entry.trim());
        entry = "";
      } else if (c === '\n' || c === '\r') {
        if (c === '\r' && next === '\n') {
          i++;
        }
        row.push(entry.trim());
        lines.push(row);
        row = [];
        entry = "";
      } else {
        entry += c;
      }
    }
  }
  
  if (entry || row.length > 0) {
    row.push(entry.trim());
    lines.push(row);
  }

  // Clean and filter empty lines
  const cleanLines = lines.filter(l => l.length > 0 && l.some(cell => cell !== ""));
  if (cleanLines.length === 0) return { headers: [], rows: [] };

  const headers = cleanLines[0].map(h => h.replace(/^"(.*)"$/, '$1')); // Clean surrounding quotes
  const rows = cleanLines.slice(1).map((line) => {
    const r: Record<string, string> = {};
    headers.forEach((h, hIndex) => {
      r[h] = line[hIndex] || "";
    });
    return r;
  });

  return { headers, rows };
}

// CSV Stringify Helper
export function stringifyCsv(headers: string[], rows: Record<string, string>[]): string {
  const headerLine = headers.map(h => `"${h.replace(/"/g, '""')}"`).join(",");
  const rowLines = rows.map(row => 
    headers.map(h => {
      const val = row[h] || "";
      return `"${val.replace(/"/g, '""')}"`;
    }).join(",")
  );
  return [headerLine, ...rowLines].join("\n");
}
