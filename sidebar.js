/* sidebar.js - shared sidebar component for komalunpacks.com */
(function () {
  var sidebar = document.getElementById('sidebar');
  if (!sidebar) return;

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
        '<button class="sb-toggle" id="sbToggle" aria-label="Toggle sidebar">' +
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

  /* Desktop: collapsed state */
  var isMobile = window.innerWidth < 769;
  var stored = localStorage.getItem('sidebarCollapsed');
  var collapsed = stored !== null ? stored === 'true' : false;
  if (collapsed && !isMobile) sidebar.classList.add('collapsed');

  document.getElementById('sbToggle').addEventListener('click', function () {
    if (isMobile) {
      sidebar.classList.remove('mob-open');
      var ov = document.getElementById('sbOverlay');
      if (ov) ov.classList.remove('visible');
    } else {
      collapsed = !collapsed;
      sidebar.classList.toggle('collapsed', collapsed);
      localStorage.setItem('sidebarCollapsed', String(collapsed));
    }
  });

  /* Mobile: open button */
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
})();
