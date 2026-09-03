(() => {
  const initialize = () => {
    const controls = document.getElementById('mod-filter');
    const input = document.getElementById('mod-search');
    const status = document.getElementById('mod-filter-status');
    const empty = document.getElementById('mod-filter-empty');
    if (!controls || !input || !status || !empty) return;

    const categoryFor = heading => {
      const value = heading.toLowerCase();
      if (value.includes('major')) return 'major';
      if (value.includes('campaign')) return 'campaigns';
      if (value.includes('multiplayer') || value.includes('experimental') || value.includes('crossover')) return 'multiplayer';
      return 'enhancements';
    };

    const sections = [...document.querySelectorAll('#mods-root .mod-section')].map(section => {
      const heading = section.querySelector('.mod-section-head h2')?.textContent || '';
      const cards = [...section.querySelectorAll('.mod-card')];
      return { section, category: categoryFor(heading), cards };
    });

    const collectionSection = document.querySelector('#collections-root .collection-section');
    const buttons = [...controls.querySelectorAll('[data-filter]')];
    const total = sections.reduce((count, entry) => count + entry.cards.length, 0);
    let active = 'all';

    const searchableText = card => (card.textContent || '').toLowerCase();

    const apply = () => {
      const query = input.value.trim().toLowerCase();
      let visible = 0;

      sections.forEach(({ section, category, cards }) => {
        let sectionVisible = 0;
        cards.forEach(card => {
          const categoryMatch = active === 'all' || category === active;
          const searchMatch = !query || searchableText(card).includes(query);
          const show = categoryMatch && searchMatch;
          card.classList.toggle('catalog-filter-hidden', !show);
          if (show) {
            visible += 1;
            sectionVisible += 1;
          }
        });
        section.classList.toggle('catalog-filter-hidden', sectionVisible === 0);
      });

      // Collections are navigation aids rather than individual releases; keep
      // them in the unfiltered catalog and move them out of the way while searching.
      if (collectionSection) {
        collectionSection.classList.toggle('catalog-filter-hidden', active !== 'all' || Boolean(query));
      }

      status.textContent = `Showing ${visible} of ${total} releases`;
      empty.classList.toggle('is-visible', visible === 0);
    };

    const applyState = state => {
      active = state.filter || 'all';
      apply();
    };

    if (window.CatalogUrlState) {
      window.CatalogUrlState.create({ input, buttons, onChange: applyState });
    } else {
      buttons.forEach(button => {
        button.addEventListener('click', () => {
          active = button.dataset.filter || 'all';
          buttons.forEach(candidate => {
            const selected = candidate === button;
            candidate.classList.toggle('is-active', selected);
            candidate.setAttribute('aria-pressed', selected ? 'true' : 'false');
          });
          apply();
        });
      });
      input.addEventListener('input', apply);
      apply();
    }

    const liveScript = document.createElement('script');
    liveScript.src = './sidebar-live.js';
    document.head.appendChild(liveScript);
  };

  if (window.CatalogUrlState) {
    initialize();
    return;
  }

  const script = document.createElement('script');
  script.src = './catalog-url-state.js';
  script.dataset.catalogUrlState = 'true';
  script.addEventListener('load', initialize, { once: true });
  script.addEventListener('error', initialize, { once: true });
  document.head.appendChild(script);
})();
