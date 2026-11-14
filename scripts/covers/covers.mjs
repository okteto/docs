// The cover of every blog post and tutorial. Each entry has:
//   out: where the JPEG goes (blog: the post's img/cover.jpg; tutorials:
//        static/img/tutorials/covers/<id>.jpg)
//   alt: what the image shows (the post's `image_alt`)
//   svg: the subject, built with the helpers of style.mjs
//
// A cover shows what the article is about, never its title: a simple
// schematic, or big logos when the article is about an integration.

import {
  C, text, icon, logo, box, circle, arrow, scaled,
  mark, badge, tile, item, smallMark, group, row, hub,
} from './style.mjs';

const post = (dir) => `blog/posts/${dir}/img/cover.jpg`;
const tutorial = (id) => `static/img/tutorials/covers/${id}.jpg`;

const pods = (n = 3, color = C.teal) => Array.from({ length: n }, () => item('box', { color }));
const kubernetes = (options) => mark('kubernetes', options);
const okteto = (options) => mark('okteto', options);

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
  // -------------------------------------------------------------------------
  // Blog
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
    alt: 'An agent sandbox with the agent binary and Git access, wrapped by a Kubernetes security layer of RBAC and network policies, and connected to the namespace that runs the application: an HTTPRoute, a Service, Pods and a Volume',
    // Scaled down a little: the blog's cards crop the sides of the image.
    svg: scaled(
      // The security layer that Kubernetes puts around the sandbox.
      box(46, 86, 428, 388, { color: C.teal })
      + circle(84, 86, 25) + icon('shield-check', 84, 86, 28)
      + pills(260, 429, ['RBAC', 'Network policies'], { size: 20, gap: 14 })
      // The agent sandbox and what it carries.
      + box(78, 144, 364, 236, { color: C.purple })
      + circle(260, 144, 33, { color: C.purple }) + icon('bot', 260, 144, 36, C.purple)
      + text('Agent sandbox', 260, 216)
      + [['cpu', 'Agent binary'], ['git-branch', 'Git access']].map(([name, label], i) => {
        const y = 236 + i * 64;
        return box(98, y, 324, 54, { color: C.purple, radius: 12, strokeWidth: 3, fill: '#150f30' })
          + icon(name, 126, y + 27, 28, C.purple) + text(label, 150, y + 35, 21, { anchor: 'start' });
      }).join('')
      + arrow(492, 280, 546, 280)
      // The application, running in its namespace.
      + box(564, 132, 590, 296, { dashed: true })
      + logo('kubernetes', 859, 132, 86) + text('Namespace', 859, 216)
      + [['globe', 'HTTPRoute'], ['network', 'Service'], ['boxes', 'Pods'], ['hard-drive', 'Volume']].map(([name, label], i) => {
        const x = 643 + i * 144;
        return box(x - 48, 252, 96, 96, { color: C.teal, radius: 18, strokeWidth: 3.5 })
          + icon(name, x, 300, 52) + text(label, x, 384, 21)
          + (i < 3 ? arrow(x + 58, 300, x + 86, 300) : '');
      }).join(''), 0.93, 600, 285),
  },

  // -------------------------------------------------------------------------
  // Tutorials
  {
    out: tutorial('agentic-workflows'),
    alt: 'An AI coding agent connected to an Okteto environment with its services and database',
    svg: row([badge('bot', 'Agent', { color: C.purple, r: 74 }), 'both', group('Okteto environment', [item('globe'), item('box'), item('database')], { dashed: true, color: C.teal })]),
  },
  {
    out: tutorial('preview-environments'),
    alt: 'A pull request on GitHub deploys a Preview Environment and runs its tests',
    svg: row([mark('github', { size: 150, label: 'Pull request' }), 'arrow', group('Preview Environment', [item('globe'), item('box'), item('flask-conical', { color: C.amber })], { dashed: true, color: C.teal })]),
  },
  {
    out: tutorial('agent-ticket-to-pr'),
    alt: 'An issue goes to an AI agent, which opens a pull request',
    svg: row([tile('ticket', 'Issue', { color: C.blue }), 'arrow', badge('bot', 'Agent', { color: C.purple, r: 74 }), 'arrow', tile('git-pull-request', 'Pull request', { color: C.teal })]),
  },
  {
    out: tutorial('aws-lambda'),
    alt: 'The Okteto logo plus the AWS Lambda logo',
    svg: row([okteto(), 'plus', mark('awslambda')]),
  },
  {
    out: tutorial('compose-getting-started'),
    alt: 'The Docker logo with an arrow to the Kubernetes logo',
    svg: row([mark('docker', { size: 230 }), 'arrow', kubernetes()]),
  },
  {
    out: tutorial('helm'),
    alt: 'The Helm logo with an arrow to the Kubernetes logo',
    svg: row([mark('helm', { size: 200 }), 'arrow', kubernetes()]),
  },
  {
    out: tutorial('cloud-infrastructure'),
    alt: 'A Namespace, Terraform, and the S3 bucket that Terraform creates for it',
    svg: row([group('Namespace', pods(3), { dashed: true, color: C.teal }), 'arrow', mark('terraform', { size: 120 }), 'arrow', group('S3 bucket', [item('bucket', { color: C.amber, size: 84 })], { color: C.amber, minWidth: 230 })]),
  },
  {
    out: tutorial('webpack'),
    alt: 'A laptop synchronizes files with a Development Container that runs Webpack',
    svg: row([badge('laptop', null, { r: 80 }), 'both', group('Development Container', [smallMark('webpack', { size: 120 })], { dashed: true, color: C.teal })]),
  },
  {
    out: tutorial('optimize-your-development-environment'),
    alt: 'Three bars that get shorter: build, sync, and deploy times',
    svg: scaled(['Build', 'Sync', 'Deploy'].map((label, i) => {
      const y = 150 + i * 105;
      const length = [210, 130, 270][i];
      return text(label, 330, y + 32, 34, { anchor: 'end' })
        + `<rect x="370" y="${y}" width="560" height="56" rx="14" fill="none" stroke="${C.dim}" stroke-width="3" stroke-dasharray="10 10"/>`
        + box(370, y, length, 56, { color: C.teal, radius: 14, fill: '#0f3a4d' });
    }).join('') + icon('zap', 985, 283, 84, C.amber), 1.2, 615, 285),
  },
  {
    out: tutorial('create-and-use-volume-snapshots'),
    alt: 'A database, its Volume Snapshot, and a copy of the database in a new environment',
    svg: row([badge('database', 'Database', { r: 74 }), 'arrow', tile('camera', 'Snapshot', { color: C.purple }), 'arrow', badge('database', 'Copy', { r: 74 })]),
  },
];
