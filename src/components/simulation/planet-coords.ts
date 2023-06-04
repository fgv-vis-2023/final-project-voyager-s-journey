/*
 * Partially adapted from https://www.danbp.org/p/en/node/139
 */

import keplerianElements from './keplerian-elements.json';

interface PlanetKeplerianElements {
  semiMajorAxis: number;
  semiMajorAxisVariation: number;
  eccentricity: number;
  eccentricityVariation: number;
  inclination: number;
  inclinationVariation: number;
  meanLongitude: number;
  meanLongitudeVariation: number;
  longitudeOfPerihelion: number;
  longitudeOfPerihelionVariation: number;
  longitudeOfAscendingNode: number;
  longitudeOfAscendingNodeVariation: number;
}

function solveKeplerEquation(M: number, e: number) {
  let e1 = (180 / Math.PI) * e;
  let deg2rad = Math.PI / 180;
  let E0 = M + e1 * Math.sin(M * deg2rad);
  let tolerance = 10e-6;
  let dE: number;
  let dM: number;
  let E1 = E0;
  let E2 = 0;
  let difE1E2 = 1;

  for (let i = 0; i < 1000 && difE1E2 > tolerance; i++) {
    dM = M - (E1 - e1 * Math.sin(deg2rad * E1));
    dE = dM / (1 - e * Math.cos(deg2rad * E1));
    E2 = E1 + dE;
    difE1E2 = Math.abs(E1 - E2);
  }

  return E2;
}

export function getPlanetCoords(
  planetName: keyof typeof keplerianElements,
  time: number
) {
  const elements = keplerianElements[planetName] as PlanetKeplerianElements;

  let deg2rad = Math.PI / 180;
  let Teph = time / 1000 / 86400 + 2440587.5;
  let T = (Teph - 2451545) / 36525;

  let a0 = elements.semiMajorAxis;
  let at = elements.semiMajorAxisVariation;
  let a = a0 + at * T;
  let e0 = elements.eccentricity;
  let et = elements.eccentricityVariation;
  let e = e0 + et * T;
  let I0 = elements.inclination;
  let It = elements.inclinationVariation;
  let I = I0 + It * T;
  let L0 = elements.meanLongitude;
  let Lt = elements.meanLongitudeVariation;
  let L = L0 + Lt * T;
  let W0 = elements.longitudeOfPerihelion;
  let Wt = elements.longitudeOfPerihelionVariation;
  let W = W0 + Wt * T;
  let O0 = elements.longitudeOfAscendingNode;
  let Ot = elements.longitudeOfAscendingNodeVariation;
  let O = O0 + Ot * T;

  let w = W - O;

  let M = L - W;
  if (M < -180 || M > 180) M = M % 360;

  let E = solveKeplerEquation(M, e);

  let x1 = a * (Math.cos(deg2rad * E) - e);
  let y1 = a * Math.sqrt(1 - e * e) * Math.sin(deg2rad * E);

  const cosw = Math.cos(deg2rad * w);
  const sinw = Math.sin(deg2rad * w);
  const cosO = Math.cos(deg2rad * O);
  const sinO = Math.sin(deg2rad * O);
  const cosI = Math.cos(deg2rad * I);
  const _sinI = Math.sin(deg2rad * I);

  const x =
    (cosw * cosO - sinw * sinO * cosI) * x1 +
    (-sinw * cosO - cosw * sinO * cosI) * y1;
  const y =
    (cosw * sinO + sinw * cosO * cosI) * x1 +
    (-sinw * sinO + cosw * cosO * cosI) * y1;

  return { x, y };
}
