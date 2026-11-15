// The covers, and the diagrams inside the posts, drawn in the style of
// style.mjs. Each entry has:
//   out: where the JPEG goes (a cover is the post's img/cover.jpg; a diagram
//        is another file of the post's img/ folder)
//   background: 'white' for a diagram inside an article. A blog cover takes
//        none: it gets one of the six backgrounds in rotation, by the date order
//        of the posts (see ROTATION), so consecutive posts never look the same.
//   alt: what the image shows (the post's `image_alt`)
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

const post = (dir) => `blog/posts/${dir}/img/cover.jpg`;
const figure = (dir, name) => `blog/posts/${dir}/img/${name}.webp`;
const LB = '2023-02-28-kubernetes-load-balancer-service';
const pods = (n = 3, color = C.teal) => Array.from({ length: n }, () => item('box', { color }));
const kubernetes = (options) => mark('kubernetes', options);
const okteto = (options) => mark('okteto', options);
const versus = (name) => row([mark('okteto-wordmark', { size: 360 }), 'vs', word(name, { size: 84 })]);

// The six backgrounds of the blog covers, in the order they rotate. The posts,
// sorted by date (their folder name), take them one after another.
const ROTATION = ['dots', 'weave', 'grid', 'sun', 'beams', 'stars'];
const posts = fs.readdirSync(path.join(root, 'blog/posts')).filter((dir) => /^\d{4}-/.test(dir)).sort();
const rotation = (out) => {
  const dir = out.match(/^blog\/posts\/([^/]+)\/img\/cover\.jpg$/)?.[1];
  return dir && posts.includes(dir) ? ROTATION[posts.indexOf(dir) % ROTATION.length] : undefined;
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
    alt: 'Three steps joined by arrows: code, fast feedback, happy developers',
    svg: row([badge('code', 'Code'), 'arrow', badge('zap', 'Feedback', { color: C.amber }), 'arrow', badge('smile', 'Developers', { color: C.purple })]),
  },
  {
    out: post('2022-10-18-applying-gitops-principles-to-your-development-environments'),
    alt: 'The Git logo with an arrow to an environment in Kubernetes',
    svg: row([mark('git', { size: 170 }), 'arrow', group('Environment', pods(3), { top: 'kubernetes', dashed: true })]),
  },
  {
    out: post('2022-11-28-kubernetes-network-policies'),
    alt: 'A network policy lets a frontend Pod reach the API Pod and blocks it from the database Pod',
    svg: scaled(box(215, 205, 130, 130, { color: C.teal }) + icon('box', 280, 270, 68) + text('frontend', 280, 378)
      + box(855, 85, 130, 130, { color: C.teal }) + icon('box', 920, 150, 68) + text('api', 920, 258)
      + box(855, 305, 130, 130, { color: C.red }) + icon('database', 920, 370, 68, C.red) + text('db', 920, 478)
      + arrow(370, 245, 830, 160) + arrow(370, 295, 830, 365, { color: C.red, dashed: true })
      + circle(600, 198, 30) + icon('check', 600, 198, 34)
      + circle(600, 334, 30, { color: C.red }) + icon('x', 600, 334, 34, C.red), 1.18),
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
    alt: 'Two cost bars: building a platform, a tall bar of engineers, infrastructure and maintenance, and buying one, a short bar',
    svg: bars([
      { label: 'Build', segments: [{ value: 120, color: C.red, icon: 'users' }, { value: 110, color: C.purple, icon: 'server' }, { value: 110, color: C.amber, icon: 'wrench' }] },
      { label: 'Buy', segments: [{ value: 130, color: C.teal, icon: 'dollar-sign' }] },
    ], { baseline: 452, barWidth: 200, gap: 130, unit: 1.08 }),
  },
  {
    out: post('2023-06-02-the-modern-way-of-sharing-dev-work-with-your-team'),
    alt: 'A developer shares their work with the team through a URL',
    svg: row([badge('laptop', 'Developer'), 'arrow', tile('link', 'URL', { color: C.blue }), 'arrow', badge('users', 'Team', { color: C.purple })]),
  },
  {
    out: post('2023-07-27-the-way-you-re-using-kubernetes-clusters-during-development-is-killing-productivity'),
    alt: 'One Kubernetes cluster shared by three developers, each with their own namespace',
    svg: hub({
      rows: [{ icon: 'user', text: 'Namespace ana' }, { icon: 'user', text: 'Namespace li' }, { icon: 'user', text: 'Namespace sam' }],
      rowColor: C.teal,
    }),
  },
  {
    out: post('2023-08-15-five-challenges-with-developing-locally-using-docker-compose'),
    alt: 'The Docker logo on a laptop, with a warning sign',
    svg: row([group('Laptop', [smallMark('docker', { size: 130 })], { color: C.teal, minWidth: 260 }), 'none', badge('triangle-alert', null, { color: C.amber, r: 80 })]),
  },
  {
    out: post('2023-09-26-slash-your-kubernetes-costs-during-development'),
    alt: 'The Garbage Collector removes idle environments from Kubernetes and the cost goes down',
    svg: row([kubernetes({ size: 170 }), 'arrow', tile('trash-2', 'Garbage Collector', { color: C.purple }), 'arrow', badge('trending-down', 'Cost', { color: C.teal })]),
  },
  {
    out: post('2024-01-25-platform-engineering-roadmap'),
    alt: 'A road with three milestones that ends in a flag',
    svg: scaled(curve('M180 400 C300 400 320 250 440 250 S580 350 700 350 S840 170 960 170', { dashed: true, strokeWidth: 5 })
      + [[180, 400, '1'], [440, 250, '2'], [700, 350, '3']].map(([x, y, n]) => circle(x, y, 38) + text(n, x, y + 12, 34)).join('')
      + circle(960, 170, 62, { color: C.amber }) + icon('flag', 960, 170, 62, C.amber), 1.12, 585, 270),
  },
  {
    out: post('2024-07-29-okteto-soc-2'),
    alt: 'The Okteto logo plus a shield with a check, for SOC 2 Type 2',
    svg: row([okteto(), 'plus', badge('shield-check', 'SOC 2 Type 2', { r: 92 })]),
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
    out: post('2025-12-05-okteto-vs-mirrord-choosing-the-right-development-environment-solution-for-your-team'),
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
    alt: 'Three kinds of development environment in a row: local, shared, and ephemeral',
    svg: row([badge('laptop', 'Local', { color: C.dim }), 'arrow', badge('server', 'Shared', { color: C.amber }), 'arrow', badge('cloud', 'Ephemeral')]),
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
];

export default covers.map((cover) => ({ ...cover, background: cover.background ?? rotation(cover.out) }));
