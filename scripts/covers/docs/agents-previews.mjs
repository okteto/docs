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
// With a subtitle (the Namespace line of an application environment), the
// services start lower and the box is taller.
function stage(x, y, w, { name, nameColor, badge, title, subtitle, color }) {
  const rows = subtitle ? 138 : 112;
  let out = text(name, x + w / 2, y - 62, 32, { color: nameColor ?? C.text });
  out += box(x, y, w, rows + 218, { color });
  out += badge;
  out += text(title, x + w / 2, y + (subtitle ? 82 : 86), 26);
  if (subtitle) out += text(subtitle, x + w / 2, y + 114, 22, { color: C.dim });
  APP.forEach(([n, label], i) => { out += service(x + 24, y + rows + i * 70, w - 48, n, label); });
  return out;
}
// The three stages when they all run on Kubernetes: an application environment
// for development, a Preview Environment for CI, and production.
const K8S_STAGES = [
  { name: 'Development', nameColor: C.teal, title: 'Application environment', subtitle: 'Okteto Namespace' },
  { name: 'CI', nameColor: C.teal, title: 'Preview Environment', subtitle: 'Okteto Namespace' },
  { name: 'Production', title: 'Your application', subtitle: 'Kubernetes namespace' },
];
const SAME_ALT = 'With Okteto, development, CI, and production all run the frontend, api, and mongoDB services on Kubernetes: an application environment for development, a Preview Environment for CI, and production, each in its own namespace';
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
const LOOP_ALT = 'The autonomous agent loop: the coding agent creates the Namespace of its session, edits the code, deploys it with okteto deploy, and verifies it with okteto test. When something fails, it goes back to edit the code. When everything passes, it opens a pull request and destroys the Namespace';
// The agent loop: six steps of the same size in a row, each with a line icon,
// a verb, and what it acts on under the box. The coding agent starts the row.
const LOOP = [
  ['layers', 'Create', 'Namespace', C.blue],
  ['code', 'Edit', 'code', C.teal],
  ['rocket', 'Deploy', 'okteto deploy', C.teal],
  ['circle-check', 'Verify', 'okteto test', C.teal],
  ['git-pull-request', 'Open', 'pull request', C.teal],
  ['trash-2', 'Destroy', 'Namespace', C.blue],
];
const agent = (cx, cy) => circle(cx, cy, 44, { color: C.purple }) + icon('bot', cx, cy, 46, C.purple) + text('Coding agent', cx, cy + 82, 24);
function step(x, y, w, h, name, label, color, lines = []) {
  let out = box(x, y, w, h, { color, radius: 18 }) + icon(name, x + w / 2, y + 48, 44, color) + text(label, x + w / 2, y + 108, 26);
  lines.forEach((line, i) => { out += text(line, x + w / 2, y + 148 + i * 34, 22, { color: C.dim, mono: true }); });
  return out;
}
const endpoint = (cx, cy, name, label, color) => circle(cx, cy, 52, { color }) + icon(name, cx, cy, 50, color) + text(label, cx, cy + 92, 26);

// The collaborative loop (Coding Agents > Collaborative Workflows): you ask the
// agent for a change, the agent edits the code, File Sync copies it to the
// Development Container that okteto up started, hot reload applies it, and you
// check it on the endpoints of the application.
const COLLAB_ALT = 'The collaborative loop: you ask the coding agent for a change, the agent edits the code, File Sync copies it to the Development Container that okteto up started, hot reload applies it, and you check the change on the endpoints of the application and ask for the next one';

// ---------------------------------------------------------------------------
// The review diagram (Preview Environments): everyone reviews the change in
// the same Preview Environment.
const REVIEW_ALT = 'A Preview Environment, in its Okteto Namespace on Kubernetes, runs the frontend, api, and mongoDB services. Automated tests, coding agents, developers, and QA engineers on one side, and product managers, designers, and sales and marketing on the other, all use it';
const REVIEW_LEFT = () => [['circle-check', 'Automated Tests'], ['bot', 'Coding Agents', C.purple], ['code', 'Developers'], ['search', 'QA Engineers']];
const REVIEW_RIGHT = () => [['user', 'Product Managers'], ['pencil', 'Designers'], ['chart-column', 'Sales & Marketing']];
function previewBox(x, y, w) {
  let out = box(x, y, w, 360, { color: C.blue }) + logo('kubernetes', x + w / 2, y, 80)
    + text('Preview Environment', x + w / 2, y + 84, 30) + text('Okteto Namespace', x + w / 2, y + 118, 22, { color: C.dim });
  APP.forEach(([n, label], i) => { out += service(x + 30, y + 146 + i * 68, w - 60, n, label); });
  return out;
}
const person = (cx, cy, [name, label, color], anchor) => circle(cx, cy, 34, { color: color ?? C.teal }) + icon(name, cx, cy, 34, color ?? C.teal)
  + text(label, anchor === 'end' ? cx - 52 : cx + 52, cy + 9, 24, { anchor });

// ---------------------------------------------------------------------------
// The CI diagrams (Preview Environments): a fat CI job that runs the whole
// application with Docker, and a light CI job that uses Okteto.
const FAT_ALT = 'A fat CI job: the CI runner holds test runtimes, browsers, and credentials, and a Docker daemon runs the frontend, api, and mongoDB services';
const LIGHT_ALT = 'A light CI job with only a Git checkout and the Okteto CLI, connected to a Preview Environment in its Okteto Namespace on Kubernetes, which runs the frontend, api, and mongoDB services and the frontend and e2e tests of Okteto Test';
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
  let out = box(x, y, w, 572, { color: C.blue }) + logo('kubernetes', x + w / 2, y, 80)
    + text('Preview Environment', x + w / 2, y + 82, 30) + text('Okteto Namespace', x + w / 2, y + 114, 22, { color: C.dim });
  APP.forEach(([n, label], i) => { out += service(x + 30, y + 136 + i * 66, w - 60, n, label); });
  out += text('Okteto Test', x + w / 2, y + 368, 26, { color: C.teal });
  ['frontend', 'e2e'].forEach((label, i) => { out += service(x + 30, y + 386 + i * 66, w - 60, 'circle-check', label, { color: C.teal }); });
  return out;
}

export default [
  {
    out: 'static/img/coding-agents-loop.webp',
    background: 'white',
    height: 400,
    alt: LOOP_ALT,
    svg: () => {
      // Square steps, 28px apart, on one row. The loop back to Edit runs over
      // the row, so nothing crosses the labels under the boxes.
      const W = 136;
      const cy = 240;
      const x = (i) => 195 + i * 164;
      let out = agent(100, cy) + arrow(150, cy, x(0) - 6, cy, { color: C.dim });
      LOOP.forEach(([name, verb, what, color], i) => {
        out += box(x(i), cy - 68, W, W, { color, fill: C.row, radius: 18, strokeWidth: 3 })
          + icon(name, x(i) + W / 2, cy - 22, 40, color) + text(verb, x(i) + W / 2, cy + 38, 26)
          + text(what, x(i) + W / 2, cy + 104, 22, { color: C.dim });
        if (i) out += arrow(x(i) - 24, cy, x(i) - 6, cy, { color: C.dim });
      });
      const from = x(3) + W / 2;
      const to = x(1) + W / 2;
      out += curve(`M${from} ${cy - 74} C${from} 70 ${to} 70 ${to} ${cy - 86}`, { color: C.red, dashed: true, strokeWidth: 4 })
        + arrow(to, cy - 88, to, cy - 74, { color: C.red })
        + text('fails: fix the code', (from + to) / 2, 62, 22, { color: C.red })
        + text('passes', x(4) - 14, cy - 86, 22, { color: C.teal });
      return out;
    },
  },
  {
    out: 'static/img/coding-agents-loop-mobile.webp',
    background: 'white',
    width: 600,
    height: 950,
    alt: LOOP_ALT,
    svg: () => {
      // The same steps, stacked: icon, verb, and what it acts on in each row.
      const y = (i) => 230 + i * 118;
      let out = agent(300, 90) + arrow(300, 190, 300, y(0) - 6, { color: C.dim });
      LOOP.forEach(([name, verb, what, color], i) => {
        out += box(150, y(i), 300, 84, { color, fill: C.row, radius: 18, strokeWidth: 3 })
          + icon(name, 196, y(i) + 42, 36, color) + text(verb, 236, y(i) + 38, 26, { anchor: 'start' })
          + text(what, 236, y(i) + 66, 22, { anchor: 'start', color: C.dim });
        if (i) out += arrow(300, y(i) - 30, 300, y(i) - 6, { color: C.dim });
      });
      out += curve(`M456 ${y(3) + 42} C560 ${y(3) + 42} 560 ${y(1) + 42} 470 ${y(1) + 42}`, { color: C.red, dashed: true, strokeWidth: 4 })
        + arrow(468, y(1) + 42, 456, y(1) + 42, { color: C.red })
        + text('fails', 590, (y(1) + y(3)) / 2 + 50, 22, { color: C.red, anchor: 'end' })
        + text('passes', 316, y(4) - 12, 22, { color: C.teal, anchor: 'start' });
      return out;
    },
  },
  {
    out: 'static/img/coding-agents-collaborative.webp',
    background: 'white',
    alt: COLLAB_ALT,
    svg: () => {
      let out = endpoint(70, 290, 'user', 'You', C.teal);
      out += arrow(128, 290, 208, 290, { color: C.purple });
      out += text('ask', 166, 268, 22, { color: C.purple });
      out += step(216, 190, 250, 200, 'bot', 'Agent edits code', C.purple);
      out += arrow(474, 290, 574, 290, { color: C.teal });
      out += text('File Sync', 522, 268, 22, { color: C.teal });
      out += step(582, 160, 330, 260, 'box', 'Development Container', C.teal, ['okteto up', 'hot reload']);
      out += arrow(920, 290, 1040, 290, { color: C.teal });
      out += endpoint(1100, 290, 'globe', 'Endpoints', C.teal);
      out += curve('M1100 400 C1100 530 70 530 70 400', { color: C.purple, dashed: true, strokeWidth: 4 });
      out += arrow(70, 410, 70, 398, { color: C.purple });
      out += text('check the change, ask for the next one', 585, 532, 24, { color: C.purple });
      return out;
    },
  },
  {
    out: 'static/img/coding-agents-collaborative-mobile.webp',
    background: 'white',
    width: 600,
    height: 1040,
    alt: COLLAB_ALT,
    svg: () => {
      let out = endpoint(300, 80, 'user', 'You', C.teal);
      out += arrow(300, 205, 300, 245, { color: C.purple });
      out += text('ask', 320, 232, 22, { color: C.purple, anchor: 'start' });
      out += step(170, 255, 260, 160, 'bot', 'Agent edits code', C.purple);
      out += arrow(300, 425, 300, 500, { color: C.teal });
      out += text('File Sync', 320, 472, 22, { color: C.teal, anchor: 'start' });
      out += step(135, 510, 330, 230, 'box', 'Development Container', C.teal, ['okteto up', 'hot reload']);
      out += arrow(300, 750, 300, 800, { color: C.teal });
      out += endpoint(300, 870, 'globe', 'Endpoints', C.teal);
      out += curve('M352 870 C580 870 580 80 364 80', { color: C.purple, dashed: true, strokeWidth: 4 });
      out += arrow(374, 80, 356, 80, { color: C.purple });
      out += text('ask again', 470, 52, 22, { color: C.purple, anchor: 'start' });
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
    alt: SAME_ALT,
    svg: () => K8S_STAGES.map((st, n) => stage(30 + n * 410, 190, 320, { ...st, badge: logo('kubernetes', 190 + n * 410, 190, 80), color: C.blue })).join('')
      + link(355, 435, 400, true) + link(765, 845, 400, true),
  },
  {
    out: 'static/img/previews-same-platform-mobile.webp',
    background: 'white',
    width: 600,
    height: 1600,
    alt: SAME_ALT,
    svg: () => K8S_STAGES.map((st, n) => stage(120, 110 + n * 560, 360, { ...st, badge: logo('kubernetes', 300, 110 + n * 560, 80), color: C.blue })).join('')
      + vlink(300, 478, 564, true) + vlink(300, 1038, 1124, true),
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
