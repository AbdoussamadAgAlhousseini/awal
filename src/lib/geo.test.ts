import { describe, it, expect } from "vitest";
import { project, VIEW, BOUNDS, ringToPath, areaGeoJSON, AREA_SHAPES } from "./geo.mjs";

describe("atlas — projection", () => {
  it("projette les coins de l'emprise sur les coins du dessin", () => {
    expect(project([BOUNDS.lonMin, BOUNDS.latMax])).toEqual([0, 0]);
    expect(project([BOUNDS.lonMax, BOUNDS.latMin])).toEqual([VIEW.w, VIEW.h]);
  });

  it("ringToPath produit un chemin SVG fermé", () => {
    const d = ringToPath([[0, 20], [5, 22], [3, 18]]);
    expect(d.startsWith("M")).toBe(true);
    expect(d.endsWith("Z")).toBe(true);
  });
});

describe("atlas — GeoJSON", () => {
  it("chaque aire produit un Feature marqué « indicatif »", () => {
    for (const code of Object.keys(AREA_SHAPES)) {
      const gj = JSON.parse(areaGeoJSON(code) as string);
      expect(gj.type).toBe("Feature");
      expect(gj.geometry.type).toBe("Polygon");
      expect(gj.properties.indicative).toBe(true);
    }
  });

  it("renvoie null pour une aire inconnue", () => {
    expect(areaGeoJSON("xx")).toBeNull();
  });
});
