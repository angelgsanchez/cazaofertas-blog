// assets/js/menu.js
(function () {
  const body = document.body;
  const burger = document.getElementById('burger');
  const panel = document.getElementById('menuPanel');
  const backdrop = document.getElementById('menuBackdrop');

  function openMenu() {
    if (!panel) return;
    panel.classList.add('open');
    if (backdrop) {
      backdrop.classList.add('show');
      backdrop.setAttribute('aria-hidden', 'false');
    }
    body.classList.add('menu-open'); // bloquea scroll detrás
    burger?.setAttribute('aria-expanded', 'true');
    panel.setAttribute('aria-hidden', 'false');
  }

  function closeMenu() {
    if (!panel) return;
    panel.classList.remove('open');
    if (backdrop) {
      backdrop.classList.remove('show');
      backdrop.setAttribute('aria-hidden', 'true');
    }
    body.classList.remove('menu-open');
    burger?.setAttribute('aria-expanded', 'false');
    panel.setAttribute('aria-hidden', 'true');
  }

  burger?.addEventListener('click', () => {
    panel?.classList.contains('open') ? closeMenu() : openMenu();
  });

  backdrop?.addEventListener('click', closeMenu);
  panel?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

  // Cerrar si se pasa a escritorio
  window.addEventListener('resize', () => {
    if (window.innerWidth > 1100 && panel?.classList.contains('open')) closeMenu();
  });

  // Cerrar con ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && panel?.classList.contains('open')) closeMenu();
  });
})();
