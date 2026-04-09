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
    let currentSection = '';

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            currentSection = entry.target.id;
            navLinks.forEach(function (link) {
              const href = link.getAttribute('href');
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
  let statsAnimated = false;
  const statNums = document.querySelectorAll('.stat__num');

  function animateStats() {
    if (statsAnimated) { return; }
    statsAnimated = true;

    statNums.forEach(function (el) {
      const target = el.textContent.trim();
      const numVal = parseInt(target, 10);

      // Only animate pure numbers (not "∞")
      if (!isNaN(numVal) && numVal > 0) {
        const duration = 1200;
        let startTime = null;

        function step(timestamp) {
          if (!startTime) { startTime = timestamp; }
          const progress = Math.min((timestamp - startTime) / duration, 1);
          // Ease-out cubic
          const eased = 1 - Math.pow(1 - progress, 3);
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
    const heroStats = document.querySelector('.hero__stats');
    if (heroStats) {
      const statsObserver = new IntersectionObserver(
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

// ─── Science News Feed ───
// Fetches the latest ScienceDaily headlines via rss2json and renders them.
(function () {
  'use strict';

  var feedEl    = document.getElementById('science-news-feed');
  var loadingEl = document.getElementById('news-loading');

  if (!feedEl) { return; }

  var MAX_ITEMS = 6;

  var RSS_URL = 'https://www.sciencedaily.com/rss/all.xml';
  var API_URL = 'https://api.rss2json.com/v1/api.json?rss_url=' +
                encodeURIComponent(RSS_URL) + '&count=' + MAX_ITEMS;

  function escapeHtml(str) {
    var map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;', '`': '&#096;' };
    return (str || '').replace(/[&<>"'`]/g, function (ch) { return map[ch]; });
  }

  function formatDate(dateStr) {
    try {
      var d = new Date(dateStr);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch (e) {
      return '';
    }
  }

  function renderItems(items) {
    if (loadingEl && loadingEl.parentNode) { loadingEl.parentNode.removeChild(loadingEl); }

    items.forEach(function (item) {
      var article = document.createElement('article');
      article.className = 'news-item';
      article.setAttribute('aria-label', item.title);
      article.innerHTML =
        '<span class="news-item__source">ScienceDaily</span>' +
        '<p class="news-item__title">' + escapeHtml(item.title) + '</p>' +
        '<p class="news-item__meta">' + escapeHtml(formatDate(item.pubDate)) + '</p>' +
        '<a href="' + escapeHtml(item.link) + '" target="_blank" rel="noopener noreferrer"' +
        '   class="news-item__link" aria-label="Read article: ' + escapeHtml(item.title) + '">' +
        '  Read Article ↗' +
        '</a>';
      feedEl.appendChild(article);
    });

    var attr = document.createElement('p');
    attr.className = 'news-feed__attribution';
    attr.innerHTML = 'Source: <a href="https://www.sciencedaily.com/" target="_blank" rel="noopener noreferrer">ScienceDaily</a>';
    feedEl.appendChild(attr);
  }

  function renderError() {
    if (loadingEl && loadingEl.parentNode) { loadingEl.parentNode.removeChild(loadingEl); }
    var div = document.createElement('div');
    div.className = 'news-feed__error';
    div.setAttribute('role', 'alert');
    div.innerHTML = 'Signal unavailable — ' +
      '<a href="https://www.sciencedaily.com/" target="_blank" rel="noopener noreferrer">' +
      'visit ScienceDaily directly</a>';
    feedEl.appendChild(div);
  }

  fetch(API_URL)
    .then(function (res) {
      if (!res.ok) { throw new Error('HTTP ' + res.status); }
      return res.json();
    })
    .then(function (data) {
      if (data.status === 'ok' && Array.isArray(data.items) && data.items.length > 0) {
        renderItems(data.items.slice(0, MAX_ITEMS));
      } else {
        renderError();
      }
    })
    .catch(function () {
      renderError();
    });

}());
