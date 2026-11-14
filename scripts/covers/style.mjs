// The visual system of the blog and tutorial covers: a schematic drawn with
// neon lines on a night-blue background, with a faint 80s grid at the bottom.
// No titles: the image shows what the article is about.
//
// A cover is an SVG string built with the helpers of this file, on a
// 1200x630 canvas. Keep the subject between y=60 and y=500 (the grid starts
// at y=520) and use few, short labels.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
export const root = path.resolve(here, '../..');
const fileUrl = (relative) => `file://${path.join(root, relative)}`;

export const W = 1200;
export const H = 630;

// The palette. Teal is Okteto's; blue is Kubernetes'; purple is for agents.
export const C = {
  text: '#ffffff',
  ink: '#100c26', // fill of boxes
  teal: '#00d1ca',
  purple: '#b44cff',
  blue: '#4d8dff',
  pink: '#ff4fd8',
  amber: '#ffb13b',
  red: '#ff5c7a',
  dim: '#6b6590',
  kubernetes: '#326ce5',
};

const GLOW = 'filter="url(#glow)"';
const estimate = (string, size) => string.length * size * 0.56;
const escape = (string) => String(string).replace(/&/g, '&amp;').replace(/</g, '&lt;');

// ---------------------------------------------------------------------------
// The page: background, grid and the subject.

function floor() {
  const top = 520;
  const vx = 600;
  const vy = 380;
  let lines = '';
  for (let i = -14; i <= 14; i++) {
    const x2 = 600 + i * 120;
    const t = (top - vy) / (H + 40 - vy);
    lines += `<line x1="${vx + (x2 - vx) * t}" y1="${top}" x2="${x2}" y2="${H + 40}"/>`;
  }
  for (let k = 1; k <= 5; k++) {
    const y = top + 110 * Math.pow(k / 5, 1.8);
    lines += `<line x1="0" y1="${y}" x2="${W}" y2="${y}"/>`;
  }
  return `<g stroke="${C.pink}" stroke-width="1.5" mask="url(#floormask)">${lines}</g>`;
}

export function page(subject) {
  return `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face { font-family: Circular; font-weight: 700; src: url('${fileUrl('shared/static/fonts/CircularXXWeb-Bold.woff2')}') format('woff2'); }
html, body { margin: 0; }
body { width: ${W}px; height: ${H}px; overflow: hidden; }
text { font-family: Circular, sans-serif; font-weight: 700; }
text.mono { font-family: Menlo, Consolas, monospace; font-weight: 700; }
</style></head><body><svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
<defs>
  <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
    <feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>
  <filter id="iconglow" x="-50%" y="-50%" width="200%" height="200%">
    <feGaussianBlur stdDeviation="1.1" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>
  <filter id="logoglow" x="-50%" y="-50%" width="200%" height="200%">
    <feGaussianBlur stdDeviation="0.7" result="b"/><feComponentTransfer in="b" result="c"><feFuncA type="linear" slope="0.6"/></feComponentTransfer><feMerge><feMergeNode in="c"/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>
  <filter id="halo" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.1"/></filter>
  <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#141a38"/><stop offset="1" stop-color="#1b1540"/></linearGradient>
  <linearGradient id="floorfade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fff" stop-opacity="0.75"/></linearGradient>
  <mask id="floormask"><rect y="520" width="${W}" height="110" fill="url(#floorfade)"/></mask>
</defs>
<rect width="${W}" height="${H}" fill="url(#bg)"/>
${floor()}
${subject}
</svg></body></html>`;
}

// ---------------------------------------------------------------------------
// Primitives, positioned by their center.

export function text(string, x, y, size = 28, { color = C.text, anchor = 'middle', mono = false } = {}) {
  return `<text x="${x}" y="${y}" fill="${color}" font-size="${size}" text-anchor="${anchor}"${mono ? ' class="mono"' : ''}>${escape(string)}</text>`;
}

const svgBody = (file) => fs.readFileSync(path.join(here, file), 'utf8')
  .replace(/<!--[\s\S]*?-->/g, '').replace(/<svg[^>]*>/, '').replace('</svg>', '').replace(/<title>.*?<\/title>/, '');

// A line icon, from icons/ (Lucide, ISC license).
export function icon(name, cx, cy, size = 64, color = C.teal, strokeWidth = 1.9) {
  return `<g transform="translate(${cx - size / 2} ${cy - size / 2}) scale(${size / 24})" fill="none" stroke="${color}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round" filter="url(#iconglow)">${svgBody(`icons/${name}.svg`)}</g>`;
}

// Brand colors that read on the dark background, by logo name.
const BRANDS = {};

// A logo. Okteto and Claude come from the site's own files; Kubernetes is the
// official mark (the white wheel on the blue heptagon, one corner up, never
// on a circle); the others are single-color marks from logos/ (Simple Icons).
export function logo(name, cx, cy, size = 190, color) {
  const x = cx - size / 2;
  const y = cy - size / 2;
  if (name === 'okteto') {
    return `<image href="${fileUrl('static/img/logos/okteto.svg')}" x="${x}" y="${y}" width="${size}" height="${size}"/>`;
  }
  if (name === 'okteto-wordmark') {
    const height = size * (40 / 139);
    return `<image href="${fileUrl('shared/static/img/logo.svg')}" x="${x}" y="${cy - height / 2}" width="${size}" height="${height}"/>`;
  }
  if (name === 'claude') {
    return `<image href="${fileUrl('static/img/logos/claude.svg')}" x="${x}" y="${y}" width="${size}" height="${size}"/>`;
  }
  const scale = size / 24;
  if (name === 'kubernetes') {
    const heptagon = Array.from({ length: 7 }, (_, i) => {
      const a = -Math.PI / 2 + (i * 2 * Math.PI) / 7;
      return `${12 + 10.6 * Math.cos(a)},${12.35 + 10.6 * Math.sin(a)}`;
    }).join(' ');
    // The glow goes behind, so the wheel stays white.
    return `<g transform="translate(${x} ${y}) scale(${scale})"><polygon points="${heptagon}" fill="${C.kubernetes}" filter="url(#halo)"/><polygon points="${heptagon}" fill="#fff"/><g fill="${C.kubernetes}">${svgBody('logos/kubernetes.svg')}</g></g>`;
  }
  return `<g transform="translate(${x} ${y}) scale(${scale})" fill="${color ?? BRANDS[name] ?? C.text}" filter="url(#logoglow)">${svgBody(`logos/${name}.svg`)}</g>`;
}

export function box(x, y, width, height, { color = C.blue, dashed = false, radius = 26, fill = C.ink, strokeWidth = 4 } = {}) {
  return `<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${radius}" fill="${fill}" stroke="${color}" stroke-width="${strokeWidth}"${dashed ? ' stroke-dasharray="14 10"' : ''} ${GLOW}/>`;
}

export function circle(cx, cy, r, { color = C.teal, fill = C.ink, strokeWidth = 4 } = {}) {
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" stroke="${color}" stroke-width="${strokeWidth}" ${GLOW}/>`;
}

export function arrow(x1, y1, x2, y2, { color = C.teal, dashed = false, both = false, head = true } = {}) {
  const a = Math.atan2(y2 - y1, x2 - x1);
  const s = 14;
  const tip = (x, y, angle) => `<path d="M${x - s * Math.cos(angle - 0.6)} ${y - s * Math.sin(angle - 0.6)} L${x} ${y} L${x - s * Math.cos(angle + 0.6)} ${y - s * Math.sin(angle + 0.6)}"/>`;
  return `<g fill="none" stroke="${color}" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round" ${GLOW}>
    <path d="M${x1} ${y1} L${x2} ${y2}"${dashed ? ' stroke-dasharray="2 13"' : ''}/>${head ? tip(x2, y2, a) : ''}${both ? tip(x1, y1, a + Math.PI) : ''}</g>`;
}

/** Scales a drawing around a point, to make a hand-placed subject fill the cover. */
export function scaled(svg, factor, cx = W / 2, cy = 280) {
  return `<g transform="translate(${cx} ${cy}) scale(${factor}) translate(${-cx} ${-cy})">${svg}</g>`;
}

export function curve(d, { color = C.teal, dashed = false, strokeWidth = 4 } = {}) {
  return `<path d="${d}" fill="none" stroke="${color}" stroke-width="${strokeWidth}" stroke-linecap="round"${dashed ? ' stroke-dasharray="2 13"' : ''} ${GLOW}/>`;
}

// ---------------------------------------------------------------------------
// Nodes: things with a size that row() lays out. A node's label goes under it.

function node(width, height, label, draw) {
  return {
    w: Math.max(width, label ? estimate(label, 28) : 0),
    h: height,
    labelled: Boolean(label),
    draw: (cx, cy) => draw(cx, cy) + (label ? text(label, cx, cy + height / 2 + 44) : ''),
  };
}

/** A big logo. */
export const mark = (name, { size = 190, label, color } = {}) =>
  node(size, size, label, (cx, cy) => logo(name, cx, cy, size, color));

/** An icon in a neon circle. */
export const badge = (name, label, { color = C.teal, r = 62 } = {}) =>
  node(r * 2, r * 2, label, (cx, cy) => circle(cx, cy, r, { color }) + icon(name, cx, cy, r * 1.05, color));

/** An icon in a rounded square. */
export const tile = (name, label, { color = C.purple, size = 150, dashed = false } = {}) =>
  node(size, size, label, (cx, cy) => box(cx - size / 2, cy - size / 2, size, size, { color, dashed }) + icon(name, cx, cy, size * 0.5, color));

/** A bare icon, to put inside a group. */
export const item = (name, { color = C.teal, size = 70 } = {}) =>
  node(size, size, null, (cx, cy) => icon(name, cx, cy, size, color));

/** A small logo, to put inside a group. */
export const smallMark = (name, { size = 90, color } = {}) =>
  node(size, size, null, (cx, cy) => logo(name, cx, cy, size, color));

/** Big neon text, such as a product name or an amount. */
export const word = (string, { size = 92, color = C.text, label } = {}) =>
  node(estimate(string, size), size, label, (cx, cy) => `<g ${GLOW}>${text(string, cx, cy + size * 0.34, size, { color })}</g>`);

/**
 * A titled box with nodes inside. `top: 'kubernetes'` puts that logo on its
 * top edge; `topIcon: 'bot'` puts an icon there instead.
 */
export function group(title, items, { color = C.blue, dashed = false, top, topIcon, gap = 26, minWidth = 0 } = {}) {
  const innerWidth = items.reduce((sum, it) => sum + it.w, 0) + gap * (items.length - 1);
  const innerHeight = Math.max(...items.map((it) => it.h));
  const head = top || topIcon ? 104 : 72;
  const width = Math.max(innerWidth + 76, estimate(title, 28) + 64, minWidth);
  const height = head + innerHeight + 38;
  return node(width, height, null, (cx, cy) => {
    const y0 = cy - height / 2;
    let out = box(cx - width / 2, y0, width, height, { color, dashed });
    if (top) out += logo(top, cx, y0, 88);
    if (topIcon) out += circle(cx, y0, 42, { color }) + icon(topIcon, cx, y0, 46, color);
    out += text(title, cx, y0 + head - 22);
    let x = cx - innerWidth / 2;
    for (const it of items) {
      out += it.draw(x + it.w / 2, y0 + head + innerHeight / 2);
      x += it.w + gap;
    }
    return out;
  });
}

/** A vertical list of rows, each with an icon and a short text, to put inside a group. */
export function stack(rows, { color = C.teal } = {}) {
  const rowHeight = 62;
  const gap = 12;
  const width = Math.max(...rows.map((r) => estimate(r.text, 26) + 104), 240);
  const height = rows.length * rowHeight + (rows.length - 1) * gap;
  return node(width, height, null, (cx, cy) => rows.map((r, i) => {
    const y = cy - height / 2 + i * (rowHeight + gap);
    return box(cx - width / 2, y, width, rowHeight, { color, radius: 14, strokeWidth: 3, fill: '#150f30' })
      + icon(r.icon, cx - width / 2 + 40, y + rowHeight / 2, 36, color)
      + text(r.text, cx - width / 2 + 76, y + rowHeight / 2 + 9, 26, { anchor: 'start' });
  }).join(''));
}

const CONNECTORS = { arrow: 120, dots: 120, both: 120, plus: 120, vs: 150, none: 56 };

/**
 * Lays nodes out in a centered row, scaled to fill the cover. Between two
 * nodes goes a connector: 'arrow', 'dots' (dotted arrow), 'both' (two-way
 * arrow), 'plus', 'vs', 'none', or { icon: 'zap' } (an arrow with an icon
 * over it).
 */
export function row(parts, { cy = 285, cx = W / 2, maxWidth = 1000, maxHeight = 390, maxScale = 1.9 } = {}) {
  const isNode = (part) => typeof part !== 'string' && !part.icon;
  const width = (part) => (typeof part === 'string' ? CONNECTORS[part] : part.icon ? 150 : part.w);
  const total = parts.reduce((sum, part) => sum + width(part), 0);
  const nodes = parts.filter(isNode);
  const bodyHeight = Math.max(...nodes.map((n) => n.h));
  const labelHeight = nodes.some((n) => n.labelled) ? 58 : 0;
  const scale = Math.min(maxWidth / total, maxHeight / (bodyHeight + labelHeight), maxScale);
  // The body sits a bit higher when there are labels under it.
  return `<g transform="translate(${cx} ${cy - (labelHeight * scale) / 2}) scale(${scale}) translate(${-cx} ${-cy})">${rowAt(parts, width, total, cx, cy)}</g>`;
}

function rowAt(parts, width, total, cx, cy) {
  let x = cx - total / 2;
  let out = '';
  for (const part of parts) {
    const w = width(part);
    const mid = x + w / 2;
    if (typeof part === 'string' || part.icon) {
      const kind = part.icon ? 'arrow' : part;
      const pad = 22;
      if (kind === 'arrow' || kind === 'dots' || kind === 'both') {
        out += arrow(x + pad, cy, x + w - pad, cy, { dashed: kind === 'dots', both: kind === 'both' });
        if (part.icon) out += icon(part.icon, mid, cy - 44, 48, part.color ?? C.amber);
      } else if (kind === 'plus') {
        out += `<g stroke="${C.text}" stroke-width="7" stroke-linecap="round" ${GLOW}><path d="M${mid - 22} ${cy} H${mid + 22} M${mid} ${cy - 22} V${cy + 22}"/></g>`;
      } else if (kind === 'vs') {
        out += `<g ${GLOW}>${text('vs', mid, cy + 18, 58, { color: C.pink })}</g>`;
      }
    } else {
      out += part.draw(mid, cy);
    }
    x += w;
  }
  return out;
}

/**
 * A central box (Kubernetes by default) with up to three rows, and the points
 * of the article around it, each joined to the box.
 *   rows:        [{ icon, text }]
 *   left, right: [{ icon, label }], up to two each
 */
export function hub({ title = 'Kubernetes', top = 'kubernetes', rows = [], left = [], right = [], rowColor = C.purple }) {
  const x0 = 390;
  const width = 420;
  const head = top ? 117 : 84;
  const rowHeight = 78;
  const rowGap = 14;
  const height = head + rows.length * (rowHeight + rowGap) + 12;
  const y0 = 285 - height / 2;
  let out = box(x0, y0, width, height) + (top ? logo(top, 600, y0 + 2, 96) : '') + text(title, 600, y0 + head - 28, 32);
  rows.forEach((r, i) => {
    const y = y0 + head + i * (rowHeight + rowGap);
    out += box(x0 + 25, y, width - 50, rowHeight, { color: rowColor, radius: 14, strokeWidth: 3.5, fill: '#150f30' });
    out += icon(r.icon, x0 + 72, y + rowHeight / 2, 44, rowColor);
    out += text(r.text, x0 + 118, y + rowHeight / 2 + 10, 28, { anchor: 'start' });
  });
  const side = (points, sign) => points.forEach((p, i) => {
    const x = 600 + sign * 425;
    const y = points.length === 1 ? 270 : 190 + i * 180;
    const edge = sign < 0 ? x0 : x0 + width;
    const from = x - sign * 52;
    const mid = (from + edge) / 2;
    const ey = Math.min(Math.max(y + 30, y0 + 40), y0 + height - 40);
    out += curve(`M${from} ${y} C${mid} ${y} ${mid} ${ey} ${edge} ${ey}`, { strokeWidth: 3.5 });
    out += `<circle cx="${edge}" cy="${ey}" r="7" fill="${C.teal}"/>`;
    out += circle(x, y, 50) + icon(p.icon, x, y, 52, C.teal) + text(p.label, x, y + 94);
  });
  side(left, -1);
  side(right, 1);
  return out;
}

/** A terminal window with a few command lines. */
export function terminal(lines, { x = 230, y = 95, width = 740 } = {}) {
  const height = 96 + lines.length * 62;
  let out = box(x, y, width, height, { color: C.teal });
  out += `<path d="M${x} ${y + 62} H${x + width}" stroke="${C.teal}" stroke-width="3" opacity="0.6"/>`;
  [C.pink, C.amber, C.teal].forEach((color, i) => { out += `<circle cx="${x + 38 + i * 30}" cy="${y + 32}" r="9" fill="${color}"/>`; });
  lines.forEach((line, i) => {
    const ly = y + 122 + i * 62;
    out += text('$', x + 40, ly, 32, { color: C.pink, anchor: 'start', mono: true });
    out += text(line, x + 76, ly, 32, { anchor: 'start', mono: true });
  });
  return out;
}

/** Vertical bars on a baseline. Each bar: { label, segments: [{ value, color }] }. */
export function bars(list, { baseline = 440, barWidth = 150, gap = 110, unit = 1 } = {}) {
  const total = list.length * barWidth + (list.length - 1) * gap;
  let x = W / 2 - total / 2;
  let out = '';
  for (const bar of list) {
    let y = baseline;
    for (const segment of bar.segments) {
      const h = segment.value * unit;
      y -= h;
      out += box(x, y, barWidth, h - 8, { color: segment.color, radius: 12 });
      if (segment.icon) out += icon(segment.icon, x + barWidth / 2, y + (h - 8) / 2, 44, segment.color);
    }
    out += text(bar.label, x + barWidth / 2, baseline + 42);
    x += barWidth + gap;
  }
  return out;
}
