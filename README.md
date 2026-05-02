# 🌐 Miriho6643 Website

Willkommen im Repository der offiziellen Website von **Miriho6643**.  
Dieses Projekt ist eine statische Website (GitHub Pages geeignet), die Inhalte dynamisch aus **YAML-Konfigurationen** rendert.

## ✨ Highlights

- 🧩 **YAML-driven Content** statt harter HTML-Duplikate
- 👥 **Dynamische Team- und Profilseiten** über `userpages/users.yml`
- 🗂️ **Gruppenseiten** für z. B. Helper/Azubis über einen gemeinsamen Renderer
- 🔗 **Konfigurierbare Links-Seite** mit sortierbaren Einträgen
- 📡 **Flexible Server-IP-Ausgabe** per `config/ip.yml`:
- `json` (Remote JSON-Quelle)
- `fixed` (fester Wert)
- `domain` (feste Domain)
- 📅 **Wiki-Events aus YAML** (`wiki/events.yml`)
- 🎨 Einheitliches Styling + Discord-Widget Integration

## 🏗️ Projektstruktur

```text
.
├─ index.html                  # Startseite
├─ links/
│  ├─ index.html               # Links-Landingpage
│  ├─ links.js                 # Renderer für links.yml
│  └─ links.yml                # Link-Konfiguration
├─minecraft/
│  └─ index.html               # Minecraft Seite (alte Startseite)
├─ userpages/
│  ├─ index.html               # Übersicht + Profilansicht (?user=...)
│  ├─ users.js                 # Team/Profil-Renderer
│  ├─ group.js                 # Gruppenseiten-Renderer
│  ├─ users.yml                # Zentrale User-/Gruppenkonfiguration
│  ├─ helper/index.html        # Gruppenseite (data-group-id="helper")
│  └─ azubis/index.html        # Gruppenseite (data-group-id="azubis")
├─ wiki/
│  ├─ index.html               # Wiki-Seite inkl. Events-Section
│  └─ events.yml               # Event-Daten
├─ config/
│  └─ ip.yml                   # IP-Quellenkonfiguration
└─ media/
   ├─ style.css
   ├─ discord-widget.css
   └─ discord-widget.js
```

## ⚙️ Konfiguration

### 👥 Team & Profile (`userpages/users.yml`)

- `team_groups`: Definiert Gruppenkarten (Helper/Azubis etc.)
- `members`: Definiert Mitglieder inkl. Sichtbarkeit, Reihenfolge und Profil-Links
- `order`: Sortierung aufsteigend
- `enabled`: Sichtbarkeit in Listen
- `profile_enabled`: Profilseite aktiv/inaktiv

Beispiel:

```yml
team_groups:
  - id: "helper"
    title: "Helper Team"
    order: 1
    enabled: true

members:
  - id: "miriho6643"
    name: "Miriho6643"
    group: "core"
    order: 1
    enabled: true
    profile_enabled: true
```

### 📡 Server-IP / Domain (`config/ip.yml`)

Mit `ip_source` steuerst du, woher die angezeigte Serveradresse kommt:

- `json`: lädt von `json_url` und nimmt Feld `json_field`
- `fixed`: nutzt `fixed_ip`
- `domain`: nutzt `domain`

Beispiel:

```yml
ip_source: "json" # json | fixed | domain

json_url: "https://json.extendsclass.com/bin/948068a1fd08"
json_field: "ip"

fixed_ip: ""
domain: ""
```

### 📅 Wiki-Events (`wiki/events.yml`)

Wichtig: Der Loader erwartet **`datetime`** pro Event.

```yml
events:
  - title: "Community Event"
    description: "Treffen auf dem Server."
    datetime: "2026-03-15T19:00:00"
```

## 🧪 Lokal starten

Da `fetch()` verwendet wird, die Seite nicht direkt per Datei öffnen (`file://`), sondern über einen lokalen Webserver starten.

### Option A: VS Code Live Server

- Extension installieren: **Live Server**
- Rechtsklick auf `index.html` -> **Open with Live Server**

### Option B: Python

```bash
python -m http.server 8080
```

Dann im Browser öffnen:

```text
http://localhost:8080
```

## 🚀 Deployment

Das Projekt ist für **GitHub Pages** geeignet.

1. Branch pushen
2. In GitHub: `Settings -> Pages`
3. Source auf Branch + Root setzen
4. Speichern und Deployment abwarten

## 🛠️ Verwendete Technologien

- HTML5
- CSS3
- Vanilla JavaScript
- jQuery (bestehender Bestand)
- js-yaml
- Font Awesome

## 📌 Hinweise

- Achte auf konsistente Datei-Codierung (**UTF-8**) für Umlaute.
- `order`-Werte sind reine Sortierwerte (kein Rang-System).
- Bei `ip_source: "json"` muss die JSON-URL öffentlich erreichbar sein.

## 🤝 Mitwirken

Pull Requests sind willkommen.  
Bei größeren Änderungen bitte zuerst ein kurzes Issue/Discussion erstellen, damit Struktur und Stil konsistent bleiben.

## 📄 Lizenz

Aktuell keine eigene Lizenzdatei hinterlegt.  
Falls gewünscht, ergänze eine `LICENSE` (z. B. MIT).
