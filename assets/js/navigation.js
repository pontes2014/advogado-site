(() => {
  'use strict';

  const menuToggle = document.querySelector('.menu-toggle');
  const menu = document.getElementById('menu');
  const compactNavigation = window.matchMedia('(max-width: 42rem)');

  function setMenuOpen(open) {
    menu.hidden = compactNavigation.matches && !open;
    menuToggle.setAttribute('aria-expanded', String(open));
  }

  function syncNavigation() {
    menuToggle.hidden = !compactNavigation.matches;
    setMenuOpen(false);
  }

  menuToggle.addEventListener('click', () => {
    setMenuOpen(menuToggle.getAttribute('aria-expanded') === 'false');
  });

  menu.addEventListener('click', (event) => {
    if (compactNavigation.matches && event.target.closest('a')) {
      setMenuOpen(false);
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
      setMenuOpen(false);
      menuToggle.focus();
    }
  });

  compactNavigation.addEventListener('change', syncNavigation);
  syncNavigation();
})();
