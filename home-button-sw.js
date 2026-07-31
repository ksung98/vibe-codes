const HOME_LINK = `
  <a class="home-link" href="../" aria-label="Back to home page">← Home</a>
`;

const HOME_STYLE = `
  <style id="home-link-style">
    .home-link {
      position: fixed;
      top: 16px;
      left: 16px;
      z-index: 9999;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 10px 14px;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.9);
      color: #1f2937;
      text-decoration: none;
      font-family: Arial, Helvetica, sans-serif;
      font-size: 0.92rem;
      font-weight: 700;
      box-shadow: 0 8px 20px rgba(15, 23, 42, 0.14);
      border: 1px solid rgba(15, 23, 42, 0.1);
      backdrop-filter: blur(8px);
    }
    .home-link:hover {
      transform: translateY(-1px);
      box-shadow: 0 10px 24px rgba(15, 23, 42, 0.18);
    }
    @media (max-width: 600px) {
      .home-link {
        top: 10px;
        left: 10px;
        padding: 8px 11px;
        font-size: 0.84rem;
      }
    }
  </style>
`;

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.mode !== "navigate") return;

  const url = new URL(request.url);
  if (!url.pathname.startsWith("/vibe-codes/") || url.pathname === "/vibe-codes/" || url.pathname.endsWith("/index.html") && url.pathname === "/vibe-codes/index.html") return;

  event.respondWith(
    fetch(request).then(async (response) => {
      const contentType = response.headers.get("content-type") || "";
      if (!contentType.includes("text/html")) return response;

      let html = await response.text();
      if (!html.includes('class="home-link"')) {
        html = html.replace("</head>", `${HOME_STYLE}</head>`);
        html = html.replace("<body>", `<body>${HOME_LINK}`);
      }

      return new Response(html, {
        status: response.status,
        statusText: response.statusText,
        headers: { "content-type": "text/html; charset=utf-8" }
      });
    })
  );
});
