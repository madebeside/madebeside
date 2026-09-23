(() => {
  const gs = window.gsap;
  const st = window.ScrollTrigger;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const desktop = matchMedia('(min-width: 901px) and (pointer: fine)');
  const panel = document.querySelector('.delivery-statement');
  if (!panel || !gs || !st) return;
  gs.registerPlugin(st);
  let context, lenis, tick;
  const paused = () => reduced.matches || document.body.classList.contains('motion-paused');
  const loader = document.querySelector('.sorting-loader');
  // A non-blocking sorting indicator: the page is readable immediately.
  if (!paused() && !location.hash) {
    loader.hidden = false;
    const progress = { value: 0 };
    gs.to(progress, { value: 100, duration: 1.15, ease: 'power2.out', onUpdate() {
      loader.querySelector('b').textContent = Math.round(progress.value) + '%';
      loader.querySelector('i').style.transform = `scaleX(${progress.value / 100})`;
    }, onComplete() { gs.to(loader, { y: 20, opacity: 0, duration: .2, onComplete() { loader.hidden = true; } }); } });
    setTimeout(() => { loader.hidden = true; }, 1800);
  }
  function configure() {
    context?.revert();
    if (tick) gs.ticker.remove(tick);
    lenis?.destroy(); lenis = null;
    document.documentElement.classList.remove('agency-motion');
    if (paused()) return;
    document.documentElement.classList.add('agency-motion');
    if (desktop.matches && window.Lenis) {
      lenis = new window.Lenis({ lerp: .11, smoothWheel: true, syncTouch: false, anchors: true });
      lenis.on('scroll', st.update);
      tick = time => lenis?.raf(time * 1000);
      gs.ticker.add(tick);
      gs.ticker.lagSmoothing(0);
    }
    context = gs.context(() => {
      if (innerWidth > 600) {
        const reveal = gs.timeline({ scrollTrigger: { trigger: panel, start: 'top top', end: 'bottom bottom', scrub: .45 } });
        reveal.to('.statement-ink', { clipPath: 'inset(0 0% 0 0)', stagger: .28, duration: .75, ease: 'none' });
        reveal.to('.delivery-tracker b', { scaleX: 1, duration: reveal.duration(), ease: 'none' }, 0);
      }
      if (desktop.matches) {
        gs.to('.agency-art', { y: -65, rotation: 3, ease: 'none', scrollTrigger: { trigger: '.agency-hero', start: 'top top', end: 'bottom top', scrub: .6 } });
        gs.to('.headline-class', { x: 30, ease: 'none', scrollTrigger: { trigger: '.agency-hero', start: 'top top', end: 'bottom top', scrub: .6 } });
      }
    });
    st.refresh();
  }
  configure();
  if (!paused() && !location.hash) {
    const entrance = gs.timeline({ defaults: { duration: .9, ease: 'power3.out' } });
    entrance.from('.agency-composition h1>span', { y: 38, opacity: 0, stagger: .12, clearProps: 'opacity,transform' })
      .from('.agency-art img', { y: 45, rotation: -4, opacity: 0, clearProps: 'opacity,transform' }, .2);
    document.querySelector('.motion-toggle')?.addEventListener('click', () => entrance.progress(1), { once: true });
  }
  document.querySelector('.agency-art img')?.addEventListener('load', () => st.refresh());
  document.fonts?.ready.then(() => st.refresh());
  // Both the OS setting and the existing Pause motion control govern all effects.
  new MutationObserver(configure).observe(document.body, { attributes: true, attributeFilter: ['class'] });
  reduced.addEventListener('change', configure);
  desktop.addEventListener('change', configure);
  const mobilePanel = matchMedia('(max-width: 600px)');
  mobilePanel.addEventListener('change', configure);
  const pointer = document.createElement('span');
  pointer.className = 'agency-pointer'; pointer.setAttribute('aria-hidden', 'true');
  document.body.append(pointer);
  let pending = false, px = 0, py = 0;
  document.addEventListener('pointermove', event => {
    if (event.pointerType !== 'mouse' || !desktop.matches || paused() || event.target.closest('input,textarea,select')) { pointer.classList.remove('visible'); return; }
    pointer.classList.add('visible');
    pointer.classList.toggle('is-link', !!event.target.closest('a,button'));
    px = event.clientX; py = event.clientY;
    if (!pending) { pending = true; requestAnimationFrame(() => { pointer.style.transform = `translate(${px}px,${py}px) translate(-50%,-50%)`; pending = false; }); }
  }, { passive: true });
  document.addEventListener('keydown', () => pointer.classList.remove('visible'));
  document.documentElement.addEventListener('pointerleave', () => pointer.classList.remove('visible'));
  document.querySelectorAll('[data-magnetic]').forEach(button => {
    button.addEventListener('pointermove', event => {
      if (paused() || !desktop.matches) return;
      const r = button.getBoundingClientRect();
      gs.to(button, { x: (event.clientX-r.left-r.width/2)*.12, y: (event.clientY-r.top-r.height/2)*.12, duration: .35, overwrite: true });
    });
    button.addEventListener('pointerleave', () => gs.to(button, { x: 0, y: 0, duration: .5, ease: 'power3.out', overwrite: true }));
  });
})();
