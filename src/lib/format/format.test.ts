import { describe, expect, it } from "vitest";
import { formatDropDate, splitRemaining } from "./date";
import { formatPrice } from "./price";

describe("formatPrice (01 rule 10)", () => {
  it("formats cents as R$ with comma decimals and dot thousands", () => {
    expect(formatPrice(19990)).toBe("R$ 199,90");
    expect(formatPrice(129900)).toBe("R$ 1.299,00");
    expect(formatPrice(500)).toBe("R$ 5,00");
  });
});

describe("formatDropDate (05 D-DATA)", () => {
  it("writes weekday, date and hour in Rio time", () => {
    expect(formatDropDate("2025-08-24T00:00:00-03:00")).toBe("domingo, 24/08/2025, às 00h");
  });
  it("adds minutes only when not zero, and converts from UTC", () => {
    expect(formatDropDate("2025-12-20T21:30:00Z")).toBe("sábado, 20/12/2025, às 18h30");
  });
});

describe("splitRemaining", () => {
  it("splits milliseconds into d/h/m/s and clamps at zero", () => {
    expect(splitRemaining(((2 * 24 + 3) * 3600 + 4 * 60 + 5) * 1000)).toEqual({
      days: 2,
      hours: 3,
      minutes: 4,
      seconds: 5,
    });
    expect(splitRemaining(-5000)).toEqual({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  });
});
