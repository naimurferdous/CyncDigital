// ============================================
// Naimur Ferdous — shared site behavior
// Mobile nav, header scroll state, scroll reveals,
// stat counters, service modal, contact form.
// ============================================

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Mobile menu ---------- */
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const iconOpen = document.getElementById('icon-open');
  const iconClose = document.getElementById('icon-close');

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      const isOpen = !mobileMenu.classList.contains('hidden');
      mobileMenu.classList.toggle('hidden');
      iconOpen && iconOpen.classList.toggle('hidden');
      iconClose && iconClose.classList.toggle('hidden');
      menuToggle.setAttribute('aria-expanded', String(!isOpen));
    });

    // Close mobile menu after tapping a link
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        iconOpen && iconOpen.classList.remove('hidden');
        iconClose && iconClose.classList.add('hidden');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Header scroll state ---------- */
  const header = document.getElementById('site-header');
  if (header) {
    const onScroll = () => {
      header.classList.toggle('scrolled', window.scrollY > 12);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- Scroll reveals ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
      revealEls.forEach(el => io.observe(el));
    } else {
      revealEls.forEach(el => el.classList.add('is-visible'));
    }
  }

  /* ---------- Stat counters ---------- */
  const counters = document.querySelectorAll('.stat-value[data-count]');
  if (counters.length) {
    const animateCounter = (el) => {
      const target = parseInt(el.getAttribute('data-count'), 10) || 0;
      const suffix = el.getAttribute('data-suffix') || '';
      const duration = 1400;
      const start = performance.now();

      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        const value = Math.round(eased * target);
        el.textContent = value + suffix;
        if (progress < 1) {
          requestAnimationFrame(tick);
        } else {
          el.textContent = target + suffix;
        }
      };
      requestAnimationFrame(tick);
    };

    if ('IntersectionObserver' in window) {
      const counterIO = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterIO.unobserve(entry.target);
          }
        });
      }, { threshold: 0.4 });
      counters.forEach(el => counterIO.observe(el));
    } else {
      counters.forEach(animateCounter);
    }
  }

  /* ---------- Service detail modal ---------- */
  const serviceModal = document.getElementById('service-modal');
  if (serviceModal) {
    const modalIndex = document.getElementById('modal-index');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    const modalList = document.getElementById('modal-list');
    const modalClose = document.getElementById('modal-close');

    const serviceDetails = {
      affiliate: {
        index: '01',
        title: 'Affiliate Program Build & Management',
        body: 'End-to-end ownership of your affiliate channel, from zero to a fully activated, tracked, and tiered program.',
        items: [
          'Platform setup and tracking implementation (NetRefer or your stack of choice)',
          'Tiered commission structuring — CPA, RevShare, or hybrid',
          'Affiliate recruitment, onboarding, and ongoing relationship management',
          'Fraud monitoring and compliance checks on partner traffic'
        ]
      },
      performance: {
        index: '02',
        title: 'Performance Marketing & CRO',
        body: 'Turning existing traffic and partner activity into more conversions, without inflating spend.',
        items: [
          'Funnel and landing page audits with prioritized fix list',
          'Attribution review across AppsFlyer / SKAdNetwork and GA4',
          'A/B testing roadmap for the highest-leverage conversion points',
          'Monthly reporting built around the metrics that matter to your team'
        ]
      },
      bizdev: {
        index: '03',
        title: 'Partner & Business Development',
        body: "Opening and negotiating the partnerships that bring in traffic, sales, and reach you don't have in-house.",
        items: [
          'KOL and influencer sourcing matched to your audience',
          'Outreach, negotiation, and deal structuring',
          'Direct relationship management — no account handoffs',
          'Pipeline tracking so you always know what stage each partner is at'
        ]
      },
      audit: {
        index: '04',
        title: 'Program Audit & Scaling',
        body: "A clear-eyed look at what your existing partner or affiliate program is actually doing, then a plan to fix and scale it.",
        items: [
          'Full program health check — tracking, payouts, partner mix, compliance',
          'Honest read on what is and is not driving sales',
          'Prioritized scaling plan with realistic timelines',
          'Ongoing support to execute the plan, not just hand over a slide deck'
        ]
      }
    };

    const openModal = (key) => {
      const data = serviceDetails[key];
      if (!data) return;
      modalIndex.textContent = data.index;
      modalTitle.textContent = data.title;
      modalBody.textContent = data.body;
      modalList.innerHTML = '';
      data.items.forEach(item => {
        const li = document.createElement('li');
        li.className = 'flex items-start gap-3 text-sm text-paperdim';
        li.innerHTML = '<span class="text-sync mt-1">&#9670;</span><span>' + item + '</span>';
        modalList.appendChild(li);
      });
      serviceModal.classList.remove('hidden');
      serviceModal.classList.add('flex');
      document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
      serviceModal.classList.add('hidden');
      serviceModal.classList.remove('flex');
      document.body.style.overflow = '';
    };

    document.querySelectorAll('[data-modal]').forEach(card => {
      card.addEventListener('click', () => openModal(card.getAttribute('data-modal')));
    });

    modalClose && modalClose.addEventListener('click', closeModal);
    serviceModal.addEventListener('click', (e) => {
      if (e.target === serviceModal) closeModal();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !serviceModal.classList.contains('hidden')) closeModal();
    });
  }

  /* ---------- Contact form (Formspree via fetch/AJAX) ---------- */
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    const formSuccess = document.getElementById('form-success');
    const formError = document.getElementById('form-error');
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const submitBtnDefaultText = submitBtn ? submitBtn.textContent : '';

    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      formSuccess && formSuccess.classList.add('hidden');
      formError && formError.classList.add('hidden');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending…';
      }

      try {
        const response = await fetch(contactForm.action, {
          method: 'POST',
          body: new FormData(contactForm),
          headers: { Accept: 'application/json' }
        });

        if (response.ok) {
          formSuccess && formSuccess.classList.remove('hidden');
          contactForm.reset();
        } else {
          const data = await response.json().catch(() => null);
          console.error('Formspree error', data);
          formError && formError.classList.remove('hidden');
        }
      } catch (err) {
        console.error('Network error submitting contact form', err);
        formError && formError.classList.remove('hidden');
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = submitBtnDefaultText;
        }
      }
    });
  }

});
