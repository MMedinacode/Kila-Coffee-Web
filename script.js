/* ============================================================
   PANTALLA DE CARGA — rápida a propósito
   ============================================================ */
(function(){
  const el = document.getElementById('loadScreen');
  function hide(){ el.classList.add('hidden'); }
  window.addEventListener('load', () => setTimeout(hide, 200));
  setTimeout(hide, 700);
})();

/* ============================================================
   NAVEGACIÓN SPA POR PESTAÑAS
   ============================================================ */
const panels = document.querySelectorAll('.tab-panel');
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); revealObserver.unobserve(e.target); } });
}, { threshold: 0.15 });

function goToTab(tabId) {
  panels.forEach(p => p.classList.toggle('active', p.dataset.tabPanel === tabId));
  document.querySelectorAll('.nav-link').forEach(l => l.classList.toggle('active', l.dataset.tab === tabId));
  window.scrollTo({ top: 0, behavior: 'smooth' });
  document.getElementById('main-nav').classList.remove('open');
  const activePanel = document.querySelector('.tab-panel.active');
  if (activePanel) activePanel.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
}
document.querySelectorAll('[data-tab]').forEach(el => {
  el.addEventListener('click', (e) => { e.preventDefault(); goToTab(el.dataset.tab); });
});
document.querySelectorAll('.tab-panel.active .reveal').forEach(el => revealObserver.observe(el));

document.getElementById('navToggle').addEventListener('click', () => {
  document.getElementById('main-nav').classList.toggle('open');
});

/* --------------------------------------------------------------
   CARTA REAL — precios de la pizarra "Compartir un Café" de la
   landing original. Ítems de brunch/almuerzo sin precio confirmado
   (no hay pizarra de precios para comida) — se muestran sin
   inventar un valor.
-------------------------------------------------------------- */
const CATEGORIES = [
  { id: 'cafe', label: 'Café' },
  { id: 'pizzas', label: 'Pizzas' },
  { id: 'dulces', label: 'Panadería y Dulces' },
  { id: 'brunch', label: 'Brunch & Almuerzo' },
];

const MENU = {
  cafe: {
    items: [
      { n: 'Espresso', d: 'Carga simple.', p: 2200 },
      { n: 'Espresso doble', d: 'Carga doble.', p: 2500 },
      { n: 'Americano', d: 'Tamaño chico.', p: 2500 },
      { n: 'Americano grande', d: 'Tamaño grande.', p: 2900 },
      { n: 'Capuccino', d: 'Espresso, leche vaporizada y espuma.', p: 2900 },
      { n: 'Mokaccino', d: 'Espresso, chocolate y leche vaporizada.', p: 3900 },
      { n: 'Latte', d: 'Espresso y leche vaporizada.', p: 3500 },
      { n: 'Chocolate caliente', d: 'Chocolate caliente clásico.', p: 3900 },
      { n: 'Té e infusiones', d: 'Selección de té e infusiones.', p: 2500 },
    ]
  },
  pizzas: {
    photo: 'fotos/pizza-coppa-rucula.jpg',
    items: [
      { n: 'Pizza Coppa Rúcula', d: 'Jamón serrano, rúcula y queso — uno de los más pedidos.', p: null },
      { n: 'Pizza mozzarella y albahaca', d: 'Salsa de tomate, mozzarella y albahaca fresca.', p: null },
    ],
    note: 'Los precios de las pizzas se consultan en el local. Todos los viernes desde las 16:30 hay 30% de descuento en pizza pepperoni, para consumo en el local.'
  },
  dulces: {
    photo: 'fotos/vitrina.jpg',
    items: [
      { n: 'Cookies (3 unidades)', d: 'De la vitrina.', p: 1500 },
      { n: 'Pastelería del día', d: 'Selección de la vitrina, cambia día a día.', p: 1500 },
    ],
    note: 'La selección de la vitrina varía según el día.'
  },
  brunch: {
    items: [
      { n: 'Bowl de palta y huevo', d: 'Huevo revuelto, palta, tomate y champiñones salteados con tostadas.', p: null, photo: 'fotos/bowl-palta-huevo.jpg' },
      { n: 'Tabla de desayuno', d: 'Café o té, jugo natural de naranja, fruta y tostadas.', p: null },
      { n: 'Postre de la casa', d: 'Selección de postres, según disponibilidad del día.', p: null },
      { n: 'Menú de almuerzo', d: 'Disponible de martes a viernes, 13:00 a 15:00 hrs.', p: null },
    ],
    note: 'Los precios de los platos se consultan en el local.'
  }
};

const money = n => n === null ? 'Consultar' : '$' + n.toLocaleString('es-CL');

const tabsEl = document.getElementById('menuTabs');
const panelsEl = document.getElementById('menuPanels');

CATEGORIES.forEach((cat, i) => {
  const tab = document.createElement('button');
  tab.className = 'menu-tab' + (i === 0 ? ' active' : '');
  tab.textContent = cat.label;
  tab.dataset.key = cat.id;
  tab.addEventListener('click', () => showMenuTab(cat.id));
  tabsEl.appendChild(tab);

  const data = MENU[cat.id];
  const panel = document.createElement('div');
  panel.className = 'menu-panel' + (i === 0 ? ' active' : '');
  panel.id = 'panel-' + cat.id;
  if (data.photo) {
    const img = document.createElement('img');
    img.src = data.photo; img.alt = cat.label; img.className = 'menu-cat-photo';
    panel.appendChild(img);
  }
  const grid = document.createElement('div');
  grid.className = 'menu-grid';
  const catBlock = document.createElement('div');
  catBlock.className = 'menu-cat';
  const h = document.createElement('h3');
  h.textContent = cat.label;
  catBlock.appendChild(h);
  data.items.forEach(item => {
    const row = document.createElement('div');
    row.className = 'menu-item';
    const noteHtml = item.note ? `<span class="desc">${item.note}</span>` : (item.d ? `<span class="desc">${item.d}</span>` : '');
    const nameSpan = document.createElement('span');
    nameSpan.className = 'name';
    if (item.photo) {
      const thumb = document.createElement('img');
      thumb.src = item.photo; thumb.alt = item.n; thumb.className = 'item-thumb';
      nameSpan.appendChild(thumb);
    }
    const textWrap = document.createElement('span');
    textWrap.innerHTML = `${item.n}${noteHtml}`;
    nameSpan.appendChild(textWrap);
    const priceSpan = document.createElement('span');
    priceSpan.className = 'price';
    priceSpan.textContent = money(item.p);
    row.appendChild(nameSpan);
    row.appendChild(priceSpan);
    catBlock.appendChild(row);
  });
  if (data.note) {
    const note = document.createElement('p');
    note.className = 'menu-note';
    note.textContent = data.note;
    catBlock.appendChild(note);
  }
  grid.appendChild(catBlock);
  panel.appendChild(grid);
  panelsEl.appendChild(panel);
});

function showMenuTab(key) {
  document.querySelectorAll('.menu-tab').forEach(t => t.classList.toggle('active', t.dataset.key === key));
  document.querySelectorAll('.menu-panel').forEach(p => p.classList.toggle('active', p.id === 'panel-' + key));
}

/* --------------------------------------------------------------
   ESTADO ABIERTO / CERRADO — horario real confirmado en Google Maps
   el 04-09-2026: Martes a viernes 10:00–20:20, Sábado y domingo
   10:00–15:30 y 16:30–20:20 (corte de tarde), Lunes cerrado.
-------------------------------------------------------------- */
function updateOpenStatus() {
  let day, minutes;
  try {
    const now = new Date();
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Santiago', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false
    }).formatToParts(now);
    const map = {}; parts.forEach(p => map[p.type] = p.value);
    const weekdayMap = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
    day = weekdayMap[map.weekday];
    minutes = parseInt(map.hour) * 60 + parseInt(map.minute);
  } catch (e) {
    const now = new Date(); day = now.getDay(); minutes = now.getHours() * 60 + now.getMinutes();
  }

  let ranges = [];
  if (day >= 2 && day <= 5) ranges = [[10 * 60, 20 * 60 + 20]];             // Mar-Vie
  else if (day === 6 || day === 0) ranges = [[10 * 60, 15 * 60 + 30], [16 * 60 + 30, 20 * 60 + 20]]; // Sáb-Dom
  // Lunes (1): sin rangos -> cerrado

  const isOpen = ranges.some(([start, end]) => minutes >= start && minutes < end);
  const label = isOpen ? 'Abierto ahora' : 'Cerrado ahora';

  const navDot = document.getElementById('statusDot');
  const navText = document.getElementById('statusText');
  const visitLine = document.getElementById('visitStatusLine');
  navDot.classList.toggle('closed', !isOpen);
  navText.textContent = label;
  if (visitLine) {
    visitLine.textContent = label;
    visitLine.style.cssText = 'font-weight:700; color:' + (isOpen ? '#7bc47f' : 'var(--rojo)') + ';';
  }
}
updateOpenStatus();
setInterval(updateOpenStatus, 60000);
