(() => {
  const fallbackFiles = 'AMAS3.jpg|Acrobat_DGZT963mte.png|Acrobat_TOgmxaKPQD.png|Acrobat_iolwwCIa3n.png|Acrobat_lih22t13Cu.png|Avastr_render.webp|Avflak_render.webp|Avhtnk_screenshot.webp|HighresScreenshot00005.png|HighresScreenshot00007.png|NEXT_Generation_34_0001.jpg|Nsdf_carrier.webp|Slide_tro_2.webp|Sovstriker.jpg|Svstrk_render.webp|TroDemoAd1.webp|TroDemoAd2.webp|aammo.jpg|abaagn.jpg|abaagncomp.jpg|abfilt.jpg|abfiltcomp.webp|abnuke.jpg|avcarr2.jpg|avcruz.jpg|avsupp.jpg|avsuppcomp.jpg|avvtol.jpg|battle800x600.png|bombuh.webp|bz1unit.jpg|bztemp.bmp|early_war_gun_kino.jpg|earlytank2.webp|firefox_iXXP43Nszr.png|longbow.gif|mammoth_tank.jpg|manualsketchtank.png|mobile_repair.jpg|normal_sbaagncomp.webp|normal_sbbioscomp.webp|normal_sblasdcomp.webp|sbaagn.jpg|sbbios.jpg|sblasd.jpg|slf.jpg|striker.jpg|svcarr.jpg|svcruz.jpg|svhind.jpg|svramm2.jpg|truman_lg_badger.jpg|truman_lg_bobcat.jpg|truman_lg_pilot.jpg|truman_lg_razor.jpg|truman_lg_recycler.jpg'.split('|');
  const imagePattern = /\.(?:jpe?g|png|webp|gif|bmp)$/i;
  const filmstrip = document.getElementById('media-filmstrip');
  const counter = document.getElementById('media-slide-counter');
  const previous = document.getElementById('media-slide-prev');
  const next = document.getElementById('media-slide-next');
  const selectorCount = document.getElementById('media-selector-count');

  if (!filmstrip || !counter || !previous || !next) return;

  let files = [...fallbackFiles];
  let rebuilding = false;

  const sourceFor = file => `./assets/media/${encodeURIComponent(file)}`;
  const prettyName = file => file
    .replace(/\.[^.]+$/, '')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const currentIndex = () => {
    const match = counter.textContent.match(/^(\d+)\s*\//);
    return match ? Math.max(0, Number(match[1]) - 1) : 0;
  };

  const goTo = targetIndex => {
    const current = currentIndex();
    if (targetIndex === current || !files.length) return;

    const forward = (targetIndex - current + files.length) % files.length;
    const backward = (current - targetIndex + files.length) % files.length;
    const control = forward <= backward ? next : previous;
    const steps = Math.min(forward, backward);

    for (let step = 0; step < steps; step += 1) control.click();
  };

  const buildSelector = () => {
    if (rebuilding || filmstrip.children.length === files.length) {
      const active = currentIndex();
      Array.from(filmstrip.children).forEach((button, index) => {
        button.classList.toggle('active', index === active);
        button.setAttribute('aria-current', index === active ? 'true' : 'false');
      });
      return;
    }

    rebuilding = true;
    const active = currentIndex();
    const fragment = document.createDocumentFragment();

    files.forEach((file, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `media-filmstrip-item${index === active ? ' active' : ''}`;
      button.dataset.index = String(index);
      button.dataset.number = String(index + 1);
      button.setAttribute('aria-current', index === active ? 'true' : 'false');
      button.setAttribute('aria-label', `Show image ${index + 1}: ${prettyName(file)}`);
      button.title = `${index + 1}. ${prettyName(file)}`;

      const thumb = document.createElement('img');
      thumb.loading = 'lazy';
      thumb.decoding = 'async';
      thumb.src = sourceFor(file);
      thumb.alt = '';
      button.appendChild(thumb);
      button.addEventListener('click', () => goTo(index));
      fragment.appendChild(button);
    });

    filmstrip.replaceChildren(fragment);
    if (selectorCount) selectorCount.textContent = `${files.length} THUMBNAILS`;
    rebuilding = false;
  };

  const observer = new MutationObserver(() => {
    queueMicrotask(buildSelector);
  });
  observer.observe(filmstrip, { childList: true });

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
      // Keep the checked-in fallback list if GitHub's API is unavailable.
    }
  };

  (async () => {
    await discoverFiles();
    buildSelector();
  })();
})();
