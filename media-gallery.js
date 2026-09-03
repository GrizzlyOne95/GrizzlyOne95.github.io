(() => {
  const fallbackFiles = [
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

  const archiveMeta = {
    'HighresScreenshot00005.png': { project: 'Battlezone 98 Redux', type: 'In-game screenshot', title: 'Redux Combat Capture', description: 'Battlezone 98 Redux gameplay/development screenshot retained as part of the long-running modding archive.' },
    'HighresScreenshot00007.png': { project: 'Battlezone 98 Redux', type: 'In-game screenshot', title: 'Redux Development Capture', description: 'A second high-resolution Battlezone 98 Redux capture from the development and modding archive.' },
    'battle800x600.png': { project: 'Battlezone', type: 'Legacy reference art', title: 'Battlezone Reference Image', description: 'Legacy Battlezone imagery kept as a visual reference and reused sparingly in the site presentation.' },
    'bztemp.bmp': { project: 'Battlezone', type: 'Legacy texture / image', title: 'Battlezone Archive Texture', description: 'An older Battlezone image retained as a visual-reference asset and used as the site-wide atmospheric background.' },
    'Avastr_render.webp': { project: 'NSDF vehicle archive', type: 'Vehicle render', title: 'NSDF Assault Tank Render', description: 'Vehicle render from the Battlezone asset and model-reference archive.' },
    'Avflak_render.webp': { project: 'NSDF vehicle archive', type: 'Vehicle render', title: 'NSDF Flak Vehicle Render', description: 'Battlezone vehicle render preserved for model and faction reference.' },
    'Avhtnk_screenshot.webp': { project: 'NSDF vehicle archive', type: 'Vehicle screenshot', title: 'NSDF Heavy Tank', description: 'Heavy-tank reference image from the broader Battlezone vehicle archive.' },
    'Nsdf_carrier.webp': { project: 'NSDF vehicle archive', type: 'Vehicle render', title: 'NSDF Carrier', description: 'Carrier render/reference from the NSDF vehicle archive.' },
    'Sovstriker.jpg': { project: 'CCA vehicle archive', type: 'Vehicle reference', title: 'Soviet Striker', description: 'Reference image for the Soviet/CCA Striker vehicle.' },
    'Svstrk_render.webp': { project: 'CCA vehicle archive', type: 'Vehicle render', title: 'CCA Striker Render', description: 'Rendered Striker asset preserved as part of the CCA vehicle archive.' },
    'TroDemoAd1.webp': { project: 'The Red Odyssey', type: 'Promotional art', title: 'The Red Odyssey Demo Art I', description: 'Promotional/demo-era artwork retained from The Red Odyssey material.' },
    'TroDemoAd2.webp': { project: 'The Red Odyssey', type: 'Promotional art', title: 'The Red Odyssey Demo Art II', description: 'A second piece of promotional/demo-era artwork from The Red Odyssey archive.' },
    'Slide_tro_2.webp': { project: 'The Red Odyssey', type: 'Presentation / archive slide', title: 'The Red Odyssey Archive Slide', description: 'Presentation-style image retained with the Red Odyssey reference material.' },
    'manualsketchtank.png': { project: 'Battlezone design archive', type: 'Concept sketch', title: 'Tank Design Sketch', description: 'Hand-drawn vehicle/design reference preserved with the Battlezone concept material.' },
    'earlytank2.webp': { project: 'Battlezone design archive', type: 'Early vehicle reference', title: 'Early Tank Study', description: 'Early vehicle imagery retained for design and development-history reference.' },
    'mammoth_tank.jpg': { project: 'Battlezone design archive', type: 'Vehicle reference', title: 'Mammoth Tank', description: 'Vehicle reference image preserved in the long-term Battlezone design archive.' },
    'longbow.gif': { project: 'Battlezone design archive', type: 'Animated reference', title: 'Longbow', description: 'Animated vehicle/reference asset from the Battlezone archive.' },
    'mobile_repair.jpg': { project: 'Battlezone design archive', type: 'Vehicle reference', title: 'Mobile Repair Concept', description: 'Mobile repair/service vehicle reference kept with experimental and historical design material.' },
    'early_war_gun_kino.jpg': { project: 'Battlezone design archive', type: 'Concept / reference art', title: 'Early War Gun Study', description: 'Historical weapon/vehicle concept reference from the Battlezone design archive.' },
    'truman_lg_badger.jpg': { project: 'Truman vehicle studies', type: 'Vehicle render', title: 'Truman Badger', description: 'Hard-surface vehicle study from the Truman model set.' },
    'truman_lg_bobcat.jpg': { project: 'Truman vehicle studies', type: 'Vehicle render', title: 'Truman Bobcat', description: 'Hard-surface vehicle study from the Truman model set; a related Bobcat model also appears in the Workshop catalog.' },
    'truman_lg_pilot.jpg': { project: 'Truman vehicle studies', type: 'Character / model render', title: 'Truman Pilot', description: 'Pilot/model study retained with the Truman asset set.' },
    'truman_lg_razor.jpg': { project: 'Truman vehicle studies', type: 'Vehicle render', title: 'Truman Razor', description: 'Hard-surface vehicle study from the Truman model set.' },
    'truman_lg_recycler.jpg': { project: 'Truman vehicle studies', type: 'Vehicle render', title: 'Truman Recycler', description: 'Recycler model study retained with the Truman vehicle set.' },
    'avcarr2.jpg': { project: 'NSDF vehicle archive', type: 'Vehicle reference', title: 'NSDF Carrier Study', description: 'NSDF carrier/model reference from the Battlezone asset archive.' },
    'avcruz.jpg': { project: 'NSDF vehicle archive', type: 'Vehicle reference', title: 'NSDF Cruiser', description: 'NSDF cruiser reference image retained for vehicle and faction research.' },
    'svcarr.jpg': { project: 'CCA vehicle archive', type: 'Vehicle reference', title: 'CCA Carrier', description: 'CCA carrier reference image from the Battlezone vehicle archive.' },
    'svcruz.jpg': { project: 'CCA vehicle archive', type: 'Vehicle reference', title: 'CCA Cruiser', description: 'CCA cruiser reference image retained for vehicle and faction research.' },
    'svhind.jpg': { project: 'CCA vehicle archive', type: 'Vehicle reference', title: 'CCA Hind', description: 'CCA Hind reference image from the broader vehicle archive.' },
    'svramm2.jpg': { project: 'CCA vehicle archive', type: 'Vehicle reference', title: 'CCA Vehicle Study', description: 'CCA vehicle reference preserved with the model and design archive.' }
  };

  const imagePattern = /\.(?:jpe?g|png|webp|gif|bmp)$/i;
  const root = document.getElementById('media-slideshow');
  const image = document.getElementById('media-slide-image');
  const caption = document.getElementById('media-slide-caption');
  const counter = document.getElementById('media-slide-counter');
  const galleryCount = document.getElementById('media-gallery-count');
  const filmstrip = document.getElementById('media-filmstrip');
  const previous = document.getElementById('media-slide-prev');
  const next = document.getElementById('media-slide-next');
  const playToggle = document.getElementById('media-slide-play');
  const project = document.getElementById('media-slide-project');
  const mediaType = document.getElementById('media-slide-type');
  const description = document.getElementById('media-slide-description');

  if (!root || !image || !caption || !counter || !filmstrip || !previous || !next || !playToggle) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const failed = new Set();
  let files = [...fallbackFiles];
  let index = 0;
  let autoplay = !prefersReducedMotion;
  let timer = null;

  const sourceFor = file => `./assets/media/${encodeURIComponent(file)}`;

  const prettyName = file => file
    .replace(/\.[^.]+$/, '')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b[a-z]/g, character => character.toUpperCase());

  const metadataFor = file => archiveMeta[file] || {
    project: 'Battlezone // Archive',
    type: 'Archive image',
    title: prettyName(file),
    description: 'Battlezone development, modding, model, or reference image retained in the local archive. Additional historical context has not yet been cataloged for this file.'
  };

  const normalize = value => (value + files.length) % files.length;

  const discoverFiles = async () => {
    try {
      const response = await fetch('https://api.github.com/repos/GrizzlyOne95/GrizzlyOne95.github.io/contents/assets/media?ref=main', {
        headers: { Accept: 'application/vnd.github+json' }
      });
      if (!response.ok) return;
      const entries = await response.json();
      const discovered = entries
        .filter(entry => entry.type === 'file' && imagePattern.test(entry.name))
        .map(entry => entry.name)
        .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));
      if (discovered.length) files = discovered;
    } catch (_) {
      // The checked-in list above keeps the gallery functional if GitHub's API is unavailable.
    }
  };

  const schedule = () => {
    window.clearTimeout(timer);
    if (!autoplay) return;
    timer = window.setTimeout(() => move(1, false), 6500);
  };

  const preloadNeighbors = () => {
    if (files.length < 2) return;
    [-1, 1].forEach(offset => {
      const preload = new Image();
      preload.src = sourceFor(files[normalize(index + offset)]);
    });
  };

  const renderFilmstrip = () => {
    filmstrip.replaceChildren();
    const offsets = files.length < 5
      ? Array.from({ length: files.length }, (_, itemIndex) => itemIndex - index)
      : [-2, -1, 0, 1, 2];

    offsets.forEach(offset => {
      const itemIndex = normalize(index + offset);
      const file = files[itemIndex];
      const meta = metadataFor(file);
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `media-filmstrip-item${itemIndex === index ? ' active' : ''}`;
      button.dataset.index = String(itemIndex);
      button.setAttribute('aria-label', `Show ${meta.title}`);
      button.setAttribute('aria-current', itemIndex === index ? 'true' : 'false');

      const thumb = document.createElement('img');
      thumb.loading = 'lazy';
      thumb.decoding = 'async';
      thumb.src = sourceFor(file);
      thumb.alt = '';
      button.appendChild(thumb);

      button.addEventListener('click', () => {
        index = itemIndex;
        autoplay = false;
        render();
      });
      filmstrip.appendChild(button);
    });
  };

  const render = () => {
    if (!files.length) return;
    const file = files[index];
    const meta = metadataFor(file);
    image.src = sourceFor(file);
    image.alt = meta.title;
    caption.textContent = meta.title;
    if (project) project.textContent = meta.project;
    if (mediaType) mediaType.textContent = meta.type;
    if (description) description.textContent = meta.description;
    counter.textContent = `${index + 1} / ${files.length}`;
    if (galleryCount) galleryCount.textContent = `// ${files.length} LOCAL IMAGES`;
    playToggle.textContent = autoplay ? 'Pause' : 'Play';
    playToggle.setAttribute('aria-pressed', autoplay ? 'true' : 'false');
    renderFilmstrip();
    preloadNeighbors();
    schedule();
  };

  const move = (delta, userInitiated = true) => {
    if (!files.length) return;
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

  (async () => {
    await discoverFiles();
    index = Math.max(0, files.indexOf('HighresScreenshot00005.png'));
    render();
  })();
})();
