(() => {
  'use strict';

  const API_BASE_URL = 'https://bz98gamewatcher.com';
  const VISIBLE_POLL_MS = 60000;
  const HIDDEN_POLL_MS = 300000;
  const REQUEST_TIMEOUT_MS = 6000;

  const links = [...document.querySelectorAll('.subnav a')]
    .filter(link => (link.getAttribute('href') || '').endsWith('battlezone-live.html'));

  if (!links.length) return;

  let timer = null;
  let polling = false;

  const updateLinks = (state, gameCount = null) => {
    links.forEach(link => {
      link.classList.add('live-nav-state');
      link.classList.remove('is-live-online', 'is-live-offline');
      link.classList.add(state === 'online' ? 'is-live-online' : 'is-live-offline');

      let badge = link.querySelector('.live-nav-badge');
      if (!badge) {
        badge = document.createElement('span');
        badge.className = 'live-nav-badge';
        badge.setAttribute('aria-hidden', 'true');
        link.appendChild(badge);
      }

      if (state === 'online' && Number.isFinite(gameCount)) {
        badge.textContent = gameCount > 99 ? '99+' : String(gameCount);
        link.setAttribute('aria-label', `Live Games — Game Watcher online, ${gameCount} active game${gameCount === 1 ? '' : 's'}`);
      } else {
        badge.textContent = '';
        link.setAttribute('aria-label', 'Live Games — Game Watcher status unavailable');
      }
    });
  };

  const fetchJson = async path => {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    try {
      const response = await fetch(`${API_BASE_URL}${path}`, {
        method: 'GET',
        mode: 'cors',
        cache: 'no-store',
        credentials: 'omit',
        headers: { Accept: 'application/json' },
        signal: controller.signal
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } finally {
      window.clearTimeout(timeout);
    }
  };

  const schedule = delay => {
    window.clearTimeout(timer);
    timer = window.setTimeout(poll, delay);
  };

  const poll = async () => {
    if (polling) return;
    polling = true;

    try {
      const [health, lobbies] = await Promise.all([
        fetchJson('/api/health'),
        fetchJson('/api/BZ98Lobby')
      ]);

      const healthy = health?.status === 'ok' || health?.status === 'OK' || Boolean(health);
      const games = Array.isArray(lobbies) ? lobbies.filter(lobby => !lobby?.isChat) : [];
      updateLinks(healthy ? 'online' : 'offline', healthy ? games.length : null);
    } catch (_) {
      updateLinks('offline');
    } finally {
      polling = false;
      schedule(document.hidden ? HIDDEN_POLL_MS : VISIBLE_POLL_MS);
    }
  };

  document.addEventListener('visibilitychange', () => {
    window.clearTimeout(timer);
    schedule(document.hidden ? HIDDEN_POLL_MS : 500);
  });

  updateLinks('offline');
  poll();
})();
