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
}

export const assessments: Assessment[] = [
  {
    id: "asm_01",
    name: "Q4 Engineering Performance Review",
    status: "Completed",
    createdAt: "2026-06-10T10:30:00Z",
    totalRecords: 1284,
    description: "Quarterly engineering team performance assessment with 360-degree feedback.",
    owner: "Sarah Chen",
    duration: "2h 14m",
  },
  {
    id: "asm_02",
    name: "Customer Onboarding Survey 2026",
    status: "Processing",
    createdAt: "2026-06-14T08:15:00Z",
    totalRecords: 526,
    description: "Survey responses from new customers in the last 30 days.",
    owner: "Marcus Patel",
    duration: "—",
  },
  {
    id: "asm_03",
    name: "Security Compliance Audit",
    status: "Completed",
    createdAt: "2026-06-08T14:00:00Z",
    totalRecords: 3290,
    description: "Annual SOC 2 control evidence collection and review.",
    owner: "Priya Kapoor",
    duration: "5h 02m",
  },
  {
    id: "asm_04",
    name: "Sales Team Skills Matrix",
    status: "Failed",
    createdAt: "2026-06-12T09:45:00Z",
    totalRecords: 0,
    description: "Skill self-assessment for the global sales organization.",
    owner: "Diego Martín",
    duration: "—",
  },
  {
    id: "asm_05",
    name: "Product Beta Feedback Round 3",
    status: "Completed",
    createdAt: "2026-06-02T16:20:00Z",
    totalRecords: 842,
    description: "Aggregated feedback from beta users on new dashboard features.",
    owner: "Hannah Wright",
    duration: "1h 48m",
  },
  {
    id: "asm_06",
    name: "Engineering Hiring Assessment",
    status: "Processing",
    createdAt: "2026-06-15T11:00:00Z",
    totalRecords: 312,
    description: "Take-home submissions for the senior backend role pipeline.",
    owner: "Oliver Nguyen",
    duration: "—",
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
