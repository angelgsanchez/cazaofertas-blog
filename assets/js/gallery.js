// assets/js/gallery.js
document.addEventListener('DOMContentLoaded', function () {
  const viewport = document.querySelector('#galeria .viewport');
  const track    = document.querySelector('#galeria .track');
  const prevBtn  = document.getElementById('car-prev');
  const nextBtn  = document.getElementById('car-next');

  // Lightbox
  const lb      = document.getElementById('lightbox');
  const lbImg   = lb ? lb.querySelector('img') : null;
  const lbTitle = lb ? lb.querySelector('.lb-title') : null;
  const lbDesc  = lb ? lb.querySelector('.lb-desc') : null;
  const lbClose = lb ? lb.querySelector('.lb-close') : null;
  const lbPrev  = lb ? lb.querySelector('.lb-prev') : null;
  const lbNext  = lb ? lb.querySelector('.lb-next') : null;

  let galleryImages = [];
  let currentIndex = 0;

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

    if (galleryImages.length > 1) {
      if (lbPrev) lbPrev.style.display = 'grid';
      if (lbNext) lbNext.style.display = 'grid';
    } else {
      if (lbPrev) lbPrev.style.display = 'none';
      if (lbNext) lbNext.style.display = 'none';
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
    lbImg.alt = lbTitle?.textContent || 'Vista';
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
  if (lb) lb.addEventListener('click', e => { if (e.target === lb) closeLB(); });
  document.addEventListener('keydown', e => { 
    if (e.key === 'Escape' && lb && !lb.hasAttribute('hidden')) closeLB();
    if (e.key === 'ArrowRight' && lb && !lb.hasAttribute('hidden')) nextImage();
    if (e.key === 'ArrowLeft'  && lb && !lb.hasAttribute('hidden')) prevImage();
  });

  // Vincular thumbs
  track.querySelectorAll('.thumb').forEach(btn => {
    const imgsAttr = btn.dataset.images || btn.dataset.image || '';
    const images = imgsAttr.split(',').map(s => s.trim()).filter(Boolean);

    if (images.length > 0) {
      btn.style.backgroundImage = `url('${images[0]}')`;
    }
    btn.addEventListener('click', () => openLightbox(images, btn.dataset.title, btn.dataset.desc));
  });

  // ==== Carrusel infinito con animación + reordenamiento ====
  const GAP = 16;
  const DURATION = 350;
  let isAnimating = false;

  function getStep() {
    const first = track.querySelector('.card');
    if (!first) return 0;
    const w = first.getBoundingClientRect().width;
    return w + GAP;
  }

  function next() {
    if (isAnimating) return;
    const step = getStep();
    if (!step) return;

    isAnimating = true;
    viewport.classList.add('animating');

    track.style.transition = `transform ${DURATION}ms ease`;
    track.style.transform  = `translateX(-${step}px)`;

    const onEnd = () => {
      track.removeEventListener('transitionend', onEnd);
      const first = track.querySelector('.card');
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
    const step = getStep();
    if (!step) return;

    isAnimating = true;
    viewport.classList.add('animating');

    const items = track.querySelectorAll('.card');
    const last  = items[items.length - 1];
    track.style.transition = 'none';
    track.style.transform  = `translateX(-${step}px)`;
    track.insertBefore(last, items[0]);

    void track.offsetWidth;
    track.style.transition = `transform ${DURATION}ms ease`;
    track.style.transform  = 'translateX(0)';

    const onEnd = () => {
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
  viewport.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') next();
    if (e.key === 'ArrowLeft')  prev();
  });
});
