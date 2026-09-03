(() => {
  const ISDFC_ID = '3162242823';
  const ISDFC_IMAGE = 'https://images.steamusercontent.com/ugc/2479870614173299696/195AA57620D8FD9C3FCD9023E4BB18403304227B/?imw=5000&imh=5000&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=false';
  const detailRoutes = {
    '3686673790': './mod-campaign-reimagined.html',
    '3536800125': './mod-resurgence.html',
    '3476765858': './mod-rise-of-the-black-dogs.html',
    '3162242823': './mod-isdf-chronicles.html',
    '2973893698': './mod-legacy-of-the-black-dogs.html'
  };

  if (typeof groups !== 'undefined') {
    for (const group of groups) {
      const item = group.items.find(entry => entry.id === ISDFC_ID);
      if (item) {
        item.image = ISDFC_IMAGE;
        break;
      }
    }
  }

  document.querySelectorAll('a.mod-card').forEach(card => {
    const steamHref = card.getAttribute('href') || '';
    const match = steamHref.match(/[?&]id=(\d+)/);
    if (!match) return;

    const id = match[1];
    const article = document.createElement('article');
    article.className = card.className;
    article.dataset.modId = id;
    article.innerHTML = card.innerHTML;

    if (id === ISDFC_ID) {
      const thumb = article.querySelector('.mod-thumb');
      if (thumb) {
        thumb.classList.remove('fallback');
        thumb.innerHTML = `<img loading="lazy" src="${ISDFC_IMAGE}" alt="ISDF Chronicles: Campaign & Mod Pack">`;
      }
    }

    const oldOpen = article.querySelector('.mod-open');
    if (oldOpen) oldOpen.remove();

    const copy = article.querySelector('.mod-copy');
    if (copy) {
      const actions = document.createElement('div');
      actions.className = 'mod-actions';
      const detailHref = detailRoutes[id] || `./mod-detail.html?id=${id}`;
      actions.innerHTML = `<a class="mod-action primary" href="${detailHref}">Details →</a><a class="mod-action" href="${steamHref}" target="_blank" rel="noopener">Steam ↗</a>`;
      copy.appendChild(actions);
    }

    card.replaceWith(article);
  });
})();
