/**
 * Muhammad Hashim Portfolio - Main JavaScript
 * Lightweight, accessible, no external dependencies.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Toggle
  const mobileToggle = document.querySelector('.mobile-toggle');
  const mainNav = document.querySelector('.main-nav');

  if (mobileToggle && mainNav) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('is-open');
      mobileToggle.setAttribute('aria-expanded', String(isOpen));
      mobileToggle.innerHTML = isOpen
        ? '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>'
        : '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>';
    });

    // Close mobile nav when clicking outside
    document.addEventListener('click', (e) => {
      if (mainNav.classList.contains('is-open') && !mainNav.contains(e.target) && !mobileToggle.contains(e.target)) {
        mainNav.classList.remove('is-open');
        mobileToggle.setAttribute('aria-expanded', 'false');
        mobileToggle.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>';
      }
    });
  }

  // 2. Active Page Highlighting
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link, .dropdown-link');

  navLinks.forEach((link) => {
    const href = link.getAttribute('href');
    if (!href) return;
    const linkPath = href.split('/').pop();

    if (linkPath === currentPath || (currentPath === '' && linkPath === 'index.html')) {
      link.classList.add('active');
      const dropdownParent = link.closest('.nav-item-dropdown');
      if (dropdownParent) {
        const trigger = dropdownParent.querySelector('.dropdown-trigger');
        if (trigger) trigger.classList.add('active');
      }
    }
  });

  // 3. Dynamic Year in Footer
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // 4. Contact Form Handling
  const contactForms = document.querySelectorAll('#contact-form');
  
  contactForms.forEach((contactForm) => {
    const formFeedback = contactForm.parentElement.querySelector('#form-feedback') || document.getElementById('form-feedback');

    contactForm.addEventListener('submit', async (e) => {
      const formAction = contactForm.getAttribute('action');

      // Check if user has set up their Formspree endpoint (not placeholder)
      const isPlaceholderAction = !formAction || formAction.includes('your-formspree-id') || formAction === '#' || formAction.startsWith('mailto:');

      if (isPlaceholderAction) {
        e.preventDefault();

        const firstNameInput = contactForm.querySelector('[name="first_name"]');
        const lastNameInput = contactForm.querySelector('[name="last_name"]');
        const legacyNameInput = contactForm.querySelector('[name="name"]');
        const emailInput = contactForm.querySelector('[name="email"]');
        const phoneInput = contactForm.querySelector('[name="phone"]');
        const messageInput = contactForm.querySelector('[name="message"]');

        const firstName = firstNameInput ? firstNameInput.value.trim() : '';
        const lastName = lastNameInput ? lastNameInput.value.trim() : '';
        const fullName = (firstName || lastName) ? `${firstName} ${lastName}`.trim() : (legacyNameInput ? legacyNameInput.value.trim() : 'Prospective Client');
        const email = emailInput ? emailInput.value.trim() : '';
        const phone = phoneInput ? phoneInput.value.trim() : 'Not provided';
        const message = messageInput ? messageInput.value.trim() : '';

        const subjectEncoded = encodeURIComponent(`Project Inquiry from ${fullName}`);
        const bodyEncoded = encodeURIComponent(`Name: ${fullName}\nEmail: ${email}\nPhone: ${phone}\n\nMessage:\n${message}`);

        const mailtoUri = `mailto:20muhammad.hashim.05@gmail.com?subject=${subjectEncoded}&body=${bodyEncoded}`;

        if (formFeedback) {
          formFeedback.className = 'form-feedback success';
          formFeedback.innerHTML = `Thank you, ${fullName}! <a href="${mailtoUri}" style="text-decoration:underline; font-weight:700; color:inherit;">Click here to send directly via email</a>, or message directly on WhatsApp (+966 53 647 5110) for faster response.`;
          formFeedback.style.display = 'block';
        }

        // Trigger mailto client
        window.location.href = mailtoUri;
      }
    });
  });

  // 5. Scroll Animations (IntersectionObserver)
  const animatedElements = document.querySelectorAll('.fade-in-up');
  if ('IntersectionObserver' in window && animatedElements.length > 0) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.1
    });

    animatedElements.forEach((el) => observer.observe(el));
  } else {
    // Fallback if IntersectionObserver is not supported
    animatedElements.forEach((el) => el.classList.add('is-visible'));
  }

  // 6. Connected Segmented Tab Navigation (URAPRA Case Study)
  const csTabButtons = document.querySelectorAll('.cs-tab-btn');
  const csTabPanels = document.querySelectorAll('.cs-tab-panel');

  if (csTabButtons.length > 0 && csTabPanels.length > 0) {
    csTabButtons.forEach((btn, index) => {
      btn.addEventListener('click', () => {
        // Deactivate all tabs
        csTabButtons.forEach((b) => {
          b.classList.remove('is-active');
          b.setAttribute('aria-selected', 'false');
          b.setAttribute('tabindex', '-1');
        });
        // Hide all panels
        csTabPanels.forEach((p) => {
          p.classList.remove('is-active');
          p.setAttribute('hidden', '');
        });

        // Activate selected tab
        btn.classList.add('is-active');
        btn.setAttribute('aria-selected', 'true');
        btn.setAttribute('tabindex', '0');

        // Show corresponding panel
        const targetPanelId = btn.getAttribute('aria-controls');
        const targetPanel = document.getElementById(targetPanelId);
        if (targetPanel) {
          targetPanel.classList.add('is-active');
          targetPanel.removeAttribute('hidden');
        }
      });

      // Keyboard arrow navigation between tabs
      btn.addEventListener('keydown', (e) => {
        let newIndex = null;
        if (e.key === 'ArrowRight') {
          newIndex = (index + 1) % csTabButtons.length;
        } else if (e.key === 'ArrowLeft') {
          newIndex = (index - 1 + csTabButtons.length) % csTabButtons.length;
        } else if (e.key === 'Home') {
          newIndex = 0;
        } else if (e.key === 'End') {
          newIndex = csTabButtons.length - 1;
        }

        if (newIndex !== null) {
          e.preventDefault();
          csTabButtons[newIndex].focus();
          csTabButtons[newIndex].click();
        }
      });
    });
  }
});

