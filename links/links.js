// ===============================
// GLOBAL JS FÜR BUTTONS & LINKS
// ===============================

document.addEventListener('DOMContentLoaded', () => {

    // -------------------
    // IP-Kopier-Buttons
    // -------------------
    document.querySelectorAll('.main1_ipcopier').forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation(); // verhindert, dass Klicks auf Elterncontainer durchgehen
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
    // Klickschutz auf graue Flächen
    // -------------------
    // Nur echte Buttons/Links reagieren, graue Hintergründe nicht
    const clickableSelectors = [
        '.main5_admins_clickable',
        '.main5_group_link',
        '.main1_ipcopier'
    ];

    clickableSelectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
            el.addEventListener('click', e => {
                e.stopPropagation(); // nur auf diesen Link reagieren
            });
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

    // Position: immer über dem Button
    button.appendChild(popup);

    setTimeout(() => {
        popup.remove();
    }, 2000);
}
