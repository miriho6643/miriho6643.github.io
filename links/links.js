const YAML_CONFIG_PATH = "links.yml";
const ICON_BASE_PATH = "icons/";

// Accent-Farbe aus YAML holen (accentColor oder accent), sonst Standard-Grün
function pickAccent(entry) {
  return entry.accentColor || entry.accent || "var(--accent1)";
}

async function loadYamlConfig() {
  const res = await fetch(YAML_CONFIG_PATH, { cache: "no-store" });
  if (!res.ok) {
    throw new Error("Konnte links.yml nicht laden: " + res.status);
  }
  const text = await res.text();
  return jsyaml.load(text);
}

function createLinkCard(entry) {
  const accent = pickAccent(entry);

  const wrapper = document.createElement("a");
  wrapper.href = entry.url;
  wrapper.target = "_blank";
  wrapper.rel = "noopener noreferrer";
  wrapper.style.textDecoration = "none";
  wrapper.style.color = "inherit";
  wrapper.style.width = "100%";
  wrapper.style.display = "flex";
  wrapper.style.justifyContent = "center";

  const card = document.createElement("div");

  Object.assign(card.style, {
    display: "flex",
    alignItems: "center",
    // ein bisschen mehr „Mitte“ in der Karte
    justifyContent: "flex-start",
    gap: "32px",
    padding: "22px 44px",
    borderRadius: "50px",
    maxWidth: "880px",
    width: "100%",
    height: "120px",
    backgroundColor: "var(--background2)",
    border: "1px solid rgba(255,255,255,0.08)",
    boxShadow: "0 10px 28px rgba(0,0,0,0.6)",
    transition: "all 0.2s ease"
  });

  const icon = document.createElement("img");
  icon.src = ICON_BASE_PATH + entry.icon;
  icon.alt = entry.label;

  Object.assign(icon.style, {
    width: "64px",
    height: "64px",
    objectFit: "contain",
    filter: "invert(1)",
    transition: "all 0.2s ease"
  });

  const textWrapper = document.createElement("div");
  Object.assign(textWrapper.style, {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center"
  });

  const title = document.createElement("div");
  title.textContent = entry.label;
  Object.assign(title.style, {
    fontSize: "28px",
    fontWeight: "600"
  });

  const subtitle = document.createElement("div");
  subtitle.textContent = entry.subtitle || entry.url;
  Object.assign(subtitle.style, {
    fontSize: "17px",
    opacity: "0.9"
  });

  textWrapper.appendChild(title);
  textWrapper.appendChild(subtitle);

  card.appendChild(icon);
  card.appendChild(textWrapper);
  wrapper.appendChild(card);

  // Hover: Accent-Farbe + Glow + Icon-Glow
  card.addEventListener("mouseenter", () => {
    card.style.border = "2px solid " + accent;
    card.style.boxShadow = `
      0 0 12px ${accent},
      0 0 28px ${accent},
      0 0 50px ${accent}
    `;
    card.style.transform = "translateY(-4px)";
    icon.style.filter = `invert(1) drop-shadow(0 0 6px ${accent}) drop-shadow(0 0 14px ${accent})`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.border = "1px solid rgba(255,255,255,0.08)";
    card.style.boxShadow = "0 10px 28px rgba(0,0,0,0.6)";
    card.style.transform = "translateY(0)";
    icon.style.filter = "invert(1)";
  });

  return wrapper;
}

async function initLinksPage() {
  const root = document.getElementById("links-root");
  if (!root) return;

  Object.assign(root.style, {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "24px",

    // 👇 mehr Luft nach oben & unten, statt direkt unter dem Blur-Effekt
    paddingTop: "120px",
    paddingBottom: "120px",
    marginTop: "0",
    marginBottom: "0"
  });

  const config = await loadYamlConfig();
  const entries = Array.isArray(config) ? config : [];

  entries
    .filter(e => e.enabled !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0))
    .forEach(entry => {
      root.appendChild(createLinkCard(entry));
    });
}

initLinksPage().catch(err => console.error("[links.js] Fehler:", err));
