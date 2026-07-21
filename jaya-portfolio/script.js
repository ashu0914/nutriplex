/* ============================================================
   JAYA YADAV — BIZ PORTFOLIO JAVASCRIPT
   Three.js 3D Element, Scroll Animations, Interactivity
   MOBILE OPTIMIZED VERSION
   ============================================================ */

// ─── DEVICE DETECTION ───────────────────────────────────────
const isTouchDevice = () => {
  return (('ontouchstart' in window) ||
     (navigator.maxTouchPoints > 0) ||
     (navigator.msMaxTouchPoints > 0));
};

const isMobile = () => window.innerWidth <= 768;

// ─── SIMPLEX NOISE (Compact 3D Implementation) ────────────────
const SimplexNoise = (() => {
  const F3 = 1.0 / 3.0, G3 = 1.0 / 6.0;
  const grad3 = [
    [1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],
    [1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],
    [0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]
  ];
  const perm = new Uint8Array(512);
  const p = [];
  for (let i = 0; i < 256; i++) p[i] = i;
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [p[i], p[j]] = [p[j], p[i]];
  }
  for (let i = 0; i < 512; i++) perm[i] = p[i & 255];

  function dot3(g, x, y, z) { return g[0]*x + g[1]*y + g[2]*z; }

  return function noise3D(xin, yin, zin) {
    let n0, n1, n2, n3;
    const s = (xin + yin + zin) * F3;
    const i = Math.floor(xin + s);
    const j = Math.floor(yin + s);
    const k = Math.floor(zin + s);
    const t = (i + j + k) * G3;
    const x0 = xin - (i - t);
    const y0 = yin - (j - t);
    const z0 = zin - (k - t);
    let i1, j1, k1, i2, j2, k2;
    if (x0 >= y0) {
      if (y0 >= z0) { i1=1;j1=0;k1=0;i2=1;j2=1;k2=0; }
      else if (x0 >= z0) { i1=1;j1=0;k1=0;i2=1;j2=0;k2=1; }
      else { i1=0;j1=0;k1=1;i2=1;j2=0;k2=1; }
    } else {
      if (y0 < z0) { i1=0;j1=0;k1=1;i2=0;j2=1;k2=1; }
      else if (x0 < z0) { i1=0;j1=1;k1=0;i2=0;j2=1;k2=1; }
      else { i1=0;j1=1;k1=0;i2=1;j2=1;k2=0; }
    }
    const x1 = x0 - i1 + G3, y1 = y0 - j1 + G3, z1 = z0 - k1 + G3;
    const x2 = x0 - i2 + 2*G3, y2 = y0 - j2 + 2*G3, z2 = z0 - k2 + 2*G3;
    const x3 = x0 - 1 + 3*G3, y3 = y0 - 1 + 3*G3, z3 = z0 - 1 + 3*G3;
    const ii = i & 255, jj = j & 255, kk = k & 255;
    let t0 = 0.6 - x0*x0 - y0*y0 - z0*z0;
    n0 = t0 < 0 ? 0 : (t0 *= t0, t0 * t0 * dot3(grad3[perm[ii+perm[jj+perm[kk]]] % 12], x0, y0, z0));
    let t1 = 0.6 - x1*x1 - y1*y1 - z1*z1;
    n1 = t1 < 0 ? 0 : (t1 *= t1, t1 * t1 * dot3(grad3[perm[ii+i1+perm[jj+j1+perm[kk+k1]]] % 12], x1, y1, z1));
    let t2 = 0.6 - x2*x2 - y2*y2 - z2*z2;
    n2 = t2 < 0 ? 0 : (t2 *= t2, t2 * t2 * dot3(grad3[perm[ii+i2+perm[jj+j2+perm[kk+k2]]] % 12], x2, y2, z2));
    let t3 = 0.6 - x3*x3 - y3*y3 - z3*z3;
    n3 = t3 < 0 ? 0 : (t3 *= t3, t3 * t3 * dot3(grad3[perm[ii+1+perm[jj+1+perm[kk+1]]] % 12], x3, y3, z3));
    return 32 * (n0 + n1 + n2 + n3);
  };
})();

// ─── THREE.JS 3D BLOB ───────────────────────────────────────
const initThreeJS = () => {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) {
    console.warn('Three.js canvas not found');
    return;
  }

  // Skip Three.js on mobile for performance
  if (isMobile()) {
    console.log('Mobile detected: Three.js blob disabled for performance');
    canvas.style.display = 'none';
    return;
  }

  if (typeof THREE === 'undefined') {
    console.warn('THREE.js not loaded. Loading from CDN...');
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
    script.onload = () => {
      console.log('THREE.js loaded, initializing...');
      initThreeJS();
    };
    document.head.appendChild(script);
    return;
  }

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.z = 5;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const ambientLight = new THREE.AmbientLight(0xA3B18A, 1.0);
  scene.add(ambientLight);

  const dirLight1 = new THREE.DirectionalLight(0xFEFAE0, 1.2);
  dirLight1.position.set(3, 4, 5);
  scene.add(dirLight1);

  const dirLight2 = new THREE.DirectionalLight(0xE8C4C4, 0.8);
  dirLight2.position.set(-4, -2, 3);
  scene.add(dirLight2);

  const pointLight = new THREE.PointLight(0x8B9E7E, 1.2, 15);
  pointLight.position.set(0, 0, 4);
  scene.add(pointLight);

  const geometry = new THREE.IcosahedronGeometry(3.2, 5);
  const material = new THREE.MeshPhongMaterial({
    color: 0x4A6741,
    emissive: 0x1a2a15,
    emissiveIntensity: 0.15,
    shininess: 90,
    transparent: true,
    opacity: 0.92,
    side: THREE.DoubleSide,
  });

  const blob = new THREE.Mesh(geometry, material);
  scene.add(blob);

  const wireGeometry = new THREE.IcosahedronGeometry(3.4, 4);
  const wireMaterial = new THREE.MeshBasicMaterial({
    color: 0x2D3436,
    wireframe: true,
    transparent: true,
    opacity: 0.25,
  });
  const wireBlob = new THREE.Mesh(wireGeometry, wireMaterial);
  scene.add(wireBlob);

  const posAttr = geometry.attributes.position;
  const origPositions = new Float32Array(posAttr.array);
  const wirePosAttr = wireGeometry.attributes.position;
  const wireOrigPositions = new Float32Array(wirePosAttr.array);

  const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  const clock = new THREE.Clock();

  const updateBlobPosition = () => {
    const isDesktop = window.innerWidth > 1024;
    if (isDesktop) {
      blob.position.x = -1.8;
      wireBlob.position.x = -1.8;
      blob.position.y = 0.2;
      wireBlob.position.y = 0.2;
    } else {
      blob.position.x = 0;
      wireBlob.position.x = 0;
      blob.position.y = 0.5;
      wireBlob.position.y = 0.5;
    }
  };
  updateBlobPosition();

  const particleCount = 80;
  const particlesGeometry = new THREE.BufferGeometry();
  const particlePositions = new Float32Array(particleCount * 3);
  const particleSpeeds = [];

  for (let i = 0; i < particleCount; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = 4 + Math.random() * 2.5;
    particlePositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    particlePositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    particlePositions[i * 3 + 2] = r * Math.cos(phi);
    particleSpeeds.push(0.002 + Math.random() * 0.005);
  }

  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
  const particlesMaterial = new THREE.PointsMaterial({
    color: 0x6B8E5E,
    size: 0.08,
    transparent: true,
    opacity: 0.7,
    sizeAttenuation: true,
  });
  const particles = new THREE.Points(particlesGeometry, particlesMaterial);
  particles.position.x = blob.position.x;
  particles.position.y = blob.position.y;
  scene.add(particles);

  const animate = () => {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    mouse.tx += (mouse.x - mouse.tx) * 0.05;
    mouse.ty += (mouse.y - mouse.ty) * 0.05;

    for (let i = 0; i < posAttr.count; i++) {
      const ox = origPositions[i * 3];
      const oy = origPositions[i * 3 + 1];
      const oz = origPositions[i * 3 + 2];
      const noise = SimplexNoise(ox * 1.5 + t * 0.4, oy * 1.5 + t * 0.3, oz * 1.5 + t * 0.2);
      const displacement = 1 + noise * 0.18;
      posAttr.array[i * 3] = ox * displacement;
      posAttr.array[i * 3 + 1] = oy * displacement;
      posAttr.array[i * 3 + 2] = oz * displacement;
    }
    posAttr.needsUpdate = true;

    for (let i = 0; i < wirePosAttr.count; i++) {
      const ox = wireOrigPositions[i * 3];
      const oy = wireOrigPositions[i * 3 + 1];
      const oz = wireOrigPositions[i * 3 + 2];
      const noise = SimplexNoise(ox * 1.2 + t * 0.3, oy * 1.2 + t * 0.2, oz * 1.2 + t * 0.15);
      const displacement = 1 + noise * 0.15;
      wirePosAttr.array[i * 3] = ox * displacement;
      wirePosAttr.array[i * 3 + 1] = oy * displacement;
      wirePosAttr.array[i * 3 + 2] = oz * displacement;
    }
    wirePosAttr.needsUpdate = true;

    blob.rotation.x = mouse.ty * 0.4 + t * 0.1;
    blob.rotation.y = mouse.tx * 0.4 + t * 0.15;
    wireBlob.rotation.x = blob.rotation.x * 0.8;
    wireBlob.rotation.y = blob.rotation.y * 0.8;

    blob.position.y = 0.2 + Math.sin(t * 0.5) * 0.15;
    wireBlob.position.y = blob.position.y;

    const pPositions = particlesGeometry.attributes.position.array;
    for (let i = 0; i < particleCount; i++) {
      pPositions[i * 3 + 1] += Math.sin(t * 2 + i) * 0.001;
      const angle = t * particleSpeeds[i];
      const x = pPositions[i * 3];
      const z = pPositions[i * 3 + 2];
      pPositions[i * 3] = x * Math.cos(angle * 0.01) - z * Math.sin(angle * 0.01);
      pPositions[i * 3 + 2] = x * Math.sin(angle * 0.01) + z * Math.cos(angle * 0.01);
    }
    particlesGeometry.attributes.position.needsUpdate = true;
    particles.rotation.y = t * 0.02;

    renderer.render(scene, camera);
  };
  animate();

  document.addEventListener('mousemove', (e) => {
    mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
    mouse.y = -(e.clientY / window.innerHeight - 0.5) * 2;
  });

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    updateBlobPosition();
    particles.position.x = blob.position.x;
    particles.position.y = blob.position.y;
  });
};

// ─── CUSTOM CURSOR (Desktop Only) ──────────────────────────
const initCursor = () => {
  // Skip on touch devices
  if (isTouchDevice() || isMobile()) {
    console.log('Touch device detected: Custom cursor disabled');
    return;
  }

  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring) return;

  let mx = 0, my = 0, dx = 0, dy = 0;

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top = my + 'px';
  });

  const followCursor = () => {
    dx += (mx - dx) * 0.15;
    dy += (my - dy) * 0.15;
    ring.style.left = dx + 'px';
    ring.style.top = dy + 'px';
    requestAnimationFrame(followCursor);
  };
  followCursor();

  const interactives = document.querySelectorAll('a, button, input, textarea, select, .service-card, .blog-card, .program-card, .testimonial-card, .approach-item');
  interactives.forEach(el => {
    el.addEventListener('mouseenter', () => {
      dot.classList.add('hover');
      ring.classList.add('hover');
    });
    el.addEventListener('mouseleave', () => {
      dot.classList.remove('hover');
      ring.classList.remove('hover');
    });
  });
};

// ─── PRELOADER ──────────────────────────────────────────────
const initPreloader = () => {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;

  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('hidden');
      document.querySelectorAll('#hero .reveal').forEach((el, i) => {
        const delay = parseInt(el.dataset.delay) || 0;
        setTimeout(() => el.classList.add('visible'), 300 + delay);
      });
    }, 800);
  });
};

// ─── NAVBAR ─────────────────────────────────────────────────
const initNavbar = () => {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const scroll = window.scrollY;
    if (scroll > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScroll = scroll;
  });

  if (hamburger && navLinks) {
    // Touch-friendly hamburger
    hamburger.addEventListener('click', (e) => {
      e.preventDefault();
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('open');
      document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });

    // Touch events for hamburger
    hamburger.addEventListener('touchend', (e) => {
      e.preventDefault();
      hamburger.click();
    });

    navLinks.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      });
    });

    // Close menu on outside click (mobile)
    document.addEventListener('click', (e) => {
      if (navLinks.classList.contains('open') && 
          !navLinks.contains(e.target) && 
          !hamburger.contains(e.target)) {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }
};

// ─── SCROLL REVEAL ──────────────────────────────────────────
const initScrollReveal = () => {
  const reveals = document.querySelectorAll('.reveal:not(#hero .reveal)');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.dataset.delay) || 0;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  reveals.forEach(el => observer.observe(el));
};

// ─── ACTIVE NAV LINK ────────────────────────────────────────
const initActiveNav = () => {
  const sections = document.querySelectorAll('section[id]');
  const navLinksArr = document.querySelectorAll('.nav-link[data-section]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinksArr.forEach(link => {
          link.classList.toggle('active', link.dataset.section === id);
        });
      }
    });
  }, {
    threshold: 0.3,
    rootMargin: '-80px 0px -50% 0px'
  });

  sections.forEach(section => observer.observe(section));
};

// ─── SMOOTH SCROLL ──────────────────────────────────────────
const initSmoothScroll = () => {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        const offsetTop = target.offsetTop - 80;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });
};

// ─── COUNTER ANIMATION ──────────────────────────────────────
const initCounters = () => {
  const counters = document.querySelectorAll('.stat-number[data-target]');

  const animateCounter = (el) => {
    const target = parseInt(el.dataset.target);
    const duration = 2000;
    const start = performance.now();

    const update = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(target * ease);
      if (progress < 1) requestAnimationFrame(update);
    };

    requestAnimationFrame(update);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
};

// ─── FAQ ACCORDION ──────────────────────────────────────────
const initFAQ = () => {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');

    const toggleFAQ = (e) => {
      e.preventDefault();
      const isActive = item.classList.contains('active');
      faqItems.forEach(i => i.classList.remove('active'));
      if (!isActive) {
        item.classList.add('active');
      }
    };

    question.addEventListener('click', toggleFAQ);

    // Touch support
    question.addEventListener('touchend', (e) => {
      e.preventDefault();
      toggleFAQ(e);
    });
  });
};

// ─── CONTACT FORM (Formspree + reCAPTCHA) ─────────────────
const initContactForm = () => {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const RECAPTCHA_SITE_KEY = '6LeMPkwtAAAAADUHQbfXplPJFFWXVe-ikKdUD8kg';

  // Disposable email domains list
  const DISPOSABLE_DOMAINS = [
    'tempmail.com', '10minutemail.com', 'guerrillamail.com',
    'mailinator.com', 'throwawaymail.com', 'yopmail.com',
    'fakeinbox.com', 'sharklasers.com', 'getairmail.com',
    'temp-mail.org', 'burnermail.io', 'tempail.com',
    'mailnesia.com', 'tempinbox.com', 'spam4.me',
    'trashmail.com', 'yopmail.fr', 'yopmail.net',
    'cool.fr.nf', 'jetable.fr.nf', 'nospam.ze.tc',
    'nomail.xl.cx', 'mega.zik.dj', 'speed.1s.fr',
    'courriel.fr.nf', 'moncourrier.fr.nf', 'monemail.fr.nf',
    'monmail.fr.nf', 'hide.biz.st', 'mymail.infos.st',
    'tempm.com', 'tmpmail.org', 'disposablemail.com',
    ' Mohmal.com', 'throwawaymail.com', 'tempmailaddress.com'
  ];

  // Role emails block
  const ROLE_EMAILS = [
    'admin', 'support', 'info', 'contact', 'webmaster',
    'noreply', 'no-reply', 'postmaster', 'hostmaster',
    'abuse', 'security', 'sales', 'marketing', 'billing',
    'help', 'team', 'hello', 'office'
  ];

  // Rate limiting
  const submitTimes = [];
  const MAX_SUBMITS = 5; // 5 attempts
  const WINDOW_MS = 3600000; // 1 hour

  const checkRateLimit = () => {
    const now = Date.now();
    while (submitTimes.length > 0 && submitTimes[0] < now - WINDOW_MS) {
      submitTimes.shift();
    }
    return submitTimes.length < MAX_SUBMITS;
  };

  // Email validation
  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    if (!emailRegex.test(email)) {
      return { valid: false, message: 'Please enter a valid email address' };
    }

    const parts = email.split('@');
    const localPart = parts[0].toLowerCase();
    const domain = parts[1].toLowerCase();

    if (DISPOSABLE_DOMAINS.includes(domain)) {
      return { valid: false, message: 'Please use a permanent email address' };
    }

    if (ROLE_EMAILS.includes(localPart)) {
      return { valid: false, message: 'Please use a personal email address' };
    }

    return { valid: true };
  };

  // Sanitize input
  const sanitizeInput = (str) => {
    if (!str) return '';
    return str.replace(/[<>]/g, '').trim();
  };

  // Show error on button
  const showError = (msg) => {
    const submitBtn = document.getElementById('submitBtn');
    const originalHTML = '<span>Send Message</span><i class="fas fa-paper-plane"></i>';
    submitBtn.innerHTML = `<span>${msg}</span><i class="fas fa-exclamation-circle"></i>`;
    submitBtn.style.background = '#c0392b';
    setTimeout(() => {
      submitBtn.innerHTML = originalHTML;
      submitBtn.style.background = '';
    }, 3000);
    return false;
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Honeypot check
    const honeypot = form.querySelector('input[name="_gotcha"]');
    if (honeypot && honeypot.value) {
      return; // Bot detected
    }

    // Rate limit check
    if (!checkRateLimit()) {
      showError('Too many attempts. Try again later.');
      return;
    }

    // Get and sanitize values
    const name = sanitizeInput(form.name.value);
    const email = sanitizeInput(form.email.value);
    const phone = sanitizeInput(form.phone.value);
    const message = sanitizeInput(form.message.value);

    // Validation
    if (!name || name.length < 2) {
      showError('Please enter your full name');
      return;
    }

    const emailCheck = validateEmail(email);
    if (!emailCheck.valid) {
      showError(emailCheck.message);
      return;
    }

    if (phone && !/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(phone.replace(/\s/g, ''))) {
      showError('Please enter a valid phone number');
      return;
    }

    if (message && message.length > 1000) {
      showError('Message too long (max 1000 chars)');
      return;
    }

    // Update hidden fields with sanitized values
    form.name.value = name;
    form.email.value = email;
    form.phone.value = phone;
    form.message.value = message;

    // Loading state
    const submitBtn = document.getElementById('submitBtn');
    const originalHTML = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span>Sending...</span><i class="fas fa-spinner fa-spin"></i>';
    submitBtn.disabled = true;

    try {
      // reCAPTCHA v3
      if (typeof grecaptcha !== 'undefined') {
        const token = await grecaptcha.execute(RECAPTCHA_SITE_KEY, { action: 'submit' });
        document.getElementById('recaptchaToken').value = token;
      }

      // Record submit time for rate limiting
      submitTimes.push(Date.now());

      // Submit to Formspree
      form.submit();

    } catch (err) {
      console.error('Form submission error:', err);
      // Fallback: submit anyway
      form.submit();
    }
  });
};

// ─── PARALLAX FLOATING ELEMENTS (Desktop Only) ──────────────
const initParallax = () => {
  if (isTouchDevice() || isMobile()) {
    console.log('Parallax disabled on touch/mobile devices');
    return;
  }

  const floatingCards = document.querySelectorAll('.hero-floating-card');

  document.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;

    floatingCards.forEach((card, index) => {
      const speed = (index + 1) * 8;
      card.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
    });
  });
};

// ─── HERO PARTICLES (CSS-based) ─────────────────────────────
const initHeroParticles = () => {
  const container = document.getElementById('heroParticles');
  if (!container) return;

  // Reduce particles on mobile
  const particleCount = isMobile() ? 10 : 20;

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.style.cssText = `
      position: absolute;
      width: ${3 + Math.random() * 6}px;
      height: ${3 + Math.random() * 6}px;
      background: rgba(163, 177, 138, ${0.1 + Math.random() * 0.2});
      border-radius: 50%;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      animation: particleFloat ${8 + Math.random() * 12}s ease-in-out infinite;
      animation-delay: ${Math.random() * -10}s;
    `;
    container.appendChild(particle);
  }

  if (!document.getElementById('particleKeyframes')) {
    const style = document.createElement('style');
    style.id = 'particleKeyframes';
    style.textContent = `
      @keyframes particleFloat {
        0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.3; }
        25% { transform: translate(20px, -30px) scale(1.2); opacity: 0.6; }
        50% { transform: translate(-15px, -60px) scale(0.8); opacity: 0.4; }
        75% { transform: translate(25px, -30px) scale(1.1); opacity: 0.5; }
      }
    `;
    document.head.appendChild(style);
  }
};

// ─── TILT EFFECT ON CARDS (Desktop Only) ────────────────────
const initTiltCards = () => {
  if (isTouchDevice() || isMobile()) {
    console.log('Tilt effect disabled on touch/mobile devices');
    return;
  }

  const cards = document.querySelectorAll('.service-card, .program-card, .testimonial-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / centerY * -4;
      const rotateY = (x - centerX) / centerX * 4;

      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
};

// ─── TEXT SCRAMBLE EFFECT FOR HERO ───────────────────────────
const initTextEffects = () => {
  const heroTitle = document.querySelector('.hero-title');
  if (!heroTitle) return;

  const emElement = heroTitle.querySelector('em');
  if (emElement) {
    let hue = 0;
    const shimmer = () => {
      hue = (hue + 0.5) % 360;
      const lightness = 35 + Math.sin(hue * 0.05) * 5;
      emElement.style.color = `hsl(110, 20%, ${lightness}%)`;
      requestAnimationFrame(shimmer);
    };
    setTimeout(shimmer, 2000);
  }
};

// ─── MAGNETIC BUTTONS (Desktop Only) ────────────────────────
const initMagneticButtons = () => {
  if (isTouchDevice() || isMobile()) {
    console.log('Magnetic buttons disabled on touch/mobile devices');
    return;
  }

  const buttons = document.querySelectorAll('.btn, .nav-cta');

  buttons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
};

// ─── SCROLL PROGRESS ────────────────────────────────────────
const initScrollProgress = () => {
  const bar = document.createElement('div');
  bar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    height: 3px;
    background: linear-gradient(90deg, #8B9E7E, #A3B18A, #E8C4C4);
    z-index: 10001;
    transition: width 0.1s linear;
    border-radius: 0 2px 2px 0;
  `;
  document.body.appendChild(bar);

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / docHeight) * 100;
    bar.style.width = progress + '%';
  });
};

// ─── VIEWPORT HEIGHT FIX FOR MOBILE BROWSERS ────────────────
const initViewportHeight = () => {
  const setVH = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  };
  setVH();
  window.addEventListener('resize', setVH);
  window.addEventListener('orientationchange', setVH);
};

// ─── SWIPE GESTURE FOR MOBILE MENU ──────────────────────────
const initSwipeGestures = () => {
  if (!isTouchDevice()) return;

  let touchStartX = 0;
  let touchEndX = 0;
  const navLinks = document.getElementById('navLinks');
  const hamburger = document.getElementById('hamburger');

  if (!navLinks || !hamburger) return;

  document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, false);

  document.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, false);

  const handleSwipe = () => {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    // Swipe left to close menu
    if (navLinks.classList.contains('open') && diff > swipeThreshold) {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    }
  };
};

// ─── PREVENT ZOOM ON INPUT FOCUS (iOS) ──────────────────────
const initIOSZoomFix = () => {
  if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
      input.addEventListener('focus', () => {
        document.body.style.width = '100%';
        document.body.style.position = 'fixed';
        document.body.style.overflow = 'hidden';
      });
      input.addEventListener('blur', () => {
        document.body.style.width = '';
        document.body.style.position = '';
        document.body.style.overflow = '';
      });
    });
  }
};

// ─── INITIALIZE EVERYTHING ──────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initThreeJS();
  initCursor();
  initNavbar();
  initSmoothScroll();
  initScrollReveal();
  initActiveNav();
  initCounters();
  initFAQ();
  initContactForm();
  initParallax();
  initHeroParticles();
  initTiltCards();
  initTextEffects();
  initMagneticButtons();
  initScrollProgress();
  initViewportHeight();
  initSwipeGestures();
  initIOSZoomFix();
});