(() => {
  const controls = document.getElementById('tool-filter');
  const input = document.getElementById('tool-search');
  const status = document.getElementById('tool-filter-status');
  const empty = document.getElementById('tool-filter-empty');
  if (!controls || !input || !status || !empty) return;

  const sections = [...document.querySelectorAll('.content-body > .section-rule')]
    .map(rule => {
      const grid = rule.nextElementSibling;
      if (!grid || !grid.classList.contains('grid-2')) return null;
      const heading = rule.querySelector('h2')?.textContent || '';
      const headingLower = heading.toLowerCase();
      const cards = [...grid.querySelectorAll(':scope > .project-card')];

      cards.forEach(card => {
        const text = (card.textContent || '').toLowerCase();
        const tags = new Set();
        if (headingLower.includes('authoring')) tags.add('authoring');
        if (headingLower.includes('publishing')) tags.add('publishing');
        if (headingLower.includes('inspection')) tags.add('diagnostics');
        if (headingLower.includes('other battlezone')) tags.add('legacy');
        if (/blender|uv atlas|ogre mesh|msh|xsi/.test(text)) tags.add('blender');
        if (/multiplayer|lobby|game watcher/.test(text)) tags.add('multiplayer');
        card.dataset.toolTags = [...tags].join(' ');
      });

      return { rule, grid, cards };
    })
    .filter(Boolean);

  const buttons = [...controls.querySelectorAll('[data-filter]')];
  const total = sections.reduce((count, entry) => count + entry.cards.length, 0);
  let active = 'all';

  const apply = () => {
    const query = input.value.trim().toLowerCase();
    let visible = 0;

    sections.forEach(({ rule, grid, cards }) => {
      let sectionVisible = 0;
      cards.forEach(card => {
        const tags = (card.dataset.toolTags || '').split(/\s+/).filter(Boolean);
        const categoryMatch = active === 'all' || tags.includes(active);
        const searchMatch = !query || (card.textContent || '').toLowerCase().includes(query);
        const show = categoryMatch && searchMatch;
        card.classList.toggle('catalog-filter-hidden', !show);
        if (show) {
          visible += 1;
          sectionVisible += 1;
        }
      });

      const hideSection = sectionVisible === 0;
      rule.classList.toggle('catalog-filter-hidden', hideSection);
      grid.classList.toggle('catalog-filter-hidden', hideSection);
    });

    status.textContent = `Showing ${visible} of ${total} tools`;
    empty.classList.toggle('is-visible', visible === 0);
  };

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
})();
