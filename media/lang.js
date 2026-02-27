// Übersetzungen als Map von Originaltext zu Englisch
const translations = {
  "Willkommen auf meiner Webseite": "Welcome to my website",
  "Hier kannst du Texte eingeben und vieles mehr machen.": "Here you can enter text and do much more.",
  "Klick mich!": "Click me!"
};

// aktuelle Sprache
let currentLang = "de";

// Funktion: alles auf der Seite übersetzen
function translatePage() {
  document.body.querySelectorAll("*").forEach(el => {
    // nur Elemente mit Text
    if (el.childNodes.length === 1 && el.childNodes[0].nodeType === Node.TEXT_NODE) {
      const text = el.textContent.trim();
      if (currentLang === "de" && translations[text]) {
        el.textContent = translations[text];
      } else if (currentLang === "en") {
        // Englisch zurück zu Deutsch
        for (const [de, en] of Object.entries(translations)) {
          if (text === en) el.textContent = de;
        }
      }
    }
  });
  currentLang = currentLang === "de" ? "en" : "de";
}

// Klick auf Symbol: Sprache wechseln
document.getElementById("lang-switch").addEventListener("click", translatePage);
