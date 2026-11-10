/* ==========================================================================
   Fiamma: interactions. Vanilla JS, no dependencies.
   ========================================================================== */

/* ---------- Settings: edit these for your restaurant ---------- */
const CONFIG = {
  // Paste a Formspree / Getform / Netlify Forms endpoint here to receive
  // bookings directly. When empty, the form opens the guest's email app
  // with the request filled in, addressed to RESERVATION_EMAIL.
  FORM_ENDPOINT: '',
  RESERVATION_EMAIL: 'reservations@fiamma.example',
  MAX_GUESTS_ONLINE: 12,
  MAX_DAYS_AHEAD: 90,
  SLOT_MINUTES: 30,
  LAST_SEATING_BEFORE_CLOSE: 60, // minutes
  // Opening hours per weekday (0 = Sunday). Keep in sync with the footer.
  HOURS: {
    0: [['11:00', '14:30'], ['17:00', '21:30']],
    1: [],
    2: [['12:00', '14:30'], ['17:30', '22:00']],
    3: [['12:00', '14:30'], ['17:30', '22:00']],
    4: [['12:00', '14:30'], ['17:30', '22:00']],
    5: [['12:00', '14:30'], ['17:30', '23:00']],
    6: [['11:00', '14:30'], ['17:30', '23:00']],
  },
};

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

/* ---------- Header: solid after scrolling, hides on scroll down ---------- */
const header = $('[data-header]');
const navToggle = $('[data-nav-toggle]');
const mobileNav = $('[data-mobile-nav]');
let lastY = window.scrollY;

function updateHeader() {
  const y = window.scrollY;
  const navOpen = navToggle.getAttribute('aria-expanded') === 'true';
  header.classList.toggle('is-solid', y > 40 && !navOpen);
  if (!navOpen && y > 500 && y > lastY + 4) header.classList.add('is-hidden');
  else if (y < lastY - 4 || y <= 500) header.classList.remove('is-hidden');
  lastY = y;
}

/* ---------- Mobile navigation ---------- */
function setNav(open) {
  navToggle.setAttribute('aria-expanded', String(open));
  mobileNav.hidden = !open;
  document.body.classList.toggle('is-locked', open);
  header.classList.remove('is-hidden');
  header.classList.toggle('is-solid', !open && window.scrollY > 40);
  if (open) $('a', mobileNav).focus();
}
navToggle.addEventListener('click', () => setNav(navToggle.getAttribute('aria-expanded') !== 'true'));
mobileNav.addEventListener('click', (e) => { if (e.target.closest('a')) setNav(false); });
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !mobileNav.hidden) { setNav(false); navToggle.focus(); }
});
window.matchMedia('(min-width: 1081px)').addEventListener('change', (e) => { if (e.matches) setNav(false); });

/* ---------- Scroll reveals ---------- */
$$('[data-stagger]').forEach((group) => {
  $$('[data-reveal]', group).forEach((el, i) => el.style.setProperty('--i', i));
});
if ('IntersectionObserver' in window && !reduceMotion) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add('is-in'); io.unobserve(entry.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  $$('[data-reveal]').forEach((el) => io.observe(el));
} else {
  $$('[data-reveal]').forEach((el) => el.classList.add('is-in'));
}

/* ---------- Ring collage: tiles fly in from a diagonal cascade ---------- */
const collage = $('[data-collage]');
const ring = collage && $('.ring', collage);
const tiles = ring ? $$('.ring__tile', ring) : [];

function layoutCascade() {
  if (!ring) return;
  const w = ring.clientWidth;
  const n = tiles.length;
  tiles.forEach((tile, i) => {
    const t = i / (n - 1);
    // Cascade runs bottom-left → top-right, like a fanned stack of photos.
    const cx = -0.3 * w + t * 1.25 * w;
    const cy = 0.95 * w - t * 1.05 * w;
    tile.style.setProperty('--sx', `${Math.round(cx - tile.offsetLeft)}px`);
    tile.style.setProperty('--sy', `${Math.round(cy - tile.offsetTop)}px`);
  });
}

function updateCollage(vh) {
  if (!ring || reduceMotion) return;
  const r = collage.getBoundingClientRect();
  if (r.bottom < 0 || r.top > vh) return;
  const raw = clamp((vh - r.top) / (vh * 0.85), 0, 1);
  const eased = 1 - Math.pow(1 - raw, 3);
  ring.style.setProperty('--p', eased.toFixed(3));
}

/* ---------- Parallax ---------- */
const parallaxEls = $$('[data-parallax]').map((el) => ({ el, speed: parseFloat(el.dataset.parallax) || 0 }));

function updateParallax(vh) {
  if (reduceMotion) return;
  parallaxEls.forEach(({ el, speed }) => {
    const host = el.parentElement.getBoundingClientRect();
    if (host.bottom < -200 || host.top > vh + 200) return;
    const offset = (host.top + host.height / 2 - vh / 2) * speed;
    el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
  });
}

/* ---------- One rAF-throttled scroll loop ---------- */
let ticking = false;
function onScroll() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    const vh = window.innerHeight;
    updateHeader();
    updateCollage(vh);
    updateParallax(vh);
    ticking = false;
  });
}
window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', () => { layoutCascade(); onScroll(); });
window.addEventListener('load', () => { layoutCascade(); onScroll(); });
layoutCascade();
onScroll();

/* ---------- Menu tabs (cards act as tabs) ---------- */
const tablist = $('[data-tabs]');
if (tablist) {
  const tabs = $$('[role="tab"]', tablist);
  const select = (tab, focus = false) => {
    tabs.forEach((t) => {
      const on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
    });
    if (focus) tab.focus();
  };
  tabs.forEach((tab) => tab.addEventListener('click', () => select(tab)));
  tablist.addEventListener('keydown', (e) => {
    const i = tabs.indexOf(document.activeElement);
    if (i < 0) return;
    const next = { ArrowRight: i + 1, ArrowDown: i + 1, ArrowLeft: i - 1, ArrowUp: i - 1, Home: 0, End: tabs.length - 1 }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    select(tabs[(next + tabs.length) % tabs.length], true);
  });
}

/* ---------- Carousel ---------- */
$$('[data-carousel]').forEach((root) => {
  const track = $('[data-carousel-track]', root);
  const prev = $('[data-carousel-prev]', root);
  const next = $('[data-carousel-next]', root);
  const step = () => {
    const card = track.firstElementChild;
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    return card ? card.getBoundingClientRect().width + gap : track.clientWidth;
  };
  const sync = () => {
    prev.disabled = track.scrollLeft <= 2;
    next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;
  };
  const behavior = reduceMotion ? 'auto' : 'smooth';
  prev.addEventListener('click', () => track.scrollBy({ left: -step(), behavior }));
  next.addEventListener('click', () => track.scrollBy({ left: step(), behavior }));
  track.addEventListener('scroll', sync, { passive: true });
  track.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); track.scrollBy({ left: step(), behavior }); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); track.scrollBy({ left: -step(), behavior }); }
  });

  // Mouse drag (touch already scrolls natively).
  let startX = 0; let startScroll = 0; let dragging = false;
  track.addEventListener('pointerdown', (e) => {
    if (e.pointerType !== 'mouse') return;
    dragging = true; startX = e.clientX; startScroll = track.scrollLeft;
    track.setPointerCapture(e.pointerId);
    track.classList.add('is-dragging');
  });
  track.addEventListener('pointermove', (e) => {
    if (dragging) track.scrollLeft = startScroll - (e.clientX - startX);
  });
  const end = () => {
    if (!dragging) return;
    dragging = false;
    track.classList.remove('is-dragging');
    // Snap to the nearest card after a drag.
    const s = step();
    track.scrollTo({ left: Math.round(track.scrollLeft / s) * s, behavior });
  };
  track.addEventListener('pointerup', end);
  track.addEventListener('pointercancel', end);
  window.addEventListener('resize', sync);
  sync();
});

/* ---------- Reservation form ---------- */
const form = $('[data-reserve-form]');
if (form) {
  const success = $('[data-reserve-success]');
  const status = $('[data-form-status]', form);
  const dateInput = form.elements.date;
  const timeSelect = form.elements.time;
  const guestsSelect = form.elements.guests;
  const submitBtn = $('button[type="submit"]', form);
  let attempted = false;

  const pad = (n) => String(n).padStart(2, '0');
  const isoDate = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const parseDate = (value) => {
    const [y, m, d] = value.split('-').map(Number);
    return new Date(y, m - 1, d);
  };
  const toMinutes = (hhmm) => { const [h, m] = hhmm.split(':').map(Number); return h * 60 + m; };
  const label = (mins) => {
    const h = Math.floor(mins / 60); const m = mins % 60;
    return `${((h + 11) % 12) + 1}:${pad(m)} ${h < 12 ? 'am' : 'pm'}`;
  };
  const today = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; };

  // Date limits
  const maxDate = today(); maxDate.setDate(maxDate.getDate() + CONFIG.MAX_DAYS_AHEAD);
  dateInput.min = isoDate(today());
  dateInput.max = isoDate(maxDate);

  // Guests 1–N, plus a "large party" option
  guestsSelect.innerHTML = '';
  for (let g = 1; g <= CONFIG.MAX_GUESTS_ONLINE; g++) {
    guestsSelect.add(new Option(`${g} guest${g > 1 ? 's' : ''}`, String(g), false, g === 2));
  }
  guestsSelect.add(new Option(`${CONFIG.MAX_GUESTS_ONLINE + 1}+ guests (contact us)`, 'large'));

  function slotsFor(date) {
    const ranges = CONFIG.HOURS[date.getDay()] || [];
    const now = new Date();
    const isToday = isoDate(date) === isoDate(now);
    const nowMins = now.getHours() * 60 + now.getMinutes();
    const slots = [];
    ranges.forEach(([open, close]) => {
      for (let t = toMinutes(open); t <= toMinutes(close) - CONFIG.LAST_SEATING_BEFORE_CLOSE; t += CONFIG.SLOT_MINUTES) {
        if (!isToday || t > nowMins + 30) slots.push(t);
      }
    });
    return slots;
  }

  function fillTimes() {
    const previous = timeSelect.value;
    timeSelect.innerHTML = '';
    if (!dateInput.value) { timeSelect.add(new Option('Choose a date first', '')); return; }
    const slots = slotsFor(parseDate(dateInput.value));
    if (!slots.length) { timeSelect.add(new Option('No times available', '')); return; }
    timeSelect.add(new Option('Select a time', ''));
    slots.forEach((t) => {
      const v = `${pad(Math.floor(t / 60))}:${pad(t % 60)}`;
      timeSelect.add(new Option(label(t), v, false, v === previous));
    });
  }
  dateInput.addEventListener('change', () => { fillTimes(); if (attempted) validate(timeSelect); });

  function messageFor(field) {
    const v = field.validity;
    switch (field.name) {
      case 'name':
        if (v.valueMissing || !field.value.trim()) return 'Please tell us your name.';
        break;
      case 'email':
        if (v.valueMissing) return 'Please enter your email.';
        if (v.typeMismatch) return 'That email address doesn’t look right.';
        break;
      case 'phone':
        if (v.valueMissing) return 'Please add a phone number in case we need to reach you.';
        if (v.patternMismatch) return 'Use digits, spaces and + ( ) - only.';
        break;
      case 'date': {
        if (v.valueMissing || !field.value) return 'Please choose a date.';
        const d = parseDate(field.value);
        if (d < today()) return 'Please choose today or a later date.';
        if (d > maxDate) return `We take online bookings up to ${CONFIG.MAX_DAYS_AHEAD} days ahead.`;
        if (!(CONFIG.HOURS[d.getDay()] || []).length) return 'We’re closed that day. Please pick another date.';
        if (!slotsFor(d).length) return 'No times left on that date. Please pick another.';
        break;
      }
      case 'time':
        if (!field.value) return 'Please choose a time.';
        break;
      case 'guests':
        if (field.value === 'large') return `For ${CONFIG.MAX_GUESTS_ONLINE + 1}+ guests, please call or email us and we’ll plan it with you.`;
        break;
      default:
    }
    return '';
  }

  function validate(field) {
    const msg = messageFor(field);
    const err = document.getElementById(`${field.id}-err`);
    field.setAttribute('aria-invalid', msg ? 'true' : 'false');
    if (err) err.textContent = msg;
    return !msg;
  }

  const fields = ['name', 'email', 'phone', 'date', 'time', 'guests'].map((n) => form.elements[n]);
  fields.forEach((f) => {
    f.addEventListener(f.tagName === 'SELECT' ? 'change' : 'input', () => { if (attempted) validate(f); });
    f.addEventListener('blur', () => { if (attempted) validate(f); });
  });

  function showSuccess(message) {
    form.hidden = true;
    success.hidden = false;
    if (message) $('[data-success-message]', success).textContent = message;
    success.focus();
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    attempted = true;
    const results = fields.map(validate);
    const firstBad = fields[results.indexOf(false)];
    if (firstBad) {
      status.textContent = 'Please check the highlighted fields.';
      firstBad.focus();
      return;
    }
    status.textContent = '';
    const data = Object.fromEntries(new FormData(form));
    const when = `${parseDate(data.date).toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' })} at ${label(toMinutes(data.time))}`;

    if (!CONFIG.FORM_ENDPOINT) {
      const body = [
        `Name: ${data.name}`, `Email: ${data.email}`, `Phone: ${data.phone}`,
        `Date: ${data.date}`, `Time: ${data.time}`, `Guests: ${data.guests}`, `Notes: ${data.notes || '-'}`,
      ].join('\n');
      const href = `mailto:${CONFIG.RESERVATION_EMAIL}?subject=${encodeURIComponent(`Reservation request: ${data.guests} guests, ${data.date} ${data.time}`)}&body=${encodeURIComponent(body)}`;
      window.location.href = href;
      showSuccess(`We’ve opened your email app with your request for ${data.guests} on ${when}. Just press send and we’ll confirm shortly.`);
      return;
    }

    submitBtn.disabled = true;
    submitBtn.firstChild.textContent = 'Sending… ';
    try {
      const res = await fetch(CONFIG.FORM_ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(form),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      showSuccess(`Your request for ${data.guests} on ${when} is in. We’ll confirm by email shortly.`);
    } catch (err) {
      status.textContent = 'Sorry, something went wrong sending your request. Please try again or call us on (000) 555-0142.';
    } finally {
      submitBtn.disabled = false;
      submitBtn.firstChild.textContent = 'Request reservation ';
    }
  });

  $('[data-reserve-again]').addEventListener('click', () => {
    form.reset();
    attempted = false;
    fields.forEach((f) => { f.removeAttribute('aria-invalid'); const err = document.getElementById(`${f.id}-err`); if (err) err.textContent = ''; });
    guestsSelect.value = '2';
    fillTimes();
    success.hidden = true;
    form.hidden = false;
    form.elements.name.focus();
  });

  fillTimes();
}

/* ---------- Newsletter ---------- */
const newsletter = $('[data-newsletter]');
if (newsletter) {
  newsletter.addEventListener('submit', (e) => {
    e.preventDefault();
    const out = $('[data-newsletter-status]', newsletter);
    const input = newsletter.elements.email;
    if (!input.checkValidity()) { out.textContent = 'Please enter a valid email address.'; input.focus(); return; }
    // Connect this to your email provider (Mailchimp, Buttondown…) when ready.
    out.textContent = 'Grazie! You’re on the list.';
    newsletter.reset();
  });
}

/* ---------- Footer year ---------- */
$$('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });
