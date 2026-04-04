/* sidebar.js - shared sidebar component for komalunpacks.com */
(function () {
  var sidebar = document.getElementById('sidebar');
  if (!sidebar) return;

  // ── 1. Inject CSS overrides ──────────────────────────────────────────────
  // These override each page's width-based collapse with transform-based
  // slide-off, and switch body from flex to block so fixed sidebar + margin-left works.
  var style = document.createElement('style');
  style.textContent = [
    /* Sidebar: fixed position, transform-driven open/close */
    '#sidebar {',
    '  position: fixed !important;',
    '  left: 0; top: 0; bottom: 0;',
    '  width: 220px !important;',
    '  height: 100vh !important;',
    '  transform: translateX(0);',
    '  transition: transform 0.25s ease !important;',
    '  z-index: 100;',
    '  overflow-y: auto;',
    '  overflow-x: hidden;',
    '}',
    '#sidebar.collapsed {',
    '  transform: translateX(-100%) !important;',
    '}',
    /* Body: switch from flex to block so sidebar leaves normal flow */
    'body { display: block !important; }',
    /* Main content: left margin equals sidebar width, transitions with sidebar */
    '.site-main {',
    '  flex: none !important;',
    '  margin-left: 220px;',
    '  transition: margin-left 0.25s ease;',
    '  min-width: 0;',
    '  width: auto;',
    '}',
    'body.sb-collapsed .site-main { margin-left: 0; }',
    /* Floating toggle button (desktop only) */
    '#sb-float-btn {',
    '  position: fixed;',
    '  top: 14px;',
    '  left: 228px;',
    '  z-index: 200;',
    '  background: var(--white, #FFFDF8);',
    '  border: 1px solid rgba(107,61,122,0.12);',
    '  border-radius: 6px;',
    '  padding: 7px 9px;',
    '  cursor: pointer;',
    '  color: var(--plum, #6B3D7A);',
    '  display: flex;',
    '  align-items: center;',
    '  justify-content: center;',
    '  box-shadow: 0 2px 8px rgba(0,0,0,0.07);',
    '  transition: left 0.25s ease, background 0.2s;',
    '}',
    '#sb-float-btn:hover { background: var(--plum-pale, #F0E8F5); }',
    'body.sb-collapsed #sb-float-btn { left: 14px; }',
    /* Mobile overrides: sidebar off-screen by default, mob-open slides it in */
    '@media (max-width: 768px) {',
    '  #sidebar {',
    '    z-index: 200 !important;',
    '    transform: translateX(-100%) !important;',
    '    box-shadow: 4px 0 24px rgba(0,0,0,0.08);',
    '  }',
    '  #sidebar.mob-open { transform: translateX(0) !important; }',
    '  .site-main { margin-left: 0 !important; }',
    '  #sb-float-btn { display: none !important; }',
    '}',
  ].join('\n');
  document.head.appendChild(style);

  // ── 2. Build sidebar HTML ────────────────────────────────────────────────
  var path = location.pathname;
  var inTeardowns = path.indexOf('/teardowns/') === 0;

  function act(href) {
    if (href === '/how-i-ai' && inTeardowns) return ' active';
    if (href === '/') return (path === '/' || path === '/index.html') ? ' active' : '';
    return path.indexOf(href) === 0 ? ' active' : '';
  }

  sidebar.innerHTML =
    '<div class="sb-inner">' +
      '<div class="sb-head">' +
        '<span class="sb-label">Index</span>' +
        '<button class="sb-toggle" id="sbToggle" aria-label="Close sidebar">' +
          '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>' +
        '</button>' +
      '</div>' +
      '<nav class="sb-nav">' +
        '<a href="/case-studies" class="sb-link' + act('/case-studies') + '">Case studies</a>' +
        '<a href="/product-teardowns" class="sb-link' + act('/product-teardowns') + '">Product teardowns</a>' +
        '<div class="sb-group">' +
          '<span class="sb-group-lbl">How I AI</span>' +
          '<a href="/how-i-ai" class="sb-sub' + act('/how-i-ai') + '">Tool teardowns</a>' +
          '<a href="/ai-lab" class="sb-sub' + act('/ai-lab') + '">AI lab</a>' +
        '</div>' +
        '<div class="sb-divider"></div>' +
        '<a href="/#about" class="sb-link">About</a>' +
        '<a href="/KomalSikka_ProductOwner_15%20years.pdf" class="sb-link" download>Resume</a>' +
        '<a href="https://linkedin.com/in/komalsikka" class="sb-link sb-ext" target="_blank" rel="noopener">LinkedIn</a>' +
        '<a href="/#contact" class="sb-link">Contact</a>' +
      '</nav>' +
    '</div>';

  // ── 3. Create floating toggle button (desktop) ───────────────────────────
  var floatBtn = document.createElement('button');
  floatBtn.id = 'sb-float-btn';
  var hamSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>';
  var arrowSvg = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>';
  document.body.appendChild(floatBtn);

  // ── 4. State management ──────────────────────────────────────────────────
  var isMobile = window.innerWidth < 769;
  var stored = localStorage.getItem('sidebarCollapsed');
  // Default: open on desktop, closed (mob-open handles) on mobile
  var collapsed = stored !== null ? stored === 'true' : false;

  function updateIcon() {
    floatBtn.innerHTML = collapsed ? hamSvg : arrowSvg;
    floatBtn.setAttribute('aria-label', collapsed ? 'Open sidebar' : 'Close sidebar');
  }

  function applyState(animate) {
    if (!animate) {
      // Suppress transitions for the initial paint to avoid layout flash
      var noTrans = document.createElement('style');
      noTrans.id = 'sb-no-trans';
      noTrans.textContent = '* { transition: none !important; }';
      document.head.appendChild(noTrans);
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          var el = document.getElementById('sb-no-trans');
          if (el) el.remove();
        });
      });
    }
    sidebar.classList.toggle('collapsed', collapsed);
    document.body.classList.toggle('sb-collapsed', collapsed);
    updateIcon();
  }

  function toggleSidebar() {
    collapsed = !collapsed;
    localStorage.setItem('sidebarCollapsed', String(collapsed));
    applyState(true);
  }

  // Apply initial state on desktop (mobile is handled by mob-open CSS)
  if (!isMobile) {
    applyState(false);
  } else {
    updateIcon();
  }

  // ── 5. Event listeners ───────────────────────────────────────────────────

  // Float button (desktop) — always visible, moves with state
  floatBtn.addEventListener('click', toggleSidebar);

  // Toggle button inside sidebar header
  document.getElementById('sbToggle').addEventListener('click', function () {
    if (isMobile) {
      // On mobile this button closes the slide-in panel
      sidebar.classList.remove('mob-open');
      var ov = document.getElementById('sbOverlay');
      if (ov) ov.classList.remove('visible');
    } else {
      toggleSidebar();
    }
  });

  // Mobile: hamburger button in page HTML opens the panel
  var mBtn = document.getElementById('mobMenuBtn');
  var overlay = document.getElementById('sbOverlay');
  if (mBtn) {
    mBtn.addEventListener('click', function () {
      sidebar.classList.toggle('mob-open');
      if (overlay) overlay.classList.toggle('visible');
    });
  }
  if (overlay) {
    overlay.addEventListener('click', function () {
      sidebar.classList.remove('mob-open');
      overlay.classList.remove('visible');
    });
  }

  // Update isMobile on resize so toggle handlers stay correct
  window.addEventListener('resize', function () {
    isMobile = window.innerWidth < 769;
  });
})();
