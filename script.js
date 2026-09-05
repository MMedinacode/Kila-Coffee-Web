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
  { id: 'brunch', label: 'Brunch & Almuerzo' },
];

const MENU = {
  cafe: [
    { n: 'Espresso', d: 'Simple o doble.', p: 2200, note: 'Doble $2.500' },
    { n: 'Americano', d: 'Chico o grande.', p: 2500, note: 'Grande $2.900' },
    { n: 'Capuccino', d: 'Espresso, leche vaporizada y espuma.', p: 2900, note: 'Doble $3.200 (verificar)' },
    { n: 'Mokaccino', d: 'Espresso, chocolate y leche vaporizada.', p: 3900, note: 'Ristretto doble $2.200 (verificar)' },
    { n: 'Latte', d: 'Chico o grande.', p: 3500, note: 'Grande $4.000 · Doble $3.900 (verificar)' },
    { n: 'Chocolate caliente', d: 'Chocolate caliente clásico.', p: 3900 },
    { n: 'Té e infusiones', d: 'Selección de té e infusiones.', p: 2500 },
  ],
  brunch: [
    { n: 'Bowl de palta y huevo', d: 'Huevo revuelto, palta, tomate y champiñones salteados con tostadas.', p: null },
    { n: 'Tabla de desayuno', d: 'Café o té, jugo natural de naranja, fruta y tostadas.', p: null },
    { n: 'Postre de la casa', d: 'Selección de postres, según disponibilidad del día.', p: null },
    { n: 'Menú de almuerzo', d: 'Disponible de martes a viernes, 13:00 a 15:00 hrs.', p: null },
  ]
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

  const panel = document.createElement('div');
  panel.className = 'menu-panel' + (i === 0 ? ' active' : '');
  panel.id = 'panel-' + cat.id;
  const grid = document.createElement('div');
  grid.className = 'menu-grid';
  const catBlock = document.createElement('div');
  catBlock.className = 'menu-cat';
  const h = document.createElement('h3');
  h.textContent = cat.label;
  catBlock.appendChild(h);
  MENU[cat.id].forEach(item => {
    const row = document.createElement('div');
    row.className = 'menu-item';
    const noteHtml = item.note ? `<span class="desc">${item.note}</span>` : (item.d ? `<span class="desc">${item.d}</span>` : '');
    row.innerHTML = `<span class="name">${item.n}${noteHtml}</span><span class="price">${money(item.p)}</span>`;
    catBlock.appendChild(row);
  });
  if (cat.id === 'brunch') {
    const note = document.createElement('p');
    note.className = 'menu-note';
    note.textContent = 'No existe una pizarra de precios para los platos de comida — precios a confirmar directamente en el local.';
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
