(() => {
  const openTarget = () => {
    if (!location.hash) return;
    const target = document.querySelector(location.hash);
    if (target instanceof HTMLDetailsElement) target.open = true;
  };

  window.addEventListener('hashchange', openTarget);
  openTarget();
})();
