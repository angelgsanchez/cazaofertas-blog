(function(){
  const lb      = document.getElementById('lightbox');
  if(!lb) return;

  const img     = document.getElementById('lb-img');
  const caption = document.getElementById('lb-caption');
  const spinner = lb.querySelector('.lb-spinner');
  const closeBt = lb.querySelector('.lb-close');

  function openLB(src, alt){
    // Reset UI
    spinner.style.display = 'grid';
    img.style.display = 'none';
    caption.textContent = alt || 'Vista ampliada';
    img.removeAttribute('src');

    // Mostrar lightbox
    lb.hidden = false;
    lb.setAttribute('aria-hidden','false');
    document.body.classList.add('lb-open');

    // Cargar imagen
    const loader = new Image();
    loader.onload = () => {
      img.src = loader.src;
      img.alt = alt || 'Vista ampliada';
      spinner.style.display = 'none';
      img.style.display = 'block';
    };
    loader.onerror = () => {
      spinner.style.display = 'none';
      caption.textContent = 'No se pudo cargar la imagen.';
    };
    loader.src = src;
  }

  function closeLB(){
    lb.hidden = true;
    lb.setAttribute('aria-hidden','true');
    document.body.classList.remove('lb-open');
    img.removeAttribute('src');
  }

  // Cerrar
  closeBt.addEventListener('click', closeLB);
  lb.addEventListener('click', (e)=>{ if(e.target === lb) closeLB(); });
  document.addEventListener('keydown', (e)=>{
    if(e.key === 'Escape' && !lb.hidden) closeLB();
  });

  // Delegación: cualquier .img-zoom abre el lightbox
  document.addEventListener('click', (e)=>{
    const el = e.target.closest('.img-zoom');
    if(!el) return;

    const full = el.getAttribute('data-full') || el.getAttribute('src');
    const alt  = el.getAttribute('alt') || 'Vista ampliada';
    if(full) openLB(full, alt);
  });
})();
