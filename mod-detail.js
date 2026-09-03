(() => {
  if (!window.__grizzlySiteShellLoaded && !document.querySelector('script[data-site-shell-loader]')) {
    const shell = document.createElement('script');
    shell.src = './site-shell.js';
    shell.defer = true;
    shell.dataset.siteShellLoader = 'true';
    document.head.appendChild(shell);
  }

  const params = new URLSearchParams(window.location.search);
  const fixedId = document.body.dataset.modId || '';
  const id = fixedId || params.get('id');
  const root = document.getElementById('mod-detail-root');
  const titleEl = document.getElementById('mod-detail-title');
  const subtitleEl = document.getElementById('mod-detail-subtitle');

  const allItems = typeof groups === 'undefined' ? [] : groups.flatMap(group => group.items.map(item => ({ ...item, group: group.title })));
  const item = allItems.find(entry => entry.id === id);

  if (!item) {
    document.title = 'GrizzlyOne95 // Mod Not Found';
    titleEl.textContent = 'Mod Not Found';
    subtitleEl.textContent = 'The requested Workshop entry is not in the current catalog.';
    root.innerHTML = `<section class="panel"><p>This mod ID could not be found in the current Battlezone catalog.</p><p><a class="small-button" href="./battlezone-mods.html">← Back to Mods</a></p></section>`;
    return;
  }

  const blackDogIds = new Set(['3476765858', '2973893698', '3522108622', '3245077113']);
  if (blackDogIds.has(item.id) || /black dog/i.test(item.title)) {
    document.body.classList.add('theme-blackdog');
  }

  const extra = (typeof modDetails !== 'undefined' && modDetails[id]) ? modDetails[id] : {};
  const summary = item.desc || `A Battlezone 98 Redux Workshop release by GrizzlyOne95 in the ${item.group} category.`;
  const steamUrl = `https://steamcommunity.com/sharedfiles/filedetails/?id=${item.id}`;
  const fileName = window.location.pathname.split('/').pop() || 'mod-detail.html';
  const canonicalUrl = fixedId
    ? `https://grizzlyone95.github.io/${encodeURIComponent(fileName)}`
    : `https://grizzlyone95.github.io/mod-detail.html?id=${encodeURIComponent(item.id)}`;
  const imageHtml = item.image
    ? `<img src="${esc(item.image)}" alt="${esc(item.title)}">`
    : `<div class="mod-detail-fallback"><span>${esc(item.title)}</span></div>`;

  const ensureCanonical = () => {
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;
  };

  const setMeta = (property, content) => {
    let meta = document.querySelector(`meta[property="${property}"]`);
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('property', property);
      document.head.appendChild(meta);
    }
    meta.content = content;
  };

  ensureCanonical();
  setMeta('og:type', 'website');
  setMeta('og:site_name', 'GrizzlyOne95');
  setMeta('og:title', `GrizzlyOne95 // ${item.title}`);
  setMeta('og:description', summary);
  setMeta('og:url', canonicalUrl);
  if (item.image) setMeta('og:image', item.image);

  const schema = document.createElement('script');
  schema.type = 'application/ld+json';
  schema.dataset.modSchema = item.id;
  schema.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: item.title,
    description: summary,
    url: canonicalUrl,
    image: item.image || undefined,
    sameAs: steamUrl,
    genre: item.badge,
    creator: {
      '@type': 'Person',
      name: 'GrizzlyOne95',
      url: 'https://grizzlyone95.github.io/'
    },
    isPartOf: {
      '@type': 'VideoGame',
      name: 'Battlezone 98 Redux'
    }
  });
  document.head.appendChild(schema);

  document.title = `GrizzlyOne95 // ${item.title}`;
  titleEl.textContent = item.title;
  subtitleEl.textContent = `${item.badge} · Steam Workshop ${item.id}`;

  const listSection = (title, code, values) => {
    if (!Array.isArray(values) || !values.length) return '';
    return `<div class="section-rule"><h2>${esc(title)}</h2><span class="code">${esc(code)}</span></div><section class="panel"><ul class="list-clean">${values.map(value => `<li>${esc(value)}</li>`).join('')}</ul></section>`;
  };

  const historySection = Array.isArray(extra.history) && extra.history.length
    ? `<div class="section-rule"><h2>History</h2><span class="code">// BACKSTORY</span></div><section class="panel mod-detail-prose">${extra.history.map(paragraph => `<p>${esc(paragraph)}</p>`).join('')}</section>`
    : '';

  const noteSection = extra.creatorNote
    ? `<div class="section-rule"><h2>Creator Note</h2><span class="code">// PERSONAL</span></div><section class="panel creator-note"><p>${esc(extra.creatorNote)}</p></section>`
    : '';

  const relatedSection = Array.isArray(extra.related) && extra.related.length
    ? `<div class="section-rule"><h2>Related Links</h2><span class="code">// MORE</span></div><section class="panel"><div class="detail-links">${extra.related.map(link => `<a class="small-button" href="${esc(link.url)}" target="_blank" rel="noopener">${esc(link.label)} ↗</a>`).join('')}</div></section>`
    : '';

  root.innerHTML = `
    <section class="mod-detail-hero">
      <div class="mod-detail-image">${imageHtml}</div>
      <div class="mod-detail-summary">
        <span class="mod-badge">${esc(item.badge)}</span>
        <h2>${esc(item.title)}</h2>
        <p>${esc(summary)}</p>
        <dl class="mod-meta">
          <div><dt>Category</dt><dd>${esc(item.group)}</dd></div>
          <div><dt>Workshop ID</dt><dd>${esc(item.id)}</dd></div>
        </dl>
        <div class="detail-links">
          <a class="small-button" href="${steamUrl}" target="_blank" rel="noopener">View on Steam ↗</a>
          <a class="small-button" href="./battlezone-mods.html">← Back to Mods</a>
        </div>
      </div>
    </section>
    ${noteSection}
    ${historySection}
    ${listSection('Highlights', '// FEATURES', extra.highlights)}
    ${listSection('Requirements', '// NEEDS', extra.requirements)}
    ${listSection('Installation', '// SETUP', extra.installation)}
    ${listSection('Credits', '// CONTRIBUTORS', extra.credits)}
    ${relatedSection}
  `;
})();
