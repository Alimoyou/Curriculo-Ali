/**
 * PORTFÓLIO — ALI MOHAMAD YOUNES
 * JavaScript puro (vanilla), sem frameworks
 * Responsabilidades:
 *  1. Navbar: scroll / active link / hambúrguer
 *  2. Hero: grade de pontos decorativa
 *  3. Animações de entrada (Intersection Observer)
 *  4. Barras de habilidades animadas
 *  5. Filtro de projetos
 *  6. Validação e envio simulado do formulário de contato
 *  7. Rodapé: ano atual
 */

/* ============================================================
   1. NAVBAR — scroll, active link, hambúrguer mobile
   ============================================================ */

/** Referências ao DOM */
const navbar    = document.getElementById('navbar');
const navLinks  = document.querySelectorAll('.nav-link');
const hamburger = document.getElementById('hamburger');
const navMenu   = document.getElementById('nav-links');

/**
 * Adiciona a classe .scrolled à navbar quando o usuário
 * rola mais de 60px para baixo, ativando o fundo semitransparente.
 */
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
  highlightActiveSection();
});

/**
 * Determina qual seção está atualmente visível e marca o
 * link de navegação correspondente como .active.
 */
function highlightActiveSection() {
  const sections = document.querySelectorAll('section[id], header[id]');
  let current = '';

  sections.forEach(section => {
    const sectionTop = section.offsetTop - 80; /* margem da navbar */
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    /* O href do link é '#secao', então comparamos após o '#' */
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
}

/**
 * Abre / fecha o menu mobile ao clicar no botão hambúrguer.
 * Alterna aria-expanded para acessibilidade.
 */
hamburger.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);
});

/**
 * Fecha o menu mobile ao clicar em qualquer link de navegação.
 */
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  });
});


/* ============================================================
   2. HERO — grade de pontos decorativa
   ============================================================ */

/**
 * Cria 80 pontos posicionados aleatoriamente dentro do hero.
 * Quantidade reduzida em mobile para performance.
 */
(function createHeroDots() {
  const container = document.getElementById('hero-dots');
  if (!container) return;

  const isMobile = window.innerWidth < 768;
  const count    = isMobile ? 40 : 80;

  for (let i = 0; i < count; i++) {
    const dot = document.createElement('span');
    dot.classList.add('hero-dot');

    /* Posição aleatória dentro do container */
    dot.style.top  = Math.random() * 100 + '%';
    dot.style.left = Math.random() * 100 + '%';

    /* Opacidade ligeiramente variada para profundidade */
    dot.style.opacity = (Math.random() * 0.15 + 0.08).toFixed(2);

    container.appendChild(dot);
  }
})();


/* ============================================================
   3. INTERSECTION OBSERVER — animações de entrada
   ============================================================ */

/**
 * Usa a API nativa IntersectionObserver para detectar quando
 * elementos entram na viewport e adicionar a classe .revealed,
 * que dispara as transições CSS definidas no style.css.
 */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        /* Para de observar após revelar (animação acontece só uma vez) */
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.15, /* 15% do elemento precisa estar visível */
    rootMargin: '0px 0px -40px 0px'
  }
);

/* Observa: cartão de sobre, itens da timeline e cards de projeto */
document.querySelectorAll(
  '#sobre-card, .timeline-item, .project-card'
).forEach(el => revealObserver.observe(el));


/* ============================================================
   4. BARRAS DE HABILIDADES — animação ao entrar na viewport
   ============================================================ */

/**
 * Cada .skills-bar tem a largura final em --pct via CSS.
 * O Observer adiciona .animated quando a seção de formação
 * aparece, disparando a transição de width: 0 → var(--pct).
 */
const skillsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.skills-bar').forEach(bar => {
          bar.classList.add('animated');
        });
        skillsObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.3 }
);

const skillsSection = document.querySelector('.skills-grid');
if (skillsSection) skillsObserver.observe(skillsSection);


/* ============================================================
   5. FILTRO DE PROJETOS
   ============================================================ */

/**
 * Ao clicar em um botão de filtro:
 *  - Marca o botão clicado como .active
 *  - Exibe apenas os cards cujo data-category inclui o filtro
 *  - "todos" exibe todos os cards
 */
const filterBtns    = document.querySelectorAll('.filter-btn');
const projectCards  = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    /* Atualiza estado visual dos botões */
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter; /* "todos", "web", "social", "gestao" */

    projectCards.forEach(card => {
      if (filter === 'todos') {
        /* Mostra todos */
        card.classList.remove('hidden');
      } else {
        /* data-category pode conter múltiplas categorias separadas por espaço */
        const categories = card.dataset.category.split(' ');
        const match      = categories.includes(filter);
        card.classList.toggle('hidden', !match);
      }
    });
  });
});


/* ============================================================
   6. FORMULÁRIO DE CONTATO — validação e envio simulado
   ============================================================ */

const form       = document.getElementById('contact-form');
const btnSubmit  = document.getElementById('btn-submit');
const successMsg = document.getElementById('form-success');

/* Campos e seus elementos de erro correspondentes */
const fields = [
  {
    input : document.getElementById('nome'),
    error : document.getElementById('nome-error'),
    /** Valida nome: obrigatório, mínimo 3 caracteres */
    validate(val) {
      if (!val.trim())         return 'Por favor, informe seu nome.';
      if (val.trim().length < 3) return 'O nome deve ter ao menos 3 caracteres.';
      return '';
    }
  },
  {
    input : document.getElementById('email'),
    error : document.getElementById('email-error'),
    /** Valida e-mail: obrigatório + formato básico com regex */
    validate(val) {
      if (!val.trim()) return 'Por favor, informe seu e-mail.';
      /* Regex simples para formato de e-mail */
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(val)) return 'Informe um e-mail válido (ex: nome@dominio.com).';
      return '';
    }
  },
  {
    input : document.getElementById('mensagem'),
    error : document.getElementById('mensagem-error'),
    /** Valida mensagem: obrigatória, mínimo 10 caracteres */
    validate(val) {
      if (!val.trim())          return 'Por favor, escreva uma mensagem.';
      if (val.trim().length < 10) return 'A mensagem deve ter ao menos 10 caracteres.';
      return '';
    }
  }
];

/**
 * Valida um único campo:
 *  - Chama a função validate() do campo
 *  - Exibe ou limpa a mensagem de erro
 *  - Adiciona/remove a classe .error no input
 * @param {object} field — objeto do array fields
 * @returns {boolean} true se válido
 */
function validateField(field) {
  const errorMsg = field.validate(field.input.value);
  field.error.textContent = errorMsg;
  field.input.classList.toggle('error', errorMsg !== '');
  return errorMsg === '';
}

/**
 * Validação em tempo real: ao sair de um campo (blur),
 * valida e exibe o erro imediatamente.
 */
fields.forEach(field => {
  field.input.addEventListener('blur', () => validateField(field));

  /* Remove o erro assim que o usuário começa a corrigir */
  field.input.addEventListener('input', () => {
    if (field.input.classList.contains('error')) {
      field.error.textContent = '';
      field.input.classList.remove('error');
    }
  });
});

/**
 * Ao submeter o formulário:
 *  1. Previne o comportamento padrão (não recarregar a página)
 *  2. Valida todos os campos
 *  3. Se válido, simula envio (loader no botão + timeout)
 *  4. Exibe mensagem de sucesso e limpa o formulário
 */
form.addEventListener('submit', (event) => {
  /* Evita o envio real e o recarregamento da página */
  event.preventDefault();

  /* Valida todos os campos e coleta resultados */
  const results = fields.map(field => validateField(field));
  const allValid = results.every(r => r === true);

  if (!allValid) {
    /* Foca o primeiro campo com erro para acessibilidade */
    const firstErrorField = fields.find(f => !f.validate(f.input.value));
    if (firstErrorField) firstErrorField.input.focus();
    return;
  }

  /* ── Simulação de envio ── */
  btnSubmit.disabled     = true;
  btnSubmit.textContent  = 'Enviando…';

  /**
   * Simula delay de rede (1,5s) antes de confirmar o envio.
   * Em produção, substituir por fetch() para uma API real.
   */
  setTimeout(() => {
    /* Limpa o formulário */
    form.reset();
    fields.forEach(f => {
      f.error.textContent = '';
      f.input.classList.remove('error');
    });

    /* Exibe mensagem de sucesso */
    successMsg.hidden      = false;
    btnSubmit.disabled     = false;
    btnSubmit.textContent  = 'Enviar mensagem';

    /* Esconde a mensagem de sucesso após 6 segundos */
    setTimeout(() => { successMsg.hidden = true; }, 6000);
  }, 1500);
});


/* ============================================================
   7. RODAPÉ — ano atual dinâmico
   ============================================================ */

/**
 * Insere o ano corrente no rodapé automaticamente,
 * sem necessidade de atualizar manualmente a cada ano.
 */
const yearEl = document.getElementById('footer-year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
