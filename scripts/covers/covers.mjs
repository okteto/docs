// The covers, and the diagrams inside the posts, drawn in the style of
// style.mjs. Each entry has:
//   out: where the JPEG goes (a cover is the post's img/cover.jpg; a diagram
//        is another file of the post's img/ folder)
//   background: 'dots', 'weave', 'rings' or 'grid' for a cover. Vary it from
//        one cover to the next, so consecutive posts don't look the same.
//        'white' for a diagram inside an article.
//   alt: what the image shows (the post's `image_alt`)
//   svg: the subject, built with the helpers of style.mjs. For a diagram
//        inside an article it is a function, drawn with the light theme.
//
// A cover shows what the article is about, never its title: a simple
// schematic, or big logos when the article is about an integration.

import {
  C, text, icon, logo, box, circle, arrow, curve, scaled, hub, row, mark, word, tile, group, item,
} from './style.mjs';

const post = (dir) => `blog/posts/${dir}/img/cover.jpg`;
const figure = (dir, name) => `blog/posts/${dir}/img/${name}.webp`;
const LB = '2023-02-28-kubernetes-load-balancer-service';

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

export default [
  {
    out: post('2026-11-08-why-run-ai-coding-agents-on-kubernetes'),
    background: 'rings',
    alt: 'AI coding agents working on separate issues inside Kubernetes, with four benefits: secure, reproducible, scale, and observability',
    svg: hub({
      rows: [{ icon: 'bot', text: '#142 fix login' }, { icon: 'bot', text: '#157 add export' }, { icon: 'bot', text: '#163 bump deps' }],
      left: [{ icon: 'shield-check', label: 'Secure' }, { icon: 'equal', label: 'Reproducible' }],
      right: [{ icon: 'copy', label: 'Scale' }, { icon: 'eye', label: 'Observability' }],
    }),
  },
  {
    out: post('2026-11-12-how-to-run-ai-coding-agents-on-kubernetes'),
    background: 'weave',
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
    out: post('2026-01-15-compare-okteto-versus-signadot'),
    background: 'grid',
    alt: 'The Okteto logo versus Signadot',
    svg: row([mark('okteto-wordmark', { size: 360 }), 'vs', word('Signadot', { size: 84 })]),
  },
  {
    out: post('2026-01-12-platform-engineering-tools-2026'),
    background: 'dots',
    alt: 'A chat window connected to a Kubernetes cluster that runs an agent with guardrails, workload identity, and observability',
    svg: row([
      tile('message-square', 'Chat', { color: C.teal }),
      'arrow',
      group('Kubernetes', [item('bot', { color: C.purple }), item('shield-check', { color: C.amber }), item('key-round'), item('eye')], { top: 'kubernetes' }),
    ]),
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
];
