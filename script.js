document.addEventListener('DOMContentLoaded', () => {
  
  /* ==========================================================================
     1. FIXED HEADER ON SCROLL
     ========================================================================== */
  const header = document.querySelector('.header');
  const scrollThreshold = 50;

  const checkScroll = () => {
    if (window.scrollY > scrollThreshold) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', checkScroll);
  checkScroll(); // Initial check in case page starts scrolled

  /* ==========================================================================
     2. MOBILE MENU TOGGLE
     ========================================================================== */
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  const toggleMenu = () => {
    menuToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
    
    // Toggle body scroll to prevent scrolling behind open menu
    if (navMenu.classList.contains('active')) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  };

  const closeMenu = () => {
    menuToggle.classList.remove('active');
    navMenu.classList.remove('active');
    document.body.style.overflow = '';
  };

  menuToggle.addEventListener('click', toggleMenu);

  navLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close menu if clicked outside
  document.addEventListener('click', (e) => {
    if (navMenu.classList.contains('active') && 
        !navMenu.contains(e.target) && 
        !menuToggle.contains(e.target)) {
      closeMenu();
    }
  });

  /* ==========================================================================
     3. SCROLLSPY (ACTIVE LINK ON SCROLL)
     ========================================================================== */
  const sections = document.querySelectorAll('section[id]');
  
  const scrollSpy = () => {
    const scrollPosition = window.scrollY + 120; // offset to match header height + padding

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop;
      const sectionId = section.getAttribute('id');
      const targetLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

      if (targetLink) {
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          navLinks.forEach(link => link.classList.remove('active'));
          targetLink.classList.add('active');
        } else {
          targetLink.classList.remove('active');
        }
      }
    });
  };

  window.addEventListener('scroll', scrollSpy);
  scrollSpy(); // Initial call

  /* ==========================================================================
     4. FAQ ACCORDION (SANFONA)
     ========================================================================== */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');

    if (trigger) {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        const isOpen = item.classList.contains('open');

        // Close all other items
        faqItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('open');
          }
        });

        // Toggle current item
        if (isOpen) {
          item.classList.remove('open');
        } else {
          item.classList.add('open');
        }
      });
    }
  });

  /* ==========================================================================
     5. SCROLL REVEAL ANIMATION (INTERSECTION OBSERVER)
     ========================================================================== */
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Once animated, we can unobserve
        observer.unobserve(entry.target);
      }
    });
  }, {
    root: null, // viewport
    threshold: 0.1, // trigger when 10% of element is visible
    rootMargin: '0px 0px -50px 0px' // offset bottom slightly
  });

  revealElements.forEach(el => {
    revealObserver.observe(el);
  });

  /* ==========================================================================
     6. INTERACTIVE GLASS GLARE REFLECTION EFFECT
     ========================================================================== */
  const glareCards = document.querySelectorAll('.glare-card, .service-card, .diferencial-card, .glass-card-wrapper, .about-glass-panel, .faq-item');

  glareCards.forEach(card => {
    // Dynamically add a helper class for the glare styling
    card.classList.add('glare-card');
    
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left; // X coordinate relative to the card
      const y = e.clientY - rect.top;  // Y coordinate relative to the card

      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  /* ==========================================================================
     7. HERO BACKGROUND SLIDER
     ========================================================================== */
  const hero = document.querySelector('.hero');
  const sliderDots = document.querySelectorAll('.hero-slider-dots .dot');

  if (hero && sliderDots.length > 0) {
    const heroBgs = [
      "url('hero_glass_architecture.png')",
      "url('https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=1600')",
      "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1600')"
    ];

    let currentSlide = 0;
    let autoSlide; // Declare early in the block scope to avoid TDZ reference errors entirely!

    function goToSlide(index) {
      currentSlide = index;
      hero.style.backgroundImage = heroBgs[currentSlide];
      sliderDots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentSlide);
      });
    }

    sliderDots.forEach((dot, i) => {
      dot.style.cursor = 'pointer';
      dot.addEventListener('click', () => {
        clearInterval(autoSlide);
        goToSlide(i);
        autoSlide = setInterval(() => goToSlide((currentSlide + 1) % heroBgs.length), 5000);
      });
    });

    const prevBtn = document.getElementById('heroPrevBtn');
    const nextBtn = document.getElementById('heroNextBtn');

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        clearInterval(autoSlide);
        const prevIndex = (currentSlide - 1 + heroBgs.length) % heroBgs.length;
        goToSlide(prevIndex);
        autoSlide = setInterval(() => goToSlide((currentSlide + 1) % heroBgs.length), 5000);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        clearInterval(autoSlide);
        const nextIndex = (currentSlide + 1) % heroBgs.length;
        goToSlide(nextIndex);
        autoSlide = setInterval(() => goToSlide((currentSlide + 1) % heroBgs.length), 5000);
      });
    }

    autoSlide = setInterval(() => {
      goToSlide((currentSlide + 1) % heroBgs.length);
    }, 5000);
  }

  /* ==========================================================================
     8. SERVICES DETAILED MODAL POPUP
     ========================================================================== */
  const serviceDetails = {
    'servico-portas': {
      title: "Manutenção de Portas de Vidro",
      desc: "Evite acidentes e garanta o funcionamento perfeito da sua porta de vidro temperado. Realizamos o alinhamento completo, troca de ferragens e manutenção preventiva com técnicos especializados.",
      bullets: [
        "Ajuste e alinhamento de portas desalinhadas ou arrastando no chão",
        "Troca de roldanas gastas, trincos, fechaduras e puxadores",
        "Substituição de eixos, pivôs e ferragens danificadas",
        "Lubrificação especializada e regulagem de velocidade"
      ],
      whatsappMsg: "Olá! Gostaria de solicitar um orçamento para a manutenção de uma porta de vidro."
    },
    'servico-janelas': {
      title: "Manutenção de Janelas de Vidro",
      desc: "Trilhos travados ou vidros soltos podem comprometer a segurança da sua casa. Corrigimos infiltrações, vedação danificada e trocamos componentes com peças de alta qualidade.",
      bullets: [
        "Substituição de roldanas danificadas e ajuste nos trilhos de alumínio",
        "Substituição de trincos, fechos de segurança e travas",
        "Correção de infiltrações de água e vedação profissional com silicone",
        "Alinhamento completo das folhas para deslizamento suave"
      ],
      whatsappMsg: "Olá! Gostaria de solicitar um orçamento para a manutenção de uma janela de vidro."
    },
    'servico-box': {
      title: "Manutenção de Box de Banheiro",
      desc: "O box de banheiro é de uso diário e requer cuidados. Realizamos manutenção corretiva e preventiva para evitar que o vidro temperado sofra impactos por causa de roldanas travadas.",
      bullets: [
        "Troca de roldanas de latão blindado (maior durabilidade)",
        "Ajuste do batedor superior e limitadores de fim de curso",
        "Vedação completa com silicone anti-fungo",
        "Regulagem para fechamento suave sem folgas"
      ],
      whatsappMsg: "Olá! Gostaria de solicitar um orçamento para a manutenção de um box de banheiro."
    },
    'servico-molas': {
      title: "Regulagem de Molas de Piso e Aéreas",
      desc: "Porta batendo forte ou muito pesada? Regulamos e trocamos molas hidráulicas de piso e molas aéreas para garantir um fechamento suave e seguro.",
      bullets: [
        "Ajuste preciso das duas velocidades de fechamento",
        "Regulagem de pressão e alinhamento de prumo da porta",
        "Substituição de molas hidráulicas antigas ou com vazamento de óleo",
        "Serviço especializado em molas de grandes marcas (Dorma, Soprano)"
      ],
      whatsappMsg: "Olá! Gostaria de solicitar um orçamento para a regulagem de molas hidráulicas."
    },
    'servico-espelhos': {
      title: "Instalação de Espelhos",
      desc: "Transforme e amplie seus ambientes com espelhos instalados sob medida. Trabalhamos com fixação altamente segura com cola especial para espelhos, evitando manchas e acidentes.",
      bullets: [
        "Espelhos sob medida para banheiros, salas, closets e lojas",
        "Fixação química com selante neutro (não mancha o espelho)",
        "Opções de acabamento lapidado ou bisotê",
        "Medição técnica precisa para encaixe perfeito"
      ],
      whatsappMsg: "Olá! Gostaria de solicitar um orçamento para instalação de espelhos."
    },
    'servico-inst-box': {
      title: "Instalação de Box de Banheiro",
      desc: "Instalamos box de banheiro novos em vidro temperado de 8mm com kits modernos de alumínio em várias cores (cromado, branco, preto, bronze, champagne).",
      bullets: [
        "Vidro temperado de 8mm de alta resistência (Normas ABNT)",
        "Kits de alumínio modernos com roldanas aparentes ou convencionais",
        "Modelos de canto, frontal (correr), abrir ou articulado",
        "Instalação rápida com vedação dupla de alta qualidade"
      ],
      whatsappMsg: "Olá! Gostaria de solicitar um orçamento para a instalação de um box de banheiro novo."
    },
    'servico-inst-portas-janelas': {
      title: "Instalação de Portas e Janelas",
      desc: "Projetos novos em vidro temperado sob medida para trazer luz, amplitude e sofisticação à sua residência, loja ou escritório.",
      bullets: [
        "Portas de correr, pivotantes ou de abrir em vidro temperado",
        "Janelas em vidro temperado de 8mm ou 10mm",
        "Ferragens modernas com acabamento premium e fechaduras seguras",
        "Instalação profissional com garantia técnica e prumo perfeito"
      ],
      whatsappMsg: "Olá! Gostaria de solicitar um orçamento para a instalação de portas ou janelas de vidro."
    },
    'servico-molas-piso': {
      title: "Instalação de Molas de Piso Dorma",
      desc: "Instalação técnica especializada de molas de piso hidráulicas Dorma, a líder mundial em desempenho e durabilidade para portas de vidro comerciais e residenciais.",
      bullets: [
        "Instalação embutida no piso com caixa de cimento reforçada",
        "Ideal para portas de vidro de alto fluxo e peso elevado",
        "Ajuste micrométrico de velocidade e travamento a 90 graus",
        "Garantia de durabilidade e fechamento controlado"
      ],
      whatsappMsg: "Olá! Gostaria de solicitar um orçamento para instalação de mola de piso Dorma."
    }
  };

  const serviceModal = document.getElementById('serviceModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalIcon = document.getElementById('modalIcon');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');
  const modalDetails = document.getElementById('modalDetails');
  const modalWhatsappBtn = document.getElementById('modalWhatsappBtn');
  const serviceCards = document.querySelectorAll('.service-card');

  if (serviceModal && modalCloseBtn) {
    serviceCards.forEach(card => {
      card.style.cursor = 'pointer';
      
      card.addEventListener('click', () => {
        const id = card.getAttribute('id');
        if (id && serviceDetails[id]) {
          const data = serviceDetails[id];
          
          // Get the icon from the card
          const cardIconSvg = card.querySelector('.icon-wrapper svg').cloneNode(true);
          modalIcon.innerHTML = '';
          modalIcon.appendChild(cardIconSvg);
          
          // Set content
          modalTitle.textContent = data.title;
          modalDesc.textContent = data.desc;
          
          // Set bullets
          let bulletsHtml = '<h4>O que está incluso:</h4><ul>';
          data.bullets.forEach(bullet => {
            bulletsHtml += `<li>
              <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
              <span>${bullet}</span>
            </li>`;
          });
          bulletsHtml += '</ul>';
          modalDetails.innerHTML = bulletsHtml;
          
          // Open Modal
          serviceModal.classList.add('active');
          document.body.style.overflow = 'hidden';
        }
      });
    });

    const closeModal = () => {
      serviceModal.classList.remove('active');
      document.body.style.overflow = '';
    };

    modalCloseBtn.addEventListener('click', closeModal);
    modalWhatsappBtn.addEventListener('click', closeModal);
    serviceModal.addEventListener('click', (e) => {
      if (e.target === serviceModal) {
        closeModal();
      }
    });

    // Close on ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && serviceModal.classList.contains('active')) {
        closeModal();
      }
    });
  }

  /* ==========================================================================
     9. DYNAMIC WHATSAPP FLOAT BUTTON SPACING ABOVE FOOTER
     ========================================================================== */
  const whatsappFloat = document.getElementById('whatsappFloatBtn');
  const footerElement = document.querySelector('.footer');

  if (whatsappFloat && footerElement) {
    const adjustWhatsappFloat = () => {
      const footerRect = footerElement.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      // If the top of the footer is inside the viewport
      if (footerRect.top < viewportHeight) {
        // How many pixels of the footer are visible on screen
        const footerVisibleHeight = viewportHeight - footerRect.top;
        
        // Base margin (e.g., 35px on desktop, 24px on mobile)
        const baseBottom = window.innerWidth <= 768 ? 24 : 35;
        
        // Target position to lock inside the footer's blank area (above copyright line)
        const maxBottom = window.innerWidth <= 768 ? 105 : 120;
        
        // Cap the button rise so it lands perfectly in its footer slot
        const targetBottom = Math.min(maxBottom, baseBottom + footerVisibleHeight);
        
        whatsappFloat.style.bottom = `${targetBottom}px`;
      } else {
        // Reset to default style so CSS can take over
        whatsappFloat.style.bottom = '';
      }
    };

    window.addEventListener('scroll', adjustWhatsappFloat);
    window.addEventListener('resize', adjustWhatsappFloat);
    adjustWhatsappFloat(); // Initial check on load
  }
});





