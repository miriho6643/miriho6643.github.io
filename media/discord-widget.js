(function () {
  "use strict";

  function createBaseMarkup(host) {
    host.innerHTML = "";

    const state = document.createElement("p");
    state.className = "discord-widget__state";
    state.textContent = "Discord Daten werden geladen...";
    host.appendChild(state);
  }

  function formatNumber(value) {
    if (typeof value !== "number" || Number.isNaN(value)) return "--";
    return new Intl.NumberFormat("de-DE").format(value);
  }

  function buildIcon(data) {
    if (data.icon) {
      const img = document.createElement("img");
      img.className = "discord-widget__icon";
      img.alt = "Server Icon";
      img.src =
        "https://cdn.discordapp.com/icons/" +
        data.id +
        "/" +
        data.icon +
        ".png?size=128";
      return img;
    }

    const fallback = document.createElement("div");
    fallback.className =
      "discord-widget__icon discord-widget__icon--fallback";
    fallback.textContent = (data.name || "D").trim().slice(0, 2).toUpperCase();
    return fallback;
  }

  function onlineMembers(data) {
    if (!Array.isArray(data.members)) return [];
    return data.members.filter(function (member) {
      return member && member.status && member.status !== "offline";
    });
  }

  function statusLabel(status) {
    if (status === "online") return "Online";
    if (status === "idle") return "Abwesend";
    if (status === "dnd") return "Nicht stoeren";
    return "Offline";
  }

  function statusClass(status) {
    if (status === "online") return "is-online";
    if (status === "idle") return "is-idle";
    if (status === "dnd") return "is-dnd";
    return "is-offline";
  }

  function createMemberRow(member) {
    const row = document.createElement("div");
    row.className = "discord-widget__member";

    const avatar = document.createElement("img");
    avatar.className = "discord-widget__member-avatar";
    avatar.alt = (member.username || "Mitglied") + " Avatar";
    avatar.src = member.avatar_url || "";
    row.appendChild(avatar);

    const text = document.createElement("div");
    text.className = "discord-widget__member-text";

    const name = document.createElement("div");
    name.className = "discord-widget__member-name";
    name.textContent = member.username || "Unbekannt";
    text.appendChild(name);

    const status = document.createElement("div");
    status.className = "discord-widget__member-status";

    const dot = document.createElement("span");
    dot.className =
      "discord-widget__status-dot " + statusClass(member.status);
    status.appendChild(dot);

    const label = document.createElement("span");
    label.textContent = statusLabel(member.status);
    status.appendChild(label);

    text.appendChild(status);
    row.appendChild(text);

    return row;
  }

  function renderData(host, data) {
    host.classList.remove("discord-widget--error");
    host.innerHTML = "";

    const row = document.createElement("div");
    row.className = "discord-widget__row";
    row.appendChild(buildIcon(data));

    const title = document.createElement("h3");
    title.className = "discord-widget__title";
    title.textContent = data.name || "Discord Server";
    row.appendChild(title);

    host.appendChild(row);

    const meta = document.createElement("div");
    meta.className = "discord-widget__meta";

    const onlineNow = onlineMembers(data);

    const online = document.createElement("div");
    online.className = "discord-widget__stat";
    online.innerHTML =
      '<div class="discord-widget__stat-label">Online</div>' +
      '<div class="discord-widget__stat-value">' +
      formatNumber(data.presence_count || onlineNow.length) +
      "</div>";
    meta.appendChild(online);

    const members = document.createElement("div");
    members.className = "discord-widget__stat";
    members.innerHTML =
      '<div class="discord-widget__stat-label">Mitglieder</div>' +
      '<div class="discord-widget__stat-value">' +
      formatNumber(data.member_count) +
      "</div>";
    meta.appendChild(members);

    host.appendChild(meta);

    const listSection = document.createElement("div");
    listSection.className = "discord-widget__members";

    const listTitle = document.createElement("div");
    listTitle.className = "discord-widget__members-title";
    listTitle.textContent = "Gerade online";
    listSection.appendChild(listTitle);

    if (onlineNow.length === 0) {
      const empty = document.createElement("div");
      empty.className = "discord-widget__members-empty";
      empty.textContent = "Momentan keine Online-Mitglieder sichtbar.";
      listSection.appendChild(empty);
    } else {
      const list = document.createElement("div");
      list.className = "discord-widget__members-list";

      onlineNow.slice(0, 8).forEach(function (member) {
        list.appendChild(createMemberRow(member));
      });

      listSection.appendChild(list);
    }

    host.appendChild(listSection);

    const inviteUrl = data.instant_invite || host.dataset.inviteUrl || "";
    if (inviteUrl) {
      const actions = document.createElement("div");
      actions.className = "discord-widget__actions";

      const join = document.createElement("a");
      join.className = "discord-widget__join";
      join.href = inviteUrl;
      join.target = "_blank";
      join.rel = "noopener noreferrer nofollow";
      join.textContent = "Server beitreten";

      actions.appendChild(join);
      host.appendChild(actions);
    }
  }

  function renderError(host) {
    host.classList.add("discord-widget--error");
    host.innerHTML = "";

    const state = document.createElement("p");
    state.className = "discord-widget__state";
    state.textContent = "Discord Widget konnte nicht geladen werden.";

    host.appendChild(state);
  }

  async function loadWidget(host) {
    const serverId = host.dataset.serverId;

    if (!serverId) {
      renderError(host);
      return;
    }

    createBaseMarkup(host);

    try {
      const url =
        "https://discord.com/api/guilds/" +
        encodeURIComponent(serverId) +
        "/widget.json";

      const res = await fetch(url, { cache: "no-store" });

      if (!res.ok) {
        throw new Error("HTTP " + res.status);
      }

      const data = await res.json();

      renderData(host, data);
    } catch (err) {
      console.error("[discord-widget] Fehler:", err);
      renderError(host);
    }
  }

  async function init(container) {
    const root = container || document;

    const widgets = root.querySelectorAll(
      ".tile.discord-widget[data-server-id]"
    );

    const jobs = [];

    widgets.forEach(function (widget) {
      jobs.push(loadWidget(widget));
    });

    await Promise.all(jobs);
  }

  window.DiscordWidget = { init: init };

  document.addEventListener("DOMContentLoaded", function () {
    window.DiscordWidget.init(document);
  });
})();
