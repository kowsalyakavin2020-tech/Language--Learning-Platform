/* ============ LINGORA — main.js ============ */

let savedScrollY = 0;

document.addEventListener('DOMContentLoaded', () => {

  const hasGSAP = typeof gsap !== 'undefined';
  if(hasGSAP && typeof ScrollTrigger !== 'undefined'){
    gsap.registerPlugin(ScrollTrigger);
    document.body.classList.add('gsap-ready');
  }

  /* ---- Loader ---- */
  const loader = document.querySelector('.loader');
  if(loader){
    window.addEventListener('load', () => {
      setTimeout(()=> loader.classList.add('hide'), 500);
    });
    setTimeout(()=> loader.classList.add('hide'), 2200);
  }

  /* ---- Scroll progress bar ---- */
  const progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress';
  document.body.appendChild(progressBar);
  window.addEventListener('scroll', () => {
    const h = document.documentElement;
    const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
    progressBar.style.width = (scrolled || 0) + '%';
  });

  /* ---- Button ripple effect ---- */
  document.querySelectorAll('.btn').forEach(btn=>{
    btn.addEventListener('click', function(e){
      const r = this.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size = Math.max(r.width, r.height);
      ripple.className = 'ripple';
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - r.left - size/2) + 'px';
      ripple.style.top = (e.clientY - r.top - size/2) + 'px';
      this.appendChild(ripple);
      setTimeout(()=> ripple.remove(), 650);
    });
  });

  /* ---- Navbar scroll state ---- */
  const navbar = document.querySelector('.navbar');
  const onScroll = () => {
    if(!navbar) return;
    navbar.classList.toggle('scrolled', window.scrollY > 10);
  };
  window.addEventListener('scroll', onScroll); onScroll();

  /* ---- Mobile menu: full-page cover + real scroll lock ---- */
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileMenuClose = document.querySelector('.mobile-menu-close');
  function openMobileMenu(){
    savedScrollY = window.scrollY;
    document.body.style.top = `-${savedScrollY}px`;
    document.documentElement.classList.add('menu-open');
    document.body.classList.add('menu-open');
    hamburger.classList.add('active');
    mobileMenu.classList.add('open');
  }
  function closeMobileMenu(){
    document.documentElement.classList.remove('menu-open');
    document.body.classList.remove('menu-open');
    document.body.style.top = '';
    window.scrollTo(0, savedScrollY);
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('open');
  }
  if(hamburger && mobileMenu){
    hamburger.addEventListener('click', () => {
      mobileMenu.classList.contains('open') ? closeMobileMenu() : openMobileMenu();
    });
    mobileMenuClose?.addEventListener('click', closeMobileMenu);
    mobileMenu.querySelectorAll('.has-dropdown > .nav-link').forEach(link=>{
      link.addEventListener('click', e=>{
        e.preventDefault();
        const sub = link.nextElementSibling;
        if(sub) sub.classList.toggle('open');
      });
    });
    mobileMenu.querySelectorAll('a:not(.has-dropdown > .nav-link)').forEach(a=>{
      a.addEventListener('click', closeMobileMenu);
    });
  }

  /* ---- Scroll reveal: GSAP ScrollTrigger batch (falls back to IO) ---- */
  const revealEls = Array.from(document.querySelectorAll('[data-aos]'));
  if(hasGSAP && typeof ScrollTrigger !== 'undefined' && revealEls.length){
    revealEls.forEach(el=>{
      const type = el.dataset.aos;
      const delay = (parseInt(el.dataset.aosDelay || 0, 10)) / 1000;
      let fromVars = {opacity:0, duration:.8, delay, ease:'power3.out'};
      if(type === 'up') fromVars.y = 44;
      if(type === 'down') fromVars.y = -44;
      if(type === 'left') fromVars.x = -44;
      if(type === 'right') fromVars.x = 44;
      if(type === 'zoom') fromVars.scale = .9;
      gsap.set(el, {opacity:0, y: fromVars.y || 0, x: fromVars.x || 0, scale: fromVars.scale || 1});
      ScrollTrigger.create({
        trigger: el,
        start: 'top 88%',
        once: true,
        onEnter: () => gsap.to(el, {opacity:1, y:0, x:0, scale:1, duration:.8, delay, ease:'power3.out'})
      });
    });
  } else {
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          const delay = entry.target.dataset.aosDelay || 0;
          setTimeout(()=> entry.target.classList.add('aos-in'), delay);
          io.unobserve(entry.target);
        }
      });
    }, {threshold:.15});
    revealEls.forEach(el=> io.observe(el));
  }

  /* ---- Hero entrance timeline (GSAP) ---- */
  if(hasGSAP){
    const heroBadge = document.querySelector('.hero-badge');
    const heroH1 = document.querySelector('.hero h1');
    const heroLead = document.querySelector('.hero .lead');
    const heroCta = document.querySelector('.hero .hero-cta');
    const heroStats = document.querySelector('.hero .hero-stats');
    const heroVisual = document.querySelector('.hero-visual');
    if(heroH1){
      gsap.set([heroBadge, heroH1, heroLead, heroCta, heroStats, heroVisual], {opacity:0});
      const tl = gsap.timeline({defaults:{ease:'power3.out'}, delay:.15});
      if(heroBadge) tl.fromTo(heroBadge, {y:16,opacity:0}, {y:0,opacity:1,duration:.6});
      tl.fromTo(heroH1, {y:34,opacity:0}, {y:0,opacity:1,duration:.8}, '-=0.3')
        .fromTo(heroLead, {y:22,opacity:0}, {y:0,opacity:1,duration:.7}, '-=0.45')
        .fromTo(heroCta, {y:18,opacity:0}, {y:0,opacity:1,duration:.6}, '-=0.4')
        .fromTo(heroStats, {y:18,opacity:0}, {y:0,opacity:1,duration:.6}, '-=0.35')
        .fromTo(heroVisual, {scale:.88,opacity:0}, {scale:1,opacity:1,duration:1}, '-=0.7');
    }
    /* Parallax hero blobs */
    document.querySelectorAll('.hero-blob').forEach((blob,i)=>{
      gsap.to(blob, {
        y: i % 2 === 0 ? 40 : -30, ease:'none',
        scrollTrigger:{trigger:'.hero', start:'top top', end:'bottom top', scrub:.6}
      });
    });
  }

  /* ---- Magnetic button hover (desktop only) ---- */
  if(hasGSAP && window.matchMedia('(hover:hover)').matches){
    document.querySelectorAll('.btn-primary, .btn-amber').forEach(btn=>{
      btn.classList.add('magnetic-btn');
      btn.addEventListener('mousemove', (e)=>{
        const r = btn.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width/2) * .25;
        const y = (e.clientY - r.top - r.height/2) * .5;
        gsap.to(btn, {x, y, duration:.35, ease:'power2.out'});
      });
      btn.addEventListener('mouseleave', ()=> gsap.to(btn, {x:0,y:0,duration:.5,ease:'elastic.out(1,0.4)'}));
    });
  }

  /* ---- Counters (GSAP powered, falls back to rAF) ---- */
  const counters = document.querySelectorAll('[data-count]');
  counters.forEach(el=>{
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const isDecimal = target % 1 !== 0;
    const run = () => {
      if(hasGSAP){
        const obj = {val:0};
        gsap.to(obj, {
          val: target, duration:1.6, ease:'power2.out',
          onUpdate: () => el.textContent = (isDecimal? obj.val.toFixed(1): Math.floor(obj.val)) + suffix,
          onComplete: () => el.textContent = (isDecimal? target.toFixed(1): target) + suffix,
        });
      } else {
        let cur = 0; const step = target/60;
        const tick = () => {
          cur += step;
          if(cur >= target){ el.textContent = (isDecimal? target.toFixed(1): target) + suffix; return; }
          el.textContent = (isDecimal? cur.toFixed(1): Math.floor(cur)) + suffix;
          requestAnimationFrame(tick);
        };
        tick();
      }
    };
    if(hasGSAP && typeof ScrollTrigger !== 'undefined'){
      ScrollTrigger.create({trigger:el, start:'top 90%', once:true, onEnter:run});
    } else {
      const cIo = new IntersectionObserver((entries)=>{
        entries.forEach(entry=>{ if(entry.isIntersecting){ run(); cIo.unobserve(el);} });
      }, {threshold:.4});
      cIo.observe(el);
    }
  });

  /* ---- Tabs ---- */
  document.querySelectorAll('.tabs-head').forEach(head=>{
    const group = head.dataset.tabGroup;
    head.querySelectorAll('.tab-btn').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        head.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
        btn.classList.add('active');
        document.querySelectorAll(`.tab-panel[data-tab-group="${group}"]`).forEach(p=>p.classList.remove('active'));
        document.querySelector(`.tab-panel[data-tab-group="${group}"][data-tab="${btn.dataset.tab}"]`)?.classList.add('active');
      });
    });
  });

  /* ---- Accordion (FAQ) ---- */
  document.querySelectorAll('.acc-item').forEach(item=>{
    const head = item.querySelector('.acc-head');
    const body = item.querySelector('.acc-body');
    head.addEventListener('click', ()=>{
      const isOpen = item.classList.contains('open');
      item.parentElement.querySelectorAll('.acc-item').forEach(i=>{
        i.classList.remove('open');
        i.querySelector('.acc-body').style.maxHeight = null;
      });
      if(!isOpen){
        item.classList.add('open');
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });

  /* ---- Password toggle ---- */
  document.querySelectorAll('.pass-toggle').forEach(t=>{
    t.addEventListener('click', ()=>{
      const input = t.previousElementSibling;
      const showing = input.type === 'text';
      input.type = showing ? 'password' : 'text';
      t.classList.toggle('fa-eye', showing);
      t.classList.toggle('fa-eye-slash', !showing);
    });
  });

  /* ---- Role selector ---- */
  document.querySelectorAll('.role-select').forEach(group=>{
    group.querySelectorAll('.role-opt').forEach(opt=>{
      opt.addEventListener('click', ()=>{
        group.querySelectorAll('.role-opt').forEach(o=>o.classList.remove('active'));
        opt.classList.add('active');
        const hidden = group.parentElement.querySelector('input[type="hidden"][name="role"]');
        if(hidden) hidden.value = opt.dataset.role;
      });
    });
  });

  /* ---- Dashboard sidebar toggle (mobile) ---- */
  const dashToggle = document.querySelector('.dash-toggle');
  const dashSidebar = document.querySelector('.dash-sidebar');
  if(dashToggle && dashSidebar){
    dashToggle.addEventListener('click', ()=> dashSidebar.classList.toggle('open'));
  }
  document.querySelectorAll('.dash-nav a[data-section]').forEach(link=>{
    link.addEventListener('click', e=>{
      e.preventDefault();
      document.querySelectorAll('.dash-nav a').forEach(a=>a.classList.remove('active'));
      link.classList.add('active');
      document.querySelectorAll('.content-section').forEach(s=>s.classList.remove('active'));
      document.getElementById(link.dataset.section)?.classList.add('active');
      dashSidebar?.classList.remove('open');
    });
  });

  /* ---- Progress bar animation ---- */
  document.querySelectorAll('.progress-bar span').forEach(bar=>{
    const val = bar.dataset.value;
    if(hasGSAP){
      gsap.to(bar, {width: val + '%', duration:1.2, ease:'power2.out', delay:.2});
    } else {
      requestAnimationFrame(()=> bar.style.width = val + '%');
    }
  });

  /* ---- Dynamic logged-in email (dashboard) ---- */
  const dashEmailTargets = document.querySelectorAll('[data-user-email]');
  const savedEmail = sessionStorage.getItem('lingora_email');
  if(dashEmailTargets.length && savedEmail){
    dashEmailTargets.forEach(t=> t.textContent = savedEmail);
  }

  /* ---- Dashboard header welcome message ---- */
  const welcomeTargets = document.querySelectorAll('[data-welcome-msg]');
  if(welcomeTargets.length){
    const namePart = savedEmail ? savedEmail.split('@')[0].replace(/[^a-zA-Z]/g, ' ').trim() : '';
    const displayName = namePart ? namePart.charAt(0).toUpperCase() + namePart.slice(1) : 'back';
    welcomeTargets.forEach(t=>{
      t.innerHTML = `Welcome ${namePart ? 'back, ' + displayName : 'back'}! <span aria-hidden="true">👋</span>`;
    });
  }

});

/* ============ Toast utility ============ */
function showToast(message, type='info'){
  let wrap = document.querySelector('.toast-wrap');
  if(!wrap){
    wrap = document.createElement('div');
    wrap.className = 'toast-wrap';
    document.body.appendChild(wrap);
  }
  const icon = type==='success' ? 'fa-circle-check' : type==='error' ? 'fa-circle-exclamation' : 'fa-circle-info';
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<i class="fa-solid ${icon}"></i><span>${message}</span>`;
  wrap.appendChild(toast);
  requestAnimationFrame(()=> toast.classList.add('show'));
  setTimeout(()=>{
    toast.classList.remove('show');
    setTimeout(()=> toast.remove(), 400);
  }, 3600);
}

/* ============ Validation helpers ============ */
const Validate = {
  email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
  phone: v => /^[0-9]{10}$/.test(v.replace(/\D/g,'')),
  notEmpty: v => v.trim().length > 0,
  password: v => v.length >= 8,
};

function setFieldError(group, msg){
  group.classList.add('error');
  const em = group.querySelector('.error-msg');
  if(em) em.textContent = msg;
}
function clearFieldError(group){
  group.classList.remove('error');
}

/* ============ Generic form validator (inputs + checkboxes) ============ */
function validateForm(form){
  let valid = true;

  form.querySelectorAll('[data-validate]').forEach(input=>{
    const group = input.closest('.form-group');
    const rules = input.dataset.validate.split(' ');
    const value = input.value || '';
    let fieldValid = true;
    let msg = '';

    rules.forEach(rule=>{
      if(rule === 'required' && !Validate.notEmpty(value)){ fieldValid=false; msg = 'This field is required'; }
      if(rule === 'email' && value && !Validate.email(value)){ fieldValid=false; msg = 'Enter a valid email address'; }
      if(rule === 'phone' && value && !Validate.phone(value)){ fieldValid=false; msg = 'Enter a valid 10-digit number'; }
      if(rule === 'password' && value && !Validate.password(value)){ fieldValid=false; msg = 'Minimum 8 characters required'; }
      if(rule === 'match'){
        const target = document.getElementById(input.dataset.matchId);
        if(target && value !== target.value){ fieldValid=false; msg = 'Passwords do not match'; }
      }
    });

    if(!fieldValid){ valid = false; if(group) setFieldError(group, msg); }
    else if(group){ clearFieldError(group); }
  });

  /* Required checkboxes (e.g. Terms & Conditions) */
  form.querySelectorAll('[data-validate-check="required"]').forEach(chk=>{
    const row = chk.closest('.checkbox-row');
    if(!chk.checked){
      valid = false;
      row?.classList.add('error');
    } else {
      row?.classList.remove('error');
    }
  });

  return valid;
}
// Testimonial Carousel
(function(){
  const carousel = document.querySelector('.testi-carousel');
  if(!carousel) return;
  const cards = carousel.querySelectorAll('.testi-card');
  const dots = carousel.querySelectorAll('.testi-dot');
  let current = 0;
  let timer;

  function showCard(index){
    cards[current].classList.remove('active');
    cards[current].classList.add('exiting');
    setTimeout(()=>{ cards[current].classList.remove('exiting'); }, 400);

    current = index;
    cards[current].style.animation = 'none';
    void cards[current].offsetWidth; // reflow to restart animation
    cards[current].style.animation = '';
    cards[current].classList.add('active');

    dots.forEach(d=>d.classList.remove('active'));
    dots[current].classList.add('active');
  }

  function next(){
    const nextIndex = (current + 1) % cards.length;
    showCard(nextIndex);
  }

  function startAuto(){
    timer = setInterval(next, 4000);
  }
  function stopAuto(){
    clearInterval(timer);
  }

  dots.forEach(dot=>{
    dot.addEventListener('click', function(){
      stopAuto();
      showCard(parseInt(this.dataset.index));
      startAuto();
    });
  });

  startAuto();
})();