import { STATUSES, INTEREST_LEVELS } from "@shared/schema";

export function getNextStatus(currentStatus: string): string {
  const terminalStatuses = ["Offer", "Rejected", "Withdrawn"];
  if (terminalStatuses.includes(currentStatus)) {
    return currentStatus;
  }
  const index = STATUSES.indexOf(currentStatus as (typeof STATUSES)[number]);
  if (index === -1 || index >= STATUSES.length - 1) {
    return currentStatus;
  }
  const next = STATUSES[index + 1];
  if (next === "Rejected" || next === "Withdrawn") {
    return currentStatus;
  }
  return next;
}

export function validateProspect(data: Record<string, unknown>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data.companyName || typeof data.companyName !== "string" || data.companyName.trim() === "") {
    errors.push("Company name is required");
  }

  if (!data.roleTitle || typeof data.roleTitle !== "string" || data.roleTitle.trim() === "") {
    errors.push("Role title is required");
  }

  if (data.status !== undefined) {
    if (!STATUSES.includes(data.status as (typeof STATUSES)[number])) {
      errors.push(`Status must be one of: ${STATUSES.join(", ")}`);
    }
  }

  if (data.interestLevel !== undefined) {
    if (!INTEREST_LEVELS.includes(data.interestLevel as (typeof INTEREST_LEVELS)[number])) {
      errors.push(`Interest level must be one of: ${INTEREST_LEVELS.join(", ")}`);
    }
  }

  if (data.targetSalary !== undefined && data.targetSalary !== null && data.targetSalary !== "") {
    if (typeof data.targetSalary !== "string") {
      errors.push("Target salary must be a string");
    }
  }

  return { valid: errors.length === 0, errors };
}

export function isTerminalStatus(status: string): boolean {
  return status === "Rejected" || status === "Withdrawn" || status === "Offer";
}

export interface DashboardStats {
  total: number;
  byStatus: Record<string, number>;
  byInterestLevel: Record<string, number>;
}

export function computeDashboardStats(
  prospects: { status: string; interestLevel: string }[],
  statuses: readonly string[],
  interestLevels: readonly string[],
): DashboardStats {
  const byStatus: Record<string, number> = {};
  for (const s of statuses) {
    byStatus[s] = 0;
  }

  const byInterestLevel: Record<string, number> = {};
  for (const l of interestLevels) {
    byInterestLevel[l] = 0;
  }

  for (const p of prospects) {
    if (p.status in byStatus) {
      byStatus[p.status]++;
    }
    if (p.interestLevel in byInterestLevel) {
      byInterestLevel[p.interestLevel]++;
    }
  }

  return {
    total: prospects.length,
    byStatus,
    byInterestLevel,
  };
}
