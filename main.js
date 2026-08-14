const root = document.documentElement;
root.classList.remove('no-js');
root.dataset.theme = root.dataset.theme || 'day';

const products = [
  {
    name: 'Solstice Matcha Bloom',
    category: 'tea',
    price: '$38',
    tags: ['chlorophyll rich', 'cold whisk'],
    description: 'Shade-grown gyokuro powdered with moringa + kelp minerals.',
    isNew: true,
    badge: 'Glow AM',
  },
  {
    name: 'Forest Pulse Elixir',
    category: 'supplement',
    price: '$42',
    tags: ['adaptogen', 'focus'],
    description: 'Lion’s mane + guayusa tonic for steady cognition.',
    isNew: false,
    badge: 'Cognition',
  },
  {
    name: 'Verdant Bloom Serum',
    category: 'body',
    price: '$68',
    tags: ['phytoceramide', 'dew skin'],
    description: 'Bio-fermented squalane, bakuchiol, and chlorophyll micro-encapsulates.',
    isNew: true,
    badge: 'Skin lab',
  },
  {
    name: 'Afterglow Mineral Mist',
    category: 'body',
    price: '$29',
    tags: ['magnesium', 'cooling'],
    description: 'Blue tansy hydrosol with glacial magnesium for instant calm.',
    isNew: false,
    badge: 'Recovery',
  },
  {
    name: 'Noon Drift Tonic',
    category: 'tea',
    price: '$32',
    tags: ['sparkling', 'electrolyte'],
    description: 'Sparkling kombucha with African baobab + sea minerals.',
    isNew: false,
    badge: 'Refresh',
  },
  {
    name: 'Deep Root Complex',
    category: 'supplement',
    price: '$54',
    tags: ['immune', 'daily ritual'],
    description: 'Reishi spores, elderberry, and Nigerian ginger root concentrate.',
    isNew: true,
    badge: 'Immune',
  },
];

const testimonials = [
  {
    quote:
      'Nygra’s pairing studio reads my circadian mood and builds a cart that feels choreographed. It’s luxurious but grounded.',
    name: 'Yomi Adebayo',
    role: 'Creative director, NXT Haus',
  },
  {
    quote:
      'The ritual pods taught our wellness team how to merchandise scent, light, and temperature. Every SKU has a living story.',
    name: 'Sage Morales',
    role: 'Retail innovation, Tide & Terra',
  },
  {
    quote:
      'Sourcing data, soil metrics, and farmer voice notes pack the PDP. It is the first ecommerce experience I trust.',
    name: 'Mei Lin',
    role: 'Founder, Slow Atelier',
  },
];

const journalEntries = [
  {
    title: 'Mapping chlorophyll spikes in the midnight harvest',
    category: 'field data',
    readingTime: '6 min read',
    summary: 'IoT leaf sensors in Cross River forests highlight how moon cycles impact brew potency.',
  },
  {
    title: 'Designing packaging that composts in tropical humidity',
    category: 'design lab',
    readingTime: '4 min read',
    summary: 'A behind-the-scenes look at our kenaf fiber casings with living inks.',
  },
  {
    title: 'Why we micro-dose ginger CO₂ extract in adaptogens',
    category: 'science',
    readingTime: '5 min read',
    summary: 'Micro-dosed ginger CO₂ softens cortisol spikes and keeps palate clarity.',
  },
];

const select = (selector) => document.querySelector(selector);
const selectAll = (selector) => Array.from(document.querySelectorAll(selector));

const productGrid = select('[data-product-grid]');
const filterButtons = selectAll('[data-filter-btn]');
const newToggle = select('[data-toggle-new]');

const renderProducts = ({ filter = 'all', onlyNew = false } = {}) => {
  if (!productGrid) return;
  productGrid.innerHTML = products
    .filter((product) => (filter === 'all' ? true : product.category === filter))
    .filter((product) => (onlyNew ? product.isNew : true))
    .map(
      (product) => `
        <article class="product-card reveal-on-scroll" data-category="${product.category}">
          <header>
            <span class="tag">${product.badge}</span>
            ${product.isNew ? '<span class="tag">new</span>' : ''}
          </header>
          <h3>${product.name}</h3>
          <p>${product.description}</p>
          <div class="product-meta">
            <span>${product.category}</span>
            <strong>${product.price}</strong>
          </div>
          <div class="product-tags">
            ${product.tags.map((tag) => `<span class="tag">${tag}</span>`).join('')}
          </div>
        </article>
      `,
    )
    .join('');
};

const updateProductFilters = () => {
  const activeBtn = filterButtons.find((btn) => btn.classList.contains('is-active'));
  const filter = activeBtn?.dataset.filterBtn || 'all';
  renderProducts({ filter, onlyNew: newToggle?.checked });
  observeReveals();
};

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    filterButtons.forEach((btn) => btn.classList.remove('is-active'));
    button.classList.add('is-active');
    updateProductFilters();
  });
});

newToggle?.addEventListener('change', updateProductFilters);

const navToggle = select('[data-nav-toggle]');
const navLinks = select('[data-nav-links]');

navToggle?.addEventListener('click', () => {
  const isOpen = navLinks?.classList.toggle('is-open');
  navToggle.setAttribute('aria-expanded', String(!!isOpen));
});

navLinks
  ?.querySelectorAll('a')
  .forEach((anchor) =>
    anchor.addEventListener('click', () => {
      navLinks.classList.remove('is-open');
      navToggle?.setAttribute('aria-expanded', 'false');
    }),
  );

selectAll('[data-scroll-to]').forEach((button) => {
  button.addEventListener('click', () => {
    const target = button.dataset.scrollTo;
    if (!target) return;
    document.querySelector(target)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    navLinks?.classList.remove('is-open');
    navToggle?.setAttribute('aria-expanded', 'false');
  });
});

const themeToggle = select('[data-theme-toggle]');
themeToggle?.addEventListener('click', () => {
  const current = root.dataset.theme === 'night' ? 'day' : 'night';
  root.dataset.theme = current;
  const pressed = current === 'night';
  themeToggle.setAttribute('aria-pressed', String(pressed));
  themeToggle.textContent = pressed ? 'Solar mode' : 'Aura mode';
});

const testimonialTrack = select('[data-testimonial-track]');
const testimonialDots = select('[data-testimonial-dots]');
let testimonialIndex = 0;
let testimonialInterval;

const renderTestimonials = () => {
  if (!testimonialTrack || !testimonialDots) return;
  testimonialTrack.innerHTML = testimonials
    .map(
      ({ quote, name, role }) => `
        <article class="testimonial-card">
          <blockquote>“${quote}”</blockquote>
          <cite>${name} · <span>${role}</span></cite>
        </article>
      `,
    )
    .join('');

  testimonialDots.innerHTML = testimonials
    .map(
      (_, index) =>
        `<button type="button" aria-label="Show testimonial ${index + 1}" data-dot="${index}"></button>`,
    )
    .join('');
};

const setActiveTestimonial = (index) => {
  const cards = selectAll('.testimonial-card');
  const dots = selectAll('[data-dot]');
  if (!cards.length) return;
  testimonialIndex = (index + cards.length) % cards.length;
  cards.forEach((card, idx) => {
    card.classList.toggle('is-active', idx === testimonialIndex);
  });
  dots.forEach((dot, idx) => {
    dot.classList.toggle('is-active', idx === testimonialIndex);
  });
};

const startTestimonialLoop = () => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  clearInterval(testimonialInterval);
  testimonialInterval = setInterval(() => setActiveTestimonial(testimonialIndex + 1), 6000);
};

const initTestimonials = () => {
  renderTestimonials();
  setActiveTestimonial(0);
  startTestimonialLoop();
  testimonialDots?.addEventListener('click', (event) => {
    if (!(event.target instanceof HTMLButtonElement)) return;
    const idx = Number(event.target.dataset.dot);
    if (Number.isNaN(idx)) return;
    setActiveTestimonial(idx);
    startTestimonialLoop();
  });
};

const journalGrid = select('[data-journal-grid]');
const renderJournal = () => {
  if (!journalGrid) return;
  journalGrid.innerHTML = journalEntries
    .map(
      ({ title, category, summary, readingTime }) => `
        <article class="journal-card reveal-on-scroll">
          <span class="badge">${category}</span>
          <h3>${title}</h3>
          <p>${summary}</p>
          <span>${readingTime}</span>
        </article>
      `,
    )
    .join('');
};

const newsletterForm = select('[data-newsletter]');
newsletterForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const feedback = form.querySelector('.form-feedback');
  const formData = new FormData(form);
  const email = formData.get('email');
  feedback.textContent = 'Sending...';
  setTimeout(() => {
    feedback.textContent = `Welcome aboard, ${email}. First log ships tonight.`;
    form.reset();
  }, 900);
});

const observeReveals = () => {
  const elements = selectAll('.reveal-on-scroll');
  if (!elements.length) return;
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 },
  );
  elements.forEach((el) => observer.observe(el));
};

const initYear = () => {
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
};

document.addEventListener('DOMContentLoaded', () => {
  renderProducts({ filter: 'all', onlyNew: false });
  initTestimonials();
  renderJournal();
  observeReveals();
  initYear();
});

