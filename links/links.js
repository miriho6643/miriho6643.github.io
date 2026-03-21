const YAML_CONFIG_PATH = "links.yml";
const ICON_BASE_PATH = "icons/";

function pick(entry, key, fallback) {
  const value = entry[key];
  return value === undefined || value === null || value === "" ? fallback : value;
}

async function loadYamlConfig() {
  const res = await fetch(YAML_CONFIG_PATH, { cache: "no-store" });
  if (!res.ok) {
    throw new Error("Konnte links.yml nicht laden: " + res.status);
  }
  return jsyaml.load(await res.text());
}

function createLinkCard(entry) {
  const accent = pick(entry, "accentColor", "var(--accent1)");
  const cardBackground = pick(entry, "cardBackground", "var(--background2)");
  const titleColor = pick(entry, "titleColor", "#ffffff");
  const subtitleColor = pick(entry, "subtitleColor", "#d6d6d6");
  const iconSize = Number(pick(entry, "iconSize", 64));

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
    justifyContent: "flex-start",
    gap: "32px",
    padding: "22px 44px",
    borderRadius: "20px",
    maxWidth: "880px",
    width: "100%",
    minHeight: "120px",
    backgroundColor: cardBackground,
    border: `1px solid ${pick(entry, "borderColor", "rgba(255,255,255,0.08)")}`,
    boxShadow: "0 10px 28px rgba(0,0,0,0.6)",
    transition: "all 0.2s ease"
  });

  const icon = document.createElement(entry.photo ? "img" : "img");
  icon.src = entry.photo || (ICON_BASE_PATH + entry.icon);
  icon.alt = entry.label;
  Object.assign(icon.style, {
    width: `${iconSize}px`,
    height: `${iconSize}px`,
    objectFit: "cover",
    backgroundColor: pick(entry, "iconBackground", "transparent"),
    borderRadius: `${Number(pick(entry, "iconRadius", 20))}px`,
    padding: `${Number(pick(entry, "iconPadding", 0))}px`,
    filter: entry.photo ? "none" : pick(entry, "iconFilter", "invert(1)"),
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
    fontWeight: "600",
    color: titleColor
  });

  const subtitle = document.createElement("div");
  subtitle.textContent = entry.subtitle || entry.url;
  Object.assign(subtitle.style, {
    fontSize: "17px",
    color: subtitleColor
  });

  textWrapper.appendChild(title);
  textWrapper.appendChild(subtitle);
  card.appendChild(icon);
  card.appendChild(textWrapper);
  wrapper.appendChild(card);

  card.addEventListener("mouseenter", () => {
    card.style.border = `2px solid ${accent}`;
    card.style.boxShadow = `0 0 12px ${accent}, 0 0 28px ${accent}, 0 0 50px ${accent}`;
    card.style.transform = "translateY(-4px)";
    if (!entry.photo) {
      icon.style.filter = `invert(1) drop-shadow(0 0 6px ${accent}) drop-shadow(0 0 14px ${accent})`;
    }
  });

  card.addEventListener("mouseleave", () => {
    card.style.border = `1px solid ${pick(entry, "borderColor", "rgba(255,255,255,0.08)")}`;
    card.style.boxShadow = "0 10px 28px rgba(0,0,0,0.6)";
    card.style.transform = "translateY(0)";
    if (!entry.photo) {
      icon.style.filter = pick(entry, "iconFilter", "invert(1)");
    }
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
    paddingTop: "120px",
    paddingBottom: "120px"
  });

  const config = await loadYamlConfig();
  const entries = Array.isArray(config) ? config : [];

  entries
    .filter((e) => e.enabled !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0))
    .forEach((entry) => {
      root.appendChild(createLinkCard(entry));
    });
}

initLinksPage().catch((err) => console.error("[links.js] Fehler:", err));

// Copyright CityBuilderBot Alle Rechte Vorbehalten

