import { describe, it, expect } from "vitest";
import { schedule, previewInterval, MIN_EASE, DEFAULT_EASE } from "./srs.mjs";

describe("SRS (SM-2)", () => {
  it("progresse 1 → 6 → ~15 jours sur trois « correct »", () => {
    let c = { interval: 0, ease: DEFAULT_EASE, reps: 0, lapses: 0 };
    c = schedule(c, "good");
    expect(c.interval).toBe(1);
    expect(c.reps).toBe(1);
    c = schedule(c, "good");
    expect(c.interval).toBe(6);
    expect(c.reps).toBe(2);
    c = schedule(c, "good");
    expect(c.interval).toBe(15); // round(6 * 2.5)
    expect(c.reps).toBe(3);
  });

  it("« à revoir » réinitialise les répétitions et compte un oubli", () => {
    let c = { interval: 20, ease: 2.5, reps: 4, lapses: 0 };
    c = schedule(c, "again");
    expect(c.reps).toBe(0);
    expect(c.lapses).toBe(1);
    expect(c.interval).toBe(0);
  });

  it("ne descend jamais le facteur de facilité sous le plancher", () => {
    let c = { interval: 1, ease: MIN_EASE, reps: 1, lapses: 0 };
    for (let i = 0; i < 10; i++) c = schedule(c, "again");
    expect(c.ease).toBeGreaterThanOrEqual(MIN_EASE);
  });

  it("« facile » accélère davantage que « correct »", () => {
    const base = { interval: 10, ease: 2.5, reps: 3, lapses: 0 };
    expect(schedule(base, "easy").interval).toBeGreaterThan(schedule(base, "good").interval);
  });

  it("previewInterval annonce l'échéance de chaque note", () => {
    const c = { interval: 0, ease: DEFAULT_EASE, reps: 0, lapses: 0 };
    expect(previewInterval(c, "again")).toEqual({ minutes: 10, days: 0 });
    expect(previewInterval(c, "good").days).toBe(1);
  });

  it("rejette une note inconnue", () => {
    expect(() => schedule({ interval: 0, ease: 2.5, reps: 0, lapses: 0 }, "wat" as never)).toThrow();
  });
});
