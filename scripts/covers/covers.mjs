// The covers, and the diagrams inside the posts, drawn in the style of
// style.mjs. Each entry has:
//   out: where the JPEG goes (a cover is the post's or the tutorial's
//        img/cover.jpg; a diagram is another file of its img/ folder)
//   background: 'white' for a diagram inside an article. A cover takes
//        none: comparisons get `stars`, and the other posts one of the five
//        backgrounds of ROTATION, by date order (see below).
//   alt: what the image shows (the post's `image_alt`)
//   width, height: the canvas, when it isn't 1200x630 (for example, the
//        stacked version of a diagram for phones, shown with `mobileSrc`)
//   svg: the subject, built with the helpers of style.mjs. For a diagram
//        inside an article it is a function, drawn with the light theme.
//
// A cover shows what the article is about, never its title: a simple
// schematic, or big logos when the article is about an integration.

import fs from 'node:fs';
import path from 'node:path';

import {
  C, root, text, icon, logo, box, circle, arrow, curve, scaled, hub, row, mark, word, tile, group, item,
  badge, smallMark, terminal, bars,
} from './style.mjs';
import docsApplicationEnvironments from './docs/application-environments.mjs';
import docsEndpointsDivert from './docs/endpoints-divert.mjs';
import docsAgentsPreviews from './docs/agents-previews.mjs';
import docsDevelopmentContainers from './docs/development-containers.mjs';
import docsUserSettings from './docs/user-settings.mjs';

const post = (dir) => `blog/posts/${dir}/img/cover.jpg`;
const tutorial = (dir) => `tutorials/posts/${dir}/img/cover.jpg`;
const figure = (dir, name) => `blog/posts/${dir}/img/${name}.webp`;
const LB = '2023-02-28-kubernetes-load-balancer-service';
const pods = (n = 3, color = C.teal) => Array.from({ length: n }, () => item('box', { color }));
const kubernetes = (options) => mark('kubernetes', options);
const okteto = (options) => mark('okteto', options);
const versus = (name) => row([mark('okteto-wordmark', { size: 360 }), 'vs', word(name, { size: 84 })]);

// The backgrounds of the covers of the blog posts and the tutorials. A
// comparison of Okteto with another vendor (an "okteto-vs" or "okteto-versus"
// post) always takes `stars`, and no other post does. The other posts take the
// five backgrounds of ROTATION one after another, sorted by date (their folder
// name). The tutorials rotate the same way, on their own.
const COMPARISON = 'stars';
const ROTATION = ['dots', 'weave', 'grid', 'sun', 'hexagons'];
const isComparison = (dir) => /okteto-(vs|versus)-/.test(dir);
const rotating = (site) =>
  fs.readdirSync(path.join(root, site, 'posts')).filter((dir) => /^\d{4}-/.test(dir) && !isComparison(dir)).sort();
const ROTATING = { blog: rotating('blog'), tutorials: rotating('tutorials') };
const rotation = (out) => {
  const [, site, dir] = out.match(/^(blog|tutorials)\/posts\/([^/]+)\/img\/cover\.jpg$/) ?? [];
  if (!dir) return undefined;
  if (isComparison(dir)) return COMPARISON;
  const list = ROTATING[site];
  return list.includes(dir) ? ROTATION[list.indexOf(dir) % ROTATION.length] : undefined;
};
const BASICS = '2022-07-27-kubernetes-basics';

// A row of small labels in rounded boxes, centered on (cx, cy).
function pills(cx, cy, labels, { color = C.teal, size = 18, gap = 10, fill = C.pill } = {}) {
  const widths = labels.map((label) => label.length * size * 0.57 + 30);
  let x = cx - (widths.reduce((sum, w) => sum + w, 0) + gap * (labels.length - 1)) / 2;
  return labels.map((label, i) => {
    const out = box(x, cy - 20, widths[i], 40, { color, radius: 20, strokeWidth: 2.5, fill })
      + text(label, x + widths[i] / 2, cy + 6, size);
    x += widths[i] + gap;
    return out;
  }).join('');
}

// The governance diagram of the docs home, in a wide and a stacked version.
const GOVERNANCE_ALT = 'Developers, coding agents, and pull requests reach their own Namespaces in a Kubernetes cluster managed by Okteto with time-bound credentials, while the platform team operates the cluster with RBAC, quotas, network policies, Cloud Credentials, and Registry Credentials';
const GOVERNANCE_USERS = () => [['users', 'Developers', C.teal], ['bot', 'Coding agents', C.purple], ['git-pull-request', 'Pull requests', C.teal]];
function governanceCluster(cx, y0, width) {
  let out = box(cx - width / 2, y0, width, 480, { color: C.blue }) + logo('okteto', cx, y0, 84) + text('Kubernetes', cx, y0 + 88, 30, { color: C.onInk });
  [['alice', C.teal], ['agent-42', C.purple], ['pr-128', C.teal]].forEach(([name, color], i) => {
    const y = y0 + 120 + i * 112;
    out += box(cx - width / 2 + 35, y, width - 70, 88, { color, dashed: true, radius: 16, strokeWidth: 3 })
      + text('Namespace', cx, y + 34, 22, { color: C.dim }) + text(name, cx, y + 68, 26, { color: C.onInk });
  });
  return out;
}
function governanceControls(x, y0, width) {
  return [['shield-check', 'RBAC'], ['gauge', 'Quotas'], ['network', 'Network policies'], ['cloud', 'Cloud Credentials'], ['layers', 'Registry Credentials']].map(([name, label], i) => {
    const y = y0 + i * 72;
    return box(x, y, width, 58, { color: C.blue, radius: 12, strokeWidth: 2.5, fill: C.row })
      + icon(name, x + 30, y + 29, 30, C.blue) + text(label, x + 56, y + 37, 22, { anchor: 'start', color: C.onInk });
  }).join('');
}

// The preview URL diagram of the docs home, redrawn from "A URL for every
// change" of okteto.com: an agent's change gets a URL that reviewers open.
const PREVIEW_ALT = 'A coding agent deploys its change to an environment with its own URL, pr-142.acme.dev, that developers, product managers, and customers open in the browser';
const PREVIEW_REVIEWERS = () => [['user', 'Developers'], ['user', 'Product'], ['users', 'Customers']];
function browser(x, y, width, height) {
  let out = box(x, y, width, height, { color: C.blue });
  out += `<path d="M${x} ${y + 62} H${x + width}" stroke="${C.blue}" stroke-width="3" opacity="0.5"/>`;
  [C.red, C.amber, C.teal].forEach((color, i) => { out += `<circle cx="${x + 38 + i * 30}" cy="${y + 32}" r="9" fill="${color}"/>`; });
  out += box(x + 30, y + 88, width - 60, 64, { color: C.teal, radius: 32, strokeWidth: 3.5, fill: C.pill })
    + icon('link', x + 66, y + 120, 32) + text('pr-142.acme.dev', x + width / 2 + 16, y + 131, 30);
  out += icon('globe', x + width / 2, y + 152 + (height - 152) / 2, 110);
  return out;
}

// The hero diagram of the docs home, redrawn from "One manifest, every
// environment" of okteto.com: developers, coding agents, and test pipelines
// create their environments on Kubernetes from the same okteto.yaml.
const MANIFEST_ALT = 'Two developers, five coding agents, and three test pipelines create their own application environments, each with the services and the database of the application, in Okteto Namespaces from the same okteto.yaml';
const MANIFEST_USERS = () => [['users', 'Developers', C.teal], ['bot', 'Coding agents', C.purple], ['flask-conical', 'Test pipelines', C.amber]];
// A file with a folded corner, the Okteto logo on its top edge, and its name under it.
function manifestFile(cx, cy) {
  const w = 130;
  const h = 150;
  const x = cx - w / 2;
  const y = cy - h / 2;
  return `<path d="M${x + 14} ${y} H${x + w - 36} L${x + w} ${y + 36} V${y + h - 14} Q${x + w} ${y + h} ${x + w - 14} ${y + h} H${x + 14} Q${x} ${y + h} ${x} ${y + h - 14} V${y + 14} Q${x} ${y} ${x + 14} ${y}Z" fill="${C.ink}" stroke="${C.teal}" stroke-width="4" stroke-linejoin="round" filter="url(#glow)"/>`
    + `<path d="M${x + w - 36} ${y} V${y + 36} H${x + w}" fill="none" stroke="${C.teal}" stroke-width="4" stroke-linejoin="round"/>`
    + logo('okteto', x + (w - 36) / 2, y, 58) + icon('code', cx, cy + 10, 56) + text('okteto.yaml', cx, y + h + 46, 26, { mono: true });
}
// Ten application environments: two of developers, five of coding agents, and
// three of test pipelines, each with the services of the application (two
// services and a database).
function environments(cx, y0) {
  const width = 556;
  let out = box(cx - width / 2, y0, width, 344, { color: C.blue }) + logo('kubernetes', cx, y0, 80)
    + text('Application environments', cx, y0 + 82, 30) + text('Okteto Namespaces', cx, y0 + 116, 22, { color: C.dim });
  const [developers, agents, pipelines] = MANIFEST_USERS().map(([, , color]) => color);
  [developers, developers, agents, agents, agents, agents, agents, pipelines, pipelines, pipelines].forEach((color, i) => {
    const x = cx - 259 + (i % 5) * 106;
    const y = y0 + 148 + Math.floor(i / 5) * 86;
    out += box(x, y, 94, 74, { color, radius: 14, strokeWidth: 3 });
    ['box', 'box', 'database'].forEach((name, k) => { out += icon(name, x + 22 + k * 25, y + 37, 22, C.blue); });
  });
  return out;
}

// The scale diagram of the docs home: a cluster full of environments, some
// of them asleep, and what keeps their cost down.
const SCALE_ALT = 'Many application environments in Okteto Namespaces, some running and some asleep. The platform team controls their access with RBAC, quotas, network policies, and credentials, and their cost with the Garbage Collector, the Resource Manager, Smart Builds, and Okteto Insights';
function scaleCluster(cx, y0, width, tile, gap) {
  const rows = [[1, 1, 0, 1], [1, 0, 1, 0], [0, 1, 1, 0]];
  const height = 154 + rows.length * (tile + gap) + 10;
  let out = box(cx - width / 2, y0, width, height, { color: C.blue }) + logo('kubernetes', cx, y0, 80)
    + text('Application environments', cx, y0 + 84, 30) + text('Okteto Namespaces', cx, y0 + 116, 22, { color: C.dim });
  const x0 = cx - (4 * tile + 3 * gap) / 2;
  rows.forEach((row, r) => row.forEach((running, c) => {
    const x = x0 + c * (tile + gap);
    const y = y0 + 142 + r * (tile + gap);
    out += running
      ? box(x, y, tile, tile, { color: C.teal, radius: 16, strokeWidth: 3 }) + icon('box', x + tile / 2, y + tile / 2, tile * 0.5)
      : box(x, y, tile, tile, { color: C.dim, dashed: true, radius: 16, strokeWidth: 3 }) + icon('moon', x + tile / 2, y + tile / 2, tile * 0.46, C.dim);
  }));
  return out;
}
// What the platform team controls, in two groups: access and cost.
// The Okteto CLI wherever it runs, and the application environment it deploys
// and tests in the cluster (the Application Environments page).
const WORKFLOW_ALT = 'The Okteto CLI runs in the sandbox of a coding agent, on a laptop, or in a CI job. It deploys and tests the application in an application environment, an Okteto Namespace that runs the frontend, the API, the worker, the database, and the queue of the application, and gets back the results and the logs';
function cliBox(x, y, w) {
  let out = box(x, y, w, 370, { color: C.teal }) + logo('okteto', x + w / 2, y, 84)
    + text('Okteto CLI', x + w / 2, y + 85, 30);
  [['bot', 'Agent sandbox', C.purple], ['laptop', 'Laptop', C.teal], ['git-pull-request', 'CI job', C.teal]].forEach(([name, label, color], i) => {
    const ry = y + 118 + i * 80;
    out += box(x + 30, ry, w - 60, 62, { color: C.dim, radius: 12, strokeWidth: 2.5 }) + icon(name, x + 70, ry + 31, 30, color)
      + text(label, x + 105, ry + 40, 26, { anchor: 'start' });
  });
  return out;
}
function environmentBox(x, y, w) {
  let out = box(x, y, w, 510, { color: C.blue }) + logo('kubernetes', x + w / 2, y, 80)
    + text('Application environment', x + w / 2, y + 82, 30) + text('Okteto Namespace', x + w / 2, y + 116, 22, { color: C.dim });
  [['box', 'frontend'], ['box', 'api'], ['box', 'worker'], ['database', 'database'], ['database', 'queue']].forEach(([name, label], i) => {
    const ry = y + 138 + i * 70;
    out += box(x + 30, ry, w - 60, 58, { color: C.dim, fill: C.row, radius: 12, strokeWidth: 2 }) + icon(name, x + 68, ry + 29, 30, C.blue)
      + text(label, x + 102, ry + 38, 26, { anchor: 'start' });
  });
  return out;
}

// The Movies app of the Deploy your app series: the developer opens its URL,
// which routes to the frontend, and /api to the api, which uses MongoDB.
const MOVIES_URL = 'https://movies-cindy.okteto.example.com';
const service = (x, y, w, name, label) => box(x, y, w, 58, { color: C.dim, fill: C.row, radius: 12, strokeWidth: 2 })
  + icon(name, x + 38, y + 29, 30, C.blue) + text(label, x + 72, y + 38, 26, { anchor: 'start' });
const moviesEnvironment = (cx, y, w, h) => box(cx - w / 2, y, w, h, { color: C.blue }) + logo('kubernetes', cx, y, 80)
  + text('Application environment', cx, y + 82, 30) + text('Okteto Namespace', cx, y + 116, 22, { color: C.dim });
// The URL and /api pills sit on the border of the environment, ending at the same x.
const urlPill = (right, cy) => box(right - 390, cy - 28, 390, 56, { color: C.blue, radius: 28, strokeWidth: 3 }) + text(MOVIES_URL, right - 195, cy + 7, 18, { color: C.blue });
const apiPill = (right, cy) => box(right - 100, cy - 28, 100, 56, { color: C.blue, radius: 28, strokeWidth: 3 }) + text('/api', right - 50, cy + 8, 22, { color: C.blue });
// The two models of an application environment (the docs home), with the
// application of the Divert docs: a full replica runs every service in each
// environment, and Divert runs only the services that change and shares a
// Namespace with the rest.
const FULL_REPLICA_ALT = 'Full replica: a developer and a coding agent each have their own application environment, an Okteto Namespace that runs the whole application: its API gateway, the Rent service and its MongoDB database, and the Catalog service and its MongoDB database';
const DIVERT_ALT = 'Overlay Namespaces: the Overlay Namespace of a developer runs only the Rent service and its MongoDB database, and the Overlay Namespace of a coding agent runs only the Catalog service. Divert routes their requests to a Shared Namespace that runs the whole application';
// A database is indented under the service that owns it.
const MODEL_SERVICES = [['box', 'API Gateway'], ['box', 'Rent'], ['database', 'MongoDB', true], ['box', 'Catalog'], ['database', 'MongoDB', true]];
function modelRows(x, y, w, rows, changed = false) {
  return rows.map(([name, label, indent], i) => {
    const rx = x + (indent ? 26 : 0);
    const ry = y + i * 56;
    return box(rx, ry, w - (indent ? 26 : 0), 46, { color: changed ? C.teal : C.dim, fill: changed ? '#e2f5f3' : C.row, radius: 12, strokeWidth: 2 })
      + icon(name, rx + 28, ry + 23, 26, changed ? C.teal : C.blue) + text(label, rx + 54, ry + 31, 24, { anchor: 'start' });
  }).join('');
}
// A Namespace of the model figures: a blue box with the Kubernetes mark on the
// middle of its top edge, its title, an optional line under it, and its
// services. The rows are narrower than the box and centered in it.
const modelHeader = (subtitle) => (subtitle ? 126 : 96);
const modelHeight = (rows, subtitle) => modelHeader(subtitle) + rows * 56 + 14;
function modelEnvironment(x, y, w, title, subtitle, rows, changed = false) {
  return box(x, y, w, modelHeight(rows.length, subtitle), { color: C.blue }) + logo('kubernetes', x + w / 2, y, 72)
    + text(title, x + w / 2, y + 74, 26) + (subtitle ? text(subtitle, x + w / 2, y + 106, 22, { color: C.dim }) : '')
    + modelRows(x + 30, y + modelHeader(subtitle), w - 60, rows, changed);
}
// The owner of an environment: a circle with a line icon and the label under it.
const DEVELOPER = () => ['user', 'Developer', C.teal];
const AGENT = () => ['bot', 'Coding agent', C.purple];
const owner = (cx, cy, [name, label, color]) => circle(cx, cy, 34, { color }) + icon(name, cx, cy, 36, color) + text(label, cx, cy + 68, 24);
// An owner over its environment. 162 tall over the box.
const ownerAbove = (cx, top, who) => owner(cx, top - 128, who);
// Each owner has an application environment with every service. Wide: two
// environments side by side. Stacked: one under the other.
function fullReplica(x, y, stacked = false) {
  const w = stacked ? 400 : 340;
  const h = modelHeight(MODEL_SERVICES.length, true);
  const second = stacked ? [x, y + h + 190] : [x + w + 40, y];
  return ownerAbove(x + w / 2, y, DEVELOPER()) + modelEnvironment(x, y, w, 'Application environment', 'Okteto Namespace', MODEL_SERVICES)
    + ownerAbove(second[0] + w / 2, second[1], AGENT()) + modelEnvironment(second[0], second[1], w, 'Application environment', 'Okteto Namespace', MODEL_SERVICES);
}
const RENT = [['box', 'Rent'], ['database', 'MongoDB', true]];
const CATALOG = [['box', 'Catalog']];
// Wide: the owners on the left, their Overlay Namespaces, and the Shared
// Namespace on the right, with Divert on the arrows between them.
function divert(x, y) {
  const sharedH = modelHeight(MODEL_SERVICES.length);
  const rentH = modelHeight(RENT.length);
  const catalogH = modelHeight(CATALOG.length);
  // The two Overlay Namespaces are taller than the Shared Namespace, which is centered next to them.
  const agentY = y + rentH + 64;
  const sharedY = y + (rentH + 64 + catalogH - sharedH) / 2;
  const left = x + 150;
  const shared = left + 300 + 150;
  let out = owner(x + 50, y + rentH / 2 - 20, DEVELOPER()) + arrow(x + 96, y + rentH / 2 - 20, left - 12, y + rentH / 2 - 20, { color: C.teal })
    + owner(x + 50, agentY + catalogH / 2 - 20, AGENT()) + arrow(x + 96, agentY + catalogH / 2 - 20, left - 12, agentY + catalogH / 2 - 20, { color: C.purple });
  out += modelEnvironment(left, y, 300, 'Overlay Namespace', null, RENT, true) + modelEnvironment(left, agentY, 300, 'Overlay Namespace', null, CATALOG, true);
  [[y + rentH / 2], [agentY + catalogH / 2]].forEach(([cy]) => {
    out += arrow(left + 312, cy, shared - 12, cy, { color: C.dim }) + text('Divert', left + 375, cy - 16, 22, { color: C.dim });
  });
  return out + modelEnvironment(shared, sharedY, 320, 'Shared Namespace', null, MODEL_SERVICES);
}
// Stacked: the two Overlay Namespaces side by side, over the Shared Namespace.
function divertStacked(x, y) {
  const rentH = modelHeight(RENT.length);
  const w = 265;
  const sharedY = y + rentH + 130;
  let out = ownerAbove(x + w / 2, y, DEVELOPER()) + modelEnvironment(x, y, w, 'Overlay Namespace', null, RENT, true)
    + ownerAbove(x + w + 10 + w / 2, y, AGENT()) + modelEnvironment(x + w + 10, y, w, 'Overlay Namespace', null, CATALOG, true);
  out += arrow(x + w / 2 - 30, y + rentH + 12, x + w / 2 - 30, sharedY - 12, { color: C.dim })
    + arrow(x + w + 10 + w / 2 + 30, y + modelHeight(CATALOG.length) + 12, x + w + 10 + w / 2 + 30, sharedY - 12, { color: C.dim })
    + text('Divert', x + w + 5, y + rentH + 78, 22, { color: C.dim });
  return out + modelEnvironment(x + 60, sharedY, 2 * w + 10 - 120, 'Shared Namespace', null, MODEL_SERVICES);
}

// A light agent sandbox with the Okteto CLI, and the application environment
// it deploys and tests (the docs home).
const AGENT_ALT = 'A light agent sandbox with the agent binary, Git access, and the Okteto CLI deploys and tests the application in an application environment, an Okteto Namespace that runs the frontend, the API, the worker, the database, and the queue, and gets back the results and the logs';
function agentSandbox(x, y, w) {
  let out = box(x, y, w, 370, { color: C.purple }) + circle(x + w / 2, y, 40, { color: C.purple }) + icon('bot', x + w / 2, y, 44, C.purple)
    + text('Light agent sandbox', x + w / 2, y + 85, 30, { color: C.purple });
  ['Agent binary', 'Git access', 'Okteto CLI'].forEach((label, i) => {
    out += box(x + 30, y + 118 + i * 80, w - 60, 62, { color: C.dim, radius: 12, strokeWidth: 2.5 }) + text(label, x + w / 2, y + 158 + i * 80, 26);
  });
  return out;
}

function scaleFeatures(x, y0, width) {
  const groups = [
    ['Access', C.blue, [['shield-check', 'RBAC'], ['gauge', 'Quotas'], ['network', 'Network policies'], ['key-round', 'Credentials']]],
    ['Cost', C.teal, [['moon', 'Garbage Collector'], ['cpu', 'Resource Manager'], ['zap', 'Smart Builds'], ['eye', 'Okteto Insights']]],
  ];
  let out = '';
  let y = y0;
  for (const [title, color, rows] of groups) {
    out += text(title, x, y + 22, 24, { anchor: 'start', color });
    y += 38;
    for (const [name, label] of rows) {
      out += box(x, y, width, 44, { color, radius: 12, strokeWidth: 2.5, fill: C.row })
        + icon(name, x + 30, y + 22, 28, color) + text(label, x + 58, y + 30, 22, { anchor: 'start', color: C.onInk });
      y += 50;
    }
    y += 14;
  }
  return out;
}

const covers = [
  {
    out: post('2019-09-22-manage-your-kubernetes-context-directly-from-vs-code'),
    alt: 'The Visual Studio Code logo with an arrow to the Kubernetes logo',
    svg: row([mark('visualstudiocode'), 'arrow', kubernetes()]),
  },
  {
    out: post('2021-06-07-preview-environments-for-kubernetes'),
    alt: 'A pull request deploys a Preview Environment in a Kubernetes namespace',
    svg: row([
      tile('git-pull-request', 'Pull request'),
      'arrow',
      group('Preview Environment', [item('globe'), ...pods(2)], { top: 'kubernetes', dashed: true }),
    ]),
  },
  {
    out: post('2021-10-04-best-practices-in-kubernetes-security'),
    alt: 'The Kubernetes logo inside a shield',
    svg: curve('M600 62 L772 124 V282 Q772 424 600 492 Q428 424 428 282 V124 Z', { strokeWidth: 6 })
      + logo('kubernetes', 600, 262, 236),
  },
  {
    out: post('2021-12-16-building-docker-images-faster-for-webpack'),
    alt: 'The Webpack logo with a fast arrow to the Docker logo',
    svg: row([mark('webpack'), { icon: 'zap' }, mark('docker', { size: 220 })]),
  },
  {
    out: post('2022-02-23-a-15m-series-a-to-disrupt-modern-development'),
    alt: 'The Okteto logo next to $15M, the size of the Series A',
    svg: row([okteto(), 'none', word('$15M', { size: 130, color: C.amber, label: 'Series A' })]),
  },
  {
    out: post('2022-09-27-why-development-experience-matters'),
    alt: 'The panelists: Ramiro Berrelleza, CEO and co-founder of Okteto, Lior Rabin, DevEx team lead at monday.com, and Ron Barabash, chief architect at Yotpo',
    // The photos of the panel, cut out of the original cover (images/).
    svg: `<image href="file://${path.join(root, 'scripts/covers/images/why-development-experience-matters.png')}" x="21" y="0" width="1158" height="630"/>`,
  },
  {
    out: post('2022-10-18-applying-gitops-principles-to-your-development-environments'),
    alt: 'The Git logo with an arrow to an environment in Kubernetes',
    svg: row([mark('git', { size: 170 }), 'arrow', group('Environment', pods(3), { top: 'kubernetes', dashed: true })]),
  },
  {
    out: post('2022-11-28-kubernetes-network-policies'),
    alt: 'A NetworkPolicy in a Kubernetes namespace lets the frontend Pod reach the api Pod and the api Pod reach the database, and blocks the frontend from the database',
    svg: (() => {
      const pod = (name, label, x, y, color = C.teal) => box(x - 55, y - 55, 110, 110, { color, radius: 20, strokeWidth: 3.5 })
        + icon(name, x, y, 56, color) + text(label, x, y + 98, 26);
      const verdict = (x, y, ok) => circle(x, y, 26, { color: ok ? C.teal : C.red }) + icon(ok ? 'check' : 'x', x, y, 30, ok ? C.teal : C.red);
      return box(150, 105, 900, 465, { color: C.blue, dashed: true }) + logo('kubernetes', 600, 105, 88)
        + icon('shield-check', 500, 192, 38, C.amber) + text('NetworkPolicy', 528, 204, 30, { anchor: 'start' })
        + pod('box', 'api', 600, 300) + pod('box', 'frontend', 330, 430) + pod('database', 'db', 870, 430)
        + arrow(395, 395, 532, 325) + verdict(463, 360, true)
        + arrow(668, 325, 805, 395) + verdict(737, 360, true)
        + arrow(395, 455, 805, 455, { color: C.red, dashed: true }) + verdict(600, 455, false);
    })(),
  },
  {
    out: post('2022-12-05-kubectl-cheat-sheet'),
    alt: 'A terminal with three kubectl commands',
    svg: scaled(terminal(['kubectl get pods', 'kubectl logs deploy/api', 'kubectl apply -f app.yaml'], { y: 144 }), 1.22, 600, 285),
  },
  {
    out: post('2023-02-21-four-reasons-you-need-preview-environments'),
    alt: 'A Preview Environment and four reasons to use it: collaboration, feedback, validation, and testing',
    svg: hub({
      title: 'Preview',
      top: null,
      rows: [{ icon: 'git-pull-request', text: 'Pull request' }, { icon: 'globe', text: 'Live URL' }],
      left: [{ icon: 'users', label: 'Collaboration' }, { icon: 'message-circle', label: 'Feedback' }],
      right: [{ icon: 'circle-check', label: 'Validation' }, { icon: 'flask-conical', label: 'Testing' }],
    }),
  },
  {
    out: post('2023-02-28-kubernetes-load-balancer-service'),
    alt: 'A load balancer distributes the traffic from the internet across three Pods',
    svg: scaled(circle(230, 270, 62) + icon('globe', 230, 270, 66)
      + arrow(315, 270, 470, 270)
      + box(495, 195, 210, 150, { color: C.blue }) + icon('network', 600, 258, 62, C.blue) + text('LoadBalancer', 600, 392)
      + arrow(725, 240, 880, 150) + arrow(725, 270, 880, 270) + arrow(725, 300, 880, 390)
      + [150, 270, 390].map((y) => box(905, y - 48, 96, 96, { color: C.teal, radius: 18 }) + icon('box', 953, y, 52)).join(''), 1.15, 615),
  },
  {
    out: post('2023-03-23-total-cost-of-ownership-tco-of-building-versus-buying-software-for-development'),
    alt: "Building a development platform means maintaining infrastructure, technical upkeep, security, features, integrations, and support; buying one means the Okteto platform, maintained for you",
    svg: (() => {
      let out = box(90, 125, 640, 400, { color: C.amber, dashed: true }) + icon('wrench', 340, 182, 40, C.amber) + text('Build', 372, 194, 32, { anchor: 'start' });
      [['server', 'Infrastructure'], ['wrench', 'Technical'], ['shield-check', 'Security'], ['code', 'Features'], ['link', 'Integrations'], ['users', 'Support']].forEach(([name, label], i) => {
        const x = 120 + (i % 2) * 300;
        const y = 232 + Math.floor(i / 2) * 92;
        out += box(x, y, 280, 72, { color: C.amber, radius: 14, strokeWidth: 3, fill: C.row }) + icon(name, x + 42, y + 36, 34, C.amber) + text(label, x + 76, y + 46, 25, { anchor: 'start' });
      });
      out += box(770, 125, 340, 400, { color: C.teal }) + icon('dollar-sign', 905, 182, 40) + text('Buy', 937, 194, 32, { anchor: 'start' });
      out += logo('okteto-wordmark', 940, 330, 250) + text('Maintained for you', 940, 452, 25, { color: C.teal });
      return out;
    })(),
  },
  {
    out: post('2023-06-02-the-modern-way-of-sharing-dev-work-with-your-team'),
    alt: 'A developer shares their work with the team through a URL',
    svg: row([badge('laptop', 'Developer'), 'arrow', tile('link', 'URL', { color: C.blue }), 'arrow', badge('users', 'Team', { color: C.purple })]),
  },
  {
    out: post('2023-07-27-the-way-you-re-using-kubernetes-clusters-during-development-is-killing-productivity'),
    alt: 'Developers waiting their turn for a shared cluster, versus a Kubernetes cluster where each developer has their own namespace',
    svg: (() => {
      let out = box(110, 170, 340, 330, { color: C.amber, dashed: true }) + text('Shared cluster', 280, 225, 28);
      [190, 280, 370].forEach((x, i) => { out += icon('user', x, 300, 62, i === 0 ? C.teal : C.dim); });
      out += icon('hourglass', 222, 420, 46, C.amber) + text('waiting', 256, 430, 26, { anchor: 'start', color: C.amber });
      out += arrow(470, 335, 580, 335);
      out += box(600, 130, 490, 400) + logo('kubernetes', 845, 130, 88) + text('Namespace per developer', 845, 218, 28);
      ['ana', 'li', 'sam'].forEach((name, i) => {
        const y = 248 + i * 90;
        out += box(630, y, 430, 72, { color: C.teal, radius: 14, strokeWidth: 3.5, fill: C.row })
          + icon('user', 670, y + 36, 38) + text(name, 702, y + 46, 26, { anchor: 'start' })
          + ['globe', 'box', 'database'].map((n, k) => icon(n, 880 + k * 60, y + 36, 34)).join('');
      });
      return out;
    })(),
  },
  {
    out: post('2023-08-15-five-challenges-with-developing-locally-using-docker-compose'),
    alt: 'A laptop running a Docker Compose stack of web, api, queue, and database containers, with its challenges: resources, not like production, not reproducible, coding agents, and end-to-end tests',
    svg: (() => {
      let out = box(120, 150, 440, 360, { color: C.blue }) + logo('docker', 340, 150, 96) + text('Laptop', 340, 238, 28);
      [['globe', 'web'], ['box', 'api'], ['layers', 'queue'], ['database', 'db']].forEach(([name, label], i) => {
        const x = 150 + (i % 2) * 200;
        const y = 285 + Math.floor(i / 2) * 105;
        out += box(x, y, 180, 80, { color: C.teal, radius: 14, strokeWidth: 3.5 }) + icon(name, x + 38, y + 40, 36) + text(label, x + 70, y + 50, 25, { anchor: 'start' });
      });
      [['gauge', 'Laptop resources'], ['triangle-alert', 'Not like production'], ['copy', 'Not reproducible'], ['bot', 'Coding agents'], ['flask-conical', 'End-to-end tests']].forEach(([name, label], i) => {
        const y = 150 + i * 74;
        out += box(620, y, 460, 60, { color: C.amber, radius: 30, strokeWidth: 3, fill: C.row }) + icon(name, 662, y + 30, 32, C.amber) + text(label, 696, y + 40, 25, { anchor: 'start' });
      });
      return out;
    })(),
  },
  {
    out: post('2023-09-26-slash-your-kubernetes-costs-during-development'),
    alt: 'The Garbage Collector removes idle environments from Kubernetes and the cost goes down',
    svg: row([kubernetes({ size: 170 }), 'arrow', tile('trash-2', 'Garbage Collector', { color: C.purple }), 'arrow', badge('trending-down', 'Cost', { color: C.teal })]),
  },
  {
    out: post('2024-01-25-platform-engineering-roadmap'),
    alt: "A roadmap with three milestones, self-service environments, golden paths, and collaboration, that leads to productive developers and coding agents",
    svg: (() => {
      const stop = (x, y, name, label, color = C.teal) => circle(x, y, 46, { color }) + icon(name, x, y, 46, color) + text(label, x, y + 86, 26);
      return '<g transform="translate(0 -40)">' + curve('M120 395 C220 395 260 395 300 395 S420 255 520 255 S700 375 780 375 S960 190 1050 190', { dashed: true, strokeWidth: 5 })
        + stop(250, 395, 'zap', 'Self-service')
        + stop(520, 255, 'git-branch', 'Golden paths')
        + stop(780, 375, 'users', 'Collaboration')
        + circle(1050, 190, 58, { color: C.amber }) + icon('flag', 1050, 190, 56, C.amber)
        + text('Developers', 1050, 290, 26) + text('and agents', 1050, 324, 26) + '</g>';
    })(),
  },
  {
    out: post('2024-07-29-okteto-soc-2'),
    alt: "The Okteto logo and the text \"We're SOC 2!\", with the SOC 2 Achieved badge by Strike Graph and the AICPA SOC badge",
    // The original cover, cut out of its background (images/).
    svg: `<image href="file://${path.join(root, 'scripts/covers/images/okteto-soc-2.png')}" x="0" y="32" width="1200" height="565"/>`,
  },
  {
    out: post('2025-01-07-platform-tooling-landscape'),
    alt: 'A grid with the logos of eight platform engineering tools',
    svg: scaled(['okteto', 'kubernetes', 'terraform', 'argo', 'githubactions', 'gitlab', 'prometheus', 'grafana'].map((name, i) => {
      const x = 600 + ((i % 4) - 1.5) * 190;
      const y = 175 + Math.floor(i / 4) * 190;
      return box(x - 75, y - 75, 150, 150, { color: i % 2 === Math.floor(i / 4) % 2 ? C.teal : C.purple }) + logo(name, x, y, 84);
    }).join(''), 1.12, 600, 270),
  },
  {
    out: post('2025-03-10-what-are-ephemeral-environments'),
    alt: 'A branch creates an environment that lives for a limited time and is then deleted',
    svg: row([badge('git-branch', 'Branch'), 'arrow', group('Environment', [item('timer', { color: C.amber }), ...pods(2)], { dashed: true }), 'arrow', badge('trash-2', 'Deleted', { color: C.dim })]),
  },
  {
    out: post('2025-04-22-why-flexibility-is-key-to-scaling-development-environments'),
    alt: 'Two kinds of environment: a full one with every service, and a Divert one with only the service being changed',
    svg: row([
      group('Full environment', pods(4), { dashed: true, gap: 14 }),
      'none',
      group('Divert', [item('box'), ...pods(3, C.dim)], { color: C.purple, dashed: true, gap: 14 }),
    ]),
  },
  {
    out: post('2025-07-08-the-three-pillars-of-trust-for-ai-in-software-development'),
    alt: 'Three pillars hold up an AI agent: results, safety, and unblocked',
    svg: circle(600, 84, 44, { color: C.purple }) + icon('bot', 600, 84, 48, C.purple)
      + box(250, 146, 700, 30, { color: C.blue, radius: 10 })
      + [[370, 'zap', 'Results'], [600, 'shield-check', 'Safety'], [830, 'key', 'Unblocked']].map(([x, name, label]) =>
        box(x - 55, 190, 110, 196, { color: C.teal, radius: 12 }) + icon(name, x, 288, 60) + text(label, x, 478)).join('')
      + box(250, 400, 700, 30, { color: C.blue, radius: 10 }),
  },
  {
    out: post('2026-01-08-okteto-vs-mirrord-choosing-the-right-development-environment-solution-for-your-team'),
    alt: 'The Okteto logo versus mirrord',
    svg: versus('mirrord'),
  },
  {
    out: post('2025-12-19-compare-okteto-versus-qovery'),
    alt: 'The Okteto logo versus Qovery',
    svg: versus('Qovery'),
  },
  {
    out: post('2026-01-05-development-environment-pitfalls'),
    alt: 'Three ways to run a development environment: a laptop that only fits part of the system, a full copy of every service, and Divert, which deploys only the service that changes on top of a shared environment',
    svg: (() => {
      const panel = (x, title, name, color) => box(x, 150, 290, 360, { color, dashed: color !== C.teal }) + icon(name, x + 145, 205, 52, color) + text(title, x + 145, 272, 28);
      const pod = (x, y, color = C.teal, dashed = false) => box(x - 30, y - 30, 60, 60, { color, radius: 12, strokeWidth: 3, dashed }) + (dashed ? '' : icon('box', x, y, 32, color));
      const grid = (x0, kinds) => kinds.map((k, n) => pod(x0 + 75 + (n % 3) * 70, 340 + Math.floor(n / 3) * 80, k[0], k[1])).join('');
      let out = panel(70, 'Local', 'laptop', C.dim) + grid(70, [[C.teal], [C.teal], [C.dim, true], [C.dim, true], [C.dim, true], [C.dim, true]]);
      out += panel(455, 'Full copy', 'copy', C.amber) + grid(455, Array(6).fill([C.amber]));
      out += panel(840, 'Divert', 'git-branch', C.teal) + grid(840, [[C.teal], [C.dim], [C.dim], [C.dim], [C.dim], [C.dim]]);
      return out + text('only part fits', 215, 488, 22, { color: C.dim }) + text('every service', 600, 488, 22, { color: C.amber }) + text('only what changes', 985, 488, 22, { color: C.teal });
    })(),
  },
  {
    out: post('2026-09-10-compare-okteto-versus-bunnyshell'),
    alt: 'The Okteto logo versus Bunnyshell',
    svg: versus('Bunnyshell'),
  },
  {
    out: post('2026-11-08-why-run-ai-coding-agents-on-kubernetes'),
    alt: 'AI coding agents working on separate issues inside Kubernetes, with four benefits: secure, reproducible, scale, and observability',
    svg: hub({
      rows: [{ icon: 'bot', text: '#142 fix login' }, { icon: 'bot', text: '#157 add export' }, { icon: 'bot', text: '#163 bump deps' }],
      left: [{ icon: 'shield-check', label: 'Secure' }, { icon: 'equal', label: 'Reproducible' }],
      right: [{ icon: 'copy', label: 'Scale' }, { icon: 'eye', label: 'Observability' }],
    }),
  },
  {
    out: post('2026-11-12-how-to-run-ai-coding-agents-on-kubernetes'),
    alt: 'An agent sandbox with the agent binary and Git access, connected through RBAC to the Kubernetes namespace that runs the application: an HTTPRoute, a Service, Pods and a Volume',
    // Scaled down a little (the blog's cards crop the sides of the image) and
    // moved down to the center of the cover.
    svg: `<g transform="translate(0 35)">${scaled(
      // The agent sandbox and what it carries.
      box(34, 162, 364, 236, { color: C.purple })
      + circle(216, 162, 33, { color: C.purple }) + icon('bot', 216, 162, 36, C.purple)
      + text('Agent sandbox', 216, 234)
      + [['cpu', 'Agent binary'], ['git-branch', 'Git access']].map(([name, label], i) => {
        const y = 254 + i * 64;
        return box(54, y, 324, 54, { color: C.purple, radius: 12, strokeWidth: 3, fill: C.row })
          + icon(name, 82, y + 27, 28, C.purple) + text(label, 106, y + 35, 21, { anchor: 'start' });
      }).join('')
      // What the sandbox can do in the namespace is limited by RBAC.
      + arrow(418, 280, 546, 280) + pills(480, 242, ['RBAC'], { size: 22 })
      // The application, running in its namespace.
      + box(564, 132, 590, 296, { dashed: true })
      + logo('kubernetes', 859, 132, 86) + text('Namespace', 859, 216)
      + [['globe', 'HTTPRoute'], ['network', 'Service'], ['boxes', 'Pods'], ['hard-drive', 'Volume']].map(([name, label], i) => {
        const x = 643 + i * 144;
        return box(x - 48, 252, 96, 96, { color: C.teal, radius: 18, strokeWidth: 3.5 })
          + icon(name, x, 300, 52) + text(label, x, 384, 21)
          + (i < 3 ? arrow(x + 58, 300, x + 86, 300) : '');
      }).join(''), 0.93, 594, 285)}</g>`,
  },
  {
    out: post('2026-01-28-ingress-nginx-controller-deprecation-your-migration-guide-to-kubernetes-gateway-api'),
    alt: 'The NGINX logo, for Ingress NGINX, with an arrow to the Kubernetes logo, for the Gateway API',
    svg: row([mark('nginx', { size: 170, label: 'Ingress NGINX' }), 'arrow', mark('kubernetes', { size: 180, label: 'Gateway API' })]),
  },
  {
    out: post('2026-01-15-compare-okteto-versus-signadot'),
    alt: 'The Okteto logo versus Signadot',
    svg: row([mark('okteto-wordmark', { size: 360 }), 'vs', word('Signadot', { size: 84 })]),
  },
  {
    out: post('2026-01-12-platform-engineering-tools-2026'),
    alt: 'A chat window connected to a Kubernetes cluster that runs an agent with guardrails, workload identity, and observability',
    svg: row([
      tile('message-square', 'Chat', { color: C.teal }),
      'arrow',
      group('Kubernetes', [item('bot', { color: C.purple }), item('shield-check', { color: C.amber }), item('key-round'), item('eye')], { top: 'kubernetes' }),
    ]),
  },
  {
    out: post(BASICS),
    alt: 'A Kubernetes cluster with the objects the tutorial covers: HTTPRoutes, Services, Deployments, Pods, and Volumes',
    svg: `<g transform="translate(0 40)">${
      box(170, 130, 860, 330, { color: C.blue })
      + logo('kubernetes', 600, 130, 92) + text('Kubernetes Basics', 600, 218)
      + [['globe', 'HTTPRoute'], ['network', 'Service'], ['copy', 'Deployment'], ['boxes', 'Pods'], ['hard-drive', 'Volume']].map(([name, label], i) => {
        const x = 270 + i * 165;
        return box(x - 55, 250, 110, 110, { color: C.teal, radius: 20, strokeWidth: 3.5 })
          + icon(name, x, 305, 58) + text(label, x, 405, 24);
      }).join('')
    }</g>`,
  },
  // The build times chart of the Webpack post.
  {
    out: figure('2021-12-16-building-docker-images-faster-for-webpack', 'build-times'),
    background: 'white',
    alt: 'Build times of the Okteto website with and without BuildKit caches: 50 seconds down to 9 for a dependency change, and 62 seconds down to 12 for a code change',
    svg: () => {
      const bar = (y, seconds, color) => {
        const w = (seconds / 62) * 720;
        return box(340, y, w, 48, { color, fill: color, radius: 10, strokeWidth: 2 }) + text(`${seconds}s`, 340 + w + 14, y + 34, 26, { anchor: 'start' });
      };
      let out = box(700, 28, 26, 26, { color: C.red, fill: C.red, radius: 6, strokeWidth: 2 }) + text('without BuildKit caches', 736, 50, 22, { anchor: 'start' })
        + box(700, 66, 26, 26, { color: C.teal, fill: C.teal, radius: 6, strokeWidth: 2 }) + text('with BuildKit caches', 736, 88, 22, { anchor: 'start' });
      [['yarn install', '1. Dependency change', 50, 9], ['yarn build', '2. Code change', 62, 12]].forEach(([command, caption, before, after], k) => {
        const y0 = 130 + k * 250;
        out += text('> docker build', 60, y0, 24, { anchor: 'start', mono: true, color: C.dim })
          + box(60, y0 + 18, 250, 128, { color: C.text, fill: C.text, radius: 16, strokeWidth: 2 }) + text(command, 185, y0 + 92, 28, { mono: true, color: '#ffffff' })
          + bar(y0 + 22, before, C.red) + bar(y0 + 92, after, C.teal)
          + text(caption, 340, y0 + 186, 24, { anchor: 'start', color: C.dim });
      });
      return out;
    },
  },
  // The three diagrams of How to Run AI Coding Agents on Kubernetes.
  {
    out: figure('2026-11-12-how-to-run-ai-coding-agents-on-kubernetes', 'fat-agent-sandbox'),
    background: 'white',
    alt: 'A fat agent sandbox: one privileged pod that holds the agent, its tools and privileges, and a Docker daemon running every service of the application',
    svg: () => {
      let out = box(250, 70, 700, 530, { color: C.red }) + circle(600, 70, 40, { color: C.red }) + icon('box', 600, 70, 42, C.red)
        + text('Fat agent sandbox (privileged pod)', 600, 150, 28, { color: C.red });
      out += box(280, 180, 300, 390, { color: C.dim, radius: 18, strokeWidth: 3 }) + text('Agent', 430, 225, 26, { color: C.dim });
      ['Agent binary', 'Git access', 'Tools', 'Privileges'].forEach((label, i) => {
        out += box(300, 250 + i * 65, 260, 52, { color: C.dim, radius: 10, strokeWidth: 2.5 }) + text(label, 430, 285 + i * 65, 24);
      });
      out += box(620, 180, 300, 390, { color: C.dim, radius: 18, strokeWidth: 3 }) + text('Dockerd', 770, 225, 26, { color: C.dim });
      [['box', 'frontend'], ['box', 'api'], ['database', 'db'], ['box', 'worker'], ['database', 'kafka'], ['database', 'postgres'], ['box', 'service']].forEach(([name, label], i) => {
        const x = 630 + (i % 2) * 145;
        const y = 250 + Math.floor(i / 2) * 62;
        out += box(x, y, 140, 50, { color: C.dim, fill: C.dim, radius: 10, strokeWidth: 2 }) + icon(name, x + 20, y + 25, 22, '#ffffff') + text(label, x + 36, y + 33, 22, { anchor: 'start', color: '#ffffff' });
      });
      out += box(775, 436, 140, 50, { color: C.dim, radius: 10, strokeWidth: 2.5 }) + text('...', 845, 466, 26, { color: C.dim });
      return out;
    },
  },
  {
    out: figure('2026-11-12-how-to-run-ai-coding-agents-on-kubernetes', 'agent-sandbox-and-application-environment'),
    background: 'white',
    alt: 'The decoupled design: a light agent sandbox with the agent binary, Git access, and RBAC, connected to an application environment that runs the services of the application and its tests in a Kubernetes namespace',
    svg: () => {
      let out = box(40, 150, 400, 370, { color: C.purple }) + circle(240, 150, 40, { color: C.purple }) + icon('bot', 240, 150, 44, C.purple)
        + text('Light agent sandbox', 240, 235, 30, { color: C.purple });
      ['Agent binary', 'Git access', 'RBAC'].forEach((label, i) => {
        out += box(70, 268 + i * 80, 340, 62, { color: C.dim, radius: 12, strokeWidth: 2.5 }) + text(label, 240, 308 + i * 80, 26);
      });
      out += arrow(470, 330, 640, 330, { color: C.purple }) + text('deploy, test', 555, 308, 24, { color: C.purple });
      out += arrow(640, 390, 470, 390, { color: C.dim }) + text('results, logs', 555, 432, 24, { color: C.dim });
      out += box(670, 90, 490, 510, { color: C.blue }) + logo('kubernetes', 915, 90, 80)
        + text('Application environment', 915, 172, 30) + text('Kubernetes namespace', 915, 206, 22, { color: C.dim });
      [['box', 'frontend'], ['box', 'api'], ['database', 'database'], ['database', 'queue']].forEach(([name, label], i) => {
        const y = 228 + i * 70;
        out += box(700, y, 430, 58, { color: C.dim, fill: C.row, radius: 12, strokeWidth: 2 }) + icon(name, 738, y + 29, 30, C.blue) + text(label, 772, y + 38, 26, { anchor: 'start' });
      });
      out += box(700, 518, 430, 58, { color: C.teal, fill: '#e2f5f3', radius: 12, strokeWidth: 2.5 }) + icon('circle-check', 738, 547, 30, C.teal) + text('tests', 772, 556, 26, { anchor: 'start' });
      return out;
    },
  },
  {
    out: figure('2026-11-12-how-to-run-ai-coding-agents-on-kubernetes', 'agent-loop-with-verified-output'),
    background: 'white',
    alt: 'The agent loop: the agent edits code in the light agent sandbox, builds and deploys the application to its Kubernetes namespace, and verifies its output there with tests, endpoints, and logs and metrics, repeating until it works and then opening a pull request',
    svg: () => {
      // Every step sits on one horizontal axis, with three arrows of the same length.
      const axis = 361;
      const step = (x, width, label, color = C.dim) => box(x, axis - 31, width, 62, { color, radius: 12, strokeWidth: color === C.text ? 3 : 2.5 }) + text(label, x + width / 2, axis + 9, 24);
      let out = box(30, 220, 290, 197, { color: C.purple }) + circle(175, 220, 38, { color: C.purple }) + icon('bot', 175, 220, 42, C.purple)
        + text('Light agent sandbox', 175, 295, 26, { color: C.purple })
        + step(55, 240, 'Edit code');
      out += arrow(328, axis, 362, axis, { color: C.purple });
      out += box(370, 96, 580, 415, { color: C.blue }) + logo('kubernetes', 660, 96, 80)
        + text('Application environment', 660, 176, 30) + text('Kubernetes namespace', 660, 210, 22, { color: C.dim });
      out += step(395, 215, 'Build and deploy');
      out += arrow(618, axis, 652, axis, { color: C.blue });
      // Verify output and its three checks, as one group centered on the axis.
      out += box(660, 236, 265, 250, { color: C.teal, radius: 16, strokeWidth: 2.5 });
      out += box(670, 246, 245, 56, { color: C.teal, fill: C.teal, radius: 10, strokeWidth: 2 }) + icon('circle-check', 702, 274, 30, '#ffffff') + text('Verify output', 730, 283, 24, { anchor: 'start', color: '#ffffff' });
      ['Tests', 'Endpoints', 'Logs and metrics'].forEach((label, i) => {
        const y = 310 + i * 58;
        out += box(670, y, 245, 50, { color: C.teal, fill: '#e2f5f3', radius: 10, strokeWidth: 2 }) + icon('circle-check', 698, y + 25, 26, C.teal) + text(label, 722, y + 33, 22, { anchor: 'start' });
      });
      out += arrow(958, axis, 992, axis, { color: C.teal });
      out += step(1000, 170, 'Pull request', C.text);
      // The way back, from the middle of the environment to the middle of the sandbox.
      out += curve('M660 513 V566 H175 V432', { color: C.dim }) + arrow(175, 440, 175, 425, { color: C.dim })
        + `<rect x="272" y="548" width="290" height="36" fill="#ffffff"/>` + text('repeat until it works', 417, 574, 24, { color: C.dim });
      return out;
    },
  },
  // The two diagrams of the Network Policies guide.
  ...[['default-traffic', 'by default', false], ['network-policy', 'using Network Policies', true]].map(([name, caption, blocked]) => ({
    out: figure('2022-11-28-kubernetes-network-policies', name),
    background: 'white',
    alt: blocked
      ? 'With Network Policies, the traffic between the frontend and the database is blocked'
      : 'Frontend, backend, and database pods: by default, each one can talk to the other two',
    svg: () => {
      const node = (label, cx, cy) => box(cx - 120, cy - 42, 240, 84, { color: C.blue, radius: 16, strokeWidth: 3.5 }) + text(label, cx, cy + 10, 30);
      let out = node('frontend', 300, 150) + node('backend', 900, 150) + node('database', 600, 400);
      out += arrow(436, 150, 764, 150, { both: true });
      out += arrow(812, 206, 690, 346, { both: true });
      out += blocked
        ? arrow(388, 206, 510, 346, { both: true, color: C.red, dashed: true }) + circle(449, 276, 28, { color: C.red }) + icon('x', 449, 276, 32, C.red)
        : arrow(388, 206, 510, 346, { both: true });
      return out + text(caption, 600, 545, 32, { mono: true });
    },
  })),
  // The two diagrams of Kubernetes Basics.
  {
    out: figure(BASICS, 'architecture'),
    background: 'white',
    alt: 'A Kubernetes cluster: the control plane runs kube-apiserver, kube-scheduler, kube-controller-manager, and etcd, and each worker node runs the kubelet, kube-proxy, a container runtime, and pods',
    svg: () => {
      const part = (label, x, y, w, color = C.blue) => box(x, y, w, 56, { color, radius: 12, strokeWidth: 3 }) + text(label, x + w / 2, y + 37, 24);
      let out = box(40, 70, 1120, 530, { dashed: true }) + logo('kubernetes', 600, 70, 80);
      out += box(80, 140, 480, 420, { color: C.blue }) + text('Control plane', 320, 195);
      out += part('kube-apiserver', 120, 225, 400) + part('kube-scheduler', 120, 296, 400) + part('kube-controller-manager', 120, 367, 400);
      out += icon('database', 292, 466, 44, C.blue) + text('etcd', 324, 475, 26, { anchor: 'start' });
      out += box(652, 152, 480, 420, { color: C.teal, fill: '#ffffff' }) + box(640, 140, 480, 420, { color: C.teal }) + text('Worker nodes', 880, 195);
      out += part('kubelet', 680, 225, 400, C.teal) + part('kube-proxy', 680, 296, 400, C.teal) + part('container runtime', 680, 367, 400, C.teal);
      [700, 830, 960].forEach((x) => { out += part('Pod', x, 455, 100, C.purple); });
      return out;
    },
  },
  {
    out: figure(BASICS, 'gateway-routing'),
    background: 'white',
    alt: 'Users reach a load balancer, which sends the requests to a Gateway in the cluster; HTTPRoutes send the requests for / to the frontend Service and the requests for /api to the api Service, and each Service sends them to its pods',
    svg: () => {
      const node = (label, x, y, w, color = C.blue) => box(x, y - 35, w, 70, { color, radius: 14, strokeWidth: 3.5 }) + text(label, x + w / 2, y + 10);
      let out = node('Users', 20, 330, 120, C.dim);
      out += arrow(148, 330, 190, 330) + node('Load balancer', 198, 330, 230, C.dim);
      out += box(450, 60, 730, 540, { dashed: true }) + text('Cluster', 815, 115, 28, { color: C.blue });
      out += arrow(436, 330, 480, 330) + node('Gateway', 490, 330, 150, C.teal);
      out += curve('M650 310 C700 220 720 190 765 190') + arrow(757, 190, 767, 190) + pills(705, 230, ['/'], { size: 20 });
      out += curve('M650 350 C700 440 720 470 765 470') + arrow(757, 470, 767, 470) + pills(705, 430, ['/api'], { size: 20 });
      out += node('frontend', 775, 190, 170) + node('api', 775, 470, 170);
      [190, 470].forEach((y) => {
        out += arrow(955, y, 995, y);
        [1005, 1060, 1115].forEach((x) => { out += box(x, y - 22, 44, 44, { color: C.purple, radius: 10, strokeWidth: 3 }); });
      });
      out += text('Pods', 1082, 252, 22, { color: C.dim }) + text('Pods', 1082, 532, 22, { color: C.dim });
      return out;
    },
  },
  // The four diagrams of the Load Balancer Service guide.
  {
    out: figure(LB, 'load-balancer'),
    background: 'white',
    alt: 'Clients send requests over the internet to a load balancer, which distributes them across three servers',
    svg: () => {
      let out = text('Clients', 150, 92, 30);
      [170, 315, 460].forEach((y) => {
        out += icon('user', 150, y, 72, C.blue) + arrow(200, y, 372, 315 + (y - 315) * 0.25, { color: C.blue });
      });
      out += icon('globe', 440, 315, 110, C.blue) + text('Internet', 440, 420);
      out += arrow(505, 315, 630, 315);
      out += box(640, 250, 200, 130, { color: C.teal }) + icon('split', 740, 315, 70) + text('Load Balancer', 740, 430);
      [170, 315, 460].forEach((y) => {
        out += arrow(850, 315 + (y - 315) * 0.25, 1000, y) + icon('server', 1050, y, 80, C.blue);
      });
      return out;
    },
  },
  {
    out: figure(LB, 'load-balancer-service'),
    background: 'white',
    alt: 'Incoming traffic reaches a LoadBalancer, which sends it to a Kubernetes Service in the cluster, and the Service distributes it across three Pod replicas',
    svg: () => {
      let out = icon('cloud', 140, 315, 130, C.blue) + text('Incoming traffic', 140, 420);
      out += arrow(220, 315, 320, 315);
      out += box(330, 250, 190, 130, { color: C.teal }) + icon('split', 425, 315, 70) + text('LoadBalancer', 425, 430);
      out += box(600, 70, 570, 490, { dashed: true }) + logo('kubernetes', 885, 70, 80) + text('The Cluster', 885, 150);
      out += arrow(530, 315, 650, 315);
      out += box(660, 250, 170, 130, { color: C.blue }) + icon('network', 745, 315, 70, C.blue) + text('Kubernetes', 745, 430) + text('Service', 745, 466);
      out += text('Replicas', 1050, 215, 26, { color: C.dim });
      [270, 365, 460].forEach((y, i) => {
        out += arrow(840, 315, 950, y - 0) + box(960, y - 35, 180, 70, { color: C.blue, radius: 14, strokeWidth: 3.5 }) + text(`Pod ${i + 1}`, 1050, y + 10);
      });
      return out;
    },
  },
  {
    out: figure(LB, 'endpointslice'),
    background: 'white',
    alt: 'The nginx-loadbalancer-service Service selects the pods with the label app=nginx, and its EndpointSlice lists the addresses of the three Pod replicas',
    svg: () => {
      let out = box(100, 205, 220, 180, { color: C.blue }) + logo('kubernetes', 210, 295, 110);
      out += text('Service', 210, 440) + text('nginx-loadbalancer-service', 210, 478, 20, { mono: true }) + text('selector: app=nginx', 210, 512, 20, { mono: true });
      out += arrow(335, 295, 505, 295, { color: C.blue, both: true });
      out += box(520, 145, 160, 300, { color: C.purple }) + icon('list', 600, 295, 70, C.purple) + text('EndpointSlice', 600, 500);
      out += box(800, 95, 360, 440, { dashed: true }) + text('Replicas', 980, 145, 26, { color: C.dim });
      [205, 325, 445].forEach((y, i) => {
        out += arrow(690, 295 + (y - 325) * 0.6, 880, y - 10, { color: C.purple })
          + box(890, y - 45, 180, 70, { color: C.blue, radius: 14, strokeWidth: 3.5 }) + text(`Pod ${i + 1}`, 980, y)
          + text('app=nginx', 980, y + 55, 20, { mono: true, color: C.dim });
      });
      return out;
    },
  },
  {
    out: figure(LB, 'gateway-api'),
    background: 'white',
    alt: 'A client reaches a Gateway in the cluster through a load balancer, an HTTPRoute sends the request to a Service, and the Service sends it to its Pods',
    svg: () => {
      const node = (label, x, w, color = C.blue) => box(x, 280, w, 70, { color, radius: 14, strokeWidth: 3.5 }) + text(label, x + w / 2, 325);
      let out = box(20, 280, 140, 70, { color: C.dim, radius: 35, strokeWidth: 3.5 }) + text('Client', 90, 325);
      out += box(365, 90, 805, 450, { dashed: true }) + text('Cluster', 767, 150, 28, { color: C.blue });
      out += arrow(170, 315, 375, 315, { dashed: true }) + text('Load balancer', 262, 280, 24, { color: C.dim });
      out += node('Gateway', 390, 160, C.teal) + arrow(558, 315, 580, 315);
      out += node('HTTPRoute', 590, 185, C.teal) + arrow(780, 315, 815, 315);
      out += node('Service', 825, 140);
      out += curve('M975 300 C995 240 1005 225 1015 225') + arrow(1008, 225, 1018, 225);
      out += curve('M975 330 C995 390 1005 405 1015 405') + arrow(1008, 405, 1018, 405);
      out += box(1025, 190, 120, 70, { color: C.blue, radius: 14, strokeWidth: 3.5 }) + text('Pod', 1085, 235);
      out += box(1025, 370, 120, 70, { color: C.blue, radius: 14, strokeWidth: 3.5 }) + text('Pod', 1085, 415);
      return out;
    },
  },
  {
    out: figure('2025-04-22-why-flexibility-is-key-to-scaling-development-environments', 'divert'),
    background: 'white',
    alt: 'A diagram showing diverted traffic from staging to dev environment',
    svg: () => {
      const service = (name, x, y, color) => box(x - 78, y - 34, 156, 68, { color, radius: 14, strokeWidth: 3.5 }) + text(name, x, y + 9, 25);
      // Plain lines: the glow filter drops a perfectly horizontal line.
      const line = (x1, y1, x2, y2, color = C.blue) => `<path d="M${x1} ${y1} L${x2} ${y2}" stroke="${color}" stroke-width="4.5" stroke-linecap="round"/>`;
      // Staging, with the whole application, centered on x=750.
      let out = box(400, 45, 700, 300, { dashed: true }) + pills(490, 45, ['Staging'], { color: C.blue, size: 22, fill: C.ink });
      out += line(509, 150, 560, 150) + line(720, 150, 780, 150) + line(940, 150, 991, 150);
      out += line(680, 184, 732, 236) + line(820, 184, 768, 236);
      out += icon('database', 486, 150, 60, C.blue) + icon('database', 1014, 150, 60, C.blue);
      out += service('Service-A', 640, 150, C.blue) + service('Service-B', 860, 150, C.blue) + service('Service-C', 750, 270, C.blue);
      // Both URLs enter through Service-C.
      out += pills(190, 240, ['https://app-staging.okteto.dev'], { color: C.blue, size: 19, fill: C.ink }) + arrow(366, 240, 657, 258, { color: C.blue });
      out += pills(190, 296, ['https://app-cindy.okteto.dev'], { size: 19 }) + arrow(358, 296, 657, 282);
      // Cindy's environment only runs Service-A and its database, under Service-C.
      out += box(515, 430, 370, 165, { color: C.teal, dashed: true }) + pills(600, 430, ['Cindy'], { size: 22 });
      out += icon('database', 596, 520, 60) + line(619, 520, 670, 520, C.teal) + service('Service-A', 750, 520, C.teal);
      // Her requests are diverted from Service-C to her Service-A, and go on to Service-B.
      out += arrow(750, 310, 750, 478);
      out += curve('M833 520 C995 520 995 300 897 196') + arrow(903, 204, 889, 190);
      return out;
    },
  },
  {
    out: post('2021-08-18-webpack-dev-server-in-a-container'),
    alt: 'A laptop synchronizes files with a container that runs Webpack',
    svg: row([badge('laptop', null, { r: 80 }), 'both', group('Container', [smallMark('webpack', { size: 120 })], { dashed: true, color: C.teal })]),
  },
  {
    out: post('2025-02-11-vite-dev-server-in-a-container'),
    alt: 'A laptop synchronizes files with a container that runs Vite',
    svg: row([badge('laptop', null, { r: 80 }), 'both', group('Container', [smallMark('vite', { size: 120 })], { dashed: true, color: C.teal })]),
  },

  // -------------------------------------------------------------------------
  // Tutorials
  {
    out: 'tutorials/posts/2026-09-18-agent-ticket-to-pr/img/ticket-to-pr.webp',
    background: 'white',
    alt: 'The agent label on a GitHub issue starts a GitHub Actions runner with Claude Code and the Okteto plugin. The agent deploys and tests the application in the Namespace agent-issue-42 and opens a pull request with the live URL. When the pull request closes, the cleanup job destroys the Namespace',
    svg: () => {
      let out = box(60, 160, 180, 190, { color: C.blue, radius: 22 }) + icon('ticket', 150, 210, 56, C.blue) + text('Issue', 150, 272, 26)
        + box(102, 292, 96, 36, { color: C.purple, radius: 18, strokeWidth: 2.5, fill: C.pill }) + text('agent', 150, 317, 22, { color: C.purple });
      out += arrow(250, 255, 300, 255);
      out += box(310, 120, 300, 270, { color: C.purple, dashed: true }) + text('GitHub Actions runner', 460, 165, 24, { color: C.dim })
        + circle(460, 240, 46, { color: C.purple }) + icon('bot', 460, 240, 50, C.purple) + text('Claude Code', 460, 320, 26) + text('Okteto plugin', 460, 356, 22, { color: C.dim });
      out += arrow(622, 255, 760, 255) + text('deploy, test', 691, 235, 22, { color: C.dim });
      out += box(770, 120, 370, 270, { color: C.blue }) + text('Namespace', 955, 165, 24, { color: C.dim }) + text('agent-issue-42', 955, 200, 26)
        + icon('box', 875, 290, 58) + icon('box', 955, 290, 58) + icon('flask-conical', 1035, 290, 58, C.amber);
      out += arrow(460, 395, 460, 445);
      out += box(360, 450, 200, 140, { color: C.teal, radius: 22 }) + icon('git-pull-request', 460, 500, 50) + text('Pull request', 460, 565, 24);
      out += arrow(570, 520, 885, 520) + text('on close', 728, 500, 22, { color: C.dim });
      out += circle(955, 520, 56, { color: C.red }) + icon('trash-2', 955, 520, 50, C.red) + text('Cleanup', 955, 605, 24);
      out += arrow(955, 460, 955, 400, { color: C.red, dashed: true });
      return `<g transform="translate(0 -40)">${out}</g>`;
    },
  },
  {
    out: tutorial('2026-09-18-agent-ticket-to-pr'),
    alt: 'An issue goes to an AI agent, which opens a pull request',
    svg: row([tile('ticket', 'Issue', { color: C.blue }), 'arrow', badge('bot', 'Agent', { color: C.purple, r: 74 }), 'arrow', tile('git-pull-request', 'Pull request', { color: C.teal })]),
  },
  {
    out: tutorial('2022-03-31-compose-getting-started'),
    alt: 'The Docker logo with an arrow to the Kubernetes logo',
    svg: row([mark('docker', { size: 230 }), 'arrow', kubernetes()]),
  },
  {
    out: tutorial('2026-11-17-testcontainers'),
    alt: 'Tests talk to kubedock, which runs their containers, such as a database, as pods in a Kubernetes namespace',
    svg: row([
      tile('flask-conical', 'Tests', { color: C.teal }),
      'arrow',
      tile('server', 'kubedock', { color: C.teal }),
      'arrow',
      group('Namespace', [item('database'), item('box')], { top: 'kubernetes' }),
    ]),
  },
  {
    out: tutorial('2026-11-19-dependencies'),
    alt: 'Okteto deploys the mongodb and frontend repositories in parallel, and the api repository once mongodb is deployed',
    svg: (() => {
      const repo = (cx, cy, name, label) => box(cx - 115, cy - 85, 230, 170)
        + icon(name, cx, cy - 20, 66) + text(label, cx, cy + 56, 34);
      return logo('okteto', 215, 315, 190)
        + arrow(320, 280, 430, 205) + arrow(320, 350, 430, 425)
        + repo(565, 185, 'database', 'mongodb')
        + repo(565, 445, 'globe', 'frontend')
        + arrow(700, 185, 800, 185)
        + repo(935, 185, 'server', 'api');
    })(),
  },
  {
    out: tutorial('2026-11-13-cloud-infrastructure'),
    alt: 'A Namespace, Terraform, and the S3 bucket that Terraform creates for it',
    svg: row([group('Namespace', pods(3), { dashed: true, color: C.teal }), 'arrow', mark('terraform', { size: 120 }), 'arrow', group('S3 bucket', [item('bucket', { color: C.amber, size: 84 })], { color: C.amber, minWidth: 230 })]),
  },
  {
    out: tutorial('2025-10-01-optimize-your-application-environment'),
    alt: 'A snail goes through the optimizations (builds, remote execution, Volume Snapshots, and Divert) and comes out as a rocket',
    svg: row([
      badge('snail', null, { color: C.amber, r: 86 }),
      'arrow',
      group('Optimizations', [item('layers'), item('server'), item('database'), item('split')], { dashed: true, color: C.teal }),
      'arrow',
      badge('rocket', null, { color: C.teal, r: 86 }),
    ]),
  },

  // -------------------------------------------------------------------------
  // Docs
  {
    out: 'static/img/platform-governance.webp',
    background: 'white',
    theme: 'neon',
    alt: GOVERNANCE_ALT,
    svg: () => {
      let out = '';
      // Who uses the environments, each joined to the same entry point.
      GOVERNANCE_USERS().forEach(([name, label, color], i) => {
        const y = 98 + i * 195;
        out += circle(100, y, 48, { color }) + icon(name, 100, y, 50, color) + text(label, 100, y + 84, 26);
        out += curve(`M150 ${y} C250 ${y} 240 315 330 315`, { color, strokeWidth: 6 });
      });
      out += arrow(330, 315, 460, 315);
      out += icon('key-round', 395, 205, 40, C.amber) + text('Time-bound', 395, 255, 22, { color: C.amber }) + text('credentials', 395, 283, 22, { color: C.amber });
      // Okteto on Kubernetes, with a Namespace for each of them.
      out += governanceCluster(650, 80, 360);
      // The platform team operates the cluster with these controls.
      out += circle(1040, 100, 46, { color: C.blue }) + icon('wrench', 1040, 100, 46, C.blue) + text('Platform team', 1040, 184, 26);
      out += arrow(892, 388, 840, 388, { color: C.blue });
      out += governanceControls(900, 215, 280);
      return out;
    },
  },
  {
    out: 'static/img/platform-governance-mobile.webp',
    background: 'white',
    theme: 'neon',
    width: 600,
    height: 1410,
    alt: GOVERNANCE_ALT,
    svg: () => {
      let out = '';
      GOVERNANCE_USERS().forEach(([name, label, color], i) => {
        const x = 105 + i * 195;
        out += circle(x, 70, 46, { color }) + icon(name, x, 70, 48, color) + text(label, x, 152, 24);
        out += curve(`M${x} 178 C${x} 215 300 200 300 228`, { color, strokeWidth: 6 });
      });
      out += arrow(300, 228, 300, 290);
      out += icon('key-round', 345, 240, 34, C.amber) + text('Time-bound', 372, 250, 24, { color: C.amber, anchor: 'start' }) + text('credentials', 372, 280, 24, { color: C.amber, anchor: 'start' });
      out += governanceCluster(300, 340, 380);
      out += arrow(300, 872, 300, 800, { color: C.blue });
      out += governanceControls(150, 880, 300);
      out += circle(300, 1290, 46, { color: C.blue }) + icon('wrench', 300, 1290, 46, C.blue) + text('Platform team', 300, 1373, 26);
      return out;
    },
  },
  {
    out: 'static/img/preview-url.webp',
    background: 'white',
    alt: PREVIEW_ALT,
    svg: () => {
      let out = circle(130, 315, 62, { color: C.purple }) + icon('bot', 130, 315, 64, C.purple);
      out += arrow(212, 315, 282, 315);
      out += browser(300, 115, 440, 400);
      PREVIEW_REVIEWERS().forEach(([name, label], i) => {
        const y = 165 + i * 150;
        out += arrow(758, 315 + (i - 1) * 70, 848, y + (1 - i) * 30);
        out += circle(910, y, 50) + icon(name, 910, y, 50) + text(label, 980, y + 10, 30, { anchor: 'start' });
      });
      return out;
    },
  },
  {
    out: 'static/img/preview-url-mobile.webp',
    background: 'white',
    width: 600,
    height: 900,
    alt: PREVIEW_ALT,
    svg: () => {
      let out = circle(300, 80, 54, { color: C.purple }) + icon('bot', 300, 80, 56, C.purple);
      out += arrow(300, 148, 300, 200);
      out += browser(60, 215, 480, 380);
      PREVIEW_REVIEWERS().forEach(([name, label], i) => {
        const x = 105 + i * 195;
        out += arrow(300 + (i - 1) * 60, 612, x, 680);
        out += circle(x, 740, 48) + icon(name, x, 740, 48) + text(label, x, 826, 26);
      });
      return out;
    },
  },
  {
    out: 'static/img/one-definition.webp',
    background: 'white',
    alt: MANIFEST_ALT,
    svg: () => {
      let out = '';
      MANIFEST_USERS().forEach(([name, label, color], i) => {
        const y = 105 + i * 200;
        out += circle(110, y, 46, { color }) + icon(name, 110, y, 48, color) + text(label, 110, y + 82, 26);
        out += curve(`M166 ${y} C300 ${y} 270 300 372 300`, { color, strokeWidth: 5 });
      });
      out += arrow(372, 300, 390, 300);
      out += manifestFile(465, 300);
      out += arrow(546, 300, 600, 300);
      out += environments(890, 140);
      return out;
    },
  },
  {
    out: 'static/img/one-definition-mobile.webp',
    background: 'white',
    width: 600,
    height: 980,
    alt: MANIFEST_ALT,
    svg: () => {
      let out = '';
      MANIFEST_USERS().forEach(([name, label, color], i) => {
        const x = 105 + i * 195;
        out += circle(x, 70, 46, { color }) + icon(name, x, 70, 48, color) + text(label, x, 152, 24);
        out += curve(`M${x} 178 C${x} 215 300 200 300 228`, { color, strokeWidth: 5 });
      });
      out += manifestFile(300, 330);
      out += arrow(300, 470, 300, 530);
      out += environments(300, 590);
      return out;
    },
  },
  {
    out: 'static/img/environments-at-scale.webp',
    background: 'white',
    alt: SCALE_ALT,
    svg: () => scaleCluster(350, 75, 540, 96, 24) + arrow(770, 330, 645, 330, { color: C.blue }) + scaleFeatures(790, 73, 330),
  },
  {
    out: 'static/img/environments-at-scale-mobile.webp',
    background: 'white',
    width: 600,
    height: 1170,
    alt: SCALE_ALT,
    svg: () => scaleCluster(300, 60, 480, 88, 18) + arrow(300, 640, 300, 548, { color: C.blue }) + scaleFeatures(100, 650, 400),
  },
  {
    out: 'static/img/environment-workflow.webp',
    background: 'white',
    alt: WORKFLOW_ALT,
    svg: () => cliBox(40, 150, 400)
      + arrow(470, 330, 640, 330, { color: C.teal }) + text('deploy, test', 555, 308, 24, { color: C.teal })
      + arrow(640, 390, 470, 390, { color: C.dim }) + text('results, logs', 555, 432, 24, { color: C.dim })
      + environmentBox(670, 90, 490),
  },
  {
    out: 'static/img/environment-workflow-mobile.webp',
    background: 'white',
    width: 600,
    height: 1190,
    alt: WORKFLOW_ALT,
    svg: () => cliBox(80, 60, 440)
      + arrow(230, 455, 230, 590, { color: C.teal }) + text('deploy, test', 210, 530, 24, { color: C.teal, anchor: 'end' })
      + arrow(370, 590, 370, 455, { color: C.dim }) + text('results, logs', 390, 530, 24, { color: C.dim, anchor: 'start' })
      + environmentBox(60, 640, 480),
  },
  {
    out: 'static/img/deploy-movies-app.webp',
    background: 'white',
    alt: 'Kube Movies architecture',
    svg: () => {
      // The rows of the environment, from its top edge: the two services, the
      // database, and the seed job that loads the data into it.
      const top = 66;
      const [front, api, mongo, seed] = [top + 146, top + 226, top + 338, top + 450];
      let out = circle(215, front + 29, 46, { color: C.teal }) + icon('user', 215, front + 29, 48, C.teal) + text('Developer', 215, front + 109, 26);
      out += moviesEnvironment(895, top, 510, 538);
      out += arrow(265, front + 29, 302, front + 29, { color: C.blue });
      out += curve(`M530 ${front + 57} V${api + 29} H600`, { color: C.blue });
      out += arrow(700, front + 29, 737, front + 29, { color: C.blue }) + arrow(700, api + 29, 737, api + 29, { color: C.blue });
      out += urlPill(700, front + 29) + apiPill(700, api + 29);
      out += service(745, front, 300, 'box', 'frontend') + service(745, api, 300, 'box', 'api') + service(745, mongo, 300, 'database', 'MongoDB') + service(745, seed, 300, 'terminal', 'seed');
      out += arrow(895, api + 66, 895, mongo - 8, { color: C.dim, both: true });
      out += arrow(895, seed - 8, 895, mongo + 66, { color: C.dim });
      // Shifted left so the drawing is centered on the canvas.
      return `<g transform="translate(-52 0)">${out}</g>`;
    },
  },
  {
    out: 'static/img/deploy-movies-app-mobile.webp',
    background: 'white',
    width: 600,
    height: 910,
    alt: 'Kube Movies architecture',
    svg: () => {
      let out = circle(300, 70, 46, { color: C.teal }) + icon('user', 300, 70, 48, C.teal) + text('Developer', 362, 80, 26, { anchor: 'start' });
      out += arrow(300, 122, 300, 190, { color: C.blue });
      out += moviesEnvironment(360, 300, 420, 570);
      out += curve('M90 256 V569 H100', { color: C.blue }) + arrow(90, 479, 222, 479, { color: C.blue }) + arrow(200, 569, 222, 569, { color: C.blue });
      out += urlPill(470, 228) + apiPill(200, 569);
      out += service(230, 450, 260, 'box', 'frontend') + service(230, 540, 260, 'box', 'api') + service(230, 660, 260, 'database', 'MongoDB') + service(230, 780, 260, 'terminal', 'seed');
      out += arrow(360, 606, 360, 652, { color: C.dim, both: true });
      out += arrow(360, 772, 360, 726, { color: C.dim });
      return out;
    },
  },
  {
    out: 'static/img/environment-full-replica.webp',
    background: 'white',
    alt: FULL_REPLICA_ALT,
    svg: () => fullReplica(240, 186),
  },
  {
    out: 'static/img/environment-full-replica-mobile.webp',
    background: 'white',
    width: 600,
    height: 1260,
    alt: FULL_REPLICA_ALT,
    svg: () => fullReplica(100, 190, true),
  },
  {
    out: 'static/img/environment-divert.webp',
    background: 'white',
    alt: DIVERT_ALT,
    svg: () => divert(153, 107),
  },
  {
    out: 'static/img/environment-divert-mobile.webp',
    background: 'white',
    width: 600,
    height: 900,
    alt: DIVERT_ALT,
    svg: () => divertStacked(30, 190),
  },
  {
    out: 'static/img/agent-sandbox.webp',
    background: 'white',
    alt: AGENT_ALT,
    svg: () => agentSandbox(40, 150, 400)
      + arrow(470, 330, 640, 330, { color: C.purple }) + text('deploy, test', 555, 308, 24, { color: C.purple })
      + arrow(640, 390, 470, 390, { color: C.dim }) + text('results, logs', 555, 432, 24, { color: C.dim })
      + environmentBox(670, 90, 490),
  },
  {
    out: 'static/img/agent-sandbox-mobile.webp',
    background: 'white',
    width: 600,
    height: 1190,
    alt: AGENT_ALT,
    svg: () => agentSandbox(80, 60, 440)
      + arrow(230, 455, 230, 590, { color: C.purple }) + text('deploy, test', 210, 530, 24, { color: C.purple, anchor: 'end' })
      + arrow(370, 590, 370, 455, { color: C.dim }) + text('results, logs', 390, 530, 24, { color: C.dim, anchor: 'start' })
      + environmentBox(60, 640, 480),
  },
];

covers.push(...docsApplicationEnvironments, ...docsEndpointsDivert, ...docsAgentsPreviews, ...docsDevelopmentContainers, ...docsUserSettings);

export default covers.map((cover) => ({ ...cover, background: cover.background ?? rotation(cover.out) }));
