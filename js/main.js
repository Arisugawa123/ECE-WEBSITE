// WMSU COE – ECE Department e‑profile scripts
(function(){
  const $ = (sel, el=document) => el.querySelector(sel);

  // Dynamic year in footer
  const y = new Date().getFullYear();
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = y;

  // Mobile navigation toggle
  const navToggle = $('.nav-toggle');
  const nav = $('#primary-nav');
  const header = $('.site-header');
  if (navToggle && nav){
    navToggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // Update CSS var for header height so sections fill viewport minus header
  const setHeaderHeight = () => {
    if (!header) return;
    const h = header.getBoundingClientRect().height;
    document.documentElement.style.setProperty('--header-h', `${Math.round(h)}px`);
  };
  window.addEventListener('load', setHeaderHeight);
  window.addEventListener('resize', setHeaderHeight);
  new ResizeObserver(setHeaderHeight).observe(header);

  // Hero background from data attribute
  const hero = $('#home.hero');
  if (hero){
    const src = hero.getAttribute('data-hero');
    if (src){
      const style = document.createElement('style');
      style.innerHTML = `.hero::before{ background-image: var(--hero-image, url('${src}')); }`;
      document.head.appendChild(style);
    }
    // Slightly zoom in to cover empty space while keeping faces visible
    document.documentElement.style.setProperty('--hero-size', 'cover');
    document.documentElement.style.setProperty('--hero-pos', 'left center');
  }

  // Smooth scroll + active link highlight
  const setActive = () => {
    const links = Array.from(document.querySelectorAll('.primary-nav a[href^="#"]'));
    const scrollY = window.scrollY + 120; // offset for sticky header
    let current = links[0];
    links.forEach(link => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      const top = target.offsetTop;
      if (scrollY >= top) current = link;
    });
    links.forEach(l => l.classList.remove('active'));
    if (current) current.classList.add('active');
  };
  document.addEventListener('scroll', setActive, { passive: true });
  window.addEventListener('load', setActive);

  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href');
    const el = $(id);
    if (!el) return;
    e.preventDefault();
    el.scrollIntoView({ behavior: 'smooth' });
  });
  // Desktop layout fit-to-screen on touch devices
  (function(){
    var isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (!isTouch) return;

    var html = document.documentElement;
    var body = document.body;

    // Create viewport wrapper and move existing body content inside
    var viewport = document.createElement('div');
    viewport.className = 'rv-fit-viewport';

    var root = document.createElement('div');
    root.className = 'rv-fit-root';

    // Move all body children into root
    while (body.firstChild) {
      root.appendChild(body.firstChild);
    }

    viewport.appendChild(root);
    body.appendChild(viewport);

    html.classList.add('rv-fit');
    body.classList.add('rv-fit');

    // Optional toggle to revert to normal mode
    var toggle = document.createElement('button');
    toggle.textContent = 'Toggle Fit';
    Object.assign(toggle.style, {
      position: 'fixed', right: '10px', bottom: '10px', zIndex: 1000,
      padding: '8px 10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,.3)',
      background: 'rgba(0,0,0,.35)', color: '#fff'
    });
    document.body.appendChild(toggle);

    var fitted = true;

    function sizeRoot(){
      // Use the designed desktop width (container) or a sensible width
      var designWidth = 1280; // keep desktop layout width
      var designHeight = root.scrollHeight; // dynamic height based on content

      // Compute scale to fit both width and height into viewport
      var vw = window.innerWidth; var vh = window.innerHeight;
      var scale = Math.min(vw / designWidth, vh / designHeight);
      if (!isFinite(scale) || scale <= 0) scale = 1;

      // Ensure crispness on tiny screens by allowing a minimum design width scaling
      root.style.width = designWidth + 'px';
      root.style.transform = 'scale(' + scale + ')';

      // Center within viewport
      var scaledW = designWidth * scale;
      var scaledH = designHeight * scale;
      root.style.marginLeft = ((vw - scaledW) / 2) + 'px';
      root.style.marginTop = ((vh - scaledH) / 2) + 'px';
    }

    function enableFit(){
      viewport.style.display = '';
      toggle.style.opacity = '1';
      fitted = true;
      sizeRoot();
    }
    function disableFit(){
      viewport.style.display = 'none';
      toggle.style.opacity = '.65';
      fitted = false;
    }

    toggle.addEventListener('click', function(){
      if (fitted) disableFit(); else enableFit();
    });

    window.addEventListener('resize', function(){ if (fitted) sizeRoot(); });
    window.addEventListener('orientationchange', function(){ setTimeout(sizeRoot, 50); });
    var ro = new ResizeObserver(function(){ if (fitted) sizeRoot(); });
    ro.observe(root);

    // Initial
    sizeRoot();
  })();
})();
