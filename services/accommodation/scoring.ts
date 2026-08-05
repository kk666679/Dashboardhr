// AccommodationRiskLevel type - defined locally since it may not be in @prisma/client
type AccommodationRiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

type SafetyScoringInput = {
  baselineSafetyScore: number;
  latestReadings: Array<{ type: string; value: number }>;
  openIncidents: Array<{ severity: AccommodationRiskLevel | string }>;
  now: Date;
};

const SEVERITY_WEIGHT: Record<string, number> = {
  LOW: 5,
  MEDIUM: 15,
  HIGH: 30,
  CRITICAL: 50,
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function scoreAccommodationTwin(input: SafetyScoringInput): {
  safetyScore: number;
  wellbeingScore: number;
  riskLevel: AccommodationRiskLevel;
} {
  const { baselineSafetyScore, latestReadings, openIncidents } = input;

  let deduction = 0;

  const occupancy = latestReadings.find((r) => r.type === "OCCUPANCY");
  if (occupancy) {
    if (occupancy.value > 100) deduction += 15;
    else if (occupancy.value > 80) deduction += 8;
  }

  const air = latestReadings.find((r) => r.type === "AIR_QUALITY");
  if (air) {
    if (air.value >= 200) deduction += 25;
    else if (air.value >= 150) deduction += 18;
    else if (air.value >= 100) deduction += 10;
  }

  const fire = latestReadings.find((r) => r.type === "FIRE_SAFETY");
  if (fire) {
    if (fire.value >= 1) deduction += 35;
  }

  const temp = latestReadings.find((r) => r.type === "TEMPERATURE");
  if (temp) {
    if (temp.value < 16 || temp.value > 30) deduction += 12;
  }

  const humidity = latestReadings.find((r) => r.type === "HUMIDITY");
  if (humidity) {
    if (humidity.value < 30 || humidity.value > 70) deduction += 10;
  }

  for (const inc of openIncidents) {
    const w = SEVERITY_WEIGHT[String(inc.severity)] ?? 0;
    deduction += w;
  }

  deduction = clamp(deduction, 0, 100);

  const safetyScore = clamp(Math.round(baselineSafetyScore - deduction), 0, 100);
  const wellbeingScore = safetyScore; // until wellbeing event models exist

  const riskLevel: AccommodationRiskLevel =
    safetyScore >= 85
      ? "LOW"
      : safetyScore >= 70
        ? "MEDIUM"
        : safetyScore >= 50
          ? "HIGH"
          : "CRITICAL";

  return { safetyScore, wellbeingScore, riskLevel };
}

