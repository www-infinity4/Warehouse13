/**
 * Warehouse13 — Main JavaScript
 * Handles: hamburger menu, mobile overlay, smooth scroll, active nav links
 */

(function () {
  'use strict';

  // ─── Element references ───
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const mobileMenu   = document.getElementById('mobile-menu');
  const mobileOverlay = document.getElementById('mobile-overlay');
  const mobileCloseBtn = document.getElementById('mobile-close-btn');
  const mobileLinks  = mobileMenu ? mobileMenu.querySelectorAll('.mobile-link') : [];

  if (!hamburgerBtn || !mobileMenu || !mobileOverlay) {
    return;
  }

  // ─── Open / close helpers ───
  function openMenu() {
    mobileMenu.classList.add('is-open');
    mobileOverlay.classList.add('is-open');
    hamburgerBtn.setAttribute('aria-expanded', 'true');
    mobileMenu.setAttribute('aria-hidden', 'false');
    mobileOverlay.removeAttribute('aria-hidden');
    document.body.style.overflow = 'hidden';

    // Move focus to close button
    if (mobileCloseBtn) {
      mobileCloseBtn.focus();
    }
  }

  function closeMenu() {
    mobileMenu.classList.remove('is-open');
    mobileOverlay.classList.remove('is-open');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
    mobileOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    // Return focus to trigger
    hamburgerBtn.focus();
  }

  // ─── Event listeners ───
  hamburgerBtn.addEventListener('click', function () {
    const isOpen = mobileMenu.classList.contains('is-open');
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  if (mobileCloseBtn) {
    mobileCloseBtn.addEventListener('click', closeMenu);
  }

  mobileOverlay.addEventListener('click', closeMenu);

  // Close on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && mobileMenu.classList.contains('is-open')) {
      closeMenu();
    }
  });

  // Close menu when a mobile link is clicked (navigation)
  mobileLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      closeMenu();
    });
  });

  // ─── Active section highlighting via IntersectionObserver ───
  const sections = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link[href^="#"]');

  if (sections.length > 0 && navLinks.length > 0 && 'IntersectionObserver' in window) {
    var currentSection = '';

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            currentSection = entry.target.id;
            navLinks.forEach(function (link) {
              var href = link.getAttribute('href');
              if (href === '#' + currentSection) {
                link.classList.add('nav-link--active');
              } else {
                link.classList.remove('nav-link--active');
              }
            });
          }
        });
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );

    sections.forEach(function (section) {
      observer.observe(section);
    });
  }

  // ─── Animate stat numbers on scroll ───
  var statsAnimated = false;
  var statNums = document.querySelectorAll('.stat__num');

  function animateStats() {
    if (statsAnimated) { return; }
    statsAnimated = true;

    statNums.forEach(function (el) {
      var target = el.textContent.trim();
      var numVal = parseInt(target, 10);

      // Only animate pure numbers (not "∞")
      if (!isNaN(numVal) && numVal > 0) {
        var start = 0;
        var duration = 1200;
        var startTime = null;

        function step(timestamp) {
          if (!startTime) { startTime = timestamp; }
          var progress = Math.min((timestamp - startTime) / duration, 1);
          // Ease-out cubic
          var eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(eased * numVal).toString();

          if (progress < 1) {
            requestAnimationFrame(step);
          }
        }

        requestAnimationFrame(step);
      }
    });
  }

  if ('IntersectionObserver' in window) {
    var heroStats = document.querySelector('.hero__stats');
    if (heroStats) {
      var statsObserver = new IntersectionObserver(
        function (entries) {
          if (entries[0].isIntersecting) {
            animateStats();
            statsObserver.disconnect();
          }
        },
        { threshold: 0.5 }
      );
      statsObserver.observe(heroStats);
    }
  } else {
    // Fallback for no IntersectionObserver
    animateStats();
  }

})();
