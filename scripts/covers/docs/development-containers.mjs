// Diagrams of the development-containers docs pages, drawn with the light theme of style.mjs.
// Each entry has the same fields as the entries of covers.mjs.

import { C, text, icon, logo, box, circle, arrow } from '../style.mjs';

// okteto up replaces the api Deployment with api-okteto, a Development
// Container, and File Sync keeps the source code on the developer's machine
// and the container in sync, in both directions (the Development Containers
// index). Redrawn from the old sync-development-arch.png, with its elements:
// the source code, Sync, the Namespace, api, api-okteto, frontend, database.
const ALT = 'okteto up replaces the api Deployment with api-okteto, a Development Container in your Okteto Namespace, next to the frontend and the database. File Sync keeps the source code on your machine and the Development Container in sync, in both directions';

// 300 wide and 230 tall.
function machine(x, y, w) {
  return box(x, y, w, 230, { color: C.teal }) + icon('laptop', x + w / 2, y + 95, 96, C.teal)
    + text('Source code', x + w / 2, y + 190, 28);
}

const ROWS = [
  ['box', 'frontend'],
  ['box', 'api-okteto', true],
  ['database', 'database'],
];
// 136 + 3 * 72 + 24 tall.
function namespace(x, y, w) {
  let out = box(x, y, w, 376, { color: C.blue }) + logo('kubernetes', x + w / 2, y, 80)
    + text('Okteto Namespace', x + w / 2, y + 86, 30);
  ROWS.forEach(([name, label, dev], i) => {
    const ry = y + 128 + i * 72;
    out += box(x + 30, ry, w - 60, 58, { color: dev ? C.teal : C.dim, fill: dev ? '#e2f5f3' : C.row, radius: 12, strokeWidth: dev ? 3 : 2 })
      + icon(name, x + 68, ry + 29, 30, dev ? C.teal : C.blue)
      + text(label, x + 102, ry + 38, 26, { anchor: 'start', color: dev ? C.teal : C.text });
    if (dev) out += text('replaces api', x + w - 52, ry + 38, 22, { anchor: 'end', color: C.dim });
  });
  return out;
}

// The two-way File Sync arrow, with the Okteto mark over it.
function sync(x1, x2, y) {
  const cx = (x1 + x2) / 2;
  return arrow(x1, y, x2, y, { color: C.teal, both: true }) + circle(cx, y - 70, 38, { color: C.teal })
    + logo('okteto', cx, y - 70, 50) + text('File Sync', cx, y + 46, 26, { color: C.teal });
}

export default [
  {
    out: 'static/img/development-container.webp',
    background: 'white',
    alt: ALT,
    svg: () => machine(70, 210, 300) + sync(400, 640, 325) + namespace(670, 145, 460),
  },
  {
    out: 'static/img/development-container-mobile.webp',
    background: 'white',
    width: 600,
    height: 1000,
    alt: ALT,
    svg: () => machine(150, 40, 300)
      + arrow(300, 300, 300, 470, { color: C.teal, both: true })
      + circle(225, 385, 38, { color: C.teal }) + logo('okteto', 225, 385, 50)
      + text('File Sync', 330, 394, 26, { color: C.teal, anchor: 'start' })
      + namespace(70, 560, 460),
  },
];
