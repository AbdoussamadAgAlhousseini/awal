// Awal — atlas linguistique (§15).
//
// AVERTISSEMENT MÉTHODOLOGIQUE
// Le tamasheq est un CONTINUUM dialectal : il n'existe pas de frontière nette entre
// les parlers, et les aires ci-dessous sont des approximations pédagogiques, non des
// limites attestées ni des revendications territoriales. Elles sont volontairement
// dessinées comme des zones floues et étiquetées « indicatives » dans l'interface.
// Les isoglosses réelles (§10) devront venir d'enquêtes de terrain géolocalisées.

/** Emprise de la carte, en degrés. */
export const BOUNDS = { lonMin: -8, lonMax: 15, latMin: 12, latMax: 28 };

/** Dimensions du dessin SVG. */
export const VIEW = { w: 820, h: 570 };

/** Projection équirectangulaire simple (suffisante à cette échelle et à cette latitude). */
export function project([lon, lat]) {
  const { lonMin, lonMax, latMin, latMax } = BOUNDS;
  const x = ((lon - lonMin) / (lonMax - lonMin)) * VIEW.w;
  const y = ((latMax - lat) / (latMax - latMin)) * VIEW.h;
  return [Math.round(x * 10) / 10, Math.round(y * 10) / 10];
}

/**
 * Polygones indicatifs, en coordonnées [lon, lat].
 * `labelAt` place l'étiquette à la main : le centroïde géométrique la ferait
 * chevaucher les repères de villes sur plusieurs aires.
 */
export const AREA_SHAPES = {
  ml: {
    label: "Adagh · Azawad",
    labelAt: [0.2, 19.3],
    ring: [[-5.4, 15.4], [-3.2, 16.9], [-0.6, 18.2], [1.4, 20.4], [3.6, 20.0],
           [3.9, 18.1], [1.9, 16.4], [-0.9, 15.3], [-3.6, 14.7], [-5.4, 15.4]],
  },
  ne: {
    label: "Aïr · Tawllemmet",
    labelAt: [8.2, 19.2],
    ring: [[4.4, 14.9], [7.1, 16.1], [8.6, 18.3], [9.4, 20.6], [11.6, 20.1],
           [11.1, 17.4], [9.2, 15.3], [7.0, 14.1], [5.0, 13.9], [4.4, 14.9]],
  },
  dz: {
    label: "Ahaggar (Hoggar)",
    labelAt: [5.6, 24.4],
    ring: [[2.6, 21.4], [4.6, 23.4], [6.2, 25.6], [8.4, 25.9], [9.1, 24.1],
           [7.4, 22.2], [5.2, 20.9], [3.4, 20.7], [2.6, 21.4]],
  },
  ly: {
    label: "Ajjer",
    labelAt: [12.2, 25.6],
    ring: [[9.3, 23.6], [10.6, 25.4], [12.2, 26.9], [13.9, 26.2], [13.4, 24.3],
           [11.8, 23.1], [10.2, 22.7], [9.3, 23.6]],
  },
  bf: {
    label: "Oudalan",
    labelAt: [0.5, 14.2],
    ring: [[-1.0, 13.9], [0.2, 14.8], [1.5, 15.1], [2.0, 14.3], [0.9, 13.6],
           [-0.4, 13.4], [-1.0, 13.9]],
  },
};

/** Chaîne `d` d'un <path> SVG fermé à partir d'un anneau [lon,lat]. */
export function ringToPath(ring) {
  return (
    ring
      .map((pt, i) => {
        const [x, y] = project(pt);
        return `${i === 0 ? "M" : "L"}${x} ${y}`;
      })
      .join(" ") + " Z"
  );
}

/** Centre approximatif d'un anneau, pour poser l'étiquette. */
export function ringCentroid(ring) {
  const pts = ring.map(project);
  const x = pts.reduce((s, p) => s + p[0], 0) / pts.length;
  const y = pts.reduce((s, p) => s + p[1], 0) / pts.length;
  return [Math.round(x), Math.round(y)];
}

/** GeoJSON stocké en base (champ Area.geojson). */
export function areaGeoJSON(code) {
  const shape = AREA_SHAPES[code];
  if (!shape) return null;
  return JSON.stringify({
    type: "Feature",
    properties: { label: shape.label, indicative: true },
    geometry: { type: "Polygon", coordinates: [shape.ring] },
  });
}

/** Repères géographiques, pour situer la carte sans fond de carte externe. */
export const LANDMARKS = [
  { name: "Tombouctou", at: [-3.0, 16.8] },
  { name: "Kidal", at: [1.4, 18.4] },
  { name: "Agadez", at: [7.99, 16.97] },
  { name: "Tamanrasset", at: [5.53, 22.79] },
  { name: "Djanet", at: [9.48, 24.55] },
  { name: "Gao", at: [-0.04, 16.27] },
];
