(function () {
  const root = document.documentElement;
  const themeToggle = document.querySelector('[data-theme-toggle]');
  const navToggle = document.querySelector('[data-nav-toggle]');
  const navLinks = document.querySelector('[data-nav-links]');
  const form = document.querySelector('[data-contact-form]');
  const year = document.querySelector('[data-year]');

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  /* Theme ------------------------------------------------------------------
     The initial theme is applied by the inline script in <head> so the page
     never paints the wrong palette. Here we only handle the toggle. */
  if (themeToggle) {
    const syncLabel = () => {
      const current = root.getAttribute('data-theme');
      themeToggle.setAttribute('aria-label', `Switch to ${current === 'dark' ? 'light' : 'dark'} mode`);
    };

    syncLabel();

    themeToggle.addEventListener('click', () => {
      const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try {
        localStorage.setItem('theme', next);
      } catch (e) {
        /* private browsing - the toggle still works for this page view */
      }
      syncLabel();
    });
  }

  /* Mobile navigation ------------------------------------------------------ */
  if (navToggle && navLinks) {
    const closeNav = () => {
      navLinks.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    };

    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeNav);
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && navLinks.classList.contains('is-open')) {
        closeNav();
        navToggle.focus();
      }
    });

    document.addEventListener('click', (event) => {
      if (!navLinks.classList.contains('is-open')) return;
      if (navLinks.contains(event.target) || navToggle.contains(event.target)) return;
      closeNav();
    });
  }

  /* Contact form -----------------------------------------------------------
     Submit to Formspree in the background so the visitor stays on the page
     instead of being handed off to a third-party confirmation screen. If the
     request fails for any reason we fall back to a normal form POST. */
  if (form) {
    const status = form.querySelector('[data-form-status]');
    const submit = form.querySelector('[data-submit]');
    const defaultLabel = submit ? submit.textContent : 'Send message';

    const setStatus = (message, state) => {
      if (!status) return;
      status.textContent = message;
      status.dataset.state = state || '';
    };

    form.addEventListener('submit', async (event) => {
      if (!window.fetch) return; // very old browser: let the normal POST happen
      event.preventDefault();

      if (submit) {
        submit.disabled = true;
        // Kept ASCII on purpose: this host serves .js with no charset, so
        // non-ASCII source here would rely on an encoding fallback.
        submit.textContent = 'Sending...';
      }
      setStatus('', '');

      try {
        const response = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' },
        });

        if (!response.ok) throw new Error(`Formspree responded ${response.status}`);

        form.reset();
        setStatus('Thanks, your message is on its way. Craig will follow up personally, usually within one business day.', 'success');
        if (submit) submit.textContent = 'Message sent';
        return;
      } catch (error) {
        setStatus('Something went wrong sending that. Please email craig@bennisoncpa.com directly and it will get to the same place.', 'error');
        if (submit) {
          submit.disabled = false;
          submit.textContent = defaultLabel;
        }
      }
    });
  }
})();
