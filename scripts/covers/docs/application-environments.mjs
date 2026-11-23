// Diagrams of the application-environments docs pages, drawn with the light theme of style.mjs.
// Each entry has the same fields as the entries of covers.mjs.
//
// The Build Service, Smart Builds, and Remote Execution diagrams share one
// scene: an Okteto Manifest, the command that a user runs, and the cluster
// where Okteto runs BuildKit and the Okteto Registry. Each one has a wide
// version (1200x630) and a stacked version for phones (600 wide).

import { C, text, icon, logo, box, circle, arrow, curve } from '../style.mjs';

const MONO = 22;
const LINE = 33;

// The Okteto Manifest: a card with the file name and a few lines of YAML.
function manifest(x, y, w, lines) {
  const h = 108 + lines.length * LINE;
  let out = box(x, y, w, h, { color: C.teal, radius: 20 }) + icon('code', x + 40, y + 42, 30, C.teal)
    + text('okteto.yaml', x + 68, y + 52, 26, { anchor: 'start' });
  out += `<path d="M${x} ${y + 78} H${x + w}" stroke="${C.teal}" stroke-width="2" opacity="0.5"/>`;
  lines.forEach((line, i) => {
    const indent = line.match(/^ */)[0].length;
    const [key, ...rest] = line.trim().split(/(?<=:) /);
    const ly = y + 116 + i * LINE;
    out += text(key, x + 32 + indent * 13, ly, MONO, { anchor: 'start', mono: true, color: rest.length || key.endsWith(':') ? C.blue : C.text });
    if (rest.length) out += text(rest.join(' '), x + 32 + indent * 13 + (key.length + 1) * MONO * 0.6, ly, MONO, { anchor: 'start', mono: true });
  });
  return { svg: out, h };
}

// A user, with their name under the circle, and the command they run.
function command(x, cy, w, user, label) {
  return circle(x + 40, cy, 38, { color: C.teal }) + icon('user', x + 40, cy, 40, C.teal) + text(user, x + 40, cy + 72, 24)
    + box(x + 100, cy - 30, w - 100, 60, { color: C.text, radius: 30, strokeWidth: 3 })
    + text('$', x + 128, cy + 8, MONO + 2, { anchor: 'start', mono: true, color: C.teal })
    + text(label, x + 154, cy + 8, MONO + 2, { anchor: 'start', mono: true });
}

// The cluster: a Kubernetes box with Okteto's BuildKit and Registry inside.
function cluster(x, y, w, h) {
  return box(x, y, w, h, { color: C.blue }) + logo('kubernetes', x + w / 2, y, 76)
    + text('Okteto', x + w / 2, y + 78, 30);
}

function buildkit(x, y, w, { dimmed = false, note } = {}) {
  const color = dimmed ? C.dim : C.blue;
  return box(x, y, w, 72, { color, fill: C.row, radius: 14, strokeWidth: 2.5, dashed: dimmed })
    + icon('server', x + 40, y + 36, 32, color) + text('BuildKit', x + 72, y + 45, 26, { anchor: 'start', color: dimmed ? C.dim : C.text })
    + (note ? text(note, x + w - 24, y + 45, 22, { anchor: 'end', color: C.dim }) : '');
}

function registry(x, y, w, h) {
  return box(x, y, w, h, { color: C.blue, fill: C.row, radius: 14, strokeWidth: 2.5 })
    + icon('boxes', x + 40, y + 38, 32, C.blue) + text('Okteto Registry', x + 72, y + 47, 26, { anchor: 'start' });
}

// An image tag in the registry.
function image(cx, cy, label, color = C.text) {
  const w = label.length * MONO * 0.6 + 76;
  return box(cx - w / 2, cy - 24, w, 48, { color: C.dim, radius: 24, strokeWidth: 2 })
    + icon('box', cx - w / 2 + 30, cy, 24, C.blue) + text(label, cx - w / 2 + 52, cy + 8, MONO, { anchor: 'start', mono: true, color });
}

// A curved connection with a head at its end, from (x1, y1) to (x2, y2).
function link(x1, y1, x2, y2, label, { color = C.teal } = {}) {
  const mx = (x1 + x2) / 2;
  const d = `M${x1} ${y1} C${mx} ${y1} ${mx} ${y2} ${x2 - 22} ${y2}`;
  return curve(d, { color, strokeWidth: 4.5 }) + arrow(x2 - 26, y2, x2 - 4, y2, { color })
    + (label ? text(label, mx - 22, (y1 + y2) / 2 + 8, 24, { color, anchor: 'end' }) : '');
}

const BUILD_YAML = ['build:', '  api:', '    context: api', '    dockerfile: Dockerfile', '    args:', '      GO_VERSION: 1.20'];
const DEPLOY_YAML = ['deploy:', '  image: alpine/helm:4.3.2', '  commands:', '    - helm upgrade --install', '        movies chart'];

// The inside of the cluster for each diagram, drawn from the top-left corner
// (x, y) of the area under the cluster title, w wide. Returns the drawing,
// its height, and the point where the command's connection ends.
const INSIDE = {
  build(x, y, w) {
    let out = buildkit(x, y, w) + registry(x, y + 130, w, 150);
    out += arrow(x + w / 2, y + 72, x + w / 2, y + 128, { color: C.blue }) + text('push', x + w / 2 + 16, y + 108, 24, { anchor: 'start', color: C.blue });
    out += image(x + w / 2, y + 230, 'cindy/api:okteto');
    return { svg: out, h: 280, target: [x, y + 36] };
  },
  smartFirst(x, y, w) {
    let out = buildkit(x, y, w) + registry(x, y + 130, w, 220);
    out += arrow(x + w / 2, y + 72, x + w / 2, y + 128, { color: C.blue }) + text('push', x + w / 2 + 16, y + 108, 24, { anchor: 'start', color: C.blue });
    out += image(x + w / 2, y + 230, 'okteto/api:09f8e', C.teal);
    out += arrow(x + w / 2, y + 280, x + w / 2, y + 256, { color: C.dim }) + text('tag', x + w / 2 + 16, y + 276, 22, { anchor: 'start', color: C.dim });
    out += image(x + w / 2, y + 306, 'cindy/api:okteto');
    return { svg: out, h: 350, target: [x, y + 36] };
  },
  smartReuse(x, y, w) {
    let out = buildkit(x, y, w, { dimmed: true, note: 'skipped' }) + registry(x, y + 130, w, 220);
    out += image(x + w / 2, y + 230, 'okteto/api:09f8e', C.teal);
    out += arrow(x + w / 2, y + 280, x + w / 2, y + 256, { color: C.dim }) + text('tag', x + w / 2 + 16, y + 276, 22, { anchor: 'start', color: C.dim });
    out += image(x + w / 2, y + 306, 'david/api:okteto');
    return { svg: out, h: 350, target: [x, y + 175] };
  },
  remote(x, y, w) {
    let out = buildkit(x, y, w);
    out += arrow(x + w / 2, y + 72, x + w / 2, y + 128, { color: C.blue }) + text('exec', x + w / 2 + 16, y + 108, 24, { anchor: 'start', color: C.blue });
    out += box(x, y + 130, w, 170, { color: C.blue, fill: C.row, radius: 14, strokeWidth: 2.5 })
      + icon('box', x + 40, y + 168, 30, C.blue) + text('alpine/helm:4.3.2', x + 70, y + 177, 24, { anchor: 'start', mono: true });
    out += `<path d="M${x} ${y + 200} H${x + w}" stroke="${C.dim}" stroke-width="2" opacity="0.6"/>`;
    out += text('$', x + 28, y + 242, MONO, { anchor: 'start', mono: true, color: C.teal })
      + text('helm upgrade --install', x + 52, y + 242, MONO, { anchor: 'start', mono: true })
      + text('movies chart', x + 52, y + 276, MONO, { anchor: 'start', mono: true });
    return { svg: out, h: 300, target: [x, y + 36] };
  },
};

const SCENES = {
  build: { yaml: BUILD_YAML, user: 'Cindy', cmd: 'okteto build', label: 'build' },
  smartFirst: { yaml: BUILD_YAML, user: 'Cindy', cmd: 'okteto build', label: 'build' },
  smartReuse: { yaml: BUILD_YAML, user: 'David', cmd: 'okteto build', label: 'tag' },
  remote: { yaml: DEPLOY_YAML, user: 'Cindy', cmd: 'okteto deploy', label: 'run' },
};

// Wide: the manifest and the command on the left, the cluster on the right,
// both centered on the canvas, with 60px of margin on each side. The cluster
// keeps 50px between its border and its content, at the sides and below, so
// the connection that enters it has room before its arrowhead.
function wide(name) {
  const scene = SCENES[name];
  const cardH = manifest(0, 0, 440, scene.yaml).h;
  const leftH = cardH + 170;
  const leftTop = (630 - leftH) / 2;
  const card = manifest(60, leftTop, 440, scene.yaml);
  const cy = leftTop + cardH + 70;
  const insideH = INSIDE[name](710, 0, 380).h;
  const top = (630 - (insideH + 160)) / 2 + 20;
  const content = INSIDE[name](710, top + 110, 380);
  let out = card.svg + command(60, cy, 440, scene.user, scene.cmd);
  out += cluster(660, top, 480, insideH + 160) + content.svg;
  out += link(500, cy, content.target[0], content.target[1], scene.label);
  return out;
}

// Stacked: the manifest, the command, and the cluster, from top to bottom.
function stacked(name) {
  const scene = SCENES[name];
  const card = manifest(50, 40, 500, scene.yaml);
  const cy = 40 + card.h + 60;
  const top = cy + 170;
  const inside = INSIDE[name](110, top + 110, 380);
  let out = card.svg + command(50, cy, 500, scene.user, scene.cmd);
  out += cluster(60, top, 480, inside.h + 160) + inside.svg;
  out += arrow(300, cy + 34, 300, top - 46, { color: C.teal }) + text(scene.label, 316, cy + 100, 24, { anchor: 'start', color: C.teal });
  return { svg: out, height: top + inside.h + 180 };
}

const ALT = {
  build: 'Cindy runs okteto build with an Okteto Manifest that builds the api image. Okteto builds it on BuildKit in the cluster and pushes the image cindy/api:okteto to the Okteto Registry',
  smartFirst: 'Smart Builds on the first build: Cindy runs okteto build, BuildKit builds the api image and pushes it as okteto/api:09f8e, the hash of its build context, and the Okteto Registry tags cindy/api:okteto to it',
  smartReuse: 'Smart Builds on a later build: David runs okteto build with the same build context, Okteto skips the build on BuildKit, and the Okteto Registry tags david/api:okteto to the existing okteto/api:09f8e image',
  remote: 'Cindy runs okteto deploy with an Okteto Manifest whose deploy section uses the alpine/helm:4.3.2 image. Okteto runs the deploy commands on BuildKit in the cluster, in a container of the alpine/helm:4.3.2 image that runs helm upgrade --install movies chart',
};

const OUT = { build: 'build-service-flow', smartFirst: 'smart-builds-first-build', smartReuse: 'smart-builds-reuse', remote: 'remote-execution-flow' };

export default Object.keys(SCENES).flatMap((name) => {
  const tall = () => stacked(name);
  return [
    { out: `static/img/${OUT[name]}.webp`, background: 'white', alt: ALT[name], svg: () => wide(name) },
    { out: `static/img/${OUT[name]}-mobile.webp`, background: 'white', width: 600, height: tall().height, alt: ALT[name], svg: () => tall().svg },
  ];
});
