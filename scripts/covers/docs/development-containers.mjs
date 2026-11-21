// Diagrams of the development-containers docs pages, drawn with the light theme of style.mjs.
// Each entry has the same fields as the entries of covers.mjs.

import { C, text, icon, logo, box, circle, arrow } from '../style.mjs';

// okteto up replaces the api Deployment with api-okteto, a Development
// Container that runs the application with hot reload. File Sync keeps the
// source code on the developer's machine and the container in sync, in both
// directions, and the developer reaches the application on localhost (the
// Development Containers index). Redrawn from the old sync-development-arch.png,
// with its elements: the source code, Sync, the Namespace, api, api-okteto,
// frontend, database.
const ALT = 'okteto up replaces the api Deployment with api-okteto, a Development Container with hot reload, in your Okteto Namespace, next to the frontend and the database. File Sync keeps the source code on your machine and the Development Container in sync, in both directions, and you reach the application on localhost:8080';

const TEAL_FILL = '#e2f5f3';
const PORT = 'localhost:8080';

// A service row, narrower than the Namespace and centered in it.
const service = (x, y, w, name, label) => box(x, y, w, 58, { color: C.dim, fill: C.row, radius: 12, strokeWidth: 2 })
  + icon(name, x + 38, y + 29, 30, C.blue) + text(label, x + 72, y + 38, 26, { anchor: 'start' });
// The Development Container: the service it replaces, and hot reload. 124 tall.
const devContainer = (x, y, w) => box(x, y, w, 124, { color: C.teal, fill: TEAL_FILL, radius: 12, strokeWidth: 3 })
  + icon('box', x + 38, y + 32, 30, C.teal) + text('api-okteto', x + 72, y + 41, 26, { anchor: 'start', color: C.teal })
  + text('replaces api', x + 72, y + 75, 22, { anchor: 'start', color: C.dim })
  + icon('zap', x + 38, y + 100, 26, C.teal) + text('hot reload', x + 72, y + 108, 22, { anchor: 'start' });
// The source code on the developer's machine: a circle with a line icon and the label under it.
const source = (cx, cy) => circle(cx, cy, 46, { color: C.teal }) + icon('laptop', cx, cy, 48, C.teal) + text('Source code', cx, cy + 82, 26);
// The localhost endpoint: a pill, which sits on the border of the Namespace.
const pill = (x, cy, w) => box(x, cy - 28, w, 56, { color: C.blue, radius: 28, strokeWidth: 3 }) + text(PORT, x + w / 2, cy + 8, 22, { color: C.blue });

// Wide: the source code on the left, the Namespace on the right, and the
// localhost pill on the left border of the Namespace.
function wide() {
  const x = 560;
  const y = 125;
  const rows = x + 110;
  const dev = y + 200;
  let out = box(x, y, 540, 420, { color: C.blue }) + logo('kubernetes', x + 270, y, 80) + text('Okteto Namespace', x + 270, y + 86, 30);
  out += service(rows, y + 128, 320, 'box', 'frontend') + devContainer(rows, dev, 320) + service(rows, dev + 138, 320, 'database', 'database');
  out += source(170, dev + 30) + arrow(228, dev + 30, rows - 8, dev + 30, { color: C.teal, both: true })
    + text('File Sync', 370, dev + 12, 24, { color: C.teal });
  out += pill(rows - 285, dev + 94, 240) + arrow(rows - 45, dev + 94, rows - 8, dev + 94, { color: C.blue });
  return `<g transform="translate(-20 0)">${out}</g>`;
}

// Stacked: the Namespace on top, with the Development Container as its last
// row, the localhost pill on its bottom border, and the source code under it.
function stacked() {
  const x = 50;
  const y = 60;
  const rows = x + 100;
  const dev = y + 272;
  const border = dev + 124 + 73;
  let out = box(x, y, 500, border - y, { color: C.blue }) + logo('kubernetes', 300, y, 80) + text('Okteto Namespace', 300, y + 86, 30);
  out += service(rows, y + 128, 300, 'box', 'frontend') + service(rows, y + 200, 300, 'database', 'database') + devContainer(rows, dev, 300);
  out += pill(290, border, 220) + arrow(400, border - 28, 400, dev + 132, { color: C.blue });
  out += arrow(200, border + 110, 200, dev + 132, { color: C.teal, both: true }) + text('File Sync', 222, border + 78, 24, { color: C.teal, anchor: 'start' })
    + source(200, border + 166);
  return { svg: out, height: border + 166 + 82 + 40 };
}

export default [
  { out: 'static/img/development-container.webp', background: 'white', alt: ALT, svg: () => wide() },
  { out: 'static/img/development-container-mobile.webp', background: 'white', width: 600, height: stacked().height, alt: ALT, svg: () => stacked().svg },
];
