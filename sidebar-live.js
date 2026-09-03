(() => {
  'use strict';
  if (window.__grizzlySiteShellLoaded || document.querySelector('script[data-site-shell-loader]')) return;
  const script = document.createElement('script');
  script.src = './site-shell.js';
  script.defer = true;
  script.dataset.siteShellLoader = 'true';
  document.head.appendChild(script);
})();
