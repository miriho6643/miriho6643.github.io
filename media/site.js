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
