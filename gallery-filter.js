(() => {
  'use strict';

  const root = document.getElementById('media-slideshow');
  const project = document.getElementById('media-slide-project');
  const mediaType = document.getElementById('media-slide-type');
  const caption = document.getElementById('media-slide-caption');
  const counter = document.getElementById('media-slide-counter');
  const next = document.getElementById('media-slide-next');
  const previous = document.getElementById('media-slide-prev');
  const play = document.getElementById('media-slide-play');
  if (!root || !project || !mediaType || !caption || !counter || !next || !previous) return;

  if (!document.querySelector('link[data-gallery-filter-style]')) {
    const style = document.createElement('link');
    style.rel = 'stylesheet';
    style.href = './gallery-filter.css';
    style.dataset.galleryFilterStyle = 'true';
    document.head.appendChild(style);
  }

  const sets = [
    ['all', 'All'],
    ['screenshots', 'Screenshots'],
    ['nsdf', 'NSDF'],
    ['cca', 'CCA'],
    ['tro', 'Red Odyssey'],
    ['concepts', 'Concepts'],
    ['truman', 'Truman']
  ];

  const controls = document.createElement('section');
  controls.className = 'gallery-filter';
  controls.setAttribute('aria-label', 'Browse Battlezone gallery categories');
  controls.innerHTML = `<div class="gallery-filter-buttons" role="group" aria-label="Gallery category">${sets.map(([key, label], index) => `<button class="gallery-filter-button${index === 0 ? ' is-active' : ''}" type="button" data-gallery-filter="${key}" aria-pressed="${index === 0 ? 'true' : 'false'}">${label}</button>`).join('')}</div><div class="gallery-filter-status" id="gallery-filter-status">Browsing all archive images</div>`;
  root.before(controls);

  const buttons = [...controls.querySelectorAll('[data-gallery-filter]')];
  const status = controls.querySelector('#gallery-filter-status');
  let active = 'all';
  let seeking = false;
  let direction = 1;

  const normalizedText = () => `${project.textContent || ''} ${mediaType.textContent || ''} ${caption.textContent || ''}`.toLowerCase();

  const matches = () => {
    if (active === 'all') return true;
    const text = normalizedText();
    if (active === 'screenshots') return text.includes('screenshot') || text.includes('battlezone 98 redux');
    if (active === 'nsdf') return text.includes('nsdf');
    if (active === 'cca') return text.includes('cca') || text.includes('soviet');
    if (active === 'tro') return text.includes('red odyssey');
    if (active === 'concepts') return text.includes('design archive') || text.includes('concept') || text.includes('early ');
    if (active === 'truman') return text.includes('truman');
    return true;
  };

  const totalImages = () => {
    const match = (counter.textContent || '').match(/\/\s*(\d+)/);
    return match ? Number(match[1]) : 64;
  };

  const updateStatus = () => {
    const label = sets.find(([key]) => key === active)?.[1] || 'All';
    status.textContent = active === 'all'
      ? 'Browsing all archive images'
      : `Browsing ${label} archive set // arrows stay within this set`;
  };

  const seekToMatch = (moveDirection = direction) => {
    if (active === 'all' || matches() || seeking) return;
    seeking = true;
    const control = moveDirection < 0 ? previous : next;
    const limit = totalImages();
    let attempts = 0;
    while (!matches() && attempts < limit) {
      control.click();
      attempts += 1;
    }
    seeking = false;
  };

  buttons.forEach(button => {
    button.addEventListener('click', () => {
      active = button.dataset.galleryFilter || 'all';
      buttons.forEach(candidate => {
        const selected = candidate === button;
        candidate.classList.toggle('is-active', selected);
        candidate.setAttribute('aria-pressed', selected ? 'true' : 'false');
      });
      root.classList.toggle('is-gallery-filtered', active !== 'all');
      if (active !== 'all' && play?.getAttribute('aria-pressed') === 'true') play.click();
      direction = 1;
      seekToMatch(1);
      updateStatus();
    });
  });

  root.addEventListener('click', event => {
    if (event.target.closest('#media-slide-prev')) direction = -1;
    else if (event.target.closest('#media-slide-next, .media-filmstrip-item')) direction = 1;
  }, true);

  root.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') direction = -1;
    else if (event.key === 'ArrowRight') direction = 1;
  }, true);

  const observer = new MutationObserver(() => {
    if (active !== 'all' && !seeking && !matches()) {
      queueMicrotask(() => seekToMatch(direction));
    }
  });
  [project, mediaType, caption].forEach(element => observer.observe(element, { childList: true, characterData: true, subtree: true }));
})();
