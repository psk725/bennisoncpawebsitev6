(function () {
  const root = document.documentElement;
  const themeToggle = document.querySelector('[data-theme-toggle]');
  const navToggle = document.querySelector('[data-nav-toggle]');
  const navLinks = document.querySelector('[data-nav-links]');
  const form = document.querySelector('[data-contact-form]');
  const year = document.querySelector('[data-year]');

  let theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  root.setAttribute('data-theme', theme);

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      theme = theme === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', theme);
      themeToggle.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
    });
  }

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  if (form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();

      if (!form.reportValidity()) {
        return;
      }

      const data = new FormData(form);
      const name = data.get('name');
      const email = data.get('email');
      const need = data.get('need');
      const message = data.get('message');

      const subject = encodeURIComponent(`Website inquiry from ${name}`);
      const body = encodeURIComponent(
        [
          `Name: ${name}`,
          `Email: ${email}`,
          `Need: ${need}`,
          '',
          'Brief context:',
          message,
          '',
          'Sent from the Bennison CPA website contact form.'
        ].join('\n')
      );

      window.location.href = `mailto:craig@bennisoncpa.com?subject=${subject}&body=${body}`;
    });
  }
})();
