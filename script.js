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
  '.section, .project-card, .glow-card, .exp-card, .education-card'
).forEach(el => {
  el.classList.add('reveal');
  observer.observe(el);
});


/* ================================
   Navbar hide / show on scroll
================================ */
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
  const current = window.scrollY;

  if (current > lastScroll && current > 120) {
    navbar.style.transform = 'translateY(-100%)';
  } else {
    navbar.style.transform = 'translateY(0)';
  }

  lastScroll = current;
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



