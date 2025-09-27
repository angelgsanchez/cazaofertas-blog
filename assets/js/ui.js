// assets/js/ui.js
document.addEventListener('DOMContentLoaded', () => {
  const body  = document.body;
  const btn   = document.getElementById('burger');     // OK en tu HTML
  const panel = document.getElementById('menuPanel');  // OK en tu HTML

  if (!btn || !panel) return;

  const open  = () => { panel.classList.add('open');  body.classList.add('menu-open');  btn.setAttribute('aria-expanded','true');  panel.setAttribute('aria-hidden','false'); };
  const close = () => { panel.classList.remove('open'); body.classList.remove('menu-open'); btn.setAttribute('aria-expanded','false'); panel.setAttribute('aria-hidden','true'); };

  btn.addEventListener('click', () => panel.classList.contains('open') ? close() : open());
  panel.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && panel.classList.contains('open')) close(); });

  // safety: si vuelves a desktop, cierra
  window.addEventListener('resize', () => { if (window.innerWidth > 1100 && panel.classList.contains('open')) close(); });
});
