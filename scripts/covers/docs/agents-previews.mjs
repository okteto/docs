// Diagrams of the agents-previews docs pages, drawn with the light theme of style.mjs.
// Each entry has the same fields as the entries of covers.mjs.

import { C, text, icon, logo, box, circle, arrow, curve } from '../style.mjs';

// ---------------------------------------------------------------------------
// Shared shapes

// A service row: a line icon and the name, in a light gray box.
const service = (x, y, w, name, label, { color } = {}) => box(x, y, w, 58, { color: color ?? C.dim, fill: color ? '#e2f5f3' : C.row, radius: 12, strokeWidth: 2 })
  + icon(name, x + 38, y + 29, 30, color ?? C.blue) + text(label, x + 72, y + 38, 26, { anchor: 'start' });
const APP = [['box', 'frontend'], ['box', 'api'], ['database', 'mongoDB']];

// A stage of the delivery pipeline (development, CI, production): its name
// above, a box with a badge on the top edge, a title, and the services.
function stage(x, y, w, { name, nameColor, badge, title, color }) {
  let out = text(name, x + w / 2, y - 62, 32, { color: nameColor ?? C.text });
  out += box(x, y, w, 330, { color });
  out += badge;
  out += text(title, x + w / 2, y + 86, 26);
  APP.forEach(([n, label], i) => { out += service(x + 24, y + 112 + i * 70, w - 48, n, label); });
  return out;
}
const iconBadge = (cx, cy, name) => circle(cx, cy, 40, { color: C.dim }) + icon(name, cx, cy, 40, C.text);
// An arrow between two stages, with a sign on it: ≠ in red, = in teal.
function link(x1, x2, cy, equal) {
  const color = equal ? C.teal : C.red;
  const cx = (x1 + x2) / 2 - 6;
  return arrow(x1, cy, x2, cy, { color }) + `<circle cx="${cx}" cy="${cy}" r="24" fill="${color}"/>`
    + text(equal ? '=' : '≠', cx, cy + 12, 36, { color: '#ffffff' });
}

// The same arrow and sign, vertical, for the stacked versions.
function vlink(cx, y1, y2, equal) {
  const color = equal ? C.teal : C.red;
  const cy = (y1 + y2) / 2 - 6;
  return arrow(cx, y1, cx, y2, { color }) + `<circle cx="${cx}" cy="${cy}" r="24" fill="${color}"/>`
    + text(equal ? '=' : '≠', cx, cy + 12, 36, { color: '#ffffff' });
}

// ---------------------------------------------------------------------------
// The autonomous agent loop (Coding Agents > Autonomous Workflows): the agent
// takes a task, edits the code, deploys it, verifies it in its application
// environment, fixes what fails, and opens a pull request when it passes.
const LOOP_ALT = 'The autonomous agent loop: the agent takes a task, edits the code, deploys it with okteto deploy, verifies it with okteto test, the endpoints, and the logs, goes back to edit the code when something fails, and opens a pull request when everything passes';
function step(x, y, w, h, name, label, color, lines = []) {
  let out = box(x, y, w, h, { color, radius: 18 }) + icon(name, x + w / 2, y + 48, 44, color) + text(label, x + w / 2, y + 108, 26);
  lines.forEach((line, i) => { out += text(line, x + w / 2, y + 148 + i * 34, 22, { color: C.dim, mono: true }); });
  return out;
}
const endpoint = (cx, cy, name, label, color) => circle(cx, cy, 52, { color }) + icon(name, cx, cy, 50, color) + text(label, cx, cy + 92, 26);

// ---------------------------------------------------------------------------
// The review diagram (Preview Environments): everyone reviews the change in
// the same Preview Environment.
const REVIEW_ALT = 'A Preview Environment on Kubernetes runs the frontend, api, and mongoDB services. Automated tests, AI agents, developers, and QA engineers on one side, and product managers, designers, and sales and marketing on the other, all use it';
const REVIEW_LEFT = () => [['circle-check', 'Automated Tests'], ['bot', 'AI Agents', C.purple], ['code', 'Developers'], ['search', 'QA Engineers']];
const REVIEW_RIGHT = () => [['user', 'Product Managers'], ['pencil', 'Designers'], ['chart-column', 'Sales & Marketing']];
function previewBox(x, y, w) {
  let out = box(x, y, w, 360, { color: C.blue }) + logo('okteto', x + w / 2, y, 80)
    + text('Preview Environment', x + w / 2, y + 84, 30) + text('Kubernetes', x + w / 2, y + 118, 22, { color: C.dim });
  APP.forEach(([n, label], i) => { out += service(x + 30, y + 146 + i * 68, w - 60, n, label); });
  return out;
}
const person = (cx, cy, [name, label, color], anchor) => circle(cx, cy, 34, { color: color ?? C.teal }) + icon(name, cx, cy, 34, color ?? C.teal)
  + text(label, anchor === 'end' ? cx - 52 : cx + 52, cy + 9, 24, { anchor });

// ---------------------------------------------------------------------------
// The CI diagrams (Preview Environments): a fat CI job that runs the whole
// application with Docker, and a light CI job that uses Okteto.
const FAT_ALT = 'A fat CI job: the CI runner holds test runtimes, browsers, and credentials, and a Docker daemon runs the frontend, api, and mongoDB services';
const LIGHT_ALT = 'A light CI job with only a Git checkout and the Okteto CLI, connected to Kubernetes, where Okteto runs the frontend, api, and mongoDB services and the frontend and e2e tests of Okteto Test';
function column(x, y, w, name, title, rows, { plain = false } = {}) {
  let out = box(x, y, w, 410, { color: C.dim, radius: 20 }) + circle(x + w / 2, y, 36, { color: C.dim }) + icon(name, x + w / 2, y, 36, C.text)
    + text(title, x + w / 2, y + 78, 26, { color: C.dim });
  rows.forEach(([n, label], i) => {
    const ry = y + 104 + i * 70;
    out += plain
      ? box(x + 24, ry, w - 48, 58, { color: C.text, radius: 12, strokeWidth: 2 }) + text(label, x + w / 2, ry + 38, 26)
      : service(x + 24, ry, w - 48, n, label);
  });
  const ry = y + 104 + rows.length * 70;
  return out + box(x + 24, ry, w - 48, 58, { color: C.dim, dashed: true, radius: 12, strokeWidth: 2 }) + text('...', x + w / 2, ry + 36, 30, { color: C.dim });
}
function fatJob(x, y, w, stacked = false) {
  const h = stacked ? 1060 : 560;
  let out = box(x, y, w, h, { color: C.red }) + circle(x + w / 2, y, 40, { color: C.red }) + icon('server', x + w / 2, y, 40, C.red)
    + text('Fat CI job', x + w / 2, y + 86, 32, { color: C.red });
  const cw = stacked ? w - 80 : (w - 120) / 2;
  const runner = [[null, 'Test runtimes'], [null, 'Browsers'], [null, 'Credentials']];
  if (stacked) {
    out += column(x + 40, y + 160, cw, 'terminal', 'CI runner', runner, { plain: true }) + column(x + 40, y + 620, cw, 'box', 'Docker daemon', APP);
  } else {
    out += column(x + 40, y + 140, cw, 'terminal', 'CI runner', runner, { plain: true }) + column(x + 80 + cw, y + 140, cw, 'box', 'Docker daemon', APP);
  }
  return out;
}
function lightJob(x, y, w) {
  let out = box(x, y, w, 270, { color: C.teal }) + circle(x + w / 2, y, 36, { color: C.teal }) + icon('terminal', x + w / 2, y, 36, C.teal)
    + text('Light CI job', x + w / 2, y + 80, 30, { color: C.teal });
  ['Git checkout', 'Okteto CLI'].forEach((label, i) => {
    out += box(x + 28, y + 110 + i * 72, w - 56, 58, { color: C.text, radius: 12, strokeWidth: 2 }) + text(label, x + w / 2, y + 148 + i * 72, 26);
  });
  return out;
}
function oktetoCluster(x, y, w) {
  let out = box(x, y, w, 560, { color: C.blue }) + logo('okteto', x + w / 2, y, 80) + text('Kubernetes', x + w / 2, y + 84, 30);
  APP.forEach(([n, label], i) => { out += service(x + 30, y + 112 + i * 68, w - 60, n, label); });
  out += text('Okteto Test', x + w / 2, y + 352, 26, { color: C.teal });
  ['frontend', 'e2e'].forEach((label, i) => { out += service(x + 30, y + 374 + i * 68, w - 60, 'circle-check', label, { color: C.teal }); });
  return out;
}

export default [
  {
    out: 'static/img/coding-agents-loop.webp',
    background: 'white',
    alt: LOOP_ALT,
    svg: () => {
      let out = endpoint(80, 290, 'ticket', 'Task', C.amber);
      out += arrow(140, 290, 190, 290, { color: C.purple });
      out += step(200, 190, 210, 200, 'code', 'Edit code', C.purple);
      out += arrow(420, 290, 465, 290, { color: C.teal });
      out += step(475, 190, 210, 200, 'rocket', 'Deploy', C.teal, ['okteto deploy']);
      out += arrow(695, 290, 740, 290, { color: C.teal });
      out += step(750, 160, 210, 260, 'circle-check', 'Verify', C.teal, ['okteto test', 'endpoints', 'logs']);
      out += curve('M855 420 C855 510 305 510 305 400', { color: C.red, dashed: true, strokeWidth: 4 });
      out += arrow(305, 410, 305, 398, { color: C.red });
      out += text('fails: fix the code', 580, 512, 24, { color: C.red });
      out += arrow(970, 290, 1040, 290, { color: C.teal });
      out += text('passes', 1005, 270, 22, { color: C.teal });
      out += endpoint(1100, 290, 'git-pull-request', 'Pull request', C.teal);
      return out;
    },
  },
  {
    out: 'static/img/coding-agents-loop-mobile.webp',
    background: 'white',
    width: 600,
    height: 1260,
    alt: LOOP_ALT,
    svg: () => {
      let out = endpoint(300, 80, 'ticket', 'Task', C.amber);
      out += arrow(300, 205, 300, 245, { color: C.purple });
      out += step(170, 255, 260, 160, 'code', 'Edit code', C.purple);
      out += arrow(300, 425, 300, 465, { color: C.teal });
      out += step(170, 475, 260, 200, 'rocket', 'Deploy', C.teal, ['okteto deploy']);
      out += arrow(300, 685, 300, 725, { color: C.teal });
      out += step(170, 735, 260, 260, 'circle-check', 'Verify', C.teal, ['okteto test', 'endpoints', 'logs']);
      out += curve('M430 865 C560 865 560 335 440 335', { color: C.red, dashed: true, strokeWidth: 4 });
      out += arrow(450, 335, 438, 335, { color: C.red });
      out += text('fails', 548, 610, 24, { color: C.red });
      out += arrow(300, 1005, 300, 1060, { color: C.teal });
      out += text('passes', 320, 1040, 22, { color: C.teal, anchor: 'start' });
      out += endpoint(300, 1120, 'git-pull-request', 'Pull request', C.teal);
      return out;
    },
  },
  {
    out: 'static/img/previews-drift.webp',
    background: 'white',
    alt: 'Development, CI, and production run the frontend, api, and mongoDB services on different platforms: a local environment, a virtual machine, and Kubernetes',
    svg: () => stage(40, 200, 300, { name: 'Development', badge: iconBadge(190, 200, 'laptop'), title: 'Local environment', color: C.dim })
      + link(345, 445, 400, false)
      + stage(450, 200, 300, { name: 'CI', badge: iconBadge(600, 200, 'server'), title: 'Virtual machine', color: C.dim })
      + link(755, 855, 400, false)
      + stage(860, 200, 300, { name: 'Production', badge: logo('kubernetes', 1010, 200, 80), title: 'Kubernetes', color: C.blue }),
  },
  {
    out: 'static/img/previews-drift-mobile.webp',
    background: 'white',
    width: 600,
    height: 1500,
    alt: 'Development, CI, and production run the frontend, api, and mongoDB services on different platforms: a local environment, a virtual machine, and Kubernetes',
    svg: () => stage(120, 110, 360, { name: 'Development', badge: iconBadge(300, 110, 'laptop'), title: 'Local environment', color: C.dim })
      + vlink(300, 452, 534, false)
      + stage(120, 640, 360, { name: 'CI', badge: iconBadge(300, 640, 'server'), title: 'Virtual machine', color: C.dim })
      + vlink(300, 982, 1056, false)
      + stage(120, 1160, 360, { name: 'Production', badge: logo('kubernetes', 300, 1160, 80), title: 'Kubernetes', color: C.blue }),
  },
  {
    out: 'static/img/previews-same-platform.webp',
    background: 'white',
    alt: 'With Okteto, development, CI, and production all run the frontend, api, and mongoDB services on Kubernetes',
    svg: () => stage(40, 200, 300, { name: 'Development', nameColor: C.teal, badge: logo('okteto', 190, 200, 80), title: 'Kubernetes', color: C.blue })
      + link(345, 445, 400, true)
      + stage(450, 200, 300, { name: 'CI', nameColor: C.teal, badge: logo('okteto', 600, 200, 80), title: 'Kubernetes', color: C.blue })
      + link(755, 855, 400, true)
      + stage(860, 200, 300, { name: 'Production', badge: logo('kubernetes', 1010, 200, 80), title: 'Kubernetes', color: C.blue }),
  },
  {
    out: 'static/img/previews-same-platform-mobile.webp',
    background: 'white',
    width: 600,
    height: 1500,
    alt: 'With Okteto, development, CI, and production all run the frontend, api, and mongoDB services on Kubernetes',
    svg: () => stage(120, 110, 360, { name: 'Development', nameColor: C.teal, badge: logo('okteto', 300, 110, 80), title: 'Kubernetes', color: C.blue })
      + vlink(300, 452, 534, true)
      + stage(120, 640, 360, { name: 'CI', nameColor: C.teal, badge: logo('okteto', 300, 640, 80), title: 'Kubernetes', color: C.blue })
      + vlink(300, 982, 1056, true)
      + stage(120, 1160, 360, { name: 'Production', badge: logo('kubernetes', 300, 1160, 80), title: 'Kubernetes', color: C.blue }),
  },
  {
    out: 'static/img/previews-review.webp',
    background: 'white',
    alt: REVIEW_ALT,
    svg: () => {
      let out = previewBox(430, 150, 340);
      REVIEW_LEFT().forEach((p, i) => {
        const cy = 190 + i * 100;
        out += person(330, cy, p, 'end') + arrow(370, cy, 422, 300 + (i - 1.5) * 50, { color: p[2] ?? C.teal });
      });
      REVIEW_RIGHT().forEach((p, i) => {
        const cy = 240 + i * 100;
        out += person(870, cy, p, 'start') + arrow(830, cy, 778, 330 + (i - 1) * 50, { color: C.teal });
      });
      return out;
    },
  },
  {
    out: 'static/img/previews-review-mobile.webp',
    background: 'white',
    width: 600,
    height: 1240,
    alt: REVIEW_ALT,
    svg: () => {
      let out = '';
      REVIEW_LEFT().forEach((p, i) => { out += person(150 + (i % 2) * 0, 60 + i * 84, p, 'start'); });
      out += arrow(300, 400, 300, 450, { color: C.teal });
      out += previewBox(110, 480, 380);
      out += arrow(300, 900, 300, 850, { color: C.teal });
      REVIEW_RIGHT().forEach((p, i) => { out += person(150, 960 + i * 84, p, 'start'); });
      return out;
    },
  },
  {
    out: 'static/img/previews-ci-docker.webp',
    background: 'white',
    alt: FAT_ALT,
    svg: () => fatJob(200, 50, 800),
  },
  {
    out: 'static/img/previews-ci-docker-mobile.webp',
    background: 'white',
    width: 600,
    height: 1140,
    alt: FAT_ALT,
    svg: () => fatJob(40, 50, 520, true),
  },
  {
    out: 'static/img/previews-ci-okteto.webp',
    background: 'white',
    alt: LIGHT_ALT,
    svg: () => lightJob(130, 200, 360) + arrow(510, 335, 650, 335, { color: C.teal, both: true }) + oktetoCluster(670, 45, 400),
  },
  {
    out: 'static/img/previews-ci-okteto-mobile.webp',
    background: 'white',
    width: 600,
    height: 1060,
    alt: LIGHT_ALT,
    svg: () => lightJob(120, 50, 360) + arrow(300, 330, 300, 430, { color: C.teal, both: true }) + oktetoCluster(100, 470, 400),
  },
];
