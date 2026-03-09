import { validateProspect, computeDashboardStats } from "../prospect-helpers";
import { STATUSES, INTEREST_LEVELS } from "../../shared/schema";

describe("prospect creation validation", () => {
  test("rejects a blank company name", () => {
    const result = validateProspect({
      companyName: "",
      roleTitle: "Software Engineer",
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Company name is required");
  });

  test("rejects a blank role title", () => {
    const result = validateProspect({
      companyName: "Google",
      roleTitle: "",
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Role title is required");
  });
});

describe("salary field validation", () => {
  test("accepts a valid salary string like $120,000", () => {
    const result = validateProspect({
      companyName: "Google",
      roleTitle: "Software Engineer",
      targetSalary: "$120,000",
    });

    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test("accepts a salary string with different formats", () => {
    const formats = ["$90,000", "100k", "$150,000/yr", "80000", "$200,000 - $250,000"];
    for (const salary of formats) {
      const result = validateProspect({
        companyName: "Acme",
        roleTitle: "Engineer",
        targetSalary: salary,
      });
      expect(result.valid).toBe(true);
    }
  });

  test("accepts an empty salary string (optional field)", () => {
    const result = validateProspect({
      companyName: "Google",
      roleTitle: "Software Engineer",
      targetSalary: "",
    });

    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test("accepts null salary (optional field)", () => {
    const result = validateProspect({
      companyName: "Google",
      roleTitle: "Software Engineer",
      targetSalary: null,
    });

    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test("accepts undefined salary (field omitted)", () => {
    const result = validateProspect({
      companyName: "Google",
      roleTitle: "Software Engineer",
    });

    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test("rejects a non-string salary value", () => {
    const result = validateProspect({
      companyName: "Google",
      roleTitle: "Software Engineer",
      targetSalary: 120000,
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Target salary must be a string");
  });
});

describe("dashboard stats computation", () => {
  const mockProspects = [
    { status: "Bookmarked", interestLevel: "High" },
    { status: "Bookmarked", interestLevel: "Medium" },
    { status: "Applied", interestLevel: "High" },
    { status: "Interviewing", interestLevel: "Low" },
    { status: "Offer", interestLevel: "High" },
  ];

  test("computes correct total count", () => {
    const stats = computeDashboardStats(mockProspects, STATUSES, INTEREST_LEVELS);
    expect(stats.total).toBe(5);
  });

  test("computes correct status breakdown", () => {
    const stats = computeDashboardStats(mockProspects, STATUSES, INTEREST_LEVELS);
    expect(stats.byStatus["Bookmarked"]).toBe(2);
    expect(stats.byStatus["Applied"]).toBe(1);
    expect(stats.byStatus["Phone Screen"]).toBe(0);
    expect(stats.byStatus["Interviewing"]).toBe(1);
    expect(stats.byStatus["Offer"]).toBe(1);
    expect(stats.byStatus["Rejected"]).toBe(0);
    expect(stats.byStatus["Withdrawn"]).toBe(0);
  });

  test("computes correct interest level breakdown", () => {
    const stats = computeDashboardStats(mockProspects, STATUSES, INTEREST_LEVELS);
    expect(stats.byInterestLevel["High"]).toBe(3);
    expect(stats.byInterestLevel["Medium"]).toBe(1);
    expect(stats.byInterestLevel["Low"]).toBe(1);
  });

  test("returns all zeroes for an empty list", () => {
    const stats = computeDashboardStats([], STATUSES, INTEREST_LEVELS);
    expect(stats.total).toBe(0);
    for (const s of STATUSES) {
      expect(stats.byStatus[s]).toBe(0);
    }
    for (const l of INTEREST_LEVELS) {
      expect(stats.byInterestLevel[l]).toBe(0);
    }
  });

  test("initialises every status key even when no prospects match", () => {
    const stats = computeDashboardStats(
      [{ status: "Bookmarked", interestLevel: "High" }],
      STATUSES,
      INTEREST_LEVELS,
    );
    for (const s of STATUSES) {
      expect(stats.byStatus).toHaveProperty(s);
    }
  });
});
