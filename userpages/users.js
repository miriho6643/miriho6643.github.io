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

function enabledMembers(config) {
  return (config.members || []).filter((m) => m && m.enabled !== false);
}

function profileUrl(memberId) {
  return `/userpages/?user=${encodeURIComponent(memberId)}`;
}

function applyHomepageLayout(mainContainer, layout) {
  if (!mainContainer) return;
  const isRow = String(layout || "column").toLowerCase() === "row";
  mainContainer.style.flexDirection = isRow ? "row" : "column";
  mainContainer.style.flexWrap = isRow ? "wrap" : "nowrap";
  mainContainer.style.justifyContent = "center";
}

function getRankGlowColor(member) {
  const rankClass = String(member.rank_class || "").toLowerCase();
  const rankLabel = String(member.rank_label || "").toLowerCase();

  if (rankClass.includes("owner") || rankLabel.includes("owner")) return "#3498db";
  if (rankClass.includes("admin") || rankLabel.includes("admin") || rankLabel.includes("dev")) return "#f82f2f";
  if (rankLabel.includes("helper")) return "#00f8ff";
  if (rankLabel.includes("azubi")) return "#ffa500";
  return "#00d8ff";
}

function createMainMemberCard(member, index, defaultAvatar) {
  const card = document.createElement("div");
  card.className = `main5_admins_div main5_admins_clickable ${index % 2 === 0 ? "main5_admins_dev_type2" : "main5_admins_dev_type1"}`;
  card.style.setProperty("--rank-glow", getRankGlowColor(member));
  card.setAttribute("role", "link");
  card.setAttribute("tabindex", "0");
  card.dataset.href = profileUrl(member.id);

  card.addEventListener("click", (event) => {
    if (event.target.closest(".main5_admins_nonlink")) return;
    window.location.href = card.dataset.href;
  });

  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      window.location.href = card.dataset.href;
    }
  });

  const avatarLink = document.createElement("a");
  avatarLink.href = card.dataset.href;
  avatarLink.className = "main5_admins_avatar_link";

  const avatar = document.createElement("img");
  avatar.className = "main5_admins_img";
  avatar.alt = `${member.name || "User"} Bild`;
  avatar.src = member.avatar || defaultAvatar;
  avatarLink.appendChild(avatar);

  const descWrap = document.createElement("div");
  descWrap.className = "main5_admins_description_div";

  const rank = document.createElement("span");
  rank.className = `main5_admins_description_rank main5_admins_nonlink ${member.rank_class || "main5_admins_description_rank_admin"}`;
  rank.textContent = member.rank_label || "[Team]";

  const title = document.createElement("a");
  title.className = "main5_admins_description_title";
  title.href = card.dataset.href;
  title.textContent = member.name || member.id || "Unbekannt";

  const text = document.createElement("span");
  text.className = "main5_admins_description main5_admins_nonlink";
  text.textContent = member.short_description || member.role || "";

  descWrap.appendChild(rank);
  descWrap.appendChild(title);
  descWrap.appendChild(text);

  card.appendChild(avatarLink);
  card.appendChild(descWrap);
  return card;
}

function createGroupCard(group) {
  const card = document.createElement("a");
  card.className = "main5_supporters_div main5_group_link";
  card.href = group.link || `/userpages/${group.id || ""}/`;
  card.style.setProperty("--rank-glow", group.glow_color || "#00d8ff");
  const imageEnabled = group.image_enabled !== false;
  if (!imageEnabled) {
    card.classList.add("main5_group_link_no_image");
    card.style.minHeight = "auto";
    card.style.height = "auto";
    card.style.width = "min(36rem, calc(100% - 2rem))";
    card.style.padding = "0.4rem 0.85rem";
    card.style.display = "block";
  } else {
    card.classList.add("main5_group_link_with_image");
  }
  if (imageEnabled) {
    const image = document.createElement("img");
    image.className = "main5_supporters_img";
    image.alt = `${group.title || "Team"} Bild`;
    image.src = group.image || "/media/member_placeholder.webp";
    card.appendChild(image);
  }

  const wrap = document.createElement("div");
  wrap.className = "main5_supporters_description_div";
  if (!imageEnabled) {
    wrap.style.width = "100%";
    wrap.style.maxWidth = "100%";
    wrap.style.padding = "0";
    wrap.style.display = "flex";
    wrap.style.flexDirection = "column";
    wrap.style.justifyContent = "center";
    wrap.style.gap = "0.05rem";
  }

  const rank = document.createElement("span");
  rank.className = "main5_supporters_description_rank main5_supporters_description_rank_supporter";
  rank.textContent = group.rank_label || "[Team]";
  if (!imageEnabled) {
    rank.style.display = "block";
    rank.style.textAlign = "center";
    rank.style.fontSize = "1rem";
    rank.style.marginBottom = "0";
  }

  const title = document.createElement("span");
  title.className = "main5_supporters_description_title";
  title.textContent = group.title || group.id || "Team";
  if (!imageEnabled) {
    title.style.display = "block";
    title.style.textAlign = "center";
    title.style.fontSize = "1.15rem";
    title.style.marginBottom = "0";
  }

  const desc = document.createElement("span");
  desc.className = "main5_supporters_description";
  desc.textContent = group.description || "";
  if (!imageEnabled) {
    desc.style.display = "block";
    desc.style.textAlign = "center";
    desc.style.marginBottom = "0";
    desc.style.fontSize = "1rem";
    desc.style.lineHeight = "1.2";
  }

  wrap.appendChild(rank);
  wrap.appendChild(title);
  wrap.appendChild(desc);

  card.appendChild(wrap);
  return card;
}

function renderOverview(membersRoot, groupsRoot, config) {
  const settings = config.settings || {};
  const allMembers = enabledMembers(config);
  const defaultAvatar = settings.default_avatar || "/media/member_placeholder.webp";
  const coreMembers = allMembers.filter((m) => (m.group || "core") === "core").sort(byOrder);

  applyHomepageLayout(membersRoot, settings.homepage_layout);
  coreMembers.forEach((m, idx) => membersRoot.appendChild(createMainMemberCard(m, idx, defaultAvatar)));

  const groupCounts = allMembers.reduce((acc, member) => {
    const key = member.group || "";
    if (!key || key === "core") return acc;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const groups = (config.team_groups || [])
    .filter((group) => group && group.enabled !== false && (groupCounts[group.id] || 0) > 0)
    .sort(byOrder);

  if (groupsRoot) {
    groupsRoot.style.display = groups.length > 0 ? "flex" : "none";
    groups.forEach((group) => groupsRoot.appendChild(createGroupCard(group)));
  }
}

function createProfileLink(link) {
  const a = document.createElement("a");
  a.href = link.url || "#";
  a.textContent = link.label || link.url || "Link";
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  return a;
}

function renderProfile(member, config) {
  const settings = config.settings || {};
  const defaultAvatar = settings.default_avatar || "/media/member_placeholder.webp";

  const overview = document.getElementById("userpages-overview");
  const profile = document.getElementById("user-profile");
  const notFound = document.getElementById("user-not-found");
  if (overview) overview.style.display = "none";
  if (notFound) notFound.style.display = "none";
  if (!profile) return;

  profile.style.display = "block";

  const avatar = document.getElementById("user-avatar");
  const name = document.getElementById("user-name");
  const role = document.getElementById("user-role");
  const subtitle = document.getElementById("user-subtitle");
  const bio = document.getElementById("user-bio");
  const links = document.getElementById("user-links");
  const discordWidget = document.getElementById("user-discord-widget");

  if (avatar) avatar.src = member.avatar || defaultAvatar;
  if (name) name.textContent = member.name || "Unbekannt";
  if (role) role.textContent = member.role || "Team";
  if (subtitle) subtitle.textContent = member.subtitle || "Profil";
  if (bio) bio.textContent = member.bio || member.short_description || "";

  if (links) {
    links.innerHTML = "";
    const title = document.createElement("div");
    title.textContent = `${member.name || "User"} Links:`;
    links.appendChild(title);

    (member.profile_links || []).forEach((link) => links.appendChild(createProfileLink(link)));

    if ((member.profile_links || []).length === 0) {
      links.style.display = "none";
    }
  }

  if (discordWidget) {
    if (member.discord_widget_id) {
      discordWidget.dataset.serverId = member.discord_widget_id;
      discordWidget.style.display = "block";
      if (window.DiscordWidget && typeof window.DiscordWidget.init === "function") {
        window.DiscordWidget.init(discordWidget.parentElement || document);
      }
    } else {
      delete discordWidget.dataset.serverId;
      discordWidget.style.display = "none";
    }
  }
}

function getRequestedUserId() {
  const queryUser = new URLSearchParams(window.location.search).get("user");
  if (queryUser) return queryUser;

  if (window.location.hash && window.location.hash.startsWith("#user=")) {
    return decodeURIComponent(window.location.hash.replace("#user=", ""));
  }

  return "";
}

async function initUsersPages() {
  const membersRoot = document.getElementById("main-team-members") || document.getElementById("userpages-members");
  const groupsRoot = document.getElementById("main-team-groups") || document.getElementById("userpages-groups");
  if (!membersRoot) return;

  const config = await loadUsersConfig();
  const requestedId = getRequestedUserId();

  if (!requestedId) {
    renderOverview(membersRoot, groupsRoot, config);
    return;
  }

  const member = enabledMembers(config).find((m) => String(m.id).toLowerCase() === String(requestedId).toLowerCase() && m.profile_enabled !== false);
  if (!member) {
    const notFound = document.getElementById("user-not-found");
    const overview = document.getElementById("userpages-overview");
    const profile = document.getElementById("user-profile");
    if (overview) overview.style.display = "none";
    if (profile) profile.style.display = "none";
    if (notFound) notFound.style.display = "block";
    return;
  }

  renderProfile(member, config);
}

initUsersPages().catch((err) => console.error("[users.js] Fehler:", err));
