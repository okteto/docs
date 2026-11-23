// Diagrams of the development-containers docs pages, drawn with the light theme of style.mjs.
// Each entry has the same fields as the entries of covers.mjs.

import { C, text, icon, logo, box, circle, arrow } from '../style.mjs';

// okteto up replaces the api Deployment with api-okteto, a Development
// Container that runs the application with hot reload. File Sync keeps the
// source code on the developer's machine and the container in sync, in both
// directions, and the developer reaches the database on localhost (the
// Development Containers index). Redrawn from the old sync-development-arch.png,
// with its elements: the source code, Sync, the Namespace, api, api-okteto,
// frontend, database.
const ALT = 'okteto up replaces the api Deployment with api-okteto, a Development Container with hot reload, in your Okteto Namespace, next to the frontend and the database. File Sync keeps the source code on your machine and the Development Container in sync, in both directions, and you reach the database on localhost:27017';

const TEAL_FILL = '#e2f5f3';
const PORT = 'localhost:27017';

// A service row, narrower than the Namespace and centered in it.
const service = (x, y, w, name, label) => box(x, y, w, 58, { color: C.dim, fill: C.row, radius: 12, strokeWidth: 2 })
  + icon(name, x + 38, y + 29, 30, C.blue) + text(label, x + 72, y + 38, 26, { anchor: 'start' });
// The Development Container, 96 tall: api-okteto with hot reload, drawn over
// the dashed outline of api, the Deployment it replaces.
const devContainer = (x, y, w) => box(x + 28, y - 30, w, 96, { color: C.dim, fill: C.background, radius: 12, strokeWidth: 2, dashed: true })
  + icon('box', x + 62, y - 14, 20, C.dim) + text('api', x + 80, y - 7, 20, { anchor: 'start', color: C.dim })
  + box(x, y, w, 96, { color: C.teal, fill: TEAL_FILL, radius: 12, strokeWidth: 3 })
  + icon('box', x + 38, y + 30, 30, C.teal) + text('api-okteto', x + 72, y + 39, 26, { anchor: 'start', color: C.teal })
  + icon('zap', x + 38, y + 68, 26, C.teal) + text('hot reload', x + 72, y + 76, 22, { anchor: 'start' });
// The localhost endpoint: a pill.
const pill = (x, cy, w) => box(x, cy - 28, w, 56, { color: C.blue, radius: 28, strokeWidth: 3 }) + text(PORT, x + w / 2, cy + 8, 22, { color: C.blue });
// The developer's machine: a box titled on its top edge, with the source code
// and the localhost endpoint as its two rows.
function machine(x, cy, w) {
  const title = 'Your machine';
  return box(x, cy - 100, w, 200, { color: C.teal, radius: 20 })
    + `<rect x="${x + 22}" y="${cy - 105}" width="${title.length * 14 + 62}" height="10" fill="${C.background}"/>`
    + icon('laptop', x + 48, cy - 100, 34, C.teal) + text(title, x + 74, cy - 91, 26, { anchor: 'start' })
    + service(x + 30, cy - 69, w - 60, 'code', 'Source code') + pill(x + 30, cy + 40, w - 60);
}

// Wide: the machine on the left, the Namespace on the right, both with 60px
// of margin. G is the middle of the Development Container, and the frontend
// and the database sit at the same distance from it. The machine sits halfway
// between the two rows it connects to, so File Sync (to the Development
// Container) and the localhost endpoint (to the database) mirror each other.
function wide() {
  const G = 364;
  const D = G + 123; // the middle of the database row
  const M = (G + D) / 2;
  const rows = 710;
  let out = box(640, G - 262, 500, 464, { color: C.blue }) + logo('kubernetes', 890, G - 262, 80) + text('Okteto Namespace', 890, G - 176, 30);
  out += service(rows, G - 152, 360, 'box', 'frontend') + devContainer(rows, G - 48, 360) + service(rows, G + 94, 360, 'database', 'database');
  out += machine(60, M, 360)
    + arrow(394, M - 40, rows - 8, G, { color: C.teal, both: true }) + text('File Sync', 548, G - 2, 24, { color: C.teal })
    + arrow(394, M + 40, rows - 8, D, { color: C.blue });
  return out;
}

// Stacked: the Namespace on top, with the Development Container as its last
// row, and the machine under it. The localhost endpoint reaches the database
// around the Development Container, at the right of the rows.
function stacked() {
  const x = 50;
  const y = 60;
  const rows = x + 70;
  const dev = y + 302;
  const border = dev + 96 + 50;
  const M = border + 190; // the middle of the machine
  const D = y + 229; // the middle of the database row
  let out = box(x, y, 500, border - y, { color: C.blue }) + logo('kubernetes', 300, y, 80) + text('Okteto Namespace', 300, y + 86, 30);
  out += service(rows, y + 128, 360, 'box', 'frontend') + service(rows, y + 200, 360, 'database', 'database') + devContainer(rows, dev, 360);
  out += machine(120, M, 360)
    + arrow(410, M - 104, 410, dev + 104, { color: C.teal, both: true }) + text('File Sync', 392, border + 52, 24, { color: C.teal, anchor: 'end' })
    + arrow(454, M + 40, 525, M + 40, { color: C.blue, head: false }) + arrow(525, M + 40, 525, D, { color: C.blue, head: false })
    + arrow(525, D, rows + 368, D, { color: C.blue });
  return { svg: out, height: M + 100 + 40 };
}

export default [
  { out: 'static/img/development-container.webp', background: 'white', alt: ALT, svg: () => wide() },
  { out: 'static/img/development-container-mobile.webp', background: 'white', width: 600, height: stacked().height, alt: ALT, svg: () => stacked().svg },
];
