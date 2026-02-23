
'use strict';

const navbar = document.getElementById('navbar');

function handleNavbarScroll() {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', handleNavbarScroll, { passive: true });
handleNavbarScroll();

const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('open');
  document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
});

navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

document.addEventListener('click', (e) => {
  if (!navbar.contains(e.target) && navLinks.classList.contains('open')) {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  }
});


document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const navHeight = navbar.offsetHeight;
      const targetPos = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;
      window.scrollTo({ top: targetPos, behavior: 'smooth' });
    }
  });
});


const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  if (window.scrollY > 400) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }
}, { passive: true });

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});


function initScrollAnimations() {
  const elements = document.querySelectorAll('[data-aos]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        const delay = entry.target.getAttribute('data-aos-delay') || 0;
        setTimeout(() => {
          entry.target.classList.add('aos-animate');
        }, parseInt(delay));
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -50px 0px'
  });

  elements.forEach(el => observer.observe(el));
}


function animateCounter(element, target, duration = 2000) {
  const start = 0;
  const increment = target / (duration / 16);
  let current = start;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }


    const prefix = element.dataset.prefix || '';
    const suffix = element.dataset.suffix || '';
    element.textContent = prefix + Math.floor(current).toLocaleString('pt-BR') + suffix;
  }, 16);
}

function initCounters() {
  const statNumbers = document.querySelectorAll('.stat-number');


  statNumbers.forEach(el => {
    el.dataset.original = el.textContent.trim();
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const original = el.dataset.original || el.textContent.trim();

      
        const match = original.match(/\d+/);
        if (match) {
          const num = parseInt(match[0]);
          const prefix = original.startsWith('+') ? '+' : '';
          const suffix = original.endsWith('+') ? '+' :
            original.endsWith('%') ? '%' : '';

          el.dataset.prefix = prefix;
          el.dataset.suffix = suffix;
          animateCounter(el, num);
        }

        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => observer.observe(el));
}

const contactForm = document.getElementById('contactForm');

if (contactForm) {
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const btn = this.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;

    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    btn.disabled = true;

    const nome = this.querySelector('[name="nome"]').value;
    const email = this.querySelector('[name="email"]').value;
    const telefone = this.querySelector('[name="telefone"]').value;
    const area = this.querySelector('[name="area"]').value;
    const mensagem = this.querySelector('[name="mensagem"]').value;

    emailjs.send("service_k31vq86", "template_qthc1i8", {
      from_name: nome,
      from_email: email,
      phone: telefone,
      area: area,
      message: mensagem
    })
      .then(() => {
        btn.innerHTML = '<i class="fas fa-check"></i> Mensagem Enviada!';
        btn.style.background = '#2d6b2d';
        btn.style.borderColor = '#2d6b2d';

        showFormSuccess();
        contactForm.reset();
      })
      .catch((error) => {
        console.error("Erro:", error);
        btn.innerHTML = 'Erro ao enviar';
        btn.style.background = '#8b0000';
        btn.style.borderColor = '#8b0000';
      })
      .finally(() => {
        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.disabled = false;
          btn.style.background = '';
          btn.style.borderColor = '';
          hideFormSuccess();
        }, 4000);
      });
  });
}
function showFormSuccess() {
  let successEl = document.querySelector('.form-success');

  if (!successEl) {
    successEl = document.createElement('div');
    successEl.className = 'form-success';
    successEl.innerHTML = `
      <i class="fas fa-check-circle"></i>
      <h4>Mensagem enviada com sucesso!</h4>
      <p>Em breve entraremos em contato.</p>
    `;
    contactForm.appendChild(successEl);
  }

  successEl.style.display = 'block';
}

function hideFormSuccess() {
  const successEl = document.querySelector('.form-success');
  if (successEl) {
    successEl.style.display = 'none';
  }
}

// ===== ACTIVE NAV LINK ON SCROLL =====
function updateActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const navLinksAll = document.querySelectorAll('.nav-link');

  let currentSection = '';

  sections.forEach(section => {
    const sectionTop = section.offsetTop - navbar.offsetHeight - 100;
    if (window.scrollY >= sectionTop) {
      currentSection = section.getAttribute('id');
    }
  });

  navLinksAll.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${currentSection}`) {
      link.classList.add('active');
    }
  });
}

window.addEventListener('scroll', updateActiveNavLink, { passive: true });


function handleParallax() {
  const hero = document.querySelector('.hero');
  if (hero && window.scrollY < window.innerHeight) {
    const offset = window.scrollY * 0.4;
    hero.style.backgroundPositionY = `calc(center + ${offset}px)`;
  }
}


if (window.innerWidth > 768) {
  window.addEventListener('scroll', handleParallax, { passive: true });
}


function initCardTilt() {
  const cards = document.querySelectorAll('.area-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / centerY * -5;
      const rotateY = (x - centerX) / centerX * 5;

      card.style.transform = `translateY(-8px) perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}


const phoneInput = document.getElementById('telefone');
if (phoneInput) {
  phoneInput.addEventListener('input', function () {
    let value = this.value.replace(/\D/g, '');
    if (value.length <= 11) {
      value = value.replace(/^(\d{2})(\d)/, '($1) $2');
      value = value.replace(/(\d{5})(\d{4})$/, '$1-$2');
      value = value.replace(/(\d{4})(\d{4})$/, '$1-$2');
    }
    this.value = value;
  });
}


function initLazyLoading() {
  const images = document.querySelectorAll('img[loading="lazy"]');

  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.src; // Trigger load
          img.classList.add('loaded');
          imageObserver.unobserve(img);
        }
      });
    });

    images.forEach(img => imageObserver.observe(img));
  }
}


function initTypingEffect() {
  const subtitle = document.querySelector('.hero-subtitle');
  if (!subtitle) return;

  const text = subtitle.textContent;
  subtitle.textContent = '';
  subtitle.style.opacity = '1';

  let i = 0;
  const typingInterval = setInterval(() => {
    if (i < text.length) {
      subtitle.textContent += text[i];
      i++;
    } else {
      clearInterval(typingInterval);
    }
  }, 60);
}


document.addEventListener('DOMContentLoaded', () => {
  initScrollAnimations();
  initCounters();
  initCardTilt();
  initLazyLoading();

  setTimeout(initTypingEffect, 800);

  const style = document.createElement('style');
  style.textContent = `.nav-link.active { color: var(--gold) !important; }
  .nav-link.active::after { width: 100% !important; }`;
  document.head.appendChild(style);
});

let scrollThrottleTimer;
const originalScrollHandler = window.onscroll;

window.addEventListener('scroll', () => {
  if (!scrollThrottleTimer) {
    scrollThrottleTimer = setTimeout(() => {
      scrollThrottleTimer = null;
    }, 16);
  }
}, { passive: true });
