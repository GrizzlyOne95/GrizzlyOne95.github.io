(() => {
  const create = ({
    input,
    buttons,
    onChange,
    queryParam = 'q',
    filterParam = 'category',
    defaultFilter = 'all'
  }) => {
    if (!input || !buttons?.length || typeof onChange !== 'function') return null;

    const validFilters = new Set(
      buttons.map(button => button.dataset.filter).filter(Boolean)
    );
    validFilters.add(defaultFilter);

    let searchHistoryOpen = false;

    const normalizeFilter = value => validFilters.has(value) ? value : defaultFilter;

    const readUrlState = () => {
      const params = new URLSearchParams(window.location.search);
      return {
        query: (params.get(queryParam) || '').trim(),
        filter: normalizeFilter(params.get(filterParam) || defaultFilter)
      };
    };

    const selectedFilter = () => normalizeFilter(
      buttons.find(button => button.classList.contains('is-active'))?.dataset.filter || defaultFilter
    );

    const syncButtons = filter => {
      const normalized = normalizeFilter(filter);
      buttons.forEach(button => {
        const selected = button.dataset.filter === normalized;
        button.classList.toggle('is-active', selected);
        button.setAttribute('aria-pressed', selected ? 'true' : 'false');
      });
      return normalized;
    };

    const stateFromUi = () => ({
      query: input.value.trim(),
      filter: selectedFilter()
    });

    const writeUrlState = (state, mode = 'replace') => {
      const url = new URL(window.location.href);

      if (state.query) url.searchParams.set(queryParam, state.query);
      else url.searchParams.delete(queryParam);

      if (state.filter && state.filter !== defaultFilter) {
        url.searchParams.set(filterParam, state.filter);
      } else {
        url.searchParams.delete(filterParam);
      }

      const next = `${url.pathname}${url.search}${url.hash}`;
      const current = `${window.location.pathname}${window.location.search}${window.location.hash}`;
      if (next === current) return;

      const method = mode === 'push' ? 'pushState' : 'replaceState';
      window.history[method]({ catalogUrlState: true }, '', next);
    };

    const emit = state => onChange({
      query: state.query,
      filter: normalizeFilter(state.filter)
    });

    const syncFromUrl = () => {
      const state = readUrlState();
      input.value = state.query;
      state.filter = syncButtons(state.filter);
      writeUrlState(state, 'replace');
      emit(state);
    };

    const beginSearchHistory = () => {
      if (searchHistoryOpen) return;
      window.history.pushState({ catalogUrlState: true }, '', window.location.href);
      searchHistoryOpen = true;
    };

    buttons.forEach(button => {
      button.addEventListener('click', () => {
        searchHistoryOpen = false;
        const state = {
          query: input.value.trim(),
          filter: syncButtons(button.dataset.filter || defaultFilter)
        };
        writeUrlState(state, 'push');
        emit(state);
      });
    });

    input.addEventListener('input', () => {
      beginSearchHistory();
      const state = stateFromUi();
      writeUrlState(state, 'replace');
      emit(state);
    });

    input.addEventListener('blur', () => {
      searchHistoryOpen = false;
    });

    input.addEventListener('keydown', event => {
      if (event.key === 'Enter') searchHistoryOpen = false;
    });

    document.addEventListener('keydown', event => {
      const target = event.target;
      const editable = target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target?.isContentEditable;
      const key = event.key.toLowerCase();

      if ((event.ctrlKey || event.metaKey) && key === 'k' && !event.altKey) {
        event.preventDefault();
        input.focus();
        input.select();
        return;
      }

      if (event.key === '/' && !editable && !event.ctrlKey && !event.metaKey && !event.altKey) {
        event.preventDefault();
        input.focus();
        return;
      }

      if (event.key === 'Escape' && input.value && (document.activeElement === input || !editable)) {
        event.preventDefault();
        beginSearchHistory();
        input.value = '';
        const state = stateFromUi();
        writeUrlState(state, 'replace');
        emit(state);
        input.focus();
      }
    });

    window.addEventListener('popstate', () => {
      searchHistoryOpen = false;
      syncFromUrl();
    });

    syncFromUrl();

    return {
      read: readUrlState,
      syncFromUrl
    };
  };

  window.CatalogUrlState = { create };
})();
