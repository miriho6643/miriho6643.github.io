(function () {
  "use strict";

  function updateFooterYears() {
    const currentYear = String(new Date().getFullYear());
    const footerNodes = document.querySelectorAll("[data-footer-template]");

    footerNodes.forEach((node) => {
      const template = node.getAttribute("data-footer-template") || "";
      if (!template) return;
      node.textContent = template.replace(/\{year\}/g, currentYear);
    });
  }

  document.addEventListener("DOMContentLoaded", updateFooterYears);
})();

(function () {
    "use strict";

    const BACKEND_URL = "https://dein-server.example/api/utm";

    const params = new URLSearchParams(window.location.search);

    const utmData = {
        utm_source: params.get("utm_source"),
        utm_medium: params.get("utm_medium"),
        utm_campaign: params.get("utm_campaign"),
        utm_term: params.get("utm_term"),
        utm_content: params.get("utm_content"),
        page: window.location.href,
        referrer: document.referrer || null,
        timestamp: new Date().toISOString()
    };

    if (!utmData.utm_source) return;

    fetch(BACKEND_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(utmData),
        keepalive: true
    }).catch(() => {});
})();