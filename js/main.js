/**
 * ANUBHAV SHARMA - PORTFOLIO INTERACTION ENGINE
 * Real-Life Smooth Working Animations & Dynamic Features
 */

document.addEventListener('DOMContentLoaded', () => {
  initAmbientCanvas();
  initThemeToggle();
  initNavigation();
  initScrollReveal();
  initTiltCards();
  initProjectFilters();
  initContactForm();
});

/* ==========================================================================
   1. AMBIENT BACKGROUND CANVAS
   ========================================================================== */
function initAmbientCanvas() {
  const canvas = document.getElementById('ambient-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  let width, height;
  let particles = [];
  const particleCount = 28;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.radius = Math.random() * 2.2 + 0.8;
      this.speedX = (Math.random() - 0.5) * 0.45;
      this.speedY = (Math.random() - 0.5) * 0.45;
      this.alpha = Math.random() * 0.35 + 0.1;
      this.color = Math.random() > 0.5 ? '56, 189, 248' : '129, 140, 248';
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x < 0 || this.x > width) this.speedX *= -1;
      if (this.y < 0 || this.y > height) this.speedY *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(' + this.color + ', ' + this.alpha + ')';
      ctx.shadowBlur = 10;
      ctx.shadowColor = 'rgba(' + this.color + ', 0.5)';
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    const isDark = document.body.getAttribute('data-theme') !== 'light';
    const glow1 = ctx.createRadialGradient(width * 0.2, height * 0.3, 20, width * 0.2, height * 0.3, 400);
    glow1.addColorStop(0, isDark ? 'rgba(56, 189, 248, 0.04)' : 'rgba(56, 189, 248, 0.02)');
    glow1.addColorStop(1, 'transparent');
    ctx.fillStyle = glow1;
    ctx.fillRect(0, 0, width, height);

    const glow2 = ctx.createRadialGradient(width * 0.8, height * 0.7, 20, width * 0.8, height * 0.7, 450);
    glow2.addColorStop(0, isDark ? 'rgba(129, 140, 248, 0.04)' : 'rgba(129, 140, 248, 0.02)');
    glow2.addColorStop(1, 'transparent');
    ctx.fillStyle = glow2;
    ctx.fillRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = 'rgba(56, 189, 248, ' + (0.12 * (1 - dist / 120)) + ')';
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }

    particles.forEach(p => {
      p.update();
      p.draw();
    });

    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   2. THEME SWITCHER (DARK / LIGHT)
   ========================================================================== */
function initThemeToggle() {
  const themeToggle = document.getElementById('theme-toggle');
  if (!themeToggle) return;

  const savedTheme = localStorage.getItem('as-portfolio-theme') || 'dark';
  document.body.setAttribute('data-theme', savedTheme);

  themeToggle.addEventListener('click', () => {
    const currentTheme = document.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('as-portfolio-theme', newTheme);
    showToast('Switched to ' + newTheme + ' mode');
  });
}

/* ==========================================================================
   3. NAVIGATION & SCROLLSPY
   ========================================================================== */
function initNavigation() {
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-link');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
      });
    });
  }

  window.addEventListener('scroll', () => {
    let scrollY = window.pageYOffset;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + sectionId) {
            link.classList.add('active');
          }
        });
      }
    });
  });
}

/* ==========================================================================
   4. SCROLL REVEAL ANIMATIONS
   ========================================================================== */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll');

  revealElements.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top > window.innerHeight) {
      el.classList.add('animate-ready');
    }
  });

  function checkReveal() {
    revealElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.92) {
        el.classList.remove('animate-ready');
        el.classList.add('revealed');
      }
    });
  }

  checkReveal();
  window.addEventListener('scroll', checkReveal);
}

/* ==========================================================================
   5. 3D TILT EFFECT ON CARDS
   ========================================================================== */
function initTiltCards() {
  const cards = document.querySelectorAll('.tilt-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -7;
      const rotateY = ((x - centerX) / centerX) * 7;

      card.style.transform = 'perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) scale3d(1.02, 1.02, 1.02)';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      card.style.transition = 'transform 0.5s ease';
    });

    card.addEventListener('mouseenter', () => {
      card.style.transition = 'none';
    });
  });
}

/* ==========================================================================
   6. PROJECT CATEGORY FILTERS
   ========================================================================== */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const categories = card.getAttribute('data-category') || '';
        
        if (filterValue === 'all' || categories.indexOf(filterValue) !== -1) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px) scale(0.96)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

/* ==========================================================================
   7. CASE STUDY MODAL DATA & VIEWER
   ========================================================================== */
const projectData = {
  sharma: {
    title: "Sharma's Restaurant",
    category: "Branding & Packaging",
    description: "Sharma's Restaurant is an authentic vegetarian dining destination. The creative objective was to blend timeless Indian hospitality aesthetics with modern, clean packaging and typography.",
    image: "assets/images/sharma-case-study.svg",
    client: "Sharma Hospitality Group",
    role: "Brand Identity, Packaging, Print Collateral",
    timeline: "2 Weeks",
    process: [
      { num: "01", title: "Problem", desc: "Define authentic brand tone for a discerning modern vegetarian audience." },
      { num: "02", title: "Concept", desc: "Golden wheat motifs, organic kraft textures, and royal heritage green." },
      { num: "03", title: "Design", desc: "Crafted brandmark, takeaway kraft bags, dine-in menu, and coasters." },
      { num: "04", title: "Final Result", desc: "Unified brand system that boosted customer recognition and dine-in appeal." }
    ]
  },
  nisha: {
    title: "Nisha Saree Showroom",
    category: "Social Media Design & Creative Direction",
    description: "Crafted high-converting, festive social media creative campaigns highlighting bridal silk collections, traditional motifs, and luxury store offerings.",
    image: "assets/images/demo-saree.jpg",
    client: "Nisha Ethnic Wear",
    role: "Social Media Creatives, Layouts, Motion Posts",
    timeline: "Ongoing",
    process: [
      { num: "01", title: "Research", desc: "Analyze festive fashion trends and target bridal demographic." },
      { num: "02", title: "Visual Style", desc: "Rich crimson silk palettes with ornate golden borders and typography." },
      { num: "03", title: "Production", desc: "Design multi-slide Instagram carousels and festive sale posters." },
      { num: "04", title: "Outcome", desc: "45% increase in engagement and walk-in showroom inquiries." }
    ]
  },
  edumont: {
    title: "EduMont CPA",
    category: "Social Media Campaign & Ad Creative",
    description: "Executive digital marketing banner suite promoting international CPA certification programs for finance professionals across corporate channels.",
    image: "assets/images/demo-edumont.jpg",
    client: "EduMont Global Education",
    role: "Marketing Visuals & Performance Creatives",
    timeline: "3 Weeks",
    process: [
      { num: "01", title: "Objective", desc: "Communicate prestige, credibility, and 100% placement support." },
      { num: "02", title: "Aesthetics", desc: "Corporate deep navy blue with luminous cyan neon highlights." },
      { num: "03", title: "Ad Suite", desc: "Multi-platform banners for LinkedIn, Instagram ads, and web display." },
      { num: "04", title: "Impact", desc: "Generated 3x increase in qualified admissions inquiries." }
    ]
  },
  hoodie: {
    title: "Hoodie Poster",
    category: "Print Design & Merchandise",
    description: "Streetwear graphics and apparel typography collection focused on minimalist typography and modern urban apparel aesthetics.",
    image: "assets/images/demo-hoodie.jpg",
    client: "Streetwear Concept",
    role: "Merchandise Design & Print Ready Vector Files",
    timeline: "1 Week",
    process: [
      { num: "01", title: "Concept", desc: "Bold monochrome urban youth culture themes." },
      { num: "02", title: "Typography", desc: "Distressed heavyweight sans-serif lettering." },
      { num: "03", title: "Mockup", desc: "Realistic print scaling on heavyweight cotton fabric." },
      { num: "04", title: "Result", desc: "Ready-to-manufacture vector screen printing specifications." }
    ]
  },
  portfolio: {
    title: "Portfolio Website",
    category: "Web Design & UI/UX",
    description: "Sleek, responsive dark-mode portfolio interface designed for modern creatives, featuring custom micro-animations and intuitive layout systems.",
    image: "assets/images/demo-portfolio.jpg",
    client: "Personal Showcase",
    role: "UI/UX, Visual Design, HTML/CSS/JS",
    timeline: "1 Week",
    process: [
      { num: "01", title: "Wireframing", desc: "Structure high-conversion sections for work and credentials." },
      { num: "02", title: "UI System", desc: "Dark glassmorphic surfaces with electric cyan accents." },
      { num: "03", title: "Animation", desc: "Smooth scroll, 3D card tilts, and ambient canvas particle mesh." },
      { num: "04", title: "Launch", desc: "Lighthouse 100 score responsive web portfolio." }
    ]
  },
  logofolio: {
    title: "Logofolio",
    category: "Brand Identity & Logo Design",
    description: "A curated collection of distinctive geometric vector logomarks created for emerging startups, fashion labels, and modern tech ventures.",
    image: "assets/images/demo-logofolio.jpg",
    client: "Various Startup Clients",
    role: "Brand Identity & Monogram Crafting",
    timeline: "Curated 2024-2025",
    process: [
      { num: "01", title: "Ideation", desc: "Extensive sketching and shape exploration." },
      { num: "02", title: "Grid System", desc: "Mathematical geometry, golden ratio curves, and balance." },
      { num: "03", title: "Versatility", desc: "Tested across monochrome, favicon, embroidery, and billboard." },
      { num: "04", title: "Delivery", desc: "Comprehensive brand guideline packages." }
    ]
  }
};

window.openCaseStudy = function(projectId) {
  const data = projectData[projectId] || projectData.sharma;
  const modal = document.getElementById('case-study-modal');
  const content = document.getElementById('modal-content');
  if (!modal || !content) return;

  let processHtml = '';
  data.process.forEach(function(step) {
    processHtml += '<div class="process-step">' +
      '<div class="step-num">' + step.num + '</div>' +
      '<div class="step-title">' + step.title + '</div>' +
      '<p class="step-desc">' + step.desc + '</p>' +
    '</div>';
  });

  content.innerHTML = '<div class="modal-hero-split">' +
    '<div>' +
      '<h2 class="modal-title">' + data.title + '</h2>' +
      '<p class="modal-tag">' + data.category + '</p>' +
      '<p class="modal-desc">' + data.description + '</p>' +
      '<div style="display: flex; gap: 1.5rem; margin-bottom: 1.5rem; flex-wrap: wrap;">' +
        '<div><small style="color: var(--text-muted); display: block;">Client</small><strong>' + data.client + '</strong></div>' +
        '<div><small style="color: var(--text-muted); display: block;">Role</small><strong>' + data.role + '</strong></div>' +
        '<div><small style="color: var(--text-muted); display: block;">Timeline</small><strong>' + data.timeline + '</strong></div>' +
      '</div>' +
      '<a href="#contact" onclick="closeCaseStudy()" class="btn btn-primary">' +
        'Inquire About Similar Project <i class="fa-solid fa-arrow-right-long"></i>' +
      '</a>' +
    '</div>' +
    '<div class="modal-media-showcase">' +
      '<img src="' + data.image + '" alt="' + data.title + '" class="modal-showcase-img">' +
    '</div>' +
  '</div>' +
  '<div>' +
    '<h3 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 0.5rem;">The Creative Process</h3>' +
    '<div class="process-grid">' + processHtml + '</div>' +
  '</div>';

  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
};

window.closeCaseStudy = function() {
  const modal = document.getElementById('case-study-modal');
  if (modal) {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }
};

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeCaseStudy();
});

document.getElementById('case-study-modal')?.addEventListener('click', (e) => {
  if (e.target.id === 'case-study-modal') closeCaseStudy();
});

/* ==========================================================================
   8. CONTACT FORM & INTERACTIONS
   ========================================================================== */
function initContactForm() {
  const magneticBtns = document.querySelectorAll('.magnetic-btn');
  magneticBtns.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = 'translate(' + (x * 0.2) + 'px, ' + (y * 0.2) + 'px)';
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0, 0)';
    });
  });
}

window.handleContactSubmit = function(e) {
  e.preventDefault();
  const form = document.getElementById('contact-form');
  const btn = document.getElementById('submit-btn');
  const name = document.getElementById('name').value;

  btn.disabled = true;
  const originalHtml = btn.innerHTML;
  btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Sending message...';

  setTimeout(() => {
    btn.disabled = false;
    btn.innerHTML = originalHtml;
    form.reset();
    showToast('Thank you ' + name + '! Your message has been sent.');
  }, 1200);
};

window.copyContact = function(text, event) {
  if (event) {
    event.stopPropagation();
    event.preventDefault();
  }
  navigator.clipboard.writeText(text).then(() => {
    showToast('Copied ' + text + ' to clipboard!');
  }).catch(() => {
    showToast('Email: ' + text);
  });
};

/* ==========================================================================
   9. TOAST NOTIFICATION
   ========================================================================== */
function showToast(message) {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-message');
  if (!toast || !toastMsg) return;

  toastMsg.textContent = message;
  toast.classList.remove('hidden');

  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => {
    toast.classList.add('hidden');
  }, 3500);
}