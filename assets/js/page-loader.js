(() => {
  'use strict';

  const loader = document.getElementById('page-loader');
  const images = [loader.querySelector('img'), document.querySelector('.hero-photo img')];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let exitTimeout;

  function dismiss() {
    loader.hidden = true;
    window.clearTimeout(loadTimeout);
    window.clearTimeout(exitTimeout);
    document.removeEventListener('focusin', dismiss);
  }

  function revealPage() {
    if (loader.hidden || exitTimeout !== undefined) return;
    if (reducedMotion.matches) {
      dismiss();
      return;
    }

    window.clearTimeout(loadTimeout);
    loader.classList.add('is-leaving');
    exitTimeout = window.setTimeout(dismiss, 520);
  }

  function whenImageSettles(image) {
    if (image.complete) return Promise.resolve();

    return new Promise((resolve) => {
      function settle() {
        image.removeEventListener('load', settle);
        image.removeEventListener('error', settle);
        resolve();
      }

      image.addEventListener('load', settle);
      image.addEventListener('error', settle);
    });
  }

  const loadTimeout = window.setTimeout(revealPage, reducedMotion.matches ? 1300 : 2800);
  document.addEventListener('focusin', dismiss);
  loader.hidden = false;

  const minimumDisplay = new Promise((resolve) => window.setTimeout(resolve, reducedMotion.matches ? 0 : 2000));
  Promise.all([minimumDisplay, ...images.map(whenImageSettles)]).then(revealPage);
})();
