// ===============================
// GLOBAL JS FÜR BUTTONS & LINKS
// ===============================

// -------------------
// IP Kopier-Buttons
// -------------------
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.main1_ipcopier').forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation(); // Verhindert Klicks auf Eltern-Container
            const ip = button.dataset.ip || button.innerText; // IP aus data-Attribut oder Text
            navigator.clipboard.writeText(ip).then(() => {
                showPopup(button, 'IP kopiert!');
            }).catch(() => {
                showPopup(button, 'Fehler beim Kopieren');
            });
        });
    });

    // -------------------
    // Mobile Navbar Toggle
    // -------------------
    const mobileIcon = document.querySelector('.mobile_navbar .icon');
    const mobileLinks = document.getElementById('mobile_navbar_links');
    if (mobileIcon && mobileLinks) {
        mobileIcon.addEventListener('click', () => {
            mobileLinks.style.display = mobileLinks.style.display === 'flex' ? 'none' : 'flex';
        });
    }

    // -------------------
    // Nur Buttons klickbar, graues Umfeld nicht
    // -------------------
    // Wenn du weitere klickbare Elemente hast, die nicht auf die ganze Karte reagieren sollen:
    document.querySelectorAll('.main5_admins_clickable, .main5_group_link').forEach(el => {
        el.addEventListener('click', (e) => {
            e.stopPropagation(); // nur auf diesen Link reagieren
        });
    });
});

// -------------------
// Popup-Funktion
// -------------------
function showPopup(button, message) {
    // Vorhandene Popup entfernen
    const existingPopup = button.querySelector('.main1_popup');
    if (existingPopup) existingPopup.remove();

    const popup = document.createElement('div');
    popup.classList.add('main1_popup');
    popup.innerText = message;
    button.appendChild(popup);

    setTimeout(() => {
        popup.remove();
    }, 2000);
}
