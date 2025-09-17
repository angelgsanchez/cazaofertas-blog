

document.addEventListener('DOMContentLoaded', function () {
  var viewport = document.querySelector('#galeria .viewport');
  var track    = document.querySelector('#galeria .track');
  var prevBtn  = document.getElementById('car-prev');
  var nextBtn  = document.getElementById('car-next');

  // Lightbox
  var lb      = document.getElementById('lightbox');
  var lbImg   = lb ? lb.querySelector('img') : null;
  var lbTitle = lb ? lb.querySelector('.lb-title') : null;
  var lbDesc  = lb ? lb.querySelector('.lb-desc') : null;
  var lbClose = lb ? lb.querySelector('.lb-close') : null;
  var lbPrev  = lb ? lb.querySelector('.lb-prev') : null;
  var lbNext  = lb ? lb.querySelector('.lb-next') : null;

  var galleryImages = [];
  var currentIndex = 0;

  if (!viewport || !track) {
    console.warn('[gallery] Falta viewport o track');
    return;
  }

  // ==== Lightbox con múltiples imágenes ====
 function openLightbox(images, title, desc) {
  galleryImages = images;
  currentIndex = 0;
  showImage();

  if (lbTitle) lbTitle.textContent = title || '';
  if (lbDesc)  lbDesc.textContent  = desc || '';

  //  Mostrar u ocultar flechas según cantidad de imágenes
  if (galleryImages.length > 1) {
    lbPrev.style.display = 'grid';
    lbNext.style.display = 'grid';
  } else {
    lbPrev.style.display = 'none';
    lbNext.style.display = 'none';
  }

  lb.removeAttribute('hidden');
  lb.setAttribute('aria-hidden','false');
}


  function showImage() {
    if (!lbImg) return;
    if (!galleryImages.length) {
      lbImg.removeAttribute('src');
      lbImg.alt = 'En desarrollo';
      return;
    }
    lbImg.src = galleryImages[currentIndex];
    lbImg.alt = lbTitle.textContent || 'Vista';
  }

  function nextImage() {
    if (!galleryImages.length) return;
    currentIndex = (currentIndex + 1) % galleryImages.length;
    showImage();
  }

  function prevImage() {
    if (!galleryImages.length) return;
    currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
    showImage();
  }

  if (lbNext) lbNext.addEventListener('click', nextImage);
  if (lbPrev) lbPrev.addEventListener('click', prevImage);

  function closeLB(){
    if (!lb) return;
    lb.setAttribute('hidden','true');
    lb.setAttribute('aria-hidden','true');
    if (lbImg) lbImg.removeAttribute('src');
    galleryImages = [];
    currentIndex = 0;
  }
  if (lbClose) lbClose.addEventListener('click', closeLB);
  if (lb) lb.addEventListener('click', function(e){ if (e.target === lb) closeLB(); });
  document.addEventListener('keydown', function(e){ 
    if (e.key === 'Escape' && lb && !lb.hasAttribute('hidden')) closeLB();
    if (e.key === 'ArrowRight' && !lb.hasAttribute('hidden')) nextImage();
    if (e.key === 'ArrowLeft' && !lb.hasAttribute('hidden')) prevImage();
  });

  // Vincular thumbs
  track.querySelectorAll('.thumb').forEach(function(btn){
    var imgsAttr = btn.dataset.images || btn.dataset.image || '';
    var images = imgsAttr.split(',').map(s => s.trim()).filter(Boolean);

    if (images.length > 0) {
      btn.style.backgroundImage = "url('" + images[0] + "')";
    }

    btn.addEventListener('click', function(){
      openLightbox(images, btn.dataset.title, btn.dataset.desc);
    });
  });

  // ==== Carrusel infinito con animación + reordenamiento ====
  var GAP = 16;               // igual que en CSS
  var DURATION = 350;         // ms
  var isAnimating = false;

  function getStep() {
    var first = track.querySelector('.card');
    if (!first) return 0;
    var w = first.getBoundingClientRect().width;
    return w + GAP;
  }

  function next() {
    if (isAnimating) return;
    var step = getStep();
    if (!step) return;

    isAnimating = true;
    viewport.classList.add('animating');

    track.style.transition = 'transform ' + DURATION + 'ms ease';
    track.style.transform  = 'translateX(-' + step + 'px)';

    var onEnd = function () {
      track.removeEventListener('transitionend', onEnd);
      var first = track.querySelector('.card');
      if (first) track.appendChild(first);

      track.style.transition = 'none';
      track.style.transform  = 'translateX(0)';
      void track.offsetWidth;

      viewport.classList.remove('animating');
      isAnimating = false;
    };
    track.addEventListener('transitionend', onEnd);
  }

  function prev() {
    if (isAnimating) return;
    var step = getStep();
    if (!step) return;

    isAnimating = true;
    viewport.classList.add('animating');

    var items = track.querySelectorAll('.card');
    var last  = items[items.length - 1];
    track.style.transition = 'none';
    track.style.transform  = 'translateX(-' + step + 'px)';
    track.insertBefore(last, items[0]);

    void track.offsetWidth;
    track.style.transition = 'transform ' + DURATION + 'ms ease';
    track.style.transform  = 'translateX(0)';

    var onEnd = function () {
      track.removeEventListener('transitionend', onEnd);
      track.style.transition = 'none';
      viewport.classList.remove('animating');
      isAnimating = false;
    };
    track.addEventListener('transitionend', onEnd);
  }

  if (nextBtn) nextBtn.addEventListener('click', next);
  if (prevBtn) prevBtn.addEventListener('click', prev);

  viewport.setAttribute('tabindex','0');
  viewport.addEventListener('keydown', function(e){
    if (e.key === 'ArrowRight') next();
    if (e.key === 'ArrowLeft')  prev();
  });
});

// ====== Menú hamburguesa estable ======
(function(){
  const body     = document.body;
  const btn      = document.getElementById('burger');
  const panel    = document.getElementById('menu-panel');
  const backdrop = document.getElementById('menu-backdrop');

  if(!btn || !panel || !backdrop){
    console.warn('[menu] faltan nodos burger/panel/backdrop');
    return;
  }

  function openMenu(){
    panel.classList.add('open');
    backdrop.classList.add('show');
    body.classList.add('menu-open');
    btn.setAttribute('aria-expanded','true');
    panel.setAttribute('aria-hidden','false');
    backdrop.setAttribute('aria-hidden','false');
  }
  function closeMenu(){
    panel.classList.remove('open');
    backdrop.classList.remove('show');
    body.classList.remove('menu-open');
    btn.setAttribute('aria-expanded','false');
    panel.setAttribute('aria-hidden','true');
    backdrop.setAttribute('aria-hidden','true');
  }

  btn.addEventListener('click', ()=>{
    const isOpen = panel.classList.contains('open');
    isOpen ? closeMenu() : openMenu();
  });

  // cerrar al tocar fuera o al hacer click en un link
  backdrop.addEventListener('click', closeMenu);
  panel.querySelectorAll('a').forEach(a=> a.addEventListener('click', closeMenu));

  // cerrar con ESC
  document.addEventListener('keydown', (e)=>{
    if(e.key === 'Escape' && panel.classList.contains('open')) closeMenu();
  });

  // safety: al cambiar de tamaño a desktop, cerramos si quedó abierto
  window.addEventListener('resize', ()=>{
    if(window.innerWidth > 900 && panel.classList.contains('open')) closeMenu();
  });
})();

