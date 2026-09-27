/* ============================================================
   KUNAL KASHYAP — PORTFOLIO SCRIPT
   Vanilla JS: loader, cursor glow, particle network, typing effect,
   scroll reveal, counters, skill bars, ripple, tilt, theme toggle,
   nav behaviour, contact form.
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------------- LOADING SCREEN ---------------- */
  (function loader() {
    const loaderEl = document.getElementById('loader');
    const fill = document.getElementById('loaderFill');
    let progress = 0;
    const timer = setInterval(() => {
      progress += Math.random() * 22;
      if (progress >= 100) {
        progress = 100;
        clearInterval(timer);
        setTimeout(() => loaderEl.classList.add('hidden'), 350);
      }
      fill.style.width = progress + '%';
    }, 160);
  })();

  /* ---------------- SCROLL PROGRESS BAR ---------------- */
  const scrollProgress = document.getElementById('scrollProgress');
  function updateScrollProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgress.style.width = pct + '%';
  }

  /* ---------------- NAVBAR SCROLL STATE ---------------- */
  const navbar = document.getElementById('navbar');
  function updateNavbar() {
    navbar.classList.toggle('scrolled', window.scrollY > 30);
  }

  /* ---------------- BACK TO TOP ---------------- */
  const backToTop = document.getElementById('backToTop');
  function updateBackToTop() {
    backToTop.classList.toggle('visible', window.scrollY > 600);
  }
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  window.addEventListener('scroll', () => {
    updateScrollProgress();
    updateNavbar();
    updateBackToTop();
  }, { passive: true });
  updateScrollProgress(); updateNavbar(); updateBackToTop();

  /* ---------------- MOBILE MENU ---------------- */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('active', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
  });
  mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('active');
  }));

  /* ---------------- THEME TOGGLE ---------------- */
  const themeToggle = document.getElementById('themeToggle');
  const savedTheme = (() => {
    try { return localStorage.getItem('kk-theme'); } catch (e) { return null; }
  })();
  if (savedTheme) document.documentElement.setAttribute('data-theme', savedTheme);
  themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    const next = current === 'light' ? 'dark' : 'light';
    if (next === 'light') document.documentElement.setAttribute('data-theme', 'light');
    else document.documentElement.removeAttribute('data-theme');
    try { localStorage.setItem('kk-theme', next); } catch (e) { /* storage unavailable, ignore */ }
  });

  /* ---------------- CURSOR GLOW (desktop only) ---------------- */
  const cursorGlow = document.getElementById('cursorGlow');
  const cursorDot = document.getElementById('cursorDot');
  const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (isFinePointer) {
    window.addEventListener('mousemove', (e) => {
      cursorGlow.style.left = e.clientX + 'px';
      cursorGlow.style.top = e.clientY + 'px';
      cursorDot.style.left = e.clientX + 'px';
      cursorDot.style.top = e.clientY + 'px';
      cursorGlow.classList.add('active');
      cursorDot.classList.add('active');
    });
    document.addEventListener('mouseleave', () => {
      cursorGlow.classList.remove('active');
      cursorDot.classList.remove('active');
    });
  }

  /* ---------------- TYPING ANIMATION ---------------- */
  (function typingEffect() {
    const roles = ['Data Analyst', 'Power BI Developer', 'SQL Developer', 'Python Programmer'];
    const el = document.getElementById('typingText');
    if (!el) return;
    let roleIndex = 0, charIndex = 0, deleting = false;

    function tick() {
      const current = roles[roleIndex];
      if (!deleting) {
        charIndex++;
        el.textContent = current.slice(0, charIndex);
        if (charIndex === current.length) {
          deleting = true;
          setTimeout(tick, 1400);
          return;
        }
      } else {
        charIndex--;
        el.textContent = current.slice(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
        }
      }
      setTimeout(tick, deleting ? 45 : 85);
    }
    tick();
  })();

  /* ---------------- SCROLL REVEAL (AOS-style, IntersectionObserver) ---------------- */
  (function scrollReveal() {
    const items = document.querySelectorAll('[data-reveal]');
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = entry.target.getAttribute('data-reveal-delay') || 0;
          setTimeout(() => entry.target.classList.add('in-view'), Number(delay));
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    items.forEach(item => io.observe(item));
  })();

  /* ---------------- ANIMATED COUNTERS ---------------- */
  (function counters() {
    const counterEls = document.querySelectorAll('[data-counter]');
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseFloat(el.getAttribute('data-target'));
        const decimals = Number(el.getAttribute('data-decimals') || 0);
        const suffix = el.getAttribute('data-suffix') || '';
        const duration = 1600;
        const start = performance.now();

        function step(now) {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const value = target * eased;
          el.textContent = value.toFixed(decimals) + suffix;
          if (progress < 1) requestAnimationFrame(step);
          else el.textContent = target.toFixed(decimals) + suffix;
        }
        requestAnimationFrame(step);
        io.unobserve(el);
      });
    }, { threshold: 0.4 });
    counterEls.forEach(el => io.observe(el));
  })();

  /* ---------------- SKILLS DATA + ANIMATED BARS ---------------- */
  (function skills() {
    // each skill carries its own icon (flat, single-shape glyph) and accent color
    const data = [
      { name: 'Excel', pct: 92, color: '#21a366',
        icon: '<svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/><path d="M14 2v6h6" fill="none" stroke="#0b1020" stroke-width="1"/><path d="m8.2 12 2.1 3-2.2 3h1.9l1.3-2 1.3 2h1.9l-2.2-3 2.1-3h-1.9l-1.2 1.9L9.9 12z" fill="#0b1020"/></svg>' },
      { name: 'Power BI', pct: 90, color: '#f2c811',
        icon: '<svg viewBox="0 0 24 24"><path d="M13 3h4a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1h-4z"/><path d="M7 9h4a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H7z" opacity=".75"/><path d="M2 15h3.5a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H2z" opacity=".5"/></svg>' },
      { name: 'SQL', pct: 90, color: '#4479a1',
        icon: '<svg viewBox="0 0 24 24"><ellipse cx="12" cy="5.5" rx="8" ry="3"/><path d="M4 5.5V12c0 1.66 3.58 3 8 3s8-1.34 8-3V5.5" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M4 12v6.5c0 1.66 3.58 3 8 3s8-1.34 8-3V12" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>' },
      { name: 'Python', pct: 85, color: '#4b8bbe',
        icon: '<svg viewBox="0 0 24 24"><path d="M12 2c-2.8 0-5 .9-5 2.6V7h5v1H5.6C3.6 8 2 9.6 2 12s1.6 4 3.6 4H8v-2.6C8 11.6 9.6 10 11.6 10H16c1.8 0 3-1.2 3-2.6V4.6C19 2.9 16.8 2 14 2zM9 5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/><path d="M12 22c2.8 0 5-.9 5-2.6V17h-5v-1h6.4c2 0 3.6-1.6 3.6-4s-1.6-4-3.6-4H16v2.6c0 1.8-1.6 3.4-3.6 3.4H8c-1.8 0-3 1.2-3 2.6v2.8C5 21.1 7.2 22 10 22z" opacity=".65"/><circle cx="15" cy="19" r="1"/></svg>' },
      { name: 'Pandas', pct: 85, color: '#4da4de',
        icon: '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="4" height="18" rx="1"/><rect x="9" y="3" width="4" height="12" rx="1" opacity=".6"/><rect x="15" y="3" width="4" height="18" rx="1" opacity=".85"/></svg>' },
      { name: 'NumPy', pct: 80, color: '#4dabcf',
        icon: '<svg viewBox="0 0 24 24"><path d="M12 2 3 7v10l9 5 9-5V7z" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M3 7l9 5 9-5M12 12v10" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>' },
      { name: 'Matplotlib', pct: 78, color: '#e35a2a',
        icon: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M12 3v18M3 12h18M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="1" fill="none" opacity=".7"/></svg>' },
      { name: 'Seaborn', pct: 78, color: '#3c8abe',
        icon: '<svg viewBox="0 0 24 24"><path d="M4 18c3-6 5-9 8-9s5 3 8 9" fill="none" stroke="currentColor" stroke-width="2"/><path d="M4 14c3-4 5-6 8-6s5 2 8 6" fill="none" stroke="currentColor" stroke-width="1.4" opacity=".6"/></svg>' },
      { name: 'Plotly', pct: 75, color: '#3f4f75',
        icon: '<svg viewBox="0 0 24 24"><path d="M4 20V10M9 20V4M14 20v-7M19 20V8" stroke="currentColor" stroke-width="2.2" fill="none" stroke-linecap="round"/></svg>' },
      { name: 'Power Query', pct: 88, color: '#4cc9f0',
        icon: '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" stroke-width="2"/><path d="m20 20-4.5-4.5" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>' },
      { name: 'DAX', pct: 85, color: '#9d4edd',
        icon: '<svg viewBox="0 0 24 24"><path d="M4 4h5l3 8 3-8h5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 20h5l3-8 3 8h5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" opacity=".55"/></svg>' },
      { name: 'Data Cleaning', pct: 90, color: '#4cc9f0',
        icon: '<svg viewBox="0 0 24 24"><path d="M6 3h9l3 3v15H6z" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="m9 13 2 2 4-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' },
      { name: 'EDA', pct: 88, color: '#c77dff',
        icon: '<svg viewBox="0 0 24 24"><circle cx="10" cy="10" r="6" fill="none" stroke="currentColor" stroke-width="2"/><path d="m20 20-5.2-5.2" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/><path d="M7 10h6M10 7v6" stroke="currentColor" stroke-width="1.4"/></svg>' },
      { name: 'Statistics', pct: 80, color: '#7dd8f5',
        icon: '<svg viewBox="0 0 24 24"><path d="M4 20V10M10 20V4M16 20v-6M21 20H3" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/></svg>' },
      { name: 'Machine Learning', pct: 82, color: '#9d4edd',
        icon: '<svg viewBox="0 0 24 24"><circle cx="5" cy="6" r="2"/><circle cx="5" cy="18" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="6" r="2"/><circle cx="19" cy="18" r="2"/><path d="M6.6 7 10.6 11M6.6 17l4-4M13.4 11l4-4M13.4 13l4 4" stroke="currentColor" stroke-width="1.3" opacity=".7"/></svg>' },
      { name: 'Git', pct: 75, color: '#f34f29',
        icon: '<svg viewBox="0 0 24 24"><path d="M21.6 11.1 12.9 2.4a1.4 1.4 0 0 0-2 0L9.1 4.2l2.3 2.3a1.7 1.7 0 0 1 2.1 1.6 1.7 1.7 0 0 1-1.7 1.7 1.7 1.7 0 0 1-1.7-1.7c0-.2 0-.4.1-.6L8 5.3l-5.6 5.6a1.4 1.4 0 0 0 0 2l8.7 8.7a1.4 1.4 0 0 0 2 0l8.5-8.5a1.4 1.4 0 0 0 0-2z"/></svg>' },
      { name: 'VS Code', pct: 88, color: '#3b82f6',
        icon: '<svg viewBox="0 0 24 24"><path d="M17 3 8 11 4 8l-2 1v6l2 1 4-3 9 8 4-2V5z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>' },
      { name: 'Jupyter Notebook', pct: 88, color: '#f37626',
        icon: '<svg viewBox="0 0 24 24"><circle cx="12" cy="5" r="2.2"/><circle cx="4.5" cy="17" r="1.8" opacity=".7"/><circle cx="19.5" cy="17" r="1.8" opacity=".7"/><path d="M6 16a6.5 3 0 0 1 12 0" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>' },
    ];
    const grid = document.getElementById('skillsGrid');
    if (!grid) return;

    data.forEach((skill, i) => {
      const card = document.createElement('div');
      card.className = 'skill-card';
      card.setAttribute('data-reveal', '');
      card.setAttribute('data-reveal-delay', String((i % 3) * 90));
      card.innerHTML = `
        <div class="skill-icon-wrap" style="color:${skill.color}; background:${skill.color}1a;">${skill.icon}</div>
        <span class="skill-name">${skill.name}</span>
        <div class="skill-bar-track"><div class="skill-bar-fill" data-pct="${skill.pct}"></div></div>
        <span class="skill-pct">${skill.pct}%</span>
      `;
      grid.appendChild(card);
    });

    // observe reveal for newly created elements
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = entry.target.getAttribute('data-reveal-delay') || 0;
          setTimeout(() => entry.target.classList.add('in-view'), Number(delay));
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    grid.querySelectorAll('[data-reveal]').forEach(el => io.observe(el));

    // animate bar fill widths on view
    const barIo = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const fillEl = entry.target;
          fillEl.style.width = fillEl.getAttribute('data-pct') + '%';
          barIo.unobserve(fillEl);
        }
      });
    }, { threshold: 0.3 });
    grid.querySelectorAll('.skill-bar-fill').forEach(el => barIo.observe(el));
  })();

  /* ---------------- BUTTON RIPPLE EFFECT ---------------- */
  document.querySelectorAll('.ripple').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const circle = document.createElement('span');
      const size = Math.max(rect.width, rect.height);
      circle.className = 'ripple-circle';
      circle.style.width = circle.style.height = size + 'px';
      circle.style.left = (e.clientX - rect.left - size / 2) + 'px';
      circle.style.top = (e.clientY - rect.top - size / 2) + 'px';
      this.appendChild(circle);
      setTimeout(() => circle.remove(), 650);
    });
  });

  /* ---------------- IMAGE / PHOTO TILT EFFECT ---------------- */
  (function tilt() {
    const el = document.getElementById('photoTilt');
    if (!el || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const maxTilt = 10;
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      el.style.transform = `perspective(600px) rotateY(${x * maxTilt * 2}deg) rotateX(${-y * maxTilt * 2}deg)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = 'perspective(600px) rotateY(0) rotateX(0)';
    });
  })();

  /* ---------------- PARTICLE / DATA-NETWORK BACKGROUND ---------------- */
  (function particles() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width, height, points;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function resize() {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    }

    function initPoints() {
      const count = Math.max(24, Math.floor((width * height) / 32000));
      points = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
      }));
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);
      const linkDist = 140;
      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.8, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(124, 200, 245, 0.55)';
        ctx.fill();

        for (let j = i + 1; j < points.length; j++) {
          const q = points[j];
          const dx = p.x - q.x, dy = p.y - q.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < linkDist) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(157, 78, 221, ${0.18 * (1 - dist / linkDist)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
      if (!reduceMotion) requestAnimationFrame(draw);
    }

    resize();
    initPoints();
    draw();
    window.addEventListener('resize', () => { resize(); initPoints(); });
  })();

  /* ---------------- CONTACT FORM (front-end only) ---------------- */
  // (function contactForm() {
  //   const form = document.getElementById('contactForm');
  //   const status = document.getElementById('formStatus');
  //   if (!form) return;
  //   form.addEventListener('submit', (e) => {
  //     // e.preventDefault();
  //     status.textContent = "Thanks — your message is received.";
  //     form.reset();
  //   });
  // })();

  /* ---------------- SET FOOTER YEAR ---------------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});
