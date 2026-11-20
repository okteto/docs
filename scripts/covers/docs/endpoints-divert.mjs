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
const bluePill = (x, cy, w) => box(x, cy - 24, w, 48, { color: C.blue, radius: 24, strokeWidth: 3 })
  + text(URL, x + w / 2, cy + 6, 18, { color: C.blue });
const tealPill = (x, cy, w) => box(x, cy - 38, w, 76, { color: C.teal, radius: 26, strokeWidth: 3 })
  + text(URL, x + w / 2, cy - 6, 18, { color: C.teal }) + text('baggage: okteto-divert=cindy', x + w / 2, cy + 26, 22, { color: C.teal });

// A Namespace: Staging (the Shared Namespace, with the Kubernetes mark) or
// Cindy (her Overlay Namespace, with a user icon), titled on its top edge.
function ns(x, y, w, h, kind) {
  const label = kind === 'shared' ? 'Staging' : 'Cindy';
  let out = box(x, y, w, h, { color: C.blue, radius: 20 });
  out += `<rect x="${x + 22}" y="${y - 5}" width="${label.length * 15 + 72}" height="10" fill="${C.background}"/>`;
  out += kind === 'shared' ? logo('kubernetes', x + 50, y, 50)
    : circle(x + 50, y, 22, { color: C.teal }) + icon('user', x + 50, y, 24, C.teal);
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
  let out = bluePill(30, 200, 340) + tealPill(30, 290, 340)
    + ns(410, 50, 770, 300, 'shared')
    + svc(440, 205, 220, 'API Gateway')
    + svc(730, 100, 180, 'Rent') + db(940, 100, 170, dbName)
    + svc(730, 250, 180, 'Catalog') + db(940, 250, 170, 'MongoDB')
    + line([[910, 126], [940, 126]]) + line([[910, 276], [940, 276]])
    + path([[820, 152], [820, 246]])
    + path([[660, 222], [726, 136]]) + path([[660, 242], [726, 266]])
    + path([[370, 200], [436, 222]], { color: C.blue }) + path([[370, 290], [436, 246]], { color: C.teal })
    + ns(410, 410, 770, 190, 'overlay')
    + svc(730, 480, 180, 'Rent', { teal: true }) + db(940, 480, 170, dbName, true)
    + line([[910, 506], [940, 506]], C.teal)
    + path([[620, 257], [620, 506], [726, 506]], { color: C.teal })
    + path([[790, 480], [790, 306]], { color: C.teal });
  if (snapshot) {
    out += path([[1110, 126], [1150, 126], [1150, 506], [1114, 506]], { color: C.teal, dashed: true })
      + label('Volume Snapshot', 1136, 386, { anchor: 'end' });
  }
  return out;
}

function overviewNarrow(dbName = 'MongoDB', snapshot = false) {
  let out = bluePill(30, 50, 420) + tealPill(150, 135, 420)
    + path([[90, 74], [90, 200], [260, 200], [260, 266]], { color: C.blue }) + path([[400, 173], [400, 266]], { color: C.teal })
    + ns(30, 230, 540, 370, 'shared')
    + svc(170, 270, 260, 'API Gateway')
    + svc(80, 380, 220, 'Rent') + db(320, 380, 200, dbName)
    + svc(80, 520, 220, 'Catalog') + db(320, 520, 200, 'MongoDB')
    + line([[300, 406], [320, 406]]) + line([[300, 546], [320, 546]])
    + path([[200, 322], [200, 376]]) + path([[430, 296], [540, 296], [540, 476], [240, 476], [240, 516]]) + path([[120, 432], [120, 516]])
    + ns(30, 660, 540, 160, 'overlay')
    + svc(80, 730, 220, 'Rent', { teal: true }) + db(320, 730, 200, dbName, true)
    + line([[300, 756], [320, 756]], C.teal)
    + path([[170, 296], [48, 296], [48, 756], [76, 756]], { color: C.teal })
    + path([[260, 730], [260, 576]], { color: C.teal });
  if (snapshot) {
    out += path([[520, 406], [558, 406], [558, 756], [524, 756]], { color: C.teal, dashed: true })
      + label('Volume Snapshot', 536, 640, { anchor: 'end' });
  }
  return out;
}

// ---------------------------------------------------------------------------
// Header Propagation: the rent service forwards the baggage header, or not.

function propagationWide(propagates) {
  let out = tealPill(30, 200, 340) + path([[370, 200], [436, 200]], { color: C.teal })
    + ns(410, 80, 770, 230, 'shared')
    + svc(440, 174, 220, 'API Gateway') + svc(740, 174, 170, 'Rent') + svc(980, 174, 170, 'Catalog')
    + path([[660, 200], [736, 200]], { color: C.teal }) + label('baggage', 698, 160, { anchor: 'middle' })
    + ns(410, 380, 770, 170, 'overlay') + svc(980, 450, 170, 'Catalog', { teal: true });
  if (propagates) {
    out += path([[825, 226], [825, 476], [976, 476]], { color: C.teal }) + label('baggage', 840, 352);
  } else {
    out += path([[910, 200], [976, 200]]) + label('no baggage', 945, 160, { color: C.dim, anchor: 'middle' });
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

// A subsystem in a row: API, Kafka, worker, and the database they share.
function subsystemWide(y, api, worker, dbName, teal = false, title = 'Rentals subsystem') {
  const c = teal ? C.teal : C.dim;
  return group(330, y, 810, 200, title, { color: teal ? C.teal : C.dim })
    + svc(350, y + 40, 210, api, { teal }) + db(650, y + 40, 130, 'Kafka', teal) + svc(870, y + 40, 250, worker, { teal })
    + path([[560, y + 66], [646, y + 66]], { color: c }) + path([[780, y + 66], [866, y + 66]], { color: c })
    + db(615, y + 130, 200, dbName, teal)
    + line([[455, y + 92], [455, y + 156], [615, y + 156]], c) + line([[995, y + 92], [995, y + 156], [815, y + 156]], c);
}

function queuesWide(overlay) {
  let out = bluePill(30, 60, 360) + path([[225, 84], [225, 356]], { color: C.blue })
    + ns(30, 130, 1150, 490, 'shared')
    + svc(60, 360, 210, 'API Gateway')
    + subsystemWide(170, 'Rent API', 'Rent Worker', 'PostgreSQL')
    + subsystemWide(400, 'Catalog API', 'Catalog Worker', 'MongoDB', false, 'Catalog subsystem')
    + path([[270, 376], [300, 376], [300, 236], [346, 236]]) + path([[270, 396], [300, 396], [300, 466], [346, 466]]);
  if (overlay) {
    out += tealPill(420, 60, 360) + path([[440, 98], [440, 112], [260, 112], [260, 356]], { color: C.teal })
      + ns(30, 680, 1150, 250, 'overlay')
      + subsystemWide(720, 'Rent API', 'Rent Worker', 'PostgreSQL', true)
      + path([[210, 412], [210, 786], [346, 786]], { color: C.teal });
  }
  return out;
}

// A subsystem in a column: API, Kafka, worker, and the database on the right.
function subsystemNarrow(y, api, worker, dbName, teal = false, title = 'Rentals subsystem') {
  const c = teal ? C.teal : C.dim;
  return group(50, y, 540, 270, title, { right: true, color: teal ? C.teal : C.dim })
    + svc(70, y + 30, 240, api, { teal }) + db(70, y + 110, 240, 'Kafka', teal) + svc(70, y + 190, 240, worker, { teal })
    + path([[150, y + 82], [150, y + 106]], { color: c }) + path([[150, y + 162], [150, y + 186]], { color: c })
    + db(380, y + 110, 190, dbName, teal)
    + line([[310, y + 44], [475, y + 44], [475, y + 110]], c) + line([[310, y + 216], [475, y + 216], [475, y + 162]], c);
}

function queuesNarrow(overlay) {
  const top = overlay ? 100 : 0;
  let out = bluePill(30, 50, 420);
  if (overlay) {
    out += tealPill(190, 135, 420) + path([[90, 74], [90, 200], [240, 200], [240, 266]], { color: C.blue })
      + path([[420, 173], [420, 266]], { color: C.teal });
  } else {
    out += path([[300, 74], [300, 166]], { color: C.blue });
  }
  out += ns(30, 130 + top, 580, 720, 'shared')
    + svc(190, 170 + top, 260, 'API Gateway')
    + subsystemNarrow(260 + top, 'Rent API', 'Rent Worker', 'PostgreSQL')
    + subsystemNarrow(560 + top, 'Catalog API', 'Catalog Worker', 'MongoDB', false, 'Catalog subsystem')
    + path([[230, 222 + top], [230, 286 + top]]) + path([[190, 196 + top], [40, 196 + top], [40, 616 + top], [66, 616 + top]]);
  if (overlay) {
    out += ns(30, 920 + top, 580, 330, 'overlay')
      + subsystemNarrow(960 + top, 'Rent API', 'Rent Worker', 'PostgreSQL', true)
      + path([[450, 196 + top], [600, 196 + top], [600, 1030 + top], [314, 1030 + top]], { color: C.teal });
  }
  return out;
}

// Message-level routing: both rent workers share the broker and filter by the header.
function routingWide() {
  return bluePill(30, 60, 360) + tealPill(420, 60, 360)
    + path([[225, 84], [225, 226]], { color: C.blue }) + path([[440, 98], [440, 112], [260, 112], [260, 226]], { color: C.teal })
    + ns(30, 130, 1150, 240, 'shared')
    + svc(60, 230, 210, 'API Gateway') + svc(350, 230, 170, 'Rent API') + db(600, 230, 140, 'Broker') + svc(900, 230, 210, 'Rent Worker')
    + path([[270, 256], [346, 256]]) + path([[520, 256], [596, 256]]) + path([[740, 256], [896, 256]])
    + label('baggage in message headers', 700, 330, { color: C.dim, anchor: 'end' })
    + label('skips okteto-divert=cindy', 1005, 330, { color: C.dim, anchor: 'middle' })
    + ns(30, 430, 1150, 180, 'overlay')
    + svc(900, 480, 210, 'Rent Worker', { teal: true }) + label('only okteto-divert=cindy', 1005, 570, { anchor: 'middle' })
    + path([[720, 282], [720, 506], [896, 506]], { color: C.teal });
}

function routingNarrow() {
  return bluePill(30, 50, 420) + tealPill(190, 135, 420)
    + path([[90, 74], [90, 200], [240, 200], [240, 266]], { color: C.blue }) + path([[420, 173], [420, 266]], { color: C.teal })
    + ns(30, 230, 580, 470, 'shared')
    + svc(190, 270, 260, 'API Gateway') + svc(190, 370, 260, 'Rent API') + db(190, 470, 260, 'Broker') + svc(190, 590, 260, 'Rent Worker')
    + path([[220, 322], [220, 366]]) + path([[220, 422], [220, 466]]) + path([[220, 522], [220, 586]])
    + label('baggage in message headers', 545, 562, { color: C.dim, anchor: 'end' })
    + label('skips okteto-divert=cindy', 320, 674, { color: C.dim, anchor: 'middle' })
    + ns(30, 760, 580, 180, 'overlay')
    + svc(190, 810, 260, 'Rent Worker', { teal: true }) + label('only okteto-divert=cindy', 320, 910, { anchor: 'middle' })
    + path([[450, 496], [560, 496], [560, 836], [454, 836]], { color: C.teal });
}

// ---------------------------------------------------------------------------
// Data Cloning.

function sharedDataWide() {
  return bluePill(30, 200, 340) + tealPill(30, 290, 340)
    + ns(410, 80, 770, 250, 'shared')
    + svc(440, 200, 220, 'API Gateway') + svc(730, 200, 220, 'Catalog API') + db(980, 200, 170, 'MongoDB')
    + path([[660, 226], [726, 226]]) + line([[950, 226], [980, 226]])
    + path([[370, 200], [436, 216]], { color: C.blue }) + path([[370, 290], [436, 238]], { color: C.teal })
    + ns(410, 410, 770, 190, 'overlay') + svc(730, 490, 220, 'Catalog API', { teal: true })
    + path([[600, 252], [600, 516], [726, 516]], { color: C.teal })
    + path([[950, 516], [1065, 516], [1065, 256]], { color: C.teal }) + label('reads', 1080, 380);
}

function sharedDataNarrow() {
  return bluePill(30, 50, 420) + tealPill(150, 135, 420)
    + path([[90, 74], [90, 200], [260, 200], [260, 266]], { color: C.blue }) + path([[400, 173], [400, 266]], { color: C.teal })
    + ns(30, 230, 540, 240, 'shared')
    + svc(170, 270, 260, 'API Gateway') + svc(80, 380, 220, 'Catalog API') + db(320, 380, 200, 'MongoDB')
    + path([[200, 322], [200, 376]]) + line([[300, 406], [320, 406]])
    + ns(30, 530, 540, 170, 'overlay') + svc(80, 610, 220, 'Catalog API', { teal: true })
    + path([[170, 296], [48, 296], [48, 636], [76, 636]], { color: C.teal })
    + path([[300, 636], [420, 636], [420, 436]], { color: C.teal }) + label('reads', 434, 506);
}

function multitenancyWide() {
  return bluePill(20, 250, 340) + tealPill(20, 340, 340)
    + path([[360, 250], [396, 258]], { color: C.blue }) + path([[360, 340], [396, 280]], { color: C.teal })
    + ns(380, 40, 800, 490, 'shared')
    + svc(400, 240, 210, 'API Gateway') + svc(660, 120, 200, 'Rent API') + svc(660, 360, 200, 'Catalog API')
    + group(895, 90, 270, 180, 'PostgreSQL') + db(910, 120, 240, 'rentals') + db(910, 190, 240, 'rentals__cindy', true)
    + group(895, 330, 270, 180, 'MongoDB') + db(910, 360, 240, 'catalog') + db(910, 430, 240, 'catalog__cindy', true)
    + path([[610, 256], [630, 256], [630, 146], [656, 146]]) + path([[610, 276], [630, 276], [630, 386], [656, 386]])
    + path([[860, 136], [906, 136]]) + path([[860, 386], [906, 386]])
    + path([[860, 160], [885, 160], [885, 216], [906, 216]], { color: C.teal }) + label('okteto-divert=cindy', 760, 208, { anchor: 'middle' })
    + ns(380, 590, 800, 170, 'overlay') + svc(660, 670, 200, 'Catalog API', { teal: true })
    + path([[580, 292], [580, 696], [656, 696]], { color: C.teal })
    + path([[860, 696], [885, 696], [885, 456], [906, 456]], { color: C.teal });
}

function multitenancyNarrow() {
  return bluePill(30, 50, 420) + tealPill(190, 135, 420)
    + path([[90, 74], [90, 200], [260, 200], [260, 266]], { color: C.blue }) + path([[420, 173], [420, 266]], { color: C.teal })
    + ns(30, 230, 580, 470, 'shared')
    + svc(190, 270, 260, 'API Gateway') + svc(60, 370, 240, 'Rent API') + svc(340, 370, 250, 'Catalog API')
    + path([[240, 322], [240, 366]]) + path([[400, 322], [400, 366]])
    + group(50, 490, 260, 182, 'PostgreSQL') + db(60, 520, 240, 'rentals') + db(60, 600, 240, 'rentals__cindy', true)
    + group(330, 490, 270, 182, 'MongoDB') + db(345, 520, 240, 'catalog') + db(345, 600, 240, 'catalog__cindy', true)
    + path([[280, 422], [280, 516]]) + path([[560, 422], [560, 516]])
    + path([[300, 396], [320, 396], [320, 626], [304, 626]], { color: C.teal }) + label('okteto-divert=cindy', 265, 462, { anchor: 'end' })
    + ns(30, 740, 580, 140, 'overlay') + svc(340, 790, 250, 'Catalog API', { teal: true })
    + path([[190, 296], [40, 296], [40, 816], [336, 816]], { color: C.teal })
    + path([[465, 790], [465, 656]], { color: C.teal });
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
  ...pair('divert-queues', QUEUES_ALT, () => queuesWide(false), () => queuesNarrow(false), [650, 640, 880]),
  ...pair('divert-queues-overlay', QUEUES_OVERLAY_ALT, () => queuesWide(true), () => queuesNarrow(true), [960, 640, 1380]),
  ...pair('divert-queues-routing', ROUTING_ALT, () => routingWide(), () => routingNarrow(), [640, 640, 970]),
  ...pair('divert-data-shared', SHARED_ALT, () => sharedDataWide(), () => sharedDataNarrow(), [630, 600, 730]),
  ...pair('divert-data-clone', CLONE_ALT, () => overviewWide('PostgreSQL', true), () => overviewNarrow('PostgreSQL', true), [630, 600, 850]),
  ...pair('divert-data-multitenancy', MULTITENANCY_ALT, () => multitenancyWide(), () => multitenancyNarrow(), [790, 640, 910]),
];
