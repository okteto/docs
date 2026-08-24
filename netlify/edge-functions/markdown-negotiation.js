const DOCS_ROOT = "/docs";

function parseAcceptHeader(header) {
  const values = new Map();

  for (const item of header.split(",")) {
    const [rawMediaType, ...parameters] = item.split(";");
    const mediaType = rawMediaType.trim().toLowerCase();

    if (!mediaType) {
      continue;
    }

    let quality = 1;
    for (const parameter of parameters) {
      const [name, value] = parameter.split("=", 2);
      if (name.trim().toLowerCase() !== "q") {
        continue;
      }

      const parsedQuality = Number(value?.trim());
      quality =
        Number.isFinite(parsedQuality) && parsedQuality >= 0 && parsedQuality <= 1
          ? parsedQuality
          : 0;
      break;
    }

    values.set(mediaType, Math.max(values.get(mediaType) ?? 0, quality));
  }

  return values;
}

export function acceptsMarkdown(header) {
  if (!header) {
    return false;
  }

  const accepted = parseAcceptHeader(header);
  const markdownQuality = accepted.get("text/markdown");

  if (markdownQuality === undefined || markdownQuality === 0) {
    return false;
  }

  const htmlQuality = Math.max(
    accepted.get("text/html") ?? 0,
    accepted.get("application/xhtml+xml") ?? 0,
    accepted.get("*/*") ?? 0,
  );

  return markdownQuality >= htmlQuality;
}

export function getMarkdownPath(pathname) {
  if (pathname !== DOCS_ROOT && !pathname.startsWith(`${DOCS_ROOT}/`)) {
    return null;
  }

  if (
    pathname === `${DOCS_ROOT}/assets` ||
    pathname.startsWith(`${DOCS_ROOT}/assets/`)
  ) {
    return null;
  }

  const segments = pathname.split("/").filter(Boolean);
  const lastSegment = segments.at(-1) ?? "";
  if (lastSegment.includes(".")) {
    return null;
  }

  if (pathname === DOCS_ROOT || pathname === `${DOCS_ROOT}/`) {
    return `${DOCS_ROOT}/index.md`;
  }

  return `${pathname.replace(/\/+$/, "")}.md`;
}

function addVaryAccept(headers) {
  const vary = headers.get("Vary");

  if (!vary) {
    headers.set("Vary", "Accept");
  } else if (!vary.split(",").some((value) => value.trim().toLowerCase() === "accept")) {
    headers.set("Vary", `${vary}, Accept`);
  }
}

function withVaryAccept(response) {
  const headers = new Headers(response.headers);
  addVaryAccept(headers);

  return new Response(response.body, {
    headers,
    status: response.status,
    statusText: response.statusText,
  });
}

// This is a deterministic estimate, not a tokenizer-based token count.
function estimateTokens(markdown) {
  return Math.ceil(markdown.length / 4);
}

export default async (request, context) => {
  const markdownPath = getMarkdownPath(new URL(request.url).pathname);

  if (!markdownPath) {
    return context.next();
  }

  if (request.method !== "GET" && request.method !== "HEAD") {
    return withVaryAccept(await context.next());
  }

  if (acceptsMarkdown(request.headers.get("Accept"))) {
    try {
      const requestHeaders = new Headers(request.headers);
      requestHeaders.delete("Accept-Encoding");
      const markdownResponse = await fetch(
        new URL(markdownPath, request.url),
        {
          method: request.method,
          headers: requestHeaders,
          redirect: "manual",
        },
      );

      if (markdownResponse.ok) {
        const body =
          request.method === "GET" ? await markdownResponse.text() : null;
        const headers = new Headers(markdownResponse.headers);
        headers.delete("Content-Length");
        headers.delete("Content-Encoding");
        headers.delete("Transfer-Encoding");
        headers.set("Content-Type", "text/markdown; charset=utf-8");
        addVaryAccept(headers);

        if (body !== null) {
          headers.set("x-markdown-tokens", String(estimateTokens(body)));
        }

        return new Response(body, {
          headers,
          status: markdownResponse.status,
          statusText: markdownResponse.statusText,
        });
      }
    } catch {
      // Fall through to the HTML response if the markdown twin cannot be fetched.
    }
  }

  return withVaryAccept(await context.next());
};

export const config = {
  path: [DOCS_ROOT, `${DOCS_ROOT}/*`],
  excludedPattern: [
    "^/docs/assets(/.*)?$",
    "^/docs/.*\\.[^/]+/?$",
  ],
};
