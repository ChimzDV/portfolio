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
   Terminal typing effect (ALL + cursor safe)
================================ */
/* ================================
   Terminal typing effect (looped)
================================ */
document.querySelectorAll('.terminal').forEach((terminal, index) => {
  const cursor = terminal.querySelector('.blink');
  const text = terminal.textContent.replace('█', '').trim();

  function startTyping() {
    // Clear text but keep cursor
    terminal.textContent = '';
    if (cursor) terminal.appendChild(cursor);

    let i = 0;

    function type() {
      if (i < text.length) {
        terminal.insertBefore(
          document.createTextNode(text.charAt(i)),
          cursor
        );
        i++;
        setTimeout(type, 35);
      }
    }

    type();
  }

  // Initial start
  setTimeout(startTyping, 400 + index * 300);

  // Repeat every 8 seconds
  setInterval(startTyping, 6000);
});



