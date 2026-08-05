import { describe, expect, it } from "vitest";
import {
  BASE_LEVY_SECTOR,
  calculateAnnualLevy,
  getAllLevyRates,
  getNationalityKey,
  getSectorKey,
} from "./levy-rates";

describe("levy rates", () => {
  it("uses services as the default sector", () => {
    expect(getSectorKey("unknown")).toBe("services");
    expect(BASE_LEVY_SECTOR[getSectorKey("unknown")]).toBe(1850);
  });

  it("normalizes nationality names and calculates annual levy", () => {
    expect(getNationalityKey("Bangla Desh")).toBe("bangladesh");
    expect(calculateAnnualLevy("manufacturing", "bangladesh")).toBe(2370);
  });

  it("exposes the canonical reference payload", () => {
    expect(getAllLevyRates()).toMatchObject({
      baseLevyBySector: BASE_LEVY_SECTOR,
      effectiveDate: "2026-01-01",
    });
  });
});
