const YAML_CONFIG_PATH = "helper.yml";
const ROOT_ID = "helper-root";

async function loadYamlConfig() {
  const res = await fetch(YAML_CONFIG_PATH, { cache: "no-store" });
  if (!res.ok) {
    throw new Error("Konnte helper.yml nicht laden: " + res.status);
  }
  return jsyaml.load(await res.text());
}

function createMemberCard(entry) {
  const hasPage = typeof entry.page === "string" && entry.page.trim() !== "";
  const card = document.createElement(hasPage ? "a" : "div");
  card.className = "team_member_card";

  if (hasPage) {
    card.href = entry.page;
  }

  const avatar = document.createElement("img");
  avatar.className = "team_member_avatar";
  avatar.src = entry.avatar || "../../media/member_placeholder.webp";
  avatar.alt = (entry.name || "Helper") + " Profilbild";

  const name = document.createElement("div");
  name.className = "team_member_name";
  name.textContent = entry.name || "Unbekannt";

  const role = document.createElement("div");
  role.className = "team_member_role";
  role.textContent = entry.role || "Helper";

  const category = document.createElement("div");
  category.className = "team_member_category";
  category.textContent = entry.category || "";

  const desc = document.createElement("div");
  desc.className = "team_member_desc";
  desc.textContent = entry.description || "";

  card.appendChild(avatar);
  card.appendChild(name);
  card.appendChild(role);
  if (entry.category) {
    card.appendChild(category);
  }
  card.appendChild(desc);

  return card;
}

async function initPage() {
  const root = document.getElementById(ROOT_ID);
  if (!root) return;

  const config = await loadYamlConfig();
  const entries = Array.isArray(config) ? config : [];

  entries
    .filter((entry) => entry.enabled !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0))
    .forEach((entry) => root.appendChild(createMemberCard(entry)));
}

initPage().catch((err) => console.error("[helper.js] Fehler:", err));
