const YAML_CONFIG_PATH = "links.yml";
const ICON_BASE_PATH = "icons/";

async function loadYamlConfig() {
  const res = await fetch(YAML_CONFIG_PATH, { cache: "no-store" });
  const text = await res.text();
  return jsyaml.load(text);
}

function pickAccent(entry) {
  return entry.accentColor || "var(--accent1)";
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
    justifyContent: "flex-start",
    gap: "40px",
    padding: "0 40px",
    borderRadius: "45px",
    maxWidth: "850px",
    width: "100%",
    height: "120px",
    backgroundColor: "var(--background2)",
    border: "2px solid " + accent,
    boxShadow: "0 0 18px " + accent,
    transition: "all 0.15s ease-out"
  });

  card.addEventListener("mouseenter", () => {
    card.style.transform = "translateY(-3px)";
    card.style.boxShadow = "0 0 28px " + accent;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "translateY(0)";
    card.style.boxShadow = "0 0 18px " + accent;
  });

  // ===== ICON LINKS (ZENTRIERT) =====
  const iconWrapper = document.createElement("div");
  Object.assign(iconWrapper.style, {
    width: "90px",
    height: "90px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%"
  });

  const img = document.createElement("img");
  img.src = ICON_BASE_PATH + entry.icon;
  img.alt = entry.label;

  Object.assign(img.style, {
    width: "70px",
    height: "70px",
    objectFit: "contain",
    filter: `invert(1) drop-shadow(0 0 10px ${accent})`
  });

  iconWrapper.appendChild(img);

  // ===== TEXT RECHTS (GROSS & ZENTRIERT) =====
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
    fontWeight: "700"
  });

  const subtitle = document.createElement("div");
  subtitle.textContent = entry.subtitle || entry.url;

  Object.assign(subtitle.style, {
    fontSize: "18px",
    opacity: "0.85"
  });

  textWrapper.appendChild(title);
  textWrapper.appendChild(subtitle);

  card.appendChild(iconWrapper);
  card.appendChild(textWrapper);
  wrapper.appendChild(card);

  return wrapper;
}

async function initLinksPage() {
  const root = document.getElementById("links-root");
  if (!root) return;

  // ===== WIRKLICH VERTIKAL MITTIG =====
  Object.assign(root.style, {
    minHeight: "70vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: "35px"
  });

  const config = await loadYamlConfig();

  config
    .filter(e => e.enabled !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0))
    .forEach(entry => {
      root.appendChild(createLinkCard(entry));
    });
}

document.addEventListener("DOMContentLoaded", initLinksPage);

#C 2025 CityBuilderBot
