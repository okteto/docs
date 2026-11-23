// Diagrams of the endpoints-divert docs pages, drawn with the light theme of style.mjs.
// Each entry has the same fields as the entries of covers.mjs.
//
// The Divert pages use the Movies application: the Shared Namespace (Staging)
// runs the whole application, and Cindy's Overlay Namespace runs only the
// services she changes. Gray rows are shared services, teal rows are Cindy's.
// Each diagram has a wide version and a stacked version for phones.

import { C, text, icon, logo, box, circle } from '../style.mjs';

const URL = 'https://movies-staging.okteto.dev';
const ROW = 52;

// A rounded polyline, with an arrowhead at its end unless head is false.
function path(points, { color = C.dim, head = true, dashed = false } = {}) {
  const r = 14;
  let d = `M${points[0][0]} ${points[0][1]}`;
  for (let i = 1; i < points.length; i++) {
    const [x, y] = points[i];
    if (i === points.length - 1) { d += ` L${x} ${y}`; break; }
    const [px, py] = points[i - 1];
    const [nx, ny] = points[i + 1];
    const l1 = Math.hypot(x - px, y - py);
    const l2 = Math.hypot(nx - x, ny - y);
    const k1 = Math.min(r, l1 / 2) / l1;
    const k2 = Math.min(r, l2 / 2) / l2;
    d += ` L${x - (x - px) * k1} ${y - (y - py) * k1} Q${x} ${y} ${x + (nx - x) * k2} ${y + (ny - y) * k2}`;
  }
  let out = `<g fill="none" stroke="${color}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><path d="${d}"${dashed ? ' stroke-dasharray="10 10"' : ''}/>`;
  if (head) {
    const [x1, y1] = points[points.length - 2];
    const [x2, y2] = points[points.length - 1];
    const a = Math.atan2(y2 - y1, x2 - x1);
    const s = 13;
    out += `<path d="M${x2 - s * Math.cos(a - 0.6)} ${y2 - s * Math.sin(a - 0.6)} L${x2} ${y2} L${x2 - s * Math.cos(a + 0.6)} ${y2 - s * Math.sin(a + 0.6)}"/>`;
  }
  return `${out}</g>`;
}
const line = (points, color = C.dim) => path(points, { color, head: false });

// The endpoint of the Shared Namespace, without a divert header (blue) and
// with Cindy's divert header (teal, two lines).
// The baggage line is the detail of the request, so it's smaller than the URL.
const bluePill = (x, cy, w, size = 18) => box(x, cy - 24, w, 48, { color: C.blue, radius: 24, strokeWidth: 3 })
  + text(URL, x + w / 2, cy + size / 3, size, { color: C.blue });
const tealPill = (x, cy, w, size = 18) => box(x, cy - 38, w, 76, { color: C.teal, radius: 26, strokeWidth: 3 })
  + text(URL, x + w / 2, cy - 7, size, { color: C.teal }) + text('baggage: okteto-divert=cindy', x + w / 2, cy + 22, size - 2, { color: C.teal });

// A Namespace: Staging (the Shared Namespace) or Cindy (her Overlay
// Namespace), with the Kubernetes mark and its name on its top edge. The mark
// sits at the left of the edge, not in the middle, because the connections
// between the two Namespaces cross the middle of the edge.
// The mark and the name always go at the left of the top edge, in every
// diagram: arrows enter a Namespace through its left border, or through its
// top edge at the right of the name, never over it.
function ns(x, y, w, h, kind) {
  const label = kind === 'shared' ? 'Staging' : 'Cindy';
  let out = box(x, y, w, h, { color: C.blue, radius: 20 });
  out += `<rect x="${x + 22}" y="${y - 5}" width="${label.length * 15 + 72}" height="10" fill="${C.background}"/>`;
  // Both are Namespaces, so both carry the Kubernetes mark.
  out += logo('kubernetes', x + 50, y, 50);
  return out + text(label, x + 82, y + 9, 26, { anchor: 'start' });
}

// A dashed subsystem or database server inside a Namespace, titled on its top edge.
function group(x, y, w, h, title, { right = false, color = C.dim } = {}) {
  const tw = title.length * 13.4 + 30;
  const tx = right ? x + w - 20 - tw : x + 20;
  return box(x, y, w, h, { color, radius: 16, strokeWidth: 2.5, dashed: true })
    + `<rect x="${tx}" y="${y - 5}" width="${tw}" height="10" fill="${C.background}"/>`
    + text(title, tx + 12, y + 8, 22, { anchor: 'start', color: C.text });
}

// A service or a database: a row with a line icon. Cindy's rows are teal.
function svc(x, y, w, label, { teal = false, ic = 'box' } = {}) {
  const color = teal ? C.teal : C.dim;
  return box(x, y, w, ROW, { color, fill: teal ? '#e2f5f3' : C.row, radius: 12, strokeWidth: 2.5 })
    + icon(ic, x + 28, y + ROW / 2, 26, teal ? C.teal : C.blue) + text(label, x + 50, y + 34, 22, { anchor: 'start' });
}
const db = (x, y, w, label, teal = false) => svc(x, y, w, label, { teal, ic: 'database' });
const label = (string, x, y, { color = C.teal, anchor = 'start' } = {}) => text(string, x, y, 22, { color, anchor });

// ---------------------------------------------------------------------------
// Divert: requests with Cindy's divert header reach her rent service, which
// uses its own database and calls the shared catalog service.

function overviewWide(dbName = 'MongoDB', snapshot = false) {
  // G is the row of the API Gateway: the two endpoints, and the Rent and
  // Catalog rows, sit at the same distance above and below it.
  const G = 210;
  const R = 495; // Cindy's row
  let out = bluePill(30, G - 50, 380, 20) + tealPill(30, G + 50, 380, 20)
    + ns(440, 60, 730, 300, 'shared')
    + svc(478, G - 26, 200, 'API Gateway')
    + svc(743, G - 101, 170, 'Rent') + db(943, G - 101, 190, dbName)
    + svc(743, G + 49, 170, 'Catalog') + db(943, G + 49, 190, 'MongoDB')
    + line([[913, G - 75], [943, G - 75]]) + line([[913, G + 75], [943, G + 75]])
    + path([[828, G - 49], [828, G + 45]])
    + path([[678, G - 10], [710, G - 10], [710, G - 75], [739, G - 75]]) + path([[678, G + 10], [710, G + 10], [710, G + 75], [739, G + 75]])
    + path([[410, G - 50], [474, G - 12]], { color: C.blue }) + path([[410, G + 50], [474, G + 12]], { color: C.teal })
    + ns(440, 420, 730, 150, 'overlay')
    + svc(610, R - 26, 170, 'Rent', { teal: true }) + db(810, R - 26, 190, dbName, true)
    + line([[780, R], [810, R]], C.teal)
    + path([[630, G + 26], [630, R - 30]], { color: C.teal })
    + path([[760, R - 26], [760, G + 105]], { color: C.teal });
  if (snapshot) {
    out += path([[1133, G - 75], [1152, G - 75], [1152, R], [1006, R]], { color: C.teal, dashed: true })
      + label('Volume Snapshot', 1138, 398, { anchor: 'end' });
  }
  return out;
}

function overviewNarrow(dbName = 'MongoDB', snapshot = false) {
  // The two endpoints overlap in the middle, and their arrows mirror each other.
  let out = bluePill(30, 50, 420) + tealPill(150, 135, 420)
    + path([[60, 74], [60, 205], [250, 205], [250, 266]], { color: C.blue }) + path([[540, 173], [540, 205], [350, 205], [350, 266]], { color: C.teal })
    + ns(30, 230, 540, 370, 'shared')
    + svc(170, 270, 260, 'API Gateway')
    + svc(80, 380, 220, 'Rent') + db(320, 380, 200, dbName)
    + svc(80, 520, 220, 'Catalog') + db(320, 520, 200, 'MongoDB')
    + line([[300, 406], [320, 406]]) + line([[300, 546], [320, 546]])
    + path([[200, 322], [200, 376]]) + path([[430, 296], [540, 296], [540, 476], [240, 476], [240, 516]]) + path([[120, 432], [120, 516]])
    + ns(30, 660, 540, 160, 'overlay')
    + svc(80, 714, 220, 'Rent', { teal: true }) + db(320, 714, 200, dbName, true)
    + line([[300, 740], [320, 740]], C.teal)
    + path([[170, 296], [42, 296], [42, 740], [76, 740]], { color: C.teal })
    + path([[260, 714], [260, 576]], { color: C.teal });
  if (snapshot) {
    out += path([[520, 406], [558, 406], [558, 740], [524, 740]], { color: C.teal, dashed: true })
      + label('Volume Snapshot', 536, 640, { anchor: 'end' });
  }
  return out;
}

// ---------------------------------------------------------------------------
// Header Propagation: the rent service forwards the baggage header, or not.

function propagationWide(propagates) {
  const G = 195; // the row of the shared services
  const R = 465; // Cindy's row
  let out = tealPill(30, G, 380, 20) + path([[410, G], [466, G]], { color: C.teal })
    + ns(440, 80, 730, 230, 'shared')
    + svc(470, G - 26, 220, 'API Gateway') + svc(745, G - 26, 170, 'Rent') + svc(970, G - 26, 170, 'Catalog')
    + path([[690, G], [741, G]], { color: C.teal }) + label('baggage', 717, G - 40, { anchor: 'middle' })
    + ns(440, 380, 730, 170, 'overlay') + svc(970, R - 26, 170, 'Catalog', { teal: true });
  if (propagates) {
    out += path([[830, G + 26], [830, R], [966, R]], { color: C.teal }) + label('baggage', 845, 352);
  } else {
    out += path([[915, G], [966, G]]) + label('no baggage', 942, G - 40, { color: C.dim, anchor: 'middle' });
  }
  return out;
}

function propagationNarrow(propagates) {
  let out = tealPill(30, 55, 540) + path([[300, 93], [300, 196]], { color: C.teal })
    + ns(30, 150, 540, 360, 'shared')
    + svc(170, 200, 260, 'API Gateway') + svc(170, 310, 260, 'Rent') + svc(170, 420, 260, 'Catalog')
    + path([[300, 252], [300, 306]], { color: C.teal }) + label('baggage', 316, 286)
    + ns(30, 570, 540, 170, 'overlay') + svc(170, 650, 260, 'Catalog', { teal: true });
  if (propagates) {
    out += path([[430, 336], [500, 336], [500, 676], [434, 676]], { color: C.teal }) + label('baggage', 488, 548, { anchor: 'end' });
  } else {
    out += path([[300, 362], [300, 416]]) + label('no baggage', 316, 396, { color: C.dim });
  }
  return out;
}

// ---------------------------------------------------------------------------
// Queue Splitting: each subsystem owns its broker.

// A subsystem in a row: API, Kafka, worker, and the database they share. It has
// the same padding above and below its content, and 50px between its dashed
// border and the services, so the arrows that enter it have room.
function subsystemWide(y, api, worker, dbName, teal = false, title = 'Rentals subsystem') {
  const c = teal ? C.teal : C.dim;
  const r = y + 36; // the top of the first row
  return group(390, y, 750, 210, title, { color: c })
    + svc(440, r, 210, api, { teal }) + db(695, r, 120, 'Kafka', teal) + svc(860, r, 230, worker, { teal })
    + path([[650, r + 26], [691, r + 26]], { color: c }) + path([[815, r + 26], [856, r + 26]], { color: c })
    + db(655, r + 86, 200, dbName, teal)
    + line([[545, r + 52], [545, r + 112], [655, r + 112]], c) + line([[975, r + 52], [975, r + 112], [855, r + 112]], c);
}

function queuesWide(overlay) {
  // The endpoints reach the API Gateway through the left border of the
  // Namespace, so no arrow crosses its name. Every Namespace keeps 50px above
  // its first subsystem, and 40px below and at the right of its subsystems.
  const T = 190;
  const B = 440;
  const G = (T + B) / 2 + 62; // halfway between the two API rows
  let out = bluePill(20, 60, 360) + ns(90, 140, 1090, 550, 'shared')
    + svc(125, G - 26, 210, 'API Gateway')
    + subsystemWide(T, 'Rent API', 'Rent Worker', 'PostgreSQL')
    + subsystemWide(B, 'Catalog API', 'Catalog Worker', 'MongoDB', false, 'Catalog subsystem')
    + path([[335, G - 10], [362, G - 10], [362, T + 62], [436, T + 62]]) + path([[335, G + 10], [362, G + 10], [362, B + 62], [436, B + 62]]);
  if (overlay) {
    out += path([[50, 84], [50, G - 10], [121, G - 10]], { color: C.blue })
      + tealPill(400, 60, 360) + path([[420, 98], [420, 112], [70, 112], [70, G + 10], [121, G + 10]], { color: C.teal })
      + ns(90, 750, 1090, 300, 'overlay')
      + subsystemWide(800, 'Rent API', 'Rent Worker', 'PostgreSQL', true)
      + path([[300, G + 26], [300, 862], [436, 862]], { color: C.teal });
  } else {
    out += path([[50, 84], [50, G], [121, G]], { color: C.blue });
  }
  return out;
}

// A subsystem in a column: API, Kafka, worker, and the database on the right,
// with the same paddings as the wide one.
function subsystemNarrow(y, api, worker, dbName, teal = false, title = 'Rentals subsystem') {
  const c = teal ? C.teal : C.dim;
  const r = y + 50;
  return group(50, y, 540, 302, title, { right: true, color: c })
    + svc(100, r, 220, api, { teal }) + db(100, r + 80, 220, 'Kafka', teal) + svc(100, r + 160, 220, worker, { teal })
    + path([[210, r + 52], [210, r + 76]], { color: c }) + path([[210, r + 132], [210, r + 156]], { color: c })
    + db(350, r + 80, 190, dbName, teal)
    + line([[320, r + 14], [445, r + 14], [445, r + 80]], c) + line([[320, r + 198], [445, r + 198], [445, r + 132]], c);
}

function queuesNarrow(overlay) {
  const top = overlay ? 100 : 0;
  let out = '';
  if (overlay) {
    out += bluePill(30, 50, 420) + tealPill(190, 135, 420)
      + path([[60, 74], [60, 205], [270, 205], [270, 266]], { color: C.blue })
      + path([[580, 173], [580, 205], [370, 205], [370, 266]], { color: C.teal });
  } else {
    out += bluePill(110, 50, 420) + path([[320, 74], [320, 166]], { color: C.blue });
  }
  out += ns(30, 130 + top, 580, 824, 'shared')
    + svc(190, 170 + top, 260, 'API Gateway')
    + subsystemNarrow(270 + top, 'Rent API', 'Rent Worker', 'PostgreSQL')
    + subsystemNarrow(612 + top, 'Catalog API', 'Catalog Worker', 'MongoDB', false, 'Catalog subsystem')
    + path([[210, 222 + top], [210, 316 + top]]) + path([[190, 196 + top], [40, 196 + top], [40, 688 + top], [96, 688 + top]]);
  if (overlay) {
    out += ns(30, 1014 + top, 580, 392, 'overlay')
      + subsystemNarrow(1064 + top, 'Rent API', 'Rent Worker', 'PostgreSQL', true)
      + path([[450, 196 + top], [600, 196 + top], [600, 1040 + top], [210, 1040 + top], [210, 1110 + top]], { color: C.teal });
  }
  return out;
}

// Message-level routing: both rent workers share the broker and filter by the header.
function routingWide() {
  // Both Namespaces have the same height and the same paddings, and the four
  // services of the row are evenly spaced. The endpoints enter through the
  // left border, clear of the name of the Namespace.
  const G = 216;
  return bluePill(20, 60, 360) + tealPill(400, 60, 360)
    + path([[50, 84], [50, G - 10], [121, G - 10]], { color: C.blue })
    + path([[420, 98], [420, 112], [70, 112], [70, G + 10], [121, G + 10]], { color: C.teal })
    + ns(90, 130, 1090, 190, 'shared')
    + svc(125, G - 26, 210, 'API Gateway') + svc(432, G - 26, 170, 'Rent API') + db(699, G - 26, 140, 'Broker') + svc(935, G - 26, 210, 'Rent Worker')
    + path([[335, G], [428, G]]) + path([[602, G], [695, G]]) + path([[839, G], [931, G]])
    + label('baggage in message headers', 769, 284, { color: C.dim, anchor: 'end' })
    + label('skips okteto-divert=cindy', 1145, 284, { color: C.dim, anchor: 'end' })
    + ns(90, 380, 1090, 190, 'overlay')
    + svc(935, 440, 210, 'Rent Worker', { teal: true }) + label('only okteto-divert=cindy', 1145, 534, { anchor: 'end' })
    + path([[800, G + 26], [800, 466], [931, 466]], { color: C.teal });
}

function routingNarrow() {
  return bluePill(30, 50, 420) + tealPill(190, 135, 420)
    + path([[60, 74], [60, 205], [270, 205], [270, 266]], { color: C.blue }) + path([[580, 173], [580, 205], [370, 205], [370, 266]], { color: C.teal })
    + ns(30, 230, 580, 470, 'shared')
    + svc(190, 270, 260, 'API Gateway') + svc(190, 370, 260, 'Rent API') + db(190, 470, 260, 'Broker') + svc(190, 590, 260, 'Rent Worker')
    + path([[320, 322], [320, 366]]) + path([[320, 422], [320, 466]]) + path([[320, 522], [320, 586]])
    + label('baggage in message headers', 545, 562, { color: C.dim, anchor: 'end' })
    + label('skips okteto-divert=cindy', 320, 674, { color: C.dim, anchor: 'middle' })
    + ns(30, 760, 580, 180, 'overlay')
    + svc(190, 810, 260, 'Rent Worker', { teal: true }) + label('only okteto-divert=cindy', 320, 910, { anchor: 'middle' })
    + path([[450, 496], [560, 496], [560, 836], [454, 836]], { color: C.teal });
}

// ---------------------------------------------------------------------------
// Data Cloning.

function sharedDataWide() {
  const G = 175; // the row of the shared services
  const R = 425; // Cindy's row
  return bluePill(30, G - 50, 380, 20) + tealPill(30, G + 50, 380, 20)
    + ns(440, 80, 730, 190, 'shared')
    + svc(465, G - 26, 220, 'API Gateway') + svc(745, G - 26, 200, 'Catalog API') + db(975, G - 26, 170, 'MongoDB')
    + path([[685, G], [741, G]]) + line([[945, G], [975, G]])
    + path([[410, G - 50], [461, G - 12]], { color: C.blue }) + path([[410, G + 50], [461, G + 12]], { color: C.teal })
    + ns(440, 330, 730, 190, 'overlay') + svc(745, R - 26, 200, 'Catalog API', { teal: true })
    + path([[650, G + 26], [650, R], [741, R]], { color: C.teal })
    + path([[945, R], [1060, R], [1060, G + 30]], { color: C.teal }) + label('reads', 1075, 306);
}

function sharedDataNarrow() {
  return bluePill(30, 50, 420) + tealPill(150, 135, 420)
    + path([[60, 74], [60, 205], [250, 205], [250, 266]], { color: C.blue }) + path([[540, 173], [540, 205], [350, 205], [350, 266]], { color: C.teal })
    + ns(30, 230, 540, 240, 'shared')
    + svc(170, 270, 260, 'API Gateway') + svc(80, 380, 220, 'Catalog API') + db(320, 380, 200, 'MongoDB')
    + path([[200, 322], [200, 376]]) + line([[300, 406], [320, 406]])
    + ns(30, 530, 540, 170, 'overlay') + svc(80, 600, 220, 'Catalog API', { teal: true })
    + path([[170, 296], [42, 296], [42, 626], [76, 626]], { color: C.teal })
    + path([[300, 626], [420, 626], [420, 436]], { color: C.teal }) + label('reads', 434, 506);
}

function multitenancyWide() {
  // G is the row of the API Gateway, halfway between the Rent API (A) and the
  // Catalog API (B). Each database server has the same padding on every side,
  // and 40px to the right and bottom borders of the Namespace.
  const G = 285;
  const A = G - 120;
  const B = G + 120;
  const R = 711; // Cindy's row
  return bluePill(20, G - 50, 340) + tealPill(20, G + 50, 340)
    + path([[360, G - 50], [396, G - 12]], { color: C.blue }) + path([[360, G + 50], [396, G + 12]], { color: C.teal })
    + ns(380, 60, 800, 516, 'shared')
    + svc(400, G - 26, 190, 'API Gateway') + svc(620, A - 26, 190, 'Rent API') + svc(620, B - 26, 190, 'Catalog API')
    + group(840, A - 61, 300, 192, 'PostgreSQL') + db(880, A - 26, 220, 'rentals') + db(880, A + 44, 220, 'rentals__cindy', true)
    + group(840, B - 61, 300, 192, 'MongoDB') + db(880, B - 26, 220, 'catalog') + db(880, B + 44, 220, 'catalog__cindy', true)
    + path([[590, G - 10], [605, G - 10], [605, A], [616, A]]) + path([[590, G + 10], [605, G + 10], [605, B], [616, B]])
    + path([[810, A - 8], [876, A - 8]]) + path([[810, B - 8], [876, B - 8]])
    + path([[810, A + 12], [825, A + 12], [825, A + 70], [876, A + 70]], { color: C.teal }) + label('okteto-divert=cindy', 715, A - 40, { anchor: 'middle' })
    + ns(380, 636, 800, 150, 'overlay') + svc(620, R - 26, 190, 'Catalog API', { teal: true })
    + path([[575, G + 26], [575, R], [616, R]], { color: C.teal })
    + path([[810, R], [825, R], [825, B + 70], [876, B + 70]], { color: C.teal });
}

function multitenancyNarrow() {
  return bluePill(30, 50, 420) + tealPill(190, 135, 420)
    + path([[60, 74], [60, 205], [270, 205], [270, 266]], { color: C.blue }) + path([[580, 173], [580, 205], [370, 205], [370, 266]], { color: C.teal })
    + ns(30, 230, 580, 470, 'shared')
    + svc(190, 270, 260, 'API Gateway') + svc(60, 370, 240, 'Rent API') + svc(340, 370, 240, 'Catalog API')
    + path([[240, 322], [240, 366]]) + path([[400, 322], [400, 366]])
    + group(50, 490, 260, 182, 'PostgreSQL') + db(60, 520, 240, 'rentals') + db(60, 600, 240, 'rentals__cindy', true)
    + group(330, 490, 260, 182, 'MongoDB') + db(340, 520, 240, 'catalog') + db(340, 600, 240, 'catalog__cindy', true)
    + path([[280, 422], [280, 516]]) + path([[560, 422], [560, 516]])
    + path([[300, 396], [320, 396], [320, 626], [304, 626]], { color: C.teal }) + label('okteto-divert=cindy', 265, 462, { anchor: 'end' })
    + ns(30, 740, 580, 140, 'overlay') + svc(340, 784, 240, 'Catalog API', { teal: true })
    + path([[190, 296], [40, 296], [40, 810], [336, 810]], { color: C.teal })
    + path([[460, 784], [460, 656]], { color: C.teal });
}

// ---------------------------------------------------------------------------

const OVERVIEW_ALT = 'Requests to the API gateway of staging go to the shared services. Requests with baggage okteto-divert=cindy reach Cindy\'s rent service, which uses its own MongoDB database and calls the shared catalog service';
const MISSING_ALT = 'The rent service receives the baggage header but calls the catalog service without it, so the request reaches the shared catalog service instead of Cindy\'s';
const PROPAGATION_ALT = 'The rent service forwards the baggage header to the catalog call, and the request reaches Cindy\'s catalog service';
const QUEUES_ALT = 'The API gateway calls the rent API and the catalog API. The rentals subsystem has the rent API, its own Kafka, the rent worker, and a PostgreSQL database used by the API and the worker. The catalog subsystem has the catalog API, its own Kafka, the catalog worker, and a MongoDB database used by the API and the worker';
const QUEUES_OVERLAY_ALT = 'Requests with baggage okteto-divert=cindy go from the API gateway of staging to Cindy\'s rent API. Cindy\'s Overlay Namespace runs the whole rentals subsystem: the rent API, its own Kafka, the rent worker, and PostgreSQL';
const ROUTING_ALT = 'The rent API of staging publishes to the shared broker with the baggage in the message headers. The rent worker of staging skips the messages with okteto-divert=cindy. Cindy\'s rent worker processes only the messages with okteto-divert=cindy';
const SHARED_ALT = 'Cindy\'s catalog API runs in her Overlay Namespace and only reads the MongoDB database of the Shared Namespace';
const CLONE_ALT = 'Cindy\'s rent service uses its own PostgreSQL database, cloned from the PostgreSQL database of the Shared Namespace with a Volume Snapshot';
const MULTITENANCY_ALT = 'The PostgreSQL and MongoDB containers of the Shared Namespace hold a full database for each divert header. The shared rent API writes to rentals__cindy for requests with Cindy\'s divert header, and Cindy\'s catalog API writes to catalog__cindy';

// Draws the arrows over the boxes, so a Namespace drawn later doesn't hide them.
const ARROW = /<g fill="none" stroke="[^"]*" stroke-width="4"[^>]*>.*?<\/g>/gs;
const lift = (draw) => () => {
  const svg = draw();
  return svg.replace(ARROW, '') + (svg.match(ARROW) ?? []).join('');
};
const pair = (name, alt, wide, narrow, [wh, nw, nh]) => [
  { out: `static/img/${name}.webp`, background: 'white', height: wh, alt, svg: lift(wide) },
  { out: `static/img/${name}-mobile.webp`, background: 'white', width: nw, height: nh, alt, svg: lift(narrow) },
];

export default [
  ...pair('divert-overview', OVERVIEW_ALT, () => overviewWide(), () => overviewNarrow(), [630, 600, 850]),
  ...pair('divert-propagation-missing', MISSING_ALT, () => propagationWide(false), () => propagationNarrow(false), [600, 600, 770]),
  ...pair('divert-propagation', PROPAGATION_ALT, () => propagationWide(true), () => propagationNarrow(true), [600, 600, 770]),
  ...pair('divert-queues', QUEUES_ALT, () => queuesWide(false), () => queuesNarrow(false), [730, 640, 994]),
  ...pair('divert-queues-overlay', QUEUES_OVERLAY_ALT, () => queuesWide(true), () => queuesNarrow(true), [1090, 640, 1546]),
  ...pair('divert-queues-routing', ROUTING_ALT, () => routingWide(), () => routingNarrow(), [610, 640, 970]),
  ...pair('divert-data-shared', SHARED_ALT, () => sharedDataWide(), () => sharedDataNarrow(), [560, 600, 730]),
  ...pair('divert-data-clone', CLONE_ALT, () => overviewWide('PostgreSQL', true), () => overviewNarrow('PostgreSQL', true), [630, 600, 850]),
  ...pair('divert-data-multitenancy', MULTITENANCY_ALT, () => multitenancyWide(), () => multitenancyNarrow(), [830, 640, 910]),
];
