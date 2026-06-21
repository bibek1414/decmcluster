export type AssessmentStatus = "Completed" | "Processing" | "Failed";

export interface Assessment {
  id: string;
  name: string;
  status: AssessmentStatus;
  createdAt: string;
  totalRecords: number;
  description: string;
  owner: string;
  duration: string;
  downloadUrl?: string;
}

export const assessments: Assessment[] = [
  {
    id: "asm_01",
    name: "1. Evacuation Centre Data",
    status: "Completed",
    createdAt: "2026-06-10T10:30:00Z",
    totalRecords: 1284,
    description: "Standard form for assessing evacuation centres.",
    owner: "DECM Cluster",
    duration: "2h 14m",
    downloadUrl: "/csv/Evacuation Center Master List.xlsx",
  },
  {
    id: "asm_02",
    name: "2. Community Level Damage Assessment Data",
    status: "Completed",
    createdAt: "2026-06-14T08:15:00Z",
    totalRecords: 526,
    description: "Community level damage assessment form version 2.",
    owner: "DECM Cluster",
    duration: "1h 45m",
    downloadUrl: "/csv/Evacuation Center Master List.xlsx",
  },
  {
    id: "asm_03",
    name: "3. Area Council Rapid Assessment Data",
    status: "Completed",
    createdAt: "2026-06-08T14:00:00Z",
    totalRecords: 3290,
    description: "Rapid assessment form for Area Council level.",
    owner: "DECM Cluster",
    duration: "5h 02m",
    downloadUrl: "/csv/Evacuation Center Master List.xlsx",
  },
  {
    id: "asm_04",
    name: "4. Displacement Tracking Matrix Data",
    status: "Completed",
    createdAt: "2026-06-12T09:45:00Z",
    totalRecords: 0,
    description: "DTM Flow Monitoring form for earthquake displacement.",
    owner: "IOM Vanuatu",
    duration: "—",
    downloadUrl: "/csv/Evacuation Center Master List.xlsx",
  },
  {
    id: "asm_05",
    name: "5. Displacement Profile Data",
    status: "Completed",
    createdAt: "2026-06-02T16:20:00Z",
    totalRecords: 842,
    description: "Phone survey form for displacement profiling.",
    owner: "IOM Vanuatu",
    duration: "1h 48m",
    downloadUrl: "/csv/Evacuation Center Master List.xlsx",
  },
  {
    id: "asm_06",
    name: "6. Baseline Village Assessment Data",
    status: "Completed",
    createdAt: "2026-06-15T11:00:00Z",
    totalRecords: 312,
    description: "Baseline village assessment form version 1.",
    owner: "IOM Vanuatu",
    duration: "—",
    downloadUrl: "/csv/Evacuation Center Master List.xlsx",
  },
  {
    id: "asm_07",
    name: "7. Service Monitoring Tool Data",
    status: "Completed",
    createdAt: "2026-06-16T10:00:00Z",
    totalRecords: 150,
    description: "Service monitoring tool for the DECM Cluster.",
    owner: "DECM Cluster",
    duration: "1h 20m",
    downloadUrl: "/csv/Evacuation Center Master List.xlsx",
  },
  {
    id: "asm_08",
    name: "8. Durable Solution & Relocation Data",
    status: "Completed",
    createdAt: "2026-06-17T09:00:00Z",
    totalRecords: 45,
    description: "Survey form for durable solutions and relocation.",
    owner: "DECM Cluster",
    duration: "2h 30m",
    downloadUrl: "/csv/Evacuation Center Master List.xlsx",
  },
  {
    id: "asm_09",
    name: "9. 5W Response Data",
    status: "Completed",
    createdAt: "2026-06-18T10:00:00Z",
    totalRecords: 120,
    description: "5W (Who, What, Where, When, For Whom) response tracking database.",
    owner: "DECM Cluster",
    duration: "1h 45m",
    downloadUrl: "/response-tracking/Response Tracking Tool 5W DECM Cluster.xlsx",
  },
];

export function getAssessment(id: string) {
  return assessments.find((a) => a.id === id);
}

const firstNames = ["Alex", "Jordan", "Taylor", "Morgan", "Riley", "Avery", "Casey", "Quinn", "Sam", "Drew", "Cameron", "Harper"];
const lastNames = ["Walker", "Bennett", "Hughes", "Reed", "Foster", "Sullivan", "Brooks", "Parker", "Reyes", "Murphy", "Cole", "Wood"];
const teams = ["Engineering", "Sales", "Marketing", "Product", "Support", "Design"];
const cities = ["San Francisco", "London", "Berlin", "Tokyo", "Sydney", "Toronto", "Austin", "Lisbon"];

export interface CsvRow {
  id: number;
  name: string;
  email: string;
  team: string;
  score: number;
  city: string;
  submitted: string;
  status: "Pass" | "Fail" | "Review";
}

function seeded(i: number) {
  // deterministic-ish pseudo random
  return Math.abs(Math.sin(i * 9301 + 49297) * 233280) % 1;
}

export function generateCsvData(count = 120): CsvRow[] {
  const rows: CsvRow[] = [];
  for (let i = 0; i < count; i++) {
    const f = firstNames[Math.floor(seeded(i + 1) * firstNames.length)];
    const l = lastNames[Math.floor(seeded(i + 2) * lastNames.length)];
    const t = teams[Math.floor(seeded(i + 3) * teams.length)];
    const c = cities[Math.floor(seeded(i + 4) * cities.length)];
    const score = Math.floor(40 + seeded(i + 5) * 60);
    const statusPick = seeded(i + 6);
    const status: CsvRow["status"] = statusPick > 0.75 ? "Review" : statusPick > 0.25 ? "Pass" : "Fail";
    const day = String(1 + Math.floor(seeded(i + 7) * 27)).padStart(2, "0");
    rows.push({
      id: i + 1,
      name: `${f} ${l}`,
      email: `${f}.${l}@acme.io`.toLowerCase(),
      team: t,
      score,
      city: c,
      submitted: `2026-05-${day}`,
      status,
    });
  }
  return rows;
}

export const analyticsTrend = [
  { month: "Jan", assessments: 12, completed: 9 },
  { month: "Feb", assessments: 18, completed: 14 },
  { month: "Mar", assessments: 22, completed: 19 },
  { month: "Apr", assessments: 28, completed: 24 },
  { month: "May", assessments: 34, completed: 30 },
  { month: "Jun", assessments: 41, completed: 36 },
];

export const statusBreakdown = [
  { name: "Completed", value: 64, key: "completed" },
  { name: "Processing", value: 22, key: "processing" },
  { name: "Failed", value: 6, key: "failed" },
];
