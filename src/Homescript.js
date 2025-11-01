document.getElementById('BtnLogin').onclick = () => {
    window.location.href = '';
};
Btndropdown.onclick = () => {
    const dropdown = Btndropdown.closest('.dropdown') || document.querySelector('.dropdown');

    if (!dropdown) return;

    const content = dropdown.querySelector('.dropdown-content');
    const isOpen = dropdown.classList.toggle('open'); 
    if (content) content.style.display = isOpen ? 'block' : 'none';
    const icon = dropdown.querySelector('.troca-imagem') || document.querySelector('.troca-imagem');
    if (icon) {
        if (icon.tagName === 'IMG') {
            if (!icon.dataset.orig) icon.dataset.orig = icon.getAttribute('src');
            const alt = icon.getAttribute('data-alt');
            if (alt) {
                icon.src = isOpen ? alt : icon.dataset.orig;
            } else {
                icon.classList.toggle('rotated', isOpen);
            }
        } else {
            icon.classList.toggle('active', isOpen);
        }
    }
}
