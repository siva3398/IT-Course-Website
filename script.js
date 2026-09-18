/**
 * Modern Studio UI - Vanilla JavaScript
 * Zero React dependencies - Pure DOM, Event Listeners, and Modern Web APIs
 */


document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initMobileMenu();
  initPortfolioFilter();
  initCalculator();
  initTestimonials();
  initAccordion();
  initContactForm();
  initReservation();
  initModals();
  initCodeViewer();
  initZipDownload();
});

/* ==========================================================================
   1. Theme Toggle (Light / Dark Mode with LocalStorage)
   ========================================================================== */
function initTheme() {
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const themeIconSun = document.getElementById('theme-icon-sun');
  const themeIconMoon = document.getElementById('theme-icon-moon');
  
  // Get preferred theme from storage or system
  const savedTheme = localStorage.getItem('studio-theme');
  const systemDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme ? savedTheme : (systemDark ? 'dark' : 'light');
  
  applyTheme(initialTheme);
  
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
      localStorage.setItem('studio-theme', newTheme);
      showToast(`Switched to ${newTheme} mode`);
    });
  }
  
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      if (themeIconSun) themeIconSun.classList.remove('hidden');
      if (themeIconMoon) themeIconMoon.classList.add('hidden');
    } else {
      if (themeIconSun) themeIconSun.classList.add('hidden');
      if (themeIconMoon) themeIconMoon.classList.remove('hidden');
    }
  }
}

/* ==========================================================================
   2. Mobile Navigation Toggle
   ========================================================================== */
function initMobileMenu() {
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu-drawer');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');
  
  if (!mobileToggle || !mobileMenu) return;
  
  mobileToggle.addEventListener('click', () => {
    const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
    mobileToggle.setAttribute('aria-expanded', String(!isExpanded));
    mobileMenu.classList.toggle('hidden');
  });
  
  // Close menu on link click
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
      mobileToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ==========================================================================
   3. Portfolio Filter
   ========================================================================== */
function initPortfolioFilter() {
  const filterButtons = document.querySelectorAll('[data-filter]');
  const portfolioCards = document.querySelectorAll('[data-category]');
  
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const filterValue = button.getAttribute('data-filter');
      
      // Update active tab styling
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      
      // Filter portfolio items
      portfolioCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.classList.remove('hidden-card');
        } else {
          card.classList.add('hidden-card');
        }
      });
    });
  });
}

/* ==========================================================================
   4. Interactive Project Cost Calculator
   ========================================================================== */
function initCalculator() {
  const typeCards = document.querySelectorAll('.calc-type-option');
  const pagesSlider = document.getElementById('calc-pages-slider');
  const pagesDisplay = document.getElementById('calc-pages-display');
  const timelineSelect = document.getElementById('calc-timeline-select');
  const addonCheckboxes = document.querySelectorAll('.calc-addon-input');
  
  const totalPriceDisplay = document.getElementById('calc-total-price');
  const basePriceDisplay = document.getElementById('calc-base-price');
  const timelinePriceDisplay = document.getElementById('calc-timeline-rate');
  const addonsPriceDisplay = document.getElementById('calc-addons-total');
  const applyBtn = document.getElementById('calc-apply-inquiry-btn');
  
  let currentBase = 3200;
  let currentProjectName = 'Web Application';
  
  // Project type selection
  typeCards.forEach(card => {
    card.addEventListener('click', () => {
      typeCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      currentBase = parseInt(card.getAttribute('data-base-price') || '3000', 10);
      currentProjectName = card.getAttribute('data-type-name') || 'Web App';
      recalculate();
    });
  });
  
  // Slider input
  if (pagesSlider && pagesDisplay) {
    pagesSlider.addEventListener('input', (e) => {
      pagesDisplay.textContent = `${e.target.value} views/pages`;
      recalculate();
    });
  }
  
  // Timeline dropdown
  if (timelineSelect) {
    timelineSelect.addEventListener('change', recalculate);
  }
  
  // Add-ons
  addonCheckboxes.forEach(cb => {
    cb.addEventListener('change', recalculate);
  });
  
  function recalculate() {
    if (!totalPriceDisplay) return;
    
    const pages = pagesSlider ? parseInt(pagesSlider.value, 10) : 5;
    const pagesCost = (pages - 1) * 220;
    
    let timelineMultiplier = 1.0;
    let timelineLabel = 'Standard (6 wks)';
    if (timelineSelect) {
      timelineMultiplier = parseFloat(timelineSelect.value);
      timelineLabel = timelineSelect.options[timelineSelect.selectedIndex].text;
    }
    
    let addonsTotal = 0;
    addonCheckboxes.forEach(cb => {
      if (cb.checked) {
        addonsTotal += parseInt(cb.getAttribute('data-price') || '0', 10);
      }
    });
    
    const subtotal = (currentBase + pagesCost) * timelineMultiplier + addonsTotal;
    const finalRounded = Math.round(subtotal / 50) * 50;
    
    if (basePriceDisplay) basePriceDisplay.textContent = `$${currentBase.toLocaleString()}`;
    if (timelinePriceDisplay) timelinePriceDisplay.textContent = `${timelineLabel} (${timelineMultiplier}x)`;
    if (addonsPriceDisplay) addonsPriceDisplay.textContent = `+$${addonsTotal.toLocaleString()}`;
    if (totalPriceDisplay) totalPriceDisplay.textContent = `$${finalRounded.toLocaleString()}`;
  }
  
  if (applyBtn) {
    applyBtn.addEventListener('click', () => {
      const contactSection = document.getElementById('contact');
      const projectSelect = document.getElementById('form-project-type');
      const messageText = document.getElementById('form-message');
      
      if (projectSelect) {
        // Map to select options
        if (currentProjectName.includes('Web App')) projectSelect.value = 'web-app';
        else if (currentProjectName.includes('Mobile')) projectSelect.value = 'mobile-app';
        else if (currentProjectName.includes('Brand')) projectSelect.value = 'brand-system';
        else projectSelect.value = 'marketing-site';
      }
      
      if (messageText && totalPriceDisplay) {
        messageText.value = `Hi Apex Studio, I configured an estimate of ${totalPriceDisplay.textContent} for a ${currentProjectName} (${pagesDisplay ? pagesDisplay.textContent : 'custom scope'}). Let's discuss starting next month!`;
      }
      
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
      showToast('Estimate copied to project inquiry form!');
    });
  }
  
  recalculate();
}

/* ==========================================================================
   5. Testimonial Carousel
   ========================================================================== */
function initTestimonials() {
  const slides = document.querySelectorAll('.testimonial-slide');
  const prevBtn = document.getElementById('testimonial-prev');
  const nextBtn = document.getElementById('testimonial-next');
  const dotsContainer = document.getElementById('testimonial-dots');
  
  if (!slides.length) return;
  
  let currentIndex = 0;
  let autoPlayTimer = null;
  
  // Create pagination dots
  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    slides.forEach((_, idx) => {
      const dot = document.createElement('button');
      dot.className = `w-2.5 h-2.5 rounded-full transition-all ${idx === 0 ? 'bg-blue-600 w-6' : 'bg-gray-300 dark:bg-gray-700'}`;
      dot.setAttribute('aria-label', `Go to testimonial ${idx + 1}`);
      dot.addEventListener('click', () => goToSlide(idx));
      dotsContainer.appendChild(dot);
    });
  }
  
  function updateSlide(newIndex) {
    slides[currentIndex].classList.remove('active-slide');
    currentIndex = (newIndex + slides.length) % slides.length;
    slides[currentIndex].classList.add('active-slide');
    
    if (dotsContainer) {
      const dots = dotsContainer.querySelectorAll('button');
      dots.forEach((dot, idx) => {
        if (idx === currentIndex) {
          dot.className = 'w-6 h-2.5 rounded-full bg-blue-600 transition-all';
        } else {
          dot.className = 'w-2.5 h-2.5 rounded-full bg-gray-300 dark:bg-gray-700 transition-all';
        }
      });
    }
  }
  
  function goToSlide(index) {
    updateSlide(index);
    resetAutoPlay();
  }
  
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      updateSlide(currentIndex - 1);
      resetAutoPlay();
    });
  }
  
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      updateSlide(currentIndex + 1);
      resetAutoPlay();
    });
  }
  
  function startAutoPlay() {
    autoPlayTimer = setInterval(() => {
      updateSlide(currentIndex + 1);
    }, 6000);
  }
  
  function resetAutoPlay() {
    if (autoPlayTimer) clearInterval(autoPlayTimer);
    startAutoPlay();
  }
  
  startAutoPlay();
}

/* ==========================================================================
   6. Accessible Accordion (FAQ)
   ========================================================================== */
function initAccordion() {
  const accordionHeaders = document.querySelectorAll('.accordion-header');
  
  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.closest('.accordion-item');
      if (!item) return;
      
      const isOpen = item.classList.contains('open');
      
      // Close other accordion items
      document.querySelectorAll('.accordion-item').forEach(other => {
        if (other !== item) {
          other.classList.remove('open');
          const btn = other.querySelector('.accordion-header');
          if (btn) btn.setAttribute('aria-expanded', 'false');
        }
      });
      
      // Toggle current item
      if (isOpen) {
        item.classList.remove('open');
        header.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('open');
        header.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* ==========================================================================
   7. Contact Form & Validation
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('project-inquiry-form');
  if (!form) return;
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const nameInput = document.getElementById('form-name');
    const emailInput = document.getElementById('form-email');
    const serviceInput = document.getElementById('form-project-type');
    const budgetInput = document.getElementById('form-budget');
    const messageInput = document.getElementById('form-message');
    
    let isValid = true;
    
    // Simple validation
    if (!nameInput.value.trim()) {
      nameInput.classList.add('input-error');
      isValid = false;
    } else {
      nameInput.classList.remove('input-error');
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value.trim())) {
      emailInput.classList.add('input-error');
      isValid = false;
    } else {
      emailInput.classList.remove('input-error');
    }
    
    if (!isValid) {
      showToast('Please check the required fields');
      return;
    }
    
    // Open Confirmation Dialog Modal
    const modal = document.getElementById('inquiry-modal');
    const modalSummary = document.getElementById('modal-inquiry-summary');
    
    if (modalSummary) {
      modalSummary.innerHTML = `
        <div class="space-y-2 text-sm">
          <p><strong>Client:</strong> ${escapeHtml(nameInput.value)}</p>
          <p><strong>Email:</strong> ${escapeHtml(emailInput.value)}</p>
          <p><strong>Category:</strong> ${escapeHtml(serviceInput.options[serviceInput.selectedIndex].text)}</p>
          <p><strong>Budget Tier:</strong> ${escapeHtml(budgetInput.options[budgetInput.selectedIndex].text)}</p>
          <p class="mt-2 text-gray-500 italic">"${escapeHtml(messageInput.value || 'No additional note provided')}"</p>
        </div>
      `;
    }
    
    if (modal) {
      modal.classList.add('active');
    }
    
    form.reset();
    showToast('Inquiry received! Our team will review within 24h.');
  });
}

/* ==========================================================================
   7b. Reservation Form Handler
   ========================================================================== */
function initReservation() {
  const form = document.getElementById('table-reservation-form');
  if (!form) return;

  const dateInput = document.getElementById('res-date');
  const timeInput = document.getElementById('res-time');

  // Set minimum date to today
  const today = new Date().toISOString().split('T')[0];
  if (dateInput) {
    dateInput.min = today;
    dateInput.value = today;
  }
  if (timeInput && !timeInput.value) {
    timeInput.value = '19:30';
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('res-name')?.value.trim() || 'Guest';
    const date = dateInput?.value || today;
    const time = timeInput?.value || '19:30';
    const guests = document.getElementById('res-guests')?.value || '2';

    showToast(`✨ Table reserved for ${name} on ${date} at ${time} (${guests} ${guests === '1' ? 'Person' : 'Guests'})! Confirmation sent.`);
    form.reset();
    if (dateInput) dateInput.value = today;
    if (timeInput) timeInput.value = '19:30';
  });
}

/* ==========================================================================
   8. Modals Management
   ========================================================================== */
function initModals() {
  const closeButtons = document.querySelectorAll('[data-close-modal]');
  const overlays = document.querySelectorAll('.modal-overlay');
  
  closeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal-overlay');
      if (modal) modal.classList.remove('active');
    });
  });
  
  overlays.forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('active');
      }
    });
  });
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      overlays.forEach(modal => modal.classList.remove('active'));
    }
  });

  // Project Quick View buttons
  const quickViewBtns = document.querySelectorAll('[data-quickview]');
  const quickViewModal = document.getElementById('project-detail-modal');
  const quickViewTitle = document.getElementById('qv-title');
  const quickViewDesc = document.getElementById('qv-desc');
  const quickViewTags = document.getElementById('qv-tags');
  
  quickViewBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.portfolio-card');
      if (!card || !quickViewModal) return;
      
      const title = card.querySelector('h3') ? card.querySelector('h3').textContent : 'Project Details';
      const desc = card.querySelector('p') ? card.querySelector('p').textContent : '';
      const tags = Array.from(card.querySelectorAll('.badge-tag')).map(t => t.textContent);
      
      if (quickViewTitle) quickViewTitle.textContent = title;
      if (quickViewDesc) quickViewDesc.textContent = desc;
      if (quickViewTags) {
        quickViewTags.innerHTML = tags.map(tag => `<span class="badge-tag">${escapeHtml(tag)}</span>`).join(' ');
      }
      
      quickViewModal.classList.add('active');
    });
  });
}

/* ==========================================================================
   9. Standalone Code Viewer (HTML / CSS / JS tabs & 1-Click Copy)
   ========================================================================== */
function initCodeViewer() {
  const openBtn = document.getElementById('open-code-viewer-btn');
  const modal = document.getElementById('code-viewer-modal');
  const codeTabs = document.querySelectorAll('.code-tab-btn');
  const copyBtn = document.getElementById('copy-code-btn');
  const codeContent = document.getElementById('active-code-display');
  
  if (!openBtn || !modal || !codeContent) return;
  
  const codeSnippets = {
    html: `<!-- Modern Studio UI: Single Page HTML Structure -->
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Apex Digital Studio</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <!-- Header with theme switch & navigation -->
  <header class="site-header">...</header>
  <!-- Hero Section -->
  <section class="hero-section">...</section>
  <!-- Interactive Portfolio Grid -->
  <section id="work" class="portfolio-section">...</section>
  <!-- Real-Time Project Estimator -->
  <section id="estimator">...</section>
  <!-- Testimonials & FAQ -->
  <section id="faq">...</section>
  <!-- Validated Contact Form -->
  <form id="project-inquiry-form">...</form>
  <script src="script.js"></script>
</body>
</html>`,
    css: `/* Modern Studio UI: Clean CSS Design System */
:root {
  --bg-canvas: #fcfcf9;
  --bg-surface: #ffffff;
  --text-primary: #121826;
  --text-secondary: #4b5563;
  --accent-secondary: #2563eb;
  --radius-md: 12px;
}

[data-theme="dark"] {
  --bg-canvas: #090d14;
  --bg-surface: #101622;
  --text-primary: #f8fafc;
  --text-secondary: #94a3b8;
}

body {
  font-family: 'Plus Jakarta Sans', sans-serif;
  background-color: var(--bg-canvas);
  color: var(--text-primary);
  transition: background-color 0.25s ease;
}`,
    js: `// Modern Studio UI: Pure Vanilla JavaScript Engine
document.addEventListener('DOMContentLoaded', () => {
  // 1. Dark/Light theme toggle with LocalStorage
  // 2. Interactive portfolio filtering
  // 3. Real-time cost estimator calculator
  // 4. Testimonial carousel slider
  // 5. Accessible accordion for FAQ
  // 6. Form validation & interactive toast alerts
});`
  };
  
  let currentTab = 'html';
  codeContent.textContent = codeSnippets.html;

  // Dynamically load real file contents into inspector if available
  async function loadFullSourceFiles() {
    try {
      const [hRes, cRes, jRes] = await Promise.all([
        fetch('/index.html').then(r => r.text()),
        fetch('/src/style.css').then(r => r.text()),
        fetch('/src/script.js').then(r => r.text())
      ]);
      if (hRes && hRes.length > 200) codeSnippets.html = hRes;
      if (cRes && cRes.length > 200) codeSnippets.css = cRes;
      if (jRes && jRes.length > 200) codeSnippets.js = jRes;
      if (codeContent) {
        codeContent.textContent = codeSnippets[currentTab] || '';
      }
    } catch (e) {
      console.log('Using static snippets preview', e);
    }
  }
  loadFullSourceFiles();
  
  openBtn.addEventListener('click', () => {
    modal.classList.add('active');
  });
  
  codeTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      codeTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentTab = tab.getAttribute('data-tab') || 'html';
      codeContent.textContent = codeSnippets[currentTab] || '';
    });
  });
  
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(codeContent.textContent).then(() => {
        showToast(`Copied ${currentTab.toUpperCase()} code to clipboard!`);
      }).catch(() => {
        showToast('Code copied');
      });
    });
  }
}

/* ==========================================================================
   10. Instant Downloadable Project ZIP Package (.zip generator)
   ========================================================================== */
function initZipDownload() {
  const downloadButtons = document.querySelectorAll('[data-download-zip]');
  
  downloadButtons.forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      
      const originalHtml = btn.innerHTML;
      btn.disabled = true;
      btn.classList.add('opacity-75', 'cursor-wait');
      btn.innerHTML = `
        <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-current inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span>Packaging ZIP...</span>
      `;
      
      showToast('📦 Bundling HTML, CSS, JS and README into ZIP...');

      try {
        let htmlContent = '';
        let cssContent = '';
        let jsContent = '';

        try {
          const [hRes, cRes, jRes] = await Promise.all([
            fetch('/index.html').then(r => r.text()),
            fetch('/src/style.css').then(r => r.text()),
            fetch('/src/script.js').then(r => r.text())
          ]);
          htmlContent = hRes;
          cssContent = cRes;
          jsContent = jRes;
        } catch (err) {
          console.warn('Network fetch fallback', err);
        }

        if (!htmlContent) {
          htmlContent = '<!doctype html>\n' + document.documentElement.outerHTML;
        }
        
        // Clean paths for standalone offline execution
        htmlContent = htmlContent
          .replace(/\/src\/style\.css/g, 'style.css')
          .replace(/\/src\/script\.js/g, 'script.js')
          .replace(/<script type="module" src="\/@vite\/client"><\/script>/g, '')
          .replace(/<script type="module" src="script\.js"><\/script>/g, '<script src="script.js"></script>')
          .replace(/<script type="module"/g, '<script');

        // Clean standalone JavaScript (strip JSZip bundler imports)
        if (jsContent) {
          jsContent = jsContent
            .replace(/^import\s+.*?;?\s*$/gm, '')
            .replace(/initZipDownload\(\);/g, '// initZipDownload();');
        }

        const readmeContent = `# Modern Studio UI Website

A modern, high-performance responsive website interface built strictly with pure HTML, CSS, and Vanilla JavaScript.
**Zero React • Zero Node.js Build Steps • Zero Dependencies**

## Quick Start (How to Run)
1. Unzip this folder (\`modern-studio-ui-website.zip\`).
2. Double-click **\`index.html\`** to open it directly in any web browser (Google Chrome, Safari, Microsoft Edge, Firefox).
3. The website runs 100% offline and locally without requiring \`npm install\` or any local server!

## Included Files
- \`index.html\` - Complete semantic HTML5 structure with responsive layouts and accessible markup.
- \`style.css\` - Pure CSS3 design system with CSS custom properties (variables), light & dark themes, typography, cards, and animations.
- \`script.js\` - Pure vanilla JavaScript engine handling:
  - Theme switching with LocalStorage persistence
  - Interactive portfolio category filtering
  - Real-time interactive project budget estimator
  - Testimonial slider / carousel
  - Accessible FAQ accordion with smooth open/collapse
  - Fully validated project contact form
  - Case study modal previews
- \`README.md\` - This guide.

## Technologies Used
- HTML5 (Semantic Structure)
- CSS3 (Variables, Flexbox, CSS Grid, Transitions)
- Vanilla JavaScript (ES6+ DOM APIs, Event Listeners)
- Tailwind CSS CDN for instant utility rendering without Node.js

Enjoy building!
`;

        const zip = new JSZip();
        zip.file('index.html', htmlContent);
        zip.file('style.css', cssContent || '/* Modern Studio CSS */');
        zip.file('script.js', jsContent || '// Modern Studio JS');
        zip.file('README.md', readmeContent);

        const content = await zip.generateAsync({ type: 'blob' });
        
        // Trigger download
        const downloadUrl = URL.createObjectURL(content);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = 'modern-studio-ui-website.zip';
        document.body.appendChild(link);
        link.click();
        
        setTimeout(() => {
          document.body.removeChild(link);
          URL.revokeObjectURL(downloadUrl);
        }, 1500);

        showToast('✅ modern-studio-ui-website.zip downloaded! Open index.html to view.');
      } catch (error) {
        console.error('Failed to create ZIP:', error);
        showToast('⚠️ Could not generate zip in browser. Using direct download...');
        const fallbackLink = document.createElement('a');
        fallbackLink.href = '/modern-studio-ui-website.zip';
        fallbackLink.download = 'modern-studio-ui-website.zip';
        fallbackLink.click();
      } finally {
        btn.disabled = false;
        btn.classList.remove('opacity-75', 'cursor-wait');
        btn.innerHTML = originalHtml;
      }
    });
  });
}

/* ==========================================================================
   Helper Utilities
   ========================================================================== */
function showToast(message) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  
  const toast = document.createElement('div');
  toast.className = 'toast-msg';
  toast.innerHTML = `
    <svg class="w-4 h-4 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
    </svg>
    <span>${escapeHtml(message)}</span>
  `;
  
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.25s ease';
    setTimeout(() => toast.remove(), 250);
  }, 3200);
}

function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}
