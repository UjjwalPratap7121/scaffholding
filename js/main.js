/**
 * DP INFRA SOLUTIONS - MAIN JAVASCRIPT
 * Features: Calculator, WhatsApp lead generation, modal popups, lightbox, interactive filters, stats counters.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Toggle
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        if (navMenu.classList.contains('active')) {
          icon.classList.remove('fa-bars');
          icon.classList.add('fa-xmark');
        } else {
          icon.classList.remove('fa-xmark');
          icon.classList.add('fa-bars');
        }
      }
    });

    // Close menu when clicking nav links
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const icon = mobileToggle.querySelector('i');
        if (icon) {
          icon.classList.remove('fa-xmark');
          icon.classList.add('fa-bars');
        }
      });
    });
  }

  // 2. Active Navigation Highlight on Scroll
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');
      const navItem = document.querySelector(`.nav-menu a[href*="${sectionId}"]`);
      if (navItem) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          navItem.classList.add('active');
        } else {
          navItem.classList.remove('active');
        }
      }
    });
  });

  // 3. Animated Number Counters
  const counters = document.querySelectorAll('.counter-val');
  let counted = false;

  const countUp = () => {
    counters.forEach(counter => {
      const target = +counter.getAttribute('data-target');
      const suffix = counter.getAttribute('data-suffix') || '';
      let current = 0;
      const stepTime = 20;
      const totalSteps = 60;
      const increment = target / totalSteps;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          counter.innerText = Math.floor(target).toLocaleString('en-IN') + suffix;
          clearInterval(timer);
        } else {
          counter.innerText = Math.floor(current).toLocaleString('en-IN') + suffix;
        }
      }, stepTime);
    });
  };

  const statsSection = document.getElementById('statsStrip');
  if (statsSection) {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !counted) {
        counted = true;
        countUp();
      }
    }, { threshold: 0.2 });
    observer.observe(statsSection);
  }

  // 4. Scaffolding Rental Calculator
  const projectTypeSelect = document.getElementById('calcProjectType');
  const projectAreaInput = document.getElementById('calcArea');
  const projectHeightInput = document.getElementById('calcHeight');
  const projectDurationInput = document.getElementById('calcDuration');
  const calcWhatsappBtn = document.getElementById('calcWhatsappBtn');

  const estCuplockEl = document.getElementById('estCuplock');
  const estPlanksEl = document.getElementById('estPlanks');
  const estPipesEl = document.getElementById('estPipes');
  const estTonnageEl = document.getElementById('estTonnage');
  const estPriceEl = document.getElementById('estPrice');
  const estTotalEl = document.getElementById('estTotal');

  // Typed values ignore the input's min/max, so clamp them (negative area etc. gave nonsense results)
  const readClamped = (input, fallback) => {
    const v = parseFloat(input.value) || fallback;
    const max = input.max ? +input.max : Infinity;
    return Math.min(Math.max(v, +input.min || 0), max);
  };

  function updateCalculator() {
    if (!projectAreaInput || !projectHeightInput || !projectDurationInput) return;

    const area = readClamped(projectAreaInput, 2000);
    const height = readClamped(projectHeightInput, 15);
    const duration = readClamped(projectDurationInput, 3);
    const type = projectTypeSelect ? projectTypeSelect.value : 'building';
    const typeLabel = projectTypeSelect ? projectTypeSelect.selectedOptions[0].text : type;

    // Calculation multipliers based on typical scaffolding density
    let multiplier = 1.0;
    if (type === 'infra') multiplier = 1.35;
    if (type === 'industrial') multiplier = 1.25;
    if (type === 'commercial') multiplier = 1.15;

    // Approximate quantity estimates
    const cuplockPieces = Math.round((area / 45) * (height / 3) * multiplier * 4);
    const steelPlanks = Math.round((area / 60) * (height / 4) * multiplier * 2.5);
    const pipesMeters = Math.round((area / 20) * (height / 2.5) * multiplier);
    const approxTons = ((cuplockPieces * 8 + steelPlanks * 12 + pipesMeters * 3.5) / 1000).toFixed(1);
    
    // Approximate monthly rental starting range in INR
    const monthlyRatePerTon = 4500; // Average market base rate for rental
    const approxMonthlyRent = Math.round(approxTons * monthlyRatePerTon);
    const totalRentEst = (approxMonthlyRent * duration).toLocaleString('en-IN');

    if (estCuplockEl) estCuplockEl.innerText = cuplockPieces.toLocaleString('en-IN') + ' pcs';
    if (estPlanksEl) estPlanksEl.innerText = steelPlanks.toLocaleString('en-IN') + ' nos';
    if (estPipesEl) estPipesEl.innerText = pipesMeters.toLocaleString('en-IN') + ' mtr';
    if (estTonnageEl) estTonnageEl.innerText = approxTons + ' Metric Tons';
    if (estPriceEl) estPriceEl.innerText = '₹' + approxMonthlyRent.toLocaleString('en-IN') + ' / month*';
    if (estTotalEl) estTotalEl.innerText = `≈ ₹${totalRentEst} for ${duration} month${duration === 1 ? '' : 's'}`;

    // Update WhatsApp Direct Link with dynamic quote request
    if (calcWhatsappBtn) {
      const msg = `Hello DP Infra Solutions, I used your online scaffolding calculator.\n\n*Project Details:*\n- Type: ${typeLabel}\n- Built-up Area: ${area} sq.ft\n- Height: ${height} meters\n- Duration: ${duration} months\n- Estimated Tonnage: ~${approxTons} Tons\n- Estimated Rent: ~₹${totalRentEst} total\n\nPlease provide your official quote and availability for delivery.`;
      calcWhatsappBtn.href = `https://wa.me/919275294224?text=${encodeURIComponent(msg)}`;
    }
  }

  if (projectAreaInput && projectHeightInput && projectDurationInput) {
    [projectTypeSelect, projectAreaInput, projectHeightInput, projectDurationInput].forEach(elem => {
      if (elem) elem.addEventListener('input', updateCalculator);
    });
    updateCalculator();
  }

  // 5. Product Category Filter
  const filterTabs = document.querySelectorAll('.filter-tab');
  const productCards = document.querySelectorAll('.product-card');

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filterCategory = tab.getAttribute('data-filter');

      productCards.forEach(card => {
        const itemCategory = card.getAttribute('data-category');
        if (filterCategory === 'all' || itemCategory === filterCategory) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // 6. Product Inquiry Modal
  const inquiryModal = document.getElementById('inquiryModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalProductName = document.getElementById('modalProductName');
  const inquiryButtons = document.querySelectorAll('.btn-inquire-product');
  const modalProductHiddenInput = document.getElementById('modalProductItem');

  inquiryButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const productName = btn.getAttribute('data-product') || 'Scaffolding Material';
      if (modalProductName) modalProductName.innerText = productName;
      if (modalProductHiddenInput) modalProductHiddenInput.value = productName;
      if (inquiryModal) inquiryModal.classList.add('active');
    });
  });

  if (modalCloseBtn && inquiryModal) {
    modalCloseBtn.addEventListener('click', () => {
      inquiryModal.classList.remove('active');
    });

    inquiryModal.addEventListener('click', (e) => {
      if (e.target === inquiryModal) {
        inquiryModal.classList.remove('active');
      }
    });
  }

  // 7. Lightbox Gallery Viewer
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  const galleryCards = document.querySelectorAll('.gallery-card');

  galleryCards.forEach(card => {
    card.addEventListener('click', () => {
      const img = card.querySelector('img');
      if (img && lightboxImg && lightboxModal) {
        lightboxImg.src = img.src;
        lightboxModal.classList.add('active');
      }
    });
  });

  if (lightboxClose && lightboxModal) {
    lightboxClose.addEventListener('click', () => {
      lightboxModal.classList.remove('active');
    });

    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        lightboxModal.classList.remove('active');
      }
    });
  }

  // 8. FAQ Accordion
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    if (header) {
      header.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        faqItems.forEach(i => i.classList.remove('active'));
        if (!isActive) {
          item.classList.add('active');
        }
      });
    }
  });

  // 9. Toast Notification Helper
  function showToast(message) {
    let toast = document.getElementById('toastMsg');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toastMsg';
      toast.className = 'toast-msg';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<i class="fa-solid fa-circle-check" style="color: #FFB800; margin-right: 8px;"></i> ${message}`;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 4500);
  }

  // 10. Contact Form Submission (Main Contact Form)
  const contactForm = document.getElementById('mainContactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contactName')?.value || '';
      const phone = document.getElementById('contactPhone')?.value || '';
      const email = document.getElementById('contactEmail')?.value || '';
      const location = document.getElementById('contactLocation')?.value || '';
      const reqType = document.getElementById('contactReqType')?.value || '';
      const message = document.getElementById('contactMessage')?.value || '';

      const waText = `Hello DP Infra Solutions,%0A%0A*New Inquiry from Website:*%0A- *Name:* ${encodeURIComponent(name)}%0A- *Mobile:* ${encodeURIComponent(phone)}%0A- *Email:* ${encodeURIComponent(email)}%0A- *Site Location:* ${encodeURIComponent(location)}%0A- *Requirement:* ${encodeURIComponent(reqType)}%0A- *Message:* ${encodeURIComponent(message)}`;

      // Open synchronously: a delayed window.open loses the click and gets popup-blocked (esp. iPhone Safari)
      window.open(`https://wa.me/919275294224?text=${waText}`, '_blank');
      showToast("Thank you! Opening WhatsApp to send your requirement to DP Infra Solutions...");
      contactForm.reset();
    });
  }

  // 11. Modal Form Submission
  const modalForm = document.getElementById('modalInquiryForm');
  if (modalForm) {
    modalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const prod = document.getElementById('modalProductItem')?.value || 'Scaffolding';
      const name = document.getElementById('modalName')?.value || '';
      const phone = document.getElementById('modalPhone')?.value || '';
      const qty = document.getElementById('modalQty')?.value || 'Requirement details';
      const type = document.getElementById('modalType')?.value || 'Rent';

      const waText = `Hello DP Infra Solutions,%0A%0A*Product Inquiry:*%0A- *Product:* ${encodeURIComponent(prod)}%0A- *Deal Type:* ${encodeURIComponent(type)}%0A- *Quantity/Details:* ${encodeURIComponent(qty)}%0A- *Customer Name:* ${encodeURIComponent(name)}%0A- *Contact:* ${encodeURIComponent(phone)}`;

      window.open(`https://wa.me/919275294224?text=${waText}`, '_blank');
      showToast("Redirecting to WhatsApp to send product inquiry...");
      if (inquiryModal) inquiryModal.classList.remove('active');
      modalForm.reset();
    });
  }

  // 12. Escape key closes the quote modal and the lightbox
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (inquiryModal) inquiryModal.classList.remove('active');
    if (lightboxModal) lightboxModal.classList.remove('active');
  });
});

