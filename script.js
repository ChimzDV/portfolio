/* ================================
   Smooth anchor scrolling (keep)
================================ */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    document
      .querySelector(link.getAttribute('href'))
      ?.scrollIntoView({ behavior: 'smooth' });
  });
});

/* ================================
   Mobile menu toggle
================================ */
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');

if (menuToggle && navMenu) {
  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  // Close menu when clicking on a link
  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });
}


/* ================================
   Scroll reveal animations
================================ */
const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll(
  '.section, .project-card, .project-item, .glow-card, .exp-item, .education-card, .premium-glass-card'
).forEach((el, i) => {
  el.classList.add('reveal');
  // Add stagger delay for experience items
  if (el.classList.contains('exp-item')) {
    el.style.transitionDelay = `${(i % 5) * 0.15}s`;
  }
  observer.observe(el);
});

const expObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  { threshold: 0.2 }
);

document.querySelectorAll('.exp-item').forEach(item => {
  expObserver.observe(item);
});


/* ================================
   Navbar hide / show on scroll
================================ */
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
  const current = window.scrollY;

  if (current > lastScroll && current > 120) {
    navbar.style.transform = 'translateY(-50%, -100%)';
  } else {
    navbar.style.transform = 'translateY(-50%, 0)';
  }

  lastScroll = current;
});

/* ================================
   Navbar expand at footer
================================ */
const footer = document.querySelector('.site-footer');

window.addEventListener('scroll', () => {
  const footerTop = footer.getBoundingClientRect().top;
  const screenHeight = window.innerHeight;

  if (footerTop < screenHeight) {
    navbar.classList.add('expand');
  } else {
    navbar.classList.remove('expand');
  }
});

const nav = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 120) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
});

/* ================================
   Hero icon floating animation
================================ */
document.querySelectorAll('.hero-icons i').forEach((icon, i) => {
  icon.style.animation = `float 4s ease-in-out ${i * 0.3}s infinite`;
});

/* ================================
   Terminal typing effect (looped)
================================ */
document.querySelectorAll('.terminal').forEach((terminal, index) => {
  const cursor = terminal.querySelector('.blink');
  const originalText = terminal.textContent.replace('█', '').trim();

  let typingTimeout = null;
  let loopInterval = null;
  let isTyping = false;

  function clearTimers() {
    if (typingTimeout) {
      clearTimeout(typingTimeout);
      typingTimeout = null;
    }
    if (loopInterval) {
      clearInterval(loopInterval);
      loopInterval = null;
    }
    isTyping = false;
  }

  function startTyping() {
    if (isTyping) return; // prevent overlap
    isTyping = true;

    clearTimers();

    terminal.textContent = '';
    if (cursor) terminal.appendChild(cursor);

    let i = 0;

    function type() {
      if (i < originalText.length) {
        terminal.insertBefore(
          document.createTextNode(originalText.charAt(i)),
          cursor
        );
        i++;
        typingTimeout = setTimeout(type, 35);
      } else {
        isTyping = false;
      }
    }

    type();

    loopInterval = setInterval(startTyping, 6000);
  }

  // Initial delayed start
  setTimeout(startTyping, 400 + index * 300);

  // 🔑 Visibility handling (THIS fixes your bug)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      clearTimers();
    } else {
      startTyping();
    }
  });
});



/* ================================
   Preloader hide / remove
================================ */
(function(){
  const pre = document.getElementById('preloader');
  if(!pre) return;
  // prevent scroll while loading
  document.documentElement.style.overflow = 'hidden';

  const minDisplay = 2000; // minimum ms to show preloader
  const start = Date.now();
  let hidden = false;

  function doHide(){
    if(hidden) return;
    hidden = true;
    document.documentElement.style.overflow = '';
    pre.classList.add('preloader--hide');
    setTimeout(()=>{ if(pre && pre.parentNode) pre.parentNode.removeChild(pre); }, 900);
  }

  function hidePreloader(){
    const elapsed = Date.now() - start;
    const remaining = minDisplay - elapsed;
    if(remaining > 0){
      setTimeout(doHide, remaining);
    } else {
      doHide();
    }
  }

  // --- dynamic preloader content: falling icons + typing signature ---
  const iconsContainer = pre.querySelector('.falling-icons');
  const sigNameEl = pre.querySelector('.sig-name');
  const sigCursor = pre.querySelector('.sig-cursor');

  const iconList = ['fa-terminal','fa-code','fa-gear','fa-shield-halved','fa-bolt','fa-gamepad'];
  let iconInterval = null;
  let spawnTimeouts = [];
  let typingTimer = null;

  function spawnIcon(){
    if(!iconsContainer) return;
    const i = document.createElement('i');
    const ic = iconList[Math.floor(Math.random()*iconList.length)];
    i.className = `fa-solid ${ic} fall-icon`;
    const left = Math.random()*100;
    const size = 10 + Math.random()*24;
    const duration = 2200 + Math.random()*2600; // 2.2s - 4.8s
    i.style.left = left + '%';
    i.style.fontSize = `${size}px`;
    i.style.animation = `fall ${duration}ms linear forwards`;
    i.style.opacity = 0;
    iconsContainer.appendChild(i);

    const removeT = setTimeout(()=>{
      if(i && i.parentNode) i.parentNode.removeChild(i);
    }, duration + 200);
    spawnTimeouts.push(removeT);
  }

  function startSpawning(){
    if(!iconsContainer) return;
    iconInterval = setInterval(spawnIcon, 240);
    // create a few initial icons
    for(let j=0;j<6;j++){ spawnIcon(); }
  }

  function stopSpawning(){
    if(iconInterval) clearInterval(iconInterval);
    spawnTimeouts.forEach(t=>clearTimeout(t));
    spawnTimeouts = [];
    if(iconsContainer) iconsContainer.innerHTML = '';
  }

  // typing signature
  const signature = 'CHIMWEMWE';
  function startTyping(){
    if(!sigNameEl) return;
    sigNameEl.textContent = '';
    let idx = 0;
    typingTimer = setInterval(()=>{
      sigNameEl.textContent += signature.charAt(idx);
      idx++;
      if(idx >= signature.length){
        clearInterval(typingTimer);
        typingTimer = null;
      }
    }, 120);
  }

  // start animations immediately
  startSpawning();
  setTimeout(startTyping, 500);

  window.addEventListener('load', () => {
    hidePreloader();
  });

  // safety fallback in case load doesn't fire
  setTimeout(()=>{ if(!hidden) hidePreloader(); }, 7000);

  // ensure cleanup on hide
  const origDoHide = doHide;
  doHide = function(){
    stopSpawning();
    if(typingTimer) clearInterval(typingTimer);
    if(sigNameEl) sigNameEl.textContent = signature; // ensure full name shown
    if(sigCursor) sigCursor.style.display = 'none';
    origDoHide();
  };
})();

/* ================================
   Experience Infinite Auto-Carousel & Drag/Swipe Controller
================================ */
(function initExperienceCarousel() {
  const container = document.querySelector('.experience-timeline-container');
  const track = document.querySelector('.experience-list');
  if (!container || !track) return;

  // Clone items dynamically once for infinite seamless loop
  const originalItems = Array.from(track.querySelectorAll('.exp-item'));
  if (originalItems.length > 0) {
    originalItems.forEach(item => {
      const clone = item.cloneNode(true);
      clone.classList.add('cloned-item');
      track.appendChild(clone);
    });
  }

  let isHovered = false;
  let isDragging = false;
  let startX = 0;
  let startScrollLeft = 0;
  let dragMovedDistance = 0;
  let autoAnimId = null;
  const speed = 0.5; // slow smooth movement per frame

  function getHalfScrollWidth() {
    return track.scrollWidth / 2;
  }

  function loopBoundaryCheck() {
    const halfWidth = getHalfScrollWidth();
    if (halfWidth <= 0) return;

    if (track.scrollLeft >= halfWidth) {
      track.scrollLeft -= halfWidth;
    } else if (track.scrollLeft <= 0) {
      track.scrollLeft += halfWidth;
    }
  }

  function autoScrollLoop() {
    if (!isHovered && !isDragging) {
      track.scrollLeft += speed;
      loopBoundaryCheck();
    }
    autoAnimId = requestAnimationFrame(autoScrollLoop);
  }

  autoAnimId = requestAnimationFrame(autoScrollLoop);

  // Hover & Focus Pause & Resume
  container.addEventListener('mouseenter', () => { isHovered = true; });
  container.addEventListener('mouseleave', () => {
    isHovered = false;
    isDragging = false;
  });
  container.addEventListener('focusin', () => { isHovered = true; });
  container.addEventListener('focusout', () => { isHovered = false; });

  // Dragging & Touch Swiping
  function startDrag(e) {
    isDragging = true;
    dragMovedDistance = 0;
    startX = e.pageX || (e.touches && e.touches[0].pageX) || 0;
    startScrollLeft = track.scrollLeft;
  }

  function moveDrag(e) {
    if (!isDragging) return;
    const currentX = e.pageX || (e.touches && e.touches[0].pageX) || 0;
    const diff = currentX - startX;
    dragMovedDistance = Math.abs(diff);
    track.scrollLeft = startScrollLeft - diff;
    loopBoundaryCheck();
  }

  function stopDrag() {
    isDragging = false;
  }

  track.addEventListener('mousedown', startDrag);
  window.addEventListener('mousemove', moveDrag);
  window.addEventListener('mouseup', stopDrag);

  track.addEventListener('touchstart', startDrag, { passive: true });
  track.addEventListener('touchmove', moveDrag, { passive: true });
  track.addEventListener('touchend', stopDrag);

  // Prevent link click when dragging
  track.addEventListener('click', (e) => {
    if (dragMovedDistance > 5) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, true);
})();


/* ================================
   3D Coverflow Projects Showcase Controller
================================ */
(function init3DCoverflowProjects() {
  const stage = document.querySelector('.projects-coverflow-stage');
  const track = document.querySelector('.projects-coverflow-track');
  const cards = Array.from(document.querySelectorAll('.project-card-3d'));
  const dotsContainer = document.querySelector('.coverflow-pagination-dots');
  const prevSideBtn = document.querySelector('.coverflow-side-btn.prev-btn');
  const nextSideBtn = document.querySelector('.coverflow-side-btn.next-btn');
  const prevSmBtn = document.querySelector('.coverflow-nav-arrow.nav-prev-sm');
  const nextSmBtn = document.querySelector('.coverflow-nav-arrow.nav-next-sm');

  if (!stage || !track || cards.length === 0) return;

  let currentIndex = 0; // Center focused card index (starts at 0 - TalentIQ Staffing)
  let isHovered = false;
  let isDragging = false;
  let startX = 0;
  let dragDistance = 0;
  let autoTimer = null;

  // Render pagination dot capsules dynamically
  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    cards.forEach((_, idx) => {
      const dot = document.createElement('div');
      dot.className = `dot-capsule ${idx === currentIndex ? 'active' : ''}`;
      dot.setAttribute('aria-label', `Go to project ${idx + 1}`);
      dot.addEventListener('click', () => {
        setIndex(idx);
      });
      dotsContainer.appendChild(dot);
    });
  }

  function updatePaginationDots() {
    if (!dotsContainer) return;
    const dots = dotsContainer.querySelectorAll('.dot-capsule');
    dots.forEach((dot, idx) => {
      if (idx === currentIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  // Update 3D Coverflow Positions with Continuous Circular Wrapping & Mobile Depth Blur
  function updateCoverflow() {
    const isMobile = window.innerWidth <= 900;
    const isSmallMobile = window.innerWidth <= 480;
    const gap = isSmallMobile ? 190 : (isMobile ? 220 : 320);
    const total = cards.length;

    cards.forEach((card, idx) => {
      let diff = idx - currentIndex;

      // Circular shortest-distance wrap for infinite continuous flow
      while (diff > total / 2) diff -= total;
      while (diff < -total / 2) diff += total;

      card.classList.remove('active-card');

      if (diff === 0) {
        // Active Center Card: 100% sharp, bright, in-focus, full opacity & contrast
        card.classList.add('active-card');
        card.style.transform = `translateX(0) scale(1) rotateY(0deg) translateZ(0px)`;
        card.style.opacity = '1';
        card.style.zIndex = '10';
        card.style.pointerEvents = 'auto';
        if (isMobile) {
          card.style.filter = 'none';
        } else {
          card.style.filter = '';
        }
      } else if (diff < 0) {
        // Left Side Cards: blurred, dimmed, reduced contrast and opacity on mobile
        const absDiff = Math.abs(diff);
        const translateX = diff * gap;
        const rotateY = isMobile ? Math.min(18, absDiff * 12) : Math.min(24, absDiff * 18);
        const scale = isMobile ? Math.max(0.72, 1 - absDiff * 0.15) : Math.max(0.65, 1 - absDiff * 0.14);
        const opacity = isMobile ? Math.max(0.18, 0.6 - (absDiff - 1) * 0.25) : Math.max(0, 0.85 - (absDiff - 1) * 0.35);
        const zIndex = 10 - absDiff;
        const blurAmount = isMobile ? Math.min(6, 2.5 + (absDiff - 1) * 1.8) : 0;
        const brightness = isMobile ? Math.max(0.48, 0.68 - (absDiff - 1) * 0.15) : 1;
        const contrast = isMobile ? 0.9 : 1;

        card.style.transform = `translateX(${translateX}px) scale(${scale}) rotateY(${rotateY}deg) translateZ(${-absDiff * (isMobile ? 60 : 80)}px)`;
        card.style.opacity = opacity <= 0.05 ? '0' : `${opacity}`;
        card.style.zIndex = `${zIndex}`;
        card.style.pointerEvents = 'auto';
        if (isMobile) {
          card.style.filter = `blur(${blurAmount}px) brightness(${brightness}) contrast(${contrast})`;
        } else {
          card.style.filter = '';
        }
      } else {
        // Right Side Cards: blurred, dimmed, reduced contrast and opacity on mobile
        const translateX = diff * gap;
        const rotateY = isMobile ? -Math.min(18, diff * 12) : -Math.min(24, diff * 18);
        const scale = isMobile ? Math.max(0.72, 1 - diff * 0.15) : Math.max(0.65, 1 - diff * 0.14);
        const opacity = isMobile ? Math.max(0.18, 0.6 - (diff - 1) * 0.25) : Math.max(0, 0.85 - (diff - 1) * 0.35);
        const zIndex = 10 - diff;
        const blurAmount = isMobile ? Math.min(6, 2.5 + (diff - 1) * 1.8) : 0;
        const brightness = isMobile ? Math.max(0.48, 0.68 - (diff - 1) * 0.15) : 1;
        const contrast = isMobile ? 0.9 : 1;

        card.style.transform = `translateX(${translateX}px) scale(${scale}) rotateY(${rotateY}deg) translateZ(${-diff * (isMobile ? 60 : 80)}px)`;
        card.style.opacity = opacity <= 0.05 ? '0' : `${opacity}`;
        card.style.zIndex = `${zIndex}`;
        card.style.pointerEvents = 'auto';
        if (isMobile) {
          card.style.filter = `blur(${blurAmount}px) brightness(${brightness}) contrast(${contrast})`;
        } else {
          card.style.filter = '';
        }
      }
    });

    updatePaginationDots();
  }

  function setIndex(index) {
    const total = cards.length;
    currentIndex = ((index % total) + total) % total;
    updateCoverflow();
  }

  // Click on card to activate it
  cards.forEach((card, idx) => {
    card.addEventListener('click', (e) => {
      if (dragDistance > 8) return;
      if (idx !== currentIndex) {
        e.preventDefault();
        setIndex(idx);
      }
    });
  });

  // Controls
  if (prevSideBtn) prevSideBtn.addEventListener('click', () => setIndex(currentIndex - 1));
  if (nextSideBtn) nextSideBtn.addEventListener('click', () => setIndex(currentIndex + 1));
  if (prevSmBtn) prevSmBtn.addEventListener('click', () => setIndex(currentIndex - 1));
  if (nextSmBtn) nextSmBtn.addEventListener('click', () => setIndex(currentIndex + 1));

  // Keyboard navigation when stage focused or hovered
  window.addEventListener('keydown', (e) => {
    if (!isHovered) return;
    if (e.key === 'ArrowLeft') setIndex(currentIndex - 1);
    if (e.key === 'ArrowRight') setIndex(currentIndex + 1);
  });

  // Mouse / Touch Dragging & Swiping
  function onDragStart(e) {
    isDragging = true;
    dragDistance = 0;
    startX = e.pageX || (e.touches && e.touches[0].pageX) || 0;
  }

  function onDragMove(e) {
    if (!isDragging) return;
    const currentX = e.pageX || (e.touches && e.touches[0].pageX) || 0;
    const diff = currentX - startX;
    dragDistance = Math.abs(diff);

    if (dragDistance > 55) {
      if (diff > 0) {
        setIndex(currentIndex - 1);
      } else {
        setIndex(currentIndex + 1);
      }
      isDragging = false;
    }
  }

  function onDragEnd() {
    isDragging = false;
  }

  track.addEventListener('mousedown', onDragStart);
  window.addEventListener('mousemove', onDragMove);
  window.addEventListener('mouseup', onDragEnd);

  track.addEventListener('touchstart', onDragStart, { passive: true });
  track.addEventListener('touchmove', onDragMove, { passive: true });
  track.addEventListener('touchend', onDragEnd);

  // Auto Advance Loop (idle timer)
  function startAutoAdvance() {
    stopAutoAdvance();
    autoTimer = setInterval(() => {
      if (!isHovered && !isDragging) {
        setIndex(currentIndex + 1);
      }
    }, 4500);
  }

  function stopAutoAdvance() {
    if (autoTimer) {
      clearInterval(autoTimer);
      autoTimer = null;
    }
  }

  stage.addEventListener('mouseenter', () => { isHovered = true; });
  stage.addEventListener('mouseleave', () => { isHovered = false; });
  window.addEventListener('resize', updateCoverflow);

  // Initialize
  updateCoverflow();
  startAutoAdvance();
})();



