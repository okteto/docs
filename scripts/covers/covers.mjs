// The covers drawn in the style of style.mjs. Each entry has:
//   out: where the JPEG goes (the post's img/cover.jpg)
//   alt: what the image shows (the post's `image_alt`)
//   svg: the subject, built with the helpers of style.mjs
//
// A cover shows what the article is about, never its title: a simple
// schematic, or big logos when the article is about an integration.

import {
  C, text, icon, logo, box, circle, arrow, scaled, hub,
} from './style.mjs';

const post = (dir) => `blog/posts/${dir}/img/cover.jpg`;

// A row of small labels in rounded boxes, centered on (cx, cy).
function pills(cx, cy, labels, { color = C.teal, size = 18, gap = 10 } = {}) {
  const widths = labels.map((label) => label.length * size * 0.57 + 30);
  let x = cx - (widths.reduce((sum, w) => sum + w, 0) + gap * (labels.length - 1)) / 2;
  return labels.map((label, i) => {
    const out = box(x, cy - 20, widths[i], 40, { color, radius: 20, strokeWidth: 2.5, fill: '#0f3a4d' })
      + text(label, x + widths[i] / 2, cy + 6, size);
    x += widths[i] + gap;
    return out;
  }).join('');
}

export default [
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
];
