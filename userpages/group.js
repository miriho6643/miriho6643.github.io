const USERS_YAML_PATH = "/userpages/users.yml";

async function loadUsersConfig() {
  const res = await fetch(USERS_YAML_PATH, { cache: "no-store" });
  if (!res.ok) {
    throw new Error("Konnte users.yml nicht laden: " + res.status);
  }
  return jsyaml.load(await res.text()) || {};
}

function byOrder(a, b) {
  return (a.order || 0) - (b.order || 0);
}

function createMemberCard(entry, defaultAvatar) {
  const hasPage = entry.profile_enabled !== false;
  const card = document.createElement(hasPage ? "a" : "div");
  card.className = "team_member_card";
  if (hasPage) {
    card.href = `/userpages/?user=${encodeURIComponent(entry.id)}`;
  }

  const avatar = document.createElement("img");
  avatar.className = "team_member_avatar";
  avatar.src = entry.avatar || defaultAvatar;
  avatar.alt = `${entry.name || "User"} Profilbild`;

  const name = document.createElement("div");
  name.className = "team_member_name";
  name.textContent = entry.name || "Unbekannt";

  const role = document.createElement("div");
  role.className = "team_member_role";
  role.textContent = entry.role || "Team";

  const category = document.createElement("div");
  category.className = "team_member_category";
  category.textContent = entry.category || "";

  const desc = document.createElement("div");
  desc.className = "team_member_desc";
  desc.textContent = entry.short_description || entry.bio || "";

  card.appendChild(avatar);
  card.appendChild(name);
  card.appendChild(role);
  if (entry.category) card.appendChild(category);
  card.appendChild(desc);

  return card;
}

async function initGroupPage() {
  const root = document.getElementById("team-root");
  const page = document.body;
  if (!root || !page) return;

  const groupId = page.getAttribute("data-group-id");
  if (!groupId) return;

  const config = await loadUsersConfig();
  const defaultAvatar = (config.settings || {}).default_avatar || "/media/member_placeholder.webp";

  const members = (config.members || [])
    .filter((entry) => entry && entry.enabled !== false && String(entry.group || "").toLowerCase() === String(groupId).toLowerCase())
    .sort(byOrder);

  members.forEach((entry) => root.appendChild(createMemberCard(entry, defaultAvatar)));
}

initGroupPage().catch((err) => console.error("[group.js] Fehler:", err));