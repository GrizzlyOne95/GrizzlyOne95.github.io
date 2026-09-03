(() => {
  'use strict';

  // Tailscale Funnel hostname for the self-hosted watcher. Stable across reboots and
  // service restarts, and it resolves to Tailscale's edge, never to a home IP.
  // Never replace it with a residential/public WAN IP in this public repository.
  const API_BASE_URL = 'https://bz1-gamewatcher.tail373def.ts.net';
  const NORMAL_POLL_MS = 5000;
  const HIDDEN_POLL_MS = 30000;
  const REQUEST_TIMEOUT_MS = 8000;
  // Only a backstop for a wedged-open websocket; the connection state is the
  // primary signal. Two minutes was too aggressive to use on its own, because an
  // idle lobby service sends nothing for far longer than that.
  const STALE_BACKSTOP_MS = 900000;

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

  function setStatus(kind, label, detail) {
    statusDot.className = `watcher-dot is-${kind}`;
    statusText.textContent = label;
    updatedText.textContent = detail || '';
  }

  function setMessage(value) {
    if (!value) {
      message.hidden = true;
      message.textContent = '';
      return;
    }

    message.hidden = false;
    message.textContent = value;
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

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
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

  function present(value) {
    return value !== null && value !== undefined && String(value).trim() !== '';
  }

  function safeUrl(value, protocols) {
    if (!value) return null;
    try {
      const url = new URL(value);
      return protocols.includes(url.protocol) ? url.href : null;
    } catch {
      return null;
    }
  }

  function safeJoinUrl(value) {
    return safeUrl(value, ['steam:', 'https:', 'http:']);
  }

  function safeWebUrl(value) {
    return safeUrl(value, ['https:', 'http:']);
  }

  function safeImageUrl(value) {
    return safeUrl(value, ['https:', 'http:']);
  }

  function lobbyDisplayName(lobby) {
    const rawName = text(lobby?.metaData?.name, '');
    if (!rawName) return lobby?.owner ? `${lobby.owner}'s game` : `Lobby ${lobby?.id ?? ''}`;

    return rawName
      .replace(/^~game~(?:pub|pri)~\*?~/i, '')
      .replace(/^~chat~(?:pub|pri)~~/i, '') || rawName;
  }

  function mapTitle(lobby) {
    return text(lobby?.map?.title, text(lobby?.stats?.mapFile, 'Unknown map'));
  }

  function mapModeLabel(lobby) {
    return text(
      lobby?.map?.modeLabel,
      text(lobby?.map?.customTypeName, text(lobby?.map?.typeLabel, 'Battlezone'))
    );
  }

  function lobbyState(lobby) {
    if (lobby?.metaData?.gameEnded === '1') return { label: 'ENDED', kind: 'ended', rank: 0 };
    if (lobby?.metaData?.launched === '1') return { label: 'IN PROGRESS', kind: 'playing', rank: 3 };
    if (lobby?.metaData?.launched === '0') return { label: 'IN LOBBY', kind: 'lobby', rank: 2 };
    return { label: 'LIVE', kind: 'unknown', rank: 1 };
  }

  function formatDuration(dateValue, prefix = 'Open') {
    const timestamp = Date.parse(dateValue);
    if (!Number.isFinite(timestamp)) return null;

    const seconds = Math.max(0, Math.floor((Date.now() - timestamp) / 1000));
    if (seconds < 60) return `${prefix} <1m`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${prefix} ${minutes}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${prefix} ${hours}h ${minutes % 60}m`;
    const days = Math.floor(hours / 24);
    return `${prefix} ${days}d ${hours % 24}h`;
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

  function addChip(container, label, kind = '') {
    if (!label) return;
    const chip = document.createElement('span');
    chip.className = `watcher-chip${kind ? ` is-${kind}` : ''}`;
    chip.textContent = label;
    container.appendChild(chip);
  }

  function makeAction(label, href, className = 'watcher-action', external = false) {
    const link = document.createElement('a');
    link.className = className;
    link.href = href;
    link.textContent = label;
    if (external) {
      link.target = '_blank';
      link.rel = 'noopener';
    }
    return link;
  }

  function playerPlatform(user) {
    const auth = text(user?.authType, '').toLowerCase();
    if (auth === 'steam' || user?.isSteam) return 'Steam';
    if (auth === 'gog' || user?.isGOG) return 'GOG';
    return auth ? auth.toUpperCase() : null;
  }

  function playerMeta(user, lobby) {
    const bits = [];
    const team = text(user?.metaData?.team, '');
    const vehicle = text(user?.metaData?.vehicle, '');
    const platform = playerPlatform(user);

    if (team) bits.push(`Team ${team}`);
    if (vehicle) bits.push(vehicle);
    if (platform) bits.push(platform);
    if (user?.id && (user.id === lobby?.owner || user.id === lobby?.host?.id)) bits.unshift('Host');

    return bits.join(' · ');
  }

  function makePlayer(user, lobby) {
    const item = document.createElement('li');
    item.className = 'watcher-player';

    const avatarWrap = document.createElement('span');
    avatarWrap.className = 'watcher-player-avatar';

    const avatarUrl = safeImageUrl(user?.steamImgUri);
    if (avatarUrl) {
      const image = document.createElement('img');
      image.src = avatarUrl;
      image.alt = '';
      image.loading = 'lazy';
      image.referrerPolicy = 'no-referrer';
      image.addEventListener('error', () => avatarWrap.classList.add('is-fallback'), { once: true });
      avatarWrap.appendChild(image);
    } else {
      avatarWrap.classList.add('is-fallback');
    }

    const copy = document.createElement('span');
    copy.className = 'watcher-player-copy';

    const name = document.createElement('strong');
    name.textContent = text(user?.name, 'Unknown player');
    copy.appendChild(name);

    const metaText = playerMeta(user, lobby);
    if (metaText) {
      const meta = document.createElement('span');
      meta.textContent = metaText;
      copy.appendChild(meta);
    }

    item.append(avatarWrap, copy);
    return item;
  }

  function playerTeam(user) {
    const value = Number(user?.metaData?.team);
    return Number.isFinite(value) && present(user?.metaData?.team) ? value : null;
  }

  function appendPlayerGroup(root, label, users, lobby) {
    if (!users.length) return;

    const group = document.createElement('section');
    group.className = 'watcher-team';

    const heading = document.createElement('div');
    heading.className = 'watcher-team-head';
    const title = document.createElement('span');
    title.textContent = label;
    const count = document.createElement('span');
    count.textContent = String(users.length);
    heading.append(title, count);

    const list = document.createElement('ul');
    list.className = 'watcher-players';
    users
      .sort((a, b) => text(a?.name, '').localeCompare(text(b?.name, '')))
      .forEach(user => list.appendChild(makePlayer(user, lobby)));

    group.append(heading, list);
    root.appendChild(group);
  }

  function renderPlayers(lobby, visibleUsers) {
    const roster = document.createElement('div');
    roster.className = 'watcher-roster';

    if (!visibleUsers.length) {
      const none = document.createElement('p');
      none.className = 'watcher-no-players';
      none.textContent = 'No public player details available.';
      roster.appendChild(none);
      return roster;
    }

    const odd = [];
    const even = [];
    const unassigned = [];

    visibleUsers.forEach(user => {
      const team = playerTeam(user);
      if (team === null) unassigned.push(user);
      else if (team % 2) odd.push(user);
      else even.push(user);
    });

    appendPlayerGroup(roster, odd.length && even.length ? 'TEAM // ODD' : 'PLAYERS', odd, lobby);
    appendPlayerGroup(roster, 'TEAM // EVEN', even, lobby);
    appendPlayerGroup(roster, odd.length || even.length ? 'UNASSIGNED' : 'PLAYERS', unassigned, lobby);

    return roster;
  }

  function renderLobby(lobby) {
    const card = document.createElement('article');
    const state = lobbyState(lobby);
    card.className = `watcher-lobby is-${state.kind}`;

    const visibleUsers = Object.values(lobby?.users || {});
    const currentUsers = Number.isFinite(lobby?.userCount) ? lobby.userCount : visibleUsers.length;
    const limit = Number.isFinite(lobby?.memberLimit) && lobby.memberLimit > 0 ? lobby.memberLimit : '—';

    const media = document.createElement('div');
    media.className = 'watcher-lobby-media';

    const artUrl = safeImageUrl(lobby?.map?.imageUrl) || safeImageUrl(lobby?.workshop?.previewUrl);
    if (artUrl) {
      const image = document.createElement('img');
      image.src = artUrl;
      image.alt = `${mapTitle(lobby)} map preview`;
      image.loading = 'lazy';
      image.referrerPolicy = 'no-referrer';
      image.addEventListener('error', () => {
        image.remove();
        media.classList.add('is-fallback');
      }, { once: true });
      media.appendChild(image);
    } else {
      media.classList.add('is-fallback');
    }

    const mediaShade = document.createElement('div');
    mediaShade.className = 'watcher-lobby-media-shade';
    const mapFile = document.createElement('span');
    mapFile.textContent = text(lobby?.stats?.mapFile, 'MAP PREVIEW');
    mediaShade.appendChild(mapFile);
    media.appendChild(mediaShade);

    const main = document.createElement('div');
    main.className = 'watcher-lobby-main';

    const head = document.createElement('header');
    head.className = 'watcher-lobby-head';

    const titleWrap = document.createElement('div');
    titleWrap.className = 'watcher-lobby-title';

    const eyebrow = document.createElement('div');
    eyebrow.className = 'watcher-lobby-eyebrow';
    eyebrow.textContent = `${mapModeLabel(lobby)} // LOBBY ${lobby?.id ?? '—'}`;

    const title = document.createElement('h3');
    title.textContent = mapTitle(lobby);

    const subtitle = document.createElement('p');
    subtitle.textContent = lobbyDisplayName(lobby);

    titleWrap.append(eyebrow, title, subtitle);

    const statusWrap = document.createElement('div');
    statusWrap.className = 'watcher-lobby-status';

    const statusBadge = document.createElement('span');
    statusBadge.className = `watcher-state is-${state.kind}`;
    statusBadge.textContent = state.label;

    const count = document.createElement('strong');
    count.className = 'watcher-lobby-count';
    count.textContent = `${currentUsers} / ${limit}`;

    const age = document.createElement('span');
    age.className = 'watcher-lobby-age';
    age.textContent = formatDuration(lobby?.createdTime, 'Open') || 'Age unavailable';

    statusWrap.append(statusBadge, count, age);
    head.append(titleWrap, statusWrap);

    const body = document.createElement('div');
    body.className = 'watcher-lobby-body';

    const meta = document.createElement('div');
    meta.className = 'watcher-meta';

    const workshopTitle = text(lobby?.workshop?.title, '');
    const rawMod = text(lobby?.stats?.mod, '');
    addChip(meta, workshopTitle ? `MOD ${workshopTitle}` : (rawMod ? `MOD ${rawMod}` : null));
    addChip(meta, lobby?.metaData?.gameVersion ? `VER ${lobby.metaData.gameVersion}` : null);
    addChip(meta, lobby?.stats?.syncJoin === true ? 'SYNC JOIN' : null, 'positive');
    addChip(meta, lobby?.stats?.attributes?.satellite === true ? 'SATELLITE' : null, 'positive');
    addChip(meta, present(lobby?.stats?.attributes?.lives) ? `${lobby.stats.attributes.lives} LIVES` : null);
    addChip(meta, Number(lobby?.stats?.timeLimit) > 0 ? `${lobby.stats.timeLimit} MIN` : null);
    addChip(meta, Number(lobby?.stats?.killLimit) > 0 ? `${lobby.stats.killLimit} KILLS` : null);
    addChip(meta, lobby?.hasPassword ? 'PASSWORD' : null, 'alert');
    addChip(meta, lobby?.isLocked ? 'LOCKED' : null, 'alert');
    addChip(meta, lobby?.isPrivate ? 'PRIVATE' : null, 'alert');

    const roster = renderPlayers(lobby, visibleUsers);

    const actions = document.createElement('div');
    actions.className = 'watcher-lobby-actions';

    const detailUrl = `${API_BASE_URL}/lobby/${encodeURIComponent(lobby?.id ?? '')}`;
    actions.appendChild(makeAction('Full details ↗', detailUrl, 'watcher-action is-secondary', true));

    const workshopUrl = safeWebUrl(lobby?.workshop?.workshopUrl);
    if (workshopUrl) {
      actions.appendChild(makeAction('Workshop ↗', workshopUrl, 'watcher-action is-secondary', true));
    }

    const joinUrl = safeJoinUrl(lobby?.directJoinUrl);
    if (joinUrl && !lobby?.isLocked && !lobby?.isPrivate) {
      actions.appendChild(makeAction('JOIN GAME →', joinUrl, 'watcher-action is-primary'));
    } else {
      const unavailable = document.createElement('span');
      unavailable.className = 'watcher-join-unavailable';
      unavailable.textContent = lobby?.isLocked || lobby?.isPrivate ? 'JOIN RESTRICTED' : 'DIRECT JOIN UNAVAILABLE';
      actions.appendChild(unavailable);
    }

    body.append(meta, roster, actions);
    main.append(head, body);
    card.append(media, main);
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
      .sort((a, b) => {
        const stateDifference = lobbyState(b).rank - lobbyState(a).rank;
        if (stateDifference) return stateDifference;
        return (Number(b?.userCount) || 0) - (Number(a?.userCount) || 0);
      })
      .forEach(lobby => lobbyRoot.appendChild(renderLobby(lobby)));
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

      // The lobby service is event-driven: it pushes only when a game or player
      // actually changes, so lastUpdatedUtc legitimately stops advancing during
      // quiet periods. Ageing it out on its own reported a healthy watcher as
      // stale after two idle minutes, which is normal at off-peak hours.
      //
      // The websocket state is the real signal, so trust it, and keep the age
      // check only as a long backstop for a connection that is wedged open but
      // no longer delivering anything.
      const lastUpdated = Date.parse(health?.lastUpdatedUtc);
      const connected = health?.lobbyConnection?.isConnected !== false;
      const ageExceeded = Number.isFinite(lastUpdated) && (Date.now() - lastUpdated > STALE_BACKSTOP_MS);
      const stale = !connected || ageExceeded;
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
