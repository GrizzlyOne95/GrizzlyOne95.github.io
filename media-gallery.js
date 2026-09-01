(() => {
  const files = [
    'AMAS3.jpg',
    'Acrobat_DGZT963mte.png',
    'Acrobat_TOgmxaKPQD.png',
    'Acrobat_iolwwCIa3n.png',
    'Acrobat_lih22t13Cu.png',
    'Avastr_render.webp',
    'Avflak_render.webp',
    'Avhtnk_screenshot.webp',
    'HighresScreenshot00005.png',
    'HighresScreenshot00007.png',
    'NEXT_Generation_34_0001.jpg',
    'Nsdf_carrier.webp',
    'Slide_tro_2.webp',
    'Sovstriker.jpg',
    'Svstrk_render.webp',
    'TroDemoAd1.webp',
    'TroDemoAd2.webp',
    'aammo.jpg',
    'abaagn.jpg',
    'abaagncomp.jpg',
    'abfilt.jpg',
    'abfiltcomp.webp',
    'abnuke.jpg',
    'avcarr2.jpg',
    'avcruz.jpg',
    'avsupp.jpg',
    'avsuppcomp.jpg',
    'avvtol.jpg',
    'battle800x600.png',
    'bombuh.webp',
    'bz1unit.jpg',
    'bztemp.bmp',
    'early_war_gun_kino.jpg',
    'earlytank2.webp',
    'firefox_iXXP43Nszr.png',
    'longbow.gif',
    'mammoth_tank.jpg',
    'manualsketchtank.png',
    'mobile_repair.jpg',
    'normal_sbaagncomp.webp',
    'normal_sbbioscomp.webp',
    'normal_sblasdcomp.webp',
    'sbaagn.jpg',
    'sbbios.jpg',
    'sblasd.jpg',
    'slf.jpg',
    'striker.jpg',
    'svcarr.jpg',
    'svcruz.jpg',
    'svhind.jpg',
    'svramm2.jpg',
    'truman_lg_badger.jpg',
    'truman_lg_bobcat.jpg',
    'truman_lg_pilot.jpg',
    'truman_lg_razor.jpg',
    'truman_lg_recycler.jpg'
  ];

  const root = document.getElementById('media-slideshow');
  const image = document.getElementById('media-slide-image');
  const caption = document.getElementById('media-slide-caption');
  const counter = document.getElementById('media-slide-counter');
  const filmstrip = document.getElementById('media-filmstrip');
  const previous = document.getElementById('media-slide-prev');
  const next = document.getElementById('media-slide-next');
  const playToggle = document.getElementById('media-slide-play');

  if (!root || !image || !caption || !counter || !filmstrip || !previous || !next || !playToggle || !files.length) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const failed = new Set();
  let index = Math.max(0, files.indexOf('HighresScreenshot00005.png'));
  let autoplay = !prefersReducedMotion;
  let timer = null;

  const sourceFor = file => `./assets/media/${encodeURIComponent(file)}`;

  const prettyName = file => file
    .replace(/\.[^.]+$/, '')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b[a-z]/g, character => character.toUpperCase());

  const normalize = value => (value + files.length) % files.length;

  const schedule = () => {
    window.clearTimeout(timer);
    if (!autoplay) return;
    timer = window.setTimeout(() => move(1, false), 6500);
  };

  const preloadNeighbors = () => {
    [-1, 1].forEach(offset => {
      const preload = new Image();
      preload.src = sourceFor(files[normalize(index + offset)]);
    });
  };

  const renderFilmstrip = () => {
    filmstrip.replaceChildren();
    const offsets = [-2, -1, 0, 1, 2];

    offsets.forEach(offset => {
      const itemIndex = normalize(index + offset);
      const file = files[itemIndex];
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `media-filmstrip-item${offset === 0 ? ' active' : ''}`;
      button.dataset.index = String(itemIndex);
      button.setAttribute('aria-label', `Show ${prettyName(file)}`);
      button.setAttribute('aria-current', offset === 0 ? 'true' : 'false');

      const thumb = document.createElement('img');
      thumb.loading = 'lazy';
      thumb.decoding = 'async';
      thumb.src = sourceFor(file);
      thumb.alt = '';
      button.appendChild(thumb);

      button.addEventListener('click', () => {
        index = itemIndex;
        render();
      });
      filmstrip.appendChild(button);
    });
  };

  const render = () => {
    const file = files[index];
    image.src = sourceFor(file);
    image.alt = prettyName(file);
    caption.textContent = prettyName(file);
    counter.textContent = `${index + 1} / ${files.length}`;
    playToggle.textContent = autoplay ? 'Pause' : 'Play';
    playToggle.setAttribute('aria-pressed', autoplay ? 'true' : 'false');
    renderFilmstrip();
    preloadNeighbors();
    schedule();
  };

  const move = (delta, userInitiated = true) => {
    let attempts = 0;
    do {
      index = normalize(index + delta);
      attempts += 1;
    } while (failed.has(files[index]) && attempts < files.length);

    if (userInitiated) autoplay = false;
    render();
  };

  image.addEventListener('error', () => {
    failed.add(files[index]);
    if (failed.size < files.length) move(1, false);
  });

  previous.addEventListener('click', () => move(-1));
  next.addEventListener('click', () => move(1));
  playToggle.addEventListener('click', () => {
    autoplay = !autoplay;
    render();
  });

  root.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      move(-1);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      move(1);
    } else if (event.key === ' ') {
      event.preventDefault();
      autoplay = !autoplay;
      render();
    }
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) window.clearTimeout(timer);
    else schedule();
  });

  render();
})();
