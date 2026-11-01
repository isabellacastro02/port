/* ============================================================
   PORTFÓLIO ISABELLA — SCRIPT.JS
   Funcionalidades: Scroll Reveal, Triângulos Parallax,
   Menu Mobile, Theme Toggle, Form Validation, Active Nav
   ============================================================ */

(function () {
  'use strict';

  /* ========================================
     1. THEME TOGGLE (Studio Namma)
     ======================================== */
  const themeToggle = document.getElementById('theme-toggle');
  const htmlElement = document.documentElement;

  // Recuperar tema salvo ou usar preferência do sistema
  function getPreferredTheme() {
    const saved = localStorage.getItem('theme');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  function setTheme(theme) {
    htmlElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }

  // Inicializar tema
  setTheme(getPreferredTheme());

  themeToggle.addEventListener('click', function () {
    const current = htmlElement.getAttribute('data-theme');
    setTheme(current === 'dark' ? 'light' : 'dark');
  });

  /* ========================================
     2. HEADER SCROLL EFFECT
     ======================================== */
  const header = document.getElementById('header');
  let lastScroll = 0;

  function handleHeaderScroll() {
    const scrollY = window.scrollY;

    if (scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    lastScroll = scrollY;
  }

  /* ========================================
     3. MOBILE MENU
     ======================================== */
  const navMenu = document.getElementById('nav-menu');
  const navToggle = document.getElementById('nav-toggle');
  const navClose = document.getElementById('nav-close');
  const navLinks = document.querySelectorAll('.nav__link');

  // Criar overlay
  const overlay = document.createElement('div');
  overlay.className = 'nav__overlay';
  document.body.appendChild(overlay);

  function openMenu() {
    navMenu.classList.add('show-menu');
    overlay.classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    navMenu.classList.remove('show-menu');
    overlay.classList.remove('show');
    document.body.style.overflow = '';
  }

  navToggle.addEventListener('click', openMenu);
  navClose.addEventListener('click', closeMenu);
  overlay.addEventListener('click', closeMenu);

  // Fechar menu ao clicar em um link
  navLinks.forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  // Fechar menu com Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && navMenu.classList.contains('show-menu')) {
      closeMenu();
    }
  });

  /* ========================================
     4. ACTIVE NAV LINK ON SCROLL
     ======================================== */
  const sections = document.querySelectorAll('section[id]');

  function handleActiveLink() {
    const scrollY = window.scrollY + 200;

    sections.forEach(function (section) {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach(function (link) {
          link.classList.remove('active-link');
          if (link.getAttribute('href') === '#' + sectionId) {
            link.classList.add('active-link');
          }
        });
      }
    });
  }

  /* ========================================
     5. SCROLL REVEAL (Edolus)
     ======================================== */
  const revealElements = document.querySelectorAll('.reveal');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function handleScrollReveal() {
    if (prefersReducedMotion) return;

    const windowHeight = window.innerHeight;

    revealElements.forEach(function (el) {
      const elementTop = el.getBoundingClientRect().top;
      const revealPoint = 100;

      if (elementTop < windowHeight - revealPoint) {
        el.classList.add('revealed');
      }
    });
  }

  // Se prefers-reduced-motion, mostrar tudo imediatamente
  if (prefersReducedMotion) {
    revealElements.forEach(function (el) {
      el.classList.add('revealed');
    });
  }

  /* ========================================
     6. GEOMETRIC TRIANGLES PARALLAX (La Boîte à Slide)
     ======================================== */
  const triangles = document.querySelectorAll('.triangle');
  const triangleData = [];

  // Gerar velocidades e direções para cada triângulo
  triangles.forEach(function (triangle, index) {
    triangleData.push({
      element: triangle,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: -(0.1 + Math.random() * 0.25),
      rotation: (Math.random() - 0.5) * 0.15
    });
  });

  function handleTriangleParallax() {
    if (prefersReducedMotion) return;

    const scrollY = window.scrollY;

    triangleData.forEach(function (data) {
      var translateX = scrollY * data.speedX;
      var translateY = scrollY * data.speedY;
      var rotate = scrollY * data.rotation;

      data.element.style.transform =
        'translate(' + translateX + 'px, ' + translateY + 'px) rotate(' + rotate + 'deg)';
    });
  }

  /* ========================================
     7. CONTACT FORM VALIDATION
     ======================================== */
  const form = document.getElementById('contact-form');
  const formSuccess = document.getElementById('form-success');

  function validateField(input) {
    var errorEl = document.getElementById(input.id + '-error');
    var value = input.value.trim();
    var isValid = true;

    // Limpar erro
    input.classList.remove('error');
    if (errorEl) errorEl.textContent = '';

    // Verificar campo vazio
    if (!value) {
      input.classList.add('error');
      if (errorEl) errorEl.textContent = 'Este campo é obrigatório.';
      isValid = false;
    }
    // Verificar e-mail
    else if (input.type === 'email') {
      var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        input.classList.add('error');
        if (errorEl) errorEl.textContent = 'Informe um e-mail válido.';
        isValid = false;
      }
    }

    return isValid;
  }

  // Validação em tempo real
  var formInputs = form ? form.querySelectorAll('.form__input') : [];

  formInputs.forEach(function (input) {
    input.addEventListener('blur', function () {
      validateField(input);
    });

    input.addEventListener('input', function () {
      if (input.classList.contains('error')) {
        validateField(input);
      }
    });
  });

  // Submit
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var isFormValid = true;

      formInputs.forEach(function (input) {
        if (!validateField(input)) {
          isFormValid = false;
        }
      });

      if (isFormValid) {
        // Mostrar mensagem de sucesso (sem envio real)
        formSuccess.classList.add('show');

        // Limpar formulário
        form.reset();

        // Esconder mensagem após 8 segundos
        setTimeout(function () {
          formSuccess.classList.remove('show');
        }, 8000);

        // Scroll suave até a mensagem
        formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  }

  /* ========================================
     8. SCROLL EVENT HANDLER (Otimizado com requestAnimationFrame)
     ======================================== */
  var ticking = false;

  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(function () {
        handleHeaderScroll();
        handleActiveLink();
        handleScrollReveal();
        handleTriangleParallax();
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  // Executar na carga inicial
  handleHeaderScroll();
  handleActiveLink();
  handleScrollReveal();
  handleTriangleParallax();

  /* ========================================
     9. SMOOTH SCROLL FOR ANCHOR LINKS
     ======================================== */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;

      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  /* ========================================
     10. RESIZE HANDLER
     ======================================== */
  var resizeTimeout;

  window.addEventListener('resize', function () {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function () {
      // Fechar menu mobile ao redimensionar para desktop
      if (window.innerWidth > 768) {
        closeMenu();
      }
    }, 250);
  });

})();
