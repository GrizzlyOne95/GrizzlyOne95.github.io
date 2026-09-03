(() => {
  'use strict';
  if (window.__grizzlySiteShellLoaded) return;
  window.__grizzlySiteShellLoaded = true;

  const LIVE_API = 'https://bz98gamewatcher.com';
  const LIVE_VISIBLE_MS = 60000;
  const LIVE_HIDDEN_MS = 300000;
  const LIVE_TIMEOUT_MS = 6000;

  const pages = {
    about: './index.html',
    battlezone: './battlezone.html',
    projects: './battlezone-projects.html',
    mods: './battlezone-mods.html',
    tools: './battlezone-tools.html',
    gallery: './battlezone-gallery.html',
    live: './battlezone-live.html',
    media: './media.html',
    other: './other.html'
  };

  if (!document.querySelector('link[data-site-accessibility]')) {
    const accessibility = document.createElement('link');
    accessibility.rel = 'stylesheet';
    accessibility.href = './accessibility.css';
    accessibility.dataset.siteAccessibility = 'true';
    document.head.appendChild(accessibility);
  }

  const main = document.querySelector('.content-shell');
  if (main) {
    main.id ||= 'main-content';
    main.tabIndex = -1;
    if (!document.querySelector('.skip-link')) {
      const skip = document.createElement('a');
      skip.className = 'skip-link';
      skip.href = '#main-content';
      skip.textContent = 'Skip to content';
      document.body.prepend(skip);
    }
  }

  const file = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
  const isToolDetail = /^tool-.+\.html$/.test(file);
  const isModDetail = file === 'mod-detail.html' || /^mod-.+\.html$/.test(file);
  const isBattlezone = file.startsWith('battlezone') || isToolDetail || isModDetail;

  let primary = 'about';
  if (isBattlezone) primary = 'battlezone';
  else if (file === 'media.html') primary = 'media';
  else if (file === 'other.html') primary = 'other';

  let battlezoneSection = 'overview';
  if (file === 'battlezone-projects.html') battlezoneSection = 'projects';
  else if (file === 'battlezone-mods.html' || isModDetail) battlezoneSection = 'mods';
  else if (file === 'battlezone-tools.html' || isToolDetail) battlezoneSection = 'tools';
  else if (file === 'battlezone-gallery.html') battlezoneSection = 'gallery';
  else if (file === 'battlezone-live.html') battlezoneSection = 'live';

  const active = (value, expected) => value === expected ? ' class="active"' : '';

  const mobile = document.querySelector('.mobile-header');
  if (mobile) {
    mobile.innerHTML = `<a class="mobile-brand" href="${pages.about}">GRIZZLYONE95</a><nav class="mobile-nav" aria-label="Mobile navigation"><a${active(primary, 'about')} href="${pages.about}">About</a><a${active(primary, 'battlezone')} href="${pages.battlezone}">Battlezone</a><a${active(primary, 'media')} href="${pages.media}">Media</a><a${active(primary, 'other')} href="${pages.other}">Other</a></nav>`;
  }

  const sidebar = document.querySelector('.sidebar');
  if (sidebar) {
    sidebar.innerHTML = `<div class="sidebar-shell"><a class="side-logo" href="${pages.about}"><strong>GRIZZLYONE95</strong><span>SYSTEMS // GAMES // TOOLS</span></a><nav class="side-nav"><a class="${primary === 'about' ? 'nav-link active' : 'nav-link'}" href="${pages.about}">About</a><a class="${primary === 'battlezone' ? 'nav-parent active' : 'nav-parent'}" href="${pages.battlezone}">Battlezone</a><div class="subnav"><a${active(battlezoneSection, 'projects')} href="${pages.projects}">Projects</a><a${active(battlezoneSection, 'mods')} href="${pages.mods}">Mods</a><a${active(battlezoneSection, 'tools')} href="${pages.tools}">Tools</a><a${active(battlezoneSection, 'gallery')} href="${pages.gallery}">Gallery</a><a${active(battlezoneSection, 'live')} href="${pages.live}">Live Games</a></div><a class="${primary === 'media' ? 'nav-link active' : 'nav-link'}" href="${pages.media}">Media</a><a class="${primary === 'other' ? 'nav-link active' : 'nav-link'}" href="${pages.other}">Other</a></nav><div class="side-foot">GRIZZLYONE95.GITHUB.IO<br><a href="https://github.com/GrizzlyOne95">GITHUB</a> // <a href="https://steamcommunity.com/id/GrizzlyOne95/">STEAM</a> // <a href="https://www.youtube.com/@GrizzlyOne95/videos">YOUTUBE</a></div></div>`;
  }

  const tabs = document.querySelector('.anchor-tabs');
  if (tabs && isBattlezone) {
    const tabItems = [
      ['overview', 'Overview', pages.battlezone],
      ['projects', 'Projects', pages.projects],
      ['mods', 'Mods', pages.mods],
      ['tools', 'Tools', pages.tools],
      ['gallery', 'Gallery', pages.gallery],
      ['live', 'Live Games', pages.live]
    ];
    tabs.innerHTML = tabItems.map(([key, label, href]) => `<a${key === battlezoneSection ? ' class="active-tab"' : ''} href="${href}">${label}</a>`).join('');
  }

  document.querySelectorAll('.mobile-nav a.active, .side-nav a.active, .anchor-tabs a.active-tab').forEach(link => {
    link.setAttribute('aria-current', 'page');
  });

  if (!document.querySelector('script[data-site-person-schema]')) {
    const schema = document.createElement('script');
    schema.type = 'application/ld+json';
    schema.dataset.sitePersonSchema = 'true';
    schema.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'GrizzlyOne95',
      url: 'https://grizzlyone95.github.io/',
      sameAs: [
        'https://github.com/GrizzlyOne95',
        'https://steamcommunity.com/id/GrizzlyOne95/',
        'https://www.youtube.com/@GrizzlyOne95/videos'
      ],
      knowsAbout: ['Battlezone 1998', 'game modding', 'reverse engineering', 'software development', 'IT infrastructure']
    });
    document.head.appendChild(schema);
  }

  const liveLinks = [...document.querySelectorAll('.subnav a')].filter(link => (link.getAttribute('href') || '').endsWith('battlezone-live.html'));
  if (!liveLinks.length) return;

  // The dedicated Live Games page already polls this API every five seconds;
  // avoid a redundant second request loop there. Its sidebar remains active.
  if (file === 'battlezone-live.html') return;

  let liveTimer = null;
  let livePolling = false;

  const renderLive = (online, count = null) => {
    liveLinks.forEach(link => {
      link.classList.add('live-nav-state');
      link.classList.toggle('is-live-online', online);
      link.classList.toggle('is-live-offline', !online);
      let badge = link.querySelector('.live-nav-badge');
      if (!badge) {
        badge = document.createElement('span');
        badge.className = 'live-nav-badge';
        badge.setAttribute('aria-hidden', 'true');
        link.appendChild(badge);
      }
      badge.textContent = online && Number.isFinite(count) ? (count > 99 ? '99+' : String(count)) : '';
      link.setAttribute('aria-label', online && Number.isFinite(count)
        ? `Live Games — Game Watcher online, ${count} active game${count === 1 ? '' : 's'}`
        : 'Live Games — Game Watcher status unavailable');
    });
  };

  const fetchJson = async path => {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), LIVE_TIMEOUT_MS);
    try {
      const response = await fetch(`${LIVE_API}${path}`, {
        method: 'GET', mode: 'cors', cache: 'no-store', credentials: 'omit',
        headers: { Accept: 'application/json' }, signal: controller.signal
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } finally {
      window.clearTimeout(timeout);
    }
  };

  const scheduleLive = delay => {
    window.clearTimeout(liveTimer);
    liveTimer = window.setTimeout(pollLive, delay);
  };

  const pollLive = async () => {
    if (livePolling) return;
    livePolling = true;
    try {
      const [health, lobbies] = await Promise.all([fetchJson('/api/health'), fetchJson('/api/BZ98Lobby')]);
      const healthy = health?.status === 'ok' || health?.status === 'OK' || Boolean(health);
      const games = Array.isArray(lobbies) ? lobbies.filter(lobby => !lobby?.isChat) : [];
      renderLive(healthy, healthy ? games.length : null);
    } catch (_) {
      renderLive(false);
    } finally {
      livePolling = false;
      scheduleLive(document.hidden ? LIVE_HIDDEN_MS : LIVE_VISIBLE_MS);
    }
  };

  document.addEventListener('visibilitychange', () => {
    window.clearTimeout(liveTimer);
    scheduleLive(document.hidden ? LIVE_HIDDEN_MS : 500);
  });

  renderLive(false);
  pollLive();
})();
