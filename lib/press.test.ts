import { describe, expect, it } from "vitest";
import { formatPressDate, getPressGroups } from "./press";

describe("formatPressDate", () => {
  it("formats a year and month", () => {
    expect(formatPressDate("2019-04")).toBe("Apr 2019");
    expect(formatPressDate("2020-12")).toBe("Dec 2020");
  });

  it("formats a bare year", () => {
    expect(formatPressDate("2016")).toBe("2016");
  });
});

describe("getPressGroups", () => {
  it("lists newest items first within each dated group", () => {
    for (const group of getPressGroups()) {
      const dates = group.items.map((i) => i.date).filter((d): d is string => Boolean(d));
      expect(dates).toEqual([...dates].sort().reverse());
    }
  });

  it("uses https links with no duplicates", () => {
    const urls = getPressGroups().flatMap((g) => g.items.map((i) => i.url));
    expect(new Set(urls).size).toBe(urls.length);
    for (const url of urls) expect(url).toMatch(/^https:\/\//);
  });
});
