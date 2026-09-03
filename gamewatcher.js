(() => {
  'use strict';

  // Tailscale Funnel hostname for the self-hosted watcher. Stable across reboots and
  // service restarts, and it resolves to Tailscale's edge, never to a home IP.
  // Never replace it with a residential/public WAN IP in this public repository.
  const API_BASE_URL = 'https://bz1-gamewatcher.tail373def.ts.net';
  const NORMAL_POLL_MS = 5000;
  const HIDDEN_POLL_MS = 30000;
  const REQUEST_TIMEOUT_MS = 8000;
  const STALE_AFTER_MS = 120000;

  const statusDot = document.getElementById('watcher-status-dot');
  const statusText = document.getElementById('watcher-status-text');
  const updatedText = document.getElementById('watcher-updated');
  const gameCount = document.getElementById('watcher-game-count');
  const playerCount = document.getElementById('watcher-player-count');
  const refreshRate = document.getElementById('watcher-refresh-rate');
  const message = document.getElementById('watcher-message');
  const lobbyRoot = document.getElementById('watcher-lobbies');

  let timer = null;
  let errorDelay = NORMAL_POLL_MS;
  let polling = false;

  function setStatus(kind, text, detail) {
    statusDot.className = `watcher-dot is-${kind}`;
    statusText.textContent = text;
    updatedText.textContent = detail || '';
  }

  function setMessage(text) {
    if (!text) {
      message.hidden = true;
      message.textContent = '';
      return;
    }

    message.hidden = false;
    message.textContent = text;
  }

  function schedule(delay) {
    clearTimeout(timer);
    timer = setTimeout(poll, delay);
  }

  async function fetchJson(path) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const response = await fetch(`${API_BASE_URL}${path}`, {
        method: 'GET',
        mode: 'cors',
        cache: 'no-store',
        credentials: 'omit',
        headers: { Accept: 'application/json' },
        signal: controller.signal
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return await response.json();
    } finally {
      clearTimeout(timeout);
    }
  }

  function text(value, fallback = 'Unknown') {
    if (value === null || value === undefined) return fallback;
    const normalized = String(value).trim();
    return normalized || fallback;
  }

  function safeJoinUrl(value) {
    if (!value) return null;
    try {
      const url = new URL(value);
      return ['steam:', 'https:', 'http:'].includes(url.protocol) ? url.href : null;
    } catch {
      return null;
    }
  }

  function addChip(container, label, alert = false) {
    if (!label) return;
    const chip = document.createElement('span');
    chip.className = alert ? 'watcher-chip is-alert' : 'watcher-chip';
    chip.textContent = label;
    container.appendChild(chip);
  }

  function makePlayer(user) {
    const item = document.createElement('li');
    item.className = 'watcher-player';

    if (user?.steamImgUri) {
      const image = document.createElement('img');
      image.src = user.steamImgUri;
      image.alt = '';
      image.loading = 'lazy';
      image.referrerPolicy = 'no-referrer';
      item.appendChild(image);
    } else {
      const fallback = document.createElement('span');
      fallback.className = 'watcher-avatar-fallback';
      fallback.textContent = 'BZ';
      fallback.setAttribute('aria-hidden', 'true');
      item.appendChild(fallback);
    }

    const name = document.createElement('span');
    name.textContent = text(user?.name, 'Unknown player');
    item.appendChild(name);

    return item;
  }

  function renderLobby(lobby) {
    const card = document.createElement('article');
    card.className = 'watcher-lobby';

    const head = document.createElement('div');
    head.className = 'watcher-lobby-head';

    const titleWrap = document.createElement('div');
    titleWrap.className = 'watcher-lobby-title';

    const label = document.createElement('span');
    label.className = 'label';
    label.textContent = text(lobby?.metaData?.gameType, 'Battlezone game');

    const title = document.createElement('h3');
    title.textContent = text(lobby?.metaData?.name, lobby?.owner ? `${lobby.owner}'s game` : `Lobby ${lobby?.id ?? ''}`);

    titleWrap.append(label, title);

    const count = document.createElement('span');
    count.className = 'watcher-lobby-count';
    const visibleUsers = Object.values(lobby?.users || {});
    const currentUsers = Number.isFinite(lobby?.userCount) ? lobby.userCount : visibleUsers.length;
    const limit = Number.isFinite(lobby?.memberLimit) && lobby.memberLimit > 0 ? lobby.memberLimit : '—';
    count.textContent = `${currentUsers} / ${limit}`;

    head.append(titleWrap, count);

    const body = document.createElement('div');
    body.className = 'watcher-lobby-body';

    const meta = document.createElement('div');
    meta.className = 'watcher-meta';
    addChip(meta, lobby?.stats?.mapFile ? `MAP ${lobby.stats.mapFile}` : null);
    addChip(meta, lobby?.stats?.mod ? `MOD ${lobby.stats.mod}` : null);
    addChip(meta, lobby?.metaData?.gameVersion ? `VER ${lobby.metaData.gameVersion}` : null);
    addChip(meta, lobby?.isLocked ? 'LOCKED' : null, true);
    addChip(meta, lobby?.isPrivate ? 'PRIVATE' : null, true);
    addChip(meta, lobby?.metaData?.launched ? `STATE ${lobby.metaData.launched}` : null);

    const players = document.createElement('ul');
    players.className = 'watcher-players';

    if (visibleUsers.length) {
      visibleUsers
        .sort((a, b) => text(a?.name, '').localeCompare(text(b?.name, '')))
        .forEach(user => players.appendChild(makePlayer(user)));
    } else {
      const none = document.createElement('li');
      none.className = 'watcher-player';
      none.textContent = 'No player details available';
      players.appendChild(none);
    }

    body.append(meta, players);

    const joinUrl = safeJoinUrl(lobby?.directJoinUrl);
    if (joinUrl) {
      const actions = document.createElement('div');
      actions.className = 'watcher-lobby-actions';
      const join = document.createElement('a');
      join.className = 'small-button';
      join.href = joinUrl;
      join.textContent = 'Join game ↗';
      actions.appendChild(join);
      body.appendChild(actions);
    }

    card.append(head, body);
    return card;
  }

  function renderLobbies(lobbies) {
    lobbyRoot.replaceChildren();

    const games = Array.isArray(lobbies) ? lobbies.filter(lobby => !lobby?.isChat) : [];
    const players = games.reduce((total, lobby) => {
      const count = Number(lobby?.userCount);
      return total + (Number.isFinite(count) ? count : Object.keys(lobby?.users || {}).length);
    }, 0);

    gameCount.textContent = String(games.length);
    playerCount.textContent = String(players);

    if (!games.length) {
      const empty = document.createElement('div');
      empty.className = 'watcher-empty';
      const heading = document.createElement('strong');
      heading.textContent = 'No active games';
      const copy = document.createElement('span');
      copy.textContent = 'Game Watcher is online, but no public Battlezone matches are currently open.';
      empty.append(heading, copy);
      lobbyRoot.appendChild(empty);
      return;
    }

    games
      .sort((a, b) => (Number(b?.userCount) || 0) - (Number(a?.userCount) || 0))
      .forEach(lobby => lobbyRoot.appendChild(renderLobby(lobby)));
  }

  function formatAge(dateValue) {
    const timestamp = Date.parse(dateValue);
    if (!Number.isFinite(timestamp)) return 'Update time unavailable';

    const seconds = Math.max(0, Math.round((Date.now() - timestamp) / 1000));
    if (seconds < 5) return 'Updated just now';
    if (seconds < 60) return `Updated ${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `Updated ${minutes}m ago`;
    return `Updated ${Math.floor(minutes / 60)}h ago`;
  }

  async function poll() {
    if (polling) return;
    polling = true;

    try {
      const [health, lobbies] = await Promise.all([
        fetchJson('/api/health'),
        fetchJson('/api/BZ98Lobby')
      ]);

      renderLobbies(lobbies);
      errorDelay = NORMAL_POLL_MS;
      refreshRate.textContent = document.hidden ? '30s' : '5s';
      setMessage('');

      const lastUpdated = Date.parse(health?.lastUpdatedUtc);
      const stale = Number.isFinite(lastUpdated) && (Date.now() - lastUpdated > STALE_AFTER_MS);
      if (stale) {
        setStatus('stale', 'Watcher online // lobby feed stale', formatAge(health?.lastUpdatedUtc));
      } else {
        setStatus('online', 'Battlezone network online', formatAge(health?.lastUpdatedUtc));
      }

      schedule(document.hidden ? HIDDEN_POLL_MS : NORMAL_POLL_MS);
    } catch (error) {
      const aborted = error?.name === 'AbortError';
      const detail = aborted ? 'Request timed out' : 'API unavailable or not yet configured for this origin';
      setStatus('offline', 'Game Watcher unavailable', detail);
      setMessage('The live feed could not be reached. The page will retry automatically; the rest of the site is unaffected.');
      gameCount.textContent = '—';
      playerCount.textContent = '—';
      refreshRate.textContent = `${Math.round(errorDelay / 1000)}s`;
      lobbyRoot.replaceChildren();

      errorDelay = Math.min(Math.max(errorDelay + 5000, 10000), 30000);
      schedule(document.hidden ? HIDDEN_POLL_MS : errorDelay);
    } finally {
      polling = false;
    }
  }

  document.addEventListener('visibilitychange', () => {
    clearTimeout(timer);
    refreshRate.textContent = document.hidden ? '30s' : '5s';
    schedule(document.hidden ? HIDDEN_POLL_MS : 250);
  });

  setStatus('connecting', 'Connecting to Battlezone network…', 'Starting live feed');
  poll();
})();
