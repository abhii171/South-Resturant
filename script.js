(() => {
  const header = document.querySelector('header');
  const desktopNav = header?.querySelector('nav');
  const menuToggle = document.getElementById('mobile-nav-toggle');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const menuGrid = document.querySelector('#menu .grid');
  
  if (menuGrid) {
    [...menuGrid.children]
      .sort((first, second) => Number(first.style.order) - Number(second.style.order))
      .forEach((item) => {
        menuGrid.append(item);
        item.style.removeProperty('order');
      });
  }

  if (header && desktopNav && menuToggle) {
    const mobileNav = document.createElement('nav');
    mobileNav.className = 'mobile-nav-panel';
    mobileNav.id = 'mobile-nav-panel';
    mobileNav.setAttribute('aria-label', 'Mobile navigation');
    mobileNav.setAttribute('aria-hidden', 'true');
    mobileNav.innerHTML = desktopNav.innerHTML;
    header.append(mobileNav);
    menuToggle.setAttribute('aria-controls', mobileNav.id);

    const closeMenu = () => {
      menuToggle.setAttribute('aria-expanded', 'false');
      mobileNav.classList.remove('is-open');
      mobileNav.setAttribute('aria-hidden', 'true');
    };

    menuToggle.addEventListener('click', () => {
      const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', String(!isOpen));
      mobileNav.classList.toggle('is-open', !isOpen);
      mobileNav.setAttribute('aria-hidden', String(isOpen));
    });
    mobileNav.addEventListener('click', (event) => {
      if (event.target.closest('a')) closeMenu();
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        closeMenu();
        menuToggle.focus();
      }
    });
    document.addEventListener('click', (event) => {
      if (!header.contains(event.target)) closeMenu();
    });
  }

  if (!reducedMotion && 'IntersectionObserver' in window) {
    const items = document.querySelectorAll(
      'main > section:not(#home), #categories article, #menu article, #why-jsm .grid > div, #locations .grid > div, footer'
    );
    const observer = new IntersectionObserver((entries, activeObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          activeObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -32px 0px' });

    items.forEach((item) => {
      item.classList.add('reveal-item');
      observer.observe(item);
    });
  }
})();
