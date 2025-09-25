// Navigation
function showPage(pageId) {
  // если возвращаемся к списку — убираем #service/ID
  if (pageId === 'services' && location.hash) {
    history.replaceState(null, '', location.pathname + location.search);
  }

  // переключение секций
  document.querySelectorAll('.page-section').forEach(p => p.classList.remove('active'));
  const sec = document.getElementById(pageId);
  if (!sec) { console.warn('No section #' + pageId); return; }
  sec.classList.add('active');

  // запомним открытую вкладку
  try { localStorage.setItem('lastPage', pageId); } catch (_) {}

  // прокрутка вверх
  scrollTopNow();

  // активная ссылка в навигации
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  const active = document.querySelector(`[data-page="${pageId}"]`);
  if (active) active.classList.add('active');

  // закрыть бургер-меню
  closeNav();
}

document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    showPage(link.getAttribute('data-page'));
    closeNav();
  });
});

// Services
let services = [];

function renderServiceSkeletons(count = 6) {
  const container = document.getElementById('services-container');
  if (!container) return;
  container.innerHTML = '';
  for (let i = 0; i < count; i++) {
    const skeleton = document.createElement('article');
    skeleton.className = 'service-card service-card--skeleton';
    skeleton.setAttribute('aria-hidden', 'true');
    skeleton.innerHTML = `
      <div class="glass">
        <div class="skeleton-line skeleton-line--title"></div>
        <div class="skeleton-line"></div>
        <div class="skeleton-line short"></div>
        <div class="skeleton-chip-row">
          <span class="skeleton-chip"></span>
          <span class="skeleton-chip"></span>
          <span class="skeleton-chip"></span>
        </div>
      </div>
    `;
    container.appendChild(skeleton);
  }
}

function renderPortfolioSkeletons(count = 4) {
  const grid = document.getElementById('portfolioGrid');
  if (!grid) return;
  grid.innerHTML = '';
  for (let i = 0; i < count; i++) {
    const card = document.createElement('article');
    card.className = 'portfolio-item portfolio-item--skeleton';
    card.setAttribute('aria-hidden', 'true');
    card.innerHTML = `
      <div class="portfolio-img"></div>
      <div class="portfolio-content">
        <h3></h3>
        <p></p>
      </div>
    `;
    grid.appendChild(card);
  }
}

async function loadServices() {
  const container = document.getElementById('services-container');
  if (!container) return;
  renderServiceSkeletons();

  try {
    const res = await fetch('api/services.php');
    if (!res.ok) throw new Error(`services list failed: ${res.status}`);
    const list = await res.json();
    services = Array.isArray(list) ? list : [];

    container.innerHTML = '';

    // ПУЛ конкарренси, чтобы не убить сервер доп.запросами
    const MAX_PARALLEL = 4;
    let inFlight = 0, queue = [];

    function withLimit(fn) {
      return new Promise((resolve) => {
        const run = async () => {
          inFlight++;
          try { resolve(await fn()); }
          finally {
            inFlight--;
            if (queue.length) queue.shift()();
          }
        };
        (inFlight < MAX_PARALLEL) ? run() : queue.push(run);
      });
    }

    if (!services.length) {
      container.innerHTML = '<div class="data-state">Список услуг скоро пополнится. Мы уже работаем над обновлением.</div>';
      return;
    }

    services.forEach((s) => {
      const el = document.createElement('article');
      el.className = 'service-card';
      el.setAttribute('role', 'button');
      el.setAttribute('tabindex', '0');
      el.dataset.id = s.id;

      // базовая верстка
      el.innerHTML = `
        <div class="shine"></div>
        <div class="glass">
          <h3>${escapeHtml(s.name)}</h3>
          <p>${escapeHtml(trimDescription(s.description))}</p>
          <div class="s-chips" data-chips></div>
        </div>
      `;

      // пока нет обложки — приятный градиент-заглушка (чтобы не прыгало)
      const fallback = `linear-gradient(135deg, rgba(255,173,0,.18), rgba(95,169,255,.18)), linear-gradient(135deg, #2a2a2a, #1e1e1e)`;
      el.style.setProperty('--bg', fallback);

      // чипсы из первых 2-3 фич
      const chips = el.querySelector('[data-chips]');
      const feats = (s.features || []).slice(0, 3);
      if (feats.length) {
        chips.innerHTML = feats.map(f => `<span class="s-chip">${escapeHtml(f)}</span>`).join('');
      }

      // клики/клавиатура
      el.addEventListener('click', () => openService(+s.id));
      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openService(+s.id); }
      });

      container.appendChild(el);

      // Если API уже отдаёт cover, ставим сразу:
      if (s.cover) {
        el.style.setProperty('--bg', `url("${s.cover}")`);
        return;
      }

      // Иначе — подтянем превьюшку услуги (первая картинка) аккуратно:
      withLimit(async () => {
        try {
          const rr = await fetch(`api/services.php?id=${s.id}`);
          if (!rr.ok) return;
          const full = await rr.json();
          const firstImg = (full.images && full.images[0]?.path) || null;
          if (firstImg) el.style.setProperty('--bg', `url("${firstImg}")`);
        } catch(_) {}
      });
    });
  } catch (error) {
    console.error('services list failed', error);
    services = [];
    container.innerHTML = '<div class="data-state error">Не удалось загрузить услуги. Попробуйте обновить страницу позже.</div>';
  }
}
function trimDescription(text, minLen = 100) {
  if (!text) return '';
  if (text.length <= minLen) return text;

  // Отрезаем первые minLen символов
  let cut = text.slice(0, minLen);

  // Остаток текста после minLen
  let rest = text.slice(minLen);

  // Ищем ближайшую точку/воскл/вопрос
  const match = rest.match(/.*?[.!?]/);
  if (match) {
    cut += match[0]; // добавляем до знака
  }

  return cut.trim();
}
function toggleNav() {
  const nav = document.getElementById('nav');
  if (!nav) return;
  nav.classList.toggle('open');
  const isOpen = nav.classList.contains('open');
  document.body.classList.toggle('nav-open', isOpen);
  const toggle = document.getElementById('navToggle');
  if (toggle) toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
}
function closeNav() {
  const nav = document.getElementById('nav');
  if (!nav) return;
  nav.classList.remove('open');
  document.body.classList.remove('nav-open');
  const toggle = document.getElementById('navToggle');
  if (toggle) toggle.setAttribute('aria-expanded', 'false');
}
function onCardClick(e){
  const card = e.target.closest('.card-link');
  if (!card) return;
  openService(+card.dataset.id);
}


function openAdmin() {
  document.getElementById('adminPanel').classList.add('open');
  loadAdminServices();
}

function closeAdmin() {
  document.getElementById('adminPanel').classList.remove('open');
}

async function toggleAdmin() {
  const panel = document.getElementById('adminPanel');
  if (panel.classList.contains('open')) {
    closeAdmin();
    return;
  }
  const status = await fetch('api/check_login.php').then(r => r.json());
  if (!status.admin) {
    const password = prompt('Введите пароль');
    if (!password) return;
    const login = await fetch('api/login.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });
    if (!login.ok) {
      alert('Неверный пароль');
      return;
    }
  }
  openAdmin();
}

function loadAdminServices() {
  const container = document.getElementById('adminServicesList');
  container.innerHTML = '';
  services.forEach(service => {
    const item = document.createElement('div');
    item.className = 'service-item';
    item.innerHTML = `
      <h4>${service.name}</h4>
      <p>${service.description}</p>
      <div class="service-actions">
        <button class="btn btn-small btn-danger" onclick="deleteService(${service.id})">Удалить</button>
      </div>
    `;
    container.appendChild(item);
  });
}

async function addService() {
  const name = document.getElementById('serviceName').value.trim();
  const description = document.getElementById('serviceDescription').value.trim();
  const featuresText = document.getElementById('serviceFeatures').value;
  if (!name || !description) {
    alert('Заполните все поля');
    return;
  }
  const features = featuresText.split('\n').map(f => f.trim()).filter(Boolean);
  const res = await fetch('api/services.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, description, features })
  });
  if (!res.ok) {
    alert('Не удалось сохранить услугу');
    return;
  }
  document.getElementById('serviceName').value = '';
  document.getElementById('serviceDescription').value = '';
  document.getElementById('serviceFeatures').value = '';
  await loadServices();
  loadAdminServices();
  alert('Услуга добавлена!');
}

async function deleteService(id) {
  if (!confirm('Удалить эту услугу?')) return;
  const res = await fetch(`api/services.php?id=${id}`, { method: 'DELETE' });
  if (res.ok) {
    await loadServices();
    loadAdminServices();
  }
}

// Popup
function openPopup() {
  document.getElementById('popup').classList.add('open');
}

function closePopup() {
  document.getElementById('popup').classList.remove('open');
}

const legacyContactForm = document.getElementById('contactForm');
legacyContactForm?.addEventListener('submit', function (e) {
  e.preventDefault();
  const formData = new FormData(this);
  alert('Заявка отправлена! Мы свяжемся с вами в течение 24 часов.');
  this.reset();
});



document.addEventListener('DOMContentLoaded', loadServices);
document.addEventListener('DOMContentLoaded', () => {
  handleHashOpen();

  if (!location.hash) {
    const last = (() => {
      try { return localStorage.getItem('lastPage') || 'services'; } catch(_) { return 'services'; }
    })();
    const page = document.getElementById(last) ? last : 'services';
    showPage(page);
  }
});

var __popupEl = document.getElementById('popup');
if (__popupEl) __popupEl.addEventListener('click', function (e) {
  if (e.target === this) closePopup();
});

// Safe adminPanel click-away (panel may not exist)

document.addEventListener('click', function (e) {
  const panel = document.getElementById('adminPanel');
  const toggle = document.getElementById('adminToggle');
  if (panel && panel.classList.contains('open') && !panel.contains(e.target) && (!toggle || !toggle.contains(e.target))) {
    if (typeof closeAdmin === 'function') closeAdmin();
  }
});



// === Admin SPA ===
async function adminIsLogged() {
  try {
    const r = await fetch('api/check_login.php');
    const j = await r.json();
    return !!j.admin;
  } catch(e){ return false; }
}

function adminRenderLogin() {
  const root = document.getElementById('adminRoot');
  /*
   * Render a modern login form for the admin panel.
   * The markup avoids inline styles in favour of dedicated CSS classes. A
   * wrapper card with the class `admin-login-card` controls sizing and
   * spacing. Inputs are grouped in a flex column via the
   * `admin-login-form` class for consistent spacing.
   */
  root.innerHTML = `
  <div class="admin-card admin-login-card">
    <div class="title">Вход администратора</div>
    <hr class="hr-soft">
    <div class="admin-login-form">
      <div class="input-wrap">
        <input id="admUser" class="form-control" placeholder="Логин" autocomplete="username">
      </div>
      <div class="input-wrap">
        <input id="admPass" class="form-control" type="password" placeholder="Пароль" autocomplete="current-password">
        <button type="button" class="toggle-pass" aria-label="Показать пароль" id="togglePass">👁</button>
      </div>

      <div class="admin-login-meta">Доступ только для сотрудников</div>

      <div class="admin-actions">
        <button class="btn accent wide" id="admLoginBtn">Войти</button>
      </div>
    </div>
  </div>`;
  document.getElementById('admLoginBtn').onclick = async () => {
    const username = document.getElementById('admUser').value.trim();
    const password = document.getElementById('admPass').value;
    const res = await fetch('api/login.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    if (res.ok) adminRenderDashboard();
    else alert('Неверные учетные данные');
  };
}

async function adminFetchServices() {
  const r = await fetch('api/services.php');
  if (!r.ok) throw new Error('load_failed');
  return await r.json();
}

function adminRenderDashboard() {
  const root = document.getElementById('adminRoot');
  root.innerHTML = `
  <div class="admin-shell">
    <aside class="admin-aside">
      <div class="brand">Админ</div>
      <nav class="aside-nav">
        <button class="aside-link active" data-tab="services">Услуги</button>
        <button class="aside-link" data-tab="portfolio">Портфолио</button>
        <button class="aside-link" data-tab="settings">Настройки</button>
      </nav>
      <button class="btn ghost wide" id="aLogout">Выйти</button>
    </aside>

    <section class="admin-workspace">
      <!-- SERVICES TAB -->
      <div class="tab-panel active" id="tab-services">
        <div class="toolbar">
          <div class="toolbar-left">
            <input id="filterServices" class="form-control" placeholder="Поиск по услугам…">
          </div>
          <div class="toolbar-right">
            <span class="badge" id="aCount">—</span>
            <button class="btn accent" id="openAddService">Добавить услугу</button>
          </div>
        </div>

        <div class="admin-card admin-add collapse" id="addServiceCard" hidden>
          <h3 style="margin-top:0">Новая услуга</h3>
          <div style="display:grid; gap:.75rem;">
            <input id="aName" class="form-control" placeholder="Название услуги">
            <textarea id="aDesc" class="form-control" rows="4" placeholder="Описание услуги"></textarea>
            <textarea id="aFeat" class="form-control" rows="3" placeholder="Особенности (каждая с новой строки)"></textarea>
            <label class="file-drop" id="adminFileDrop">
              <input id="aImgs" type="file" accept="image/*" multiple hidden>
              <div class="file-drop-inner">
                <div class="file-ic">📎</div>
                <div>
                  <div class="file-main">Перетащите фото сюда</div>
                  <div class="file-sub">или нажмите, чтобы выбрать</div>
                </div>
              </div>
              <div id="adminFileList" class="file-list"></div>
            </label>
            <div class="admin-actions">
              <button class="btn accent" id="aAdd">Сохранить</button>
              <button class="btn ghost" id="cancelAddService">Отмена</button>
            </div>
          </div>
        </div>

        <div class="list-head">
          <label class="row-check">
            <input type="checkbox" id="checkAll">
            <span>Все</span>
          </label>
          <div class="bulk-actions" hidden>
            <button class="btn danger" id="bulkDelete">Удалить выбранные</button>
          </div>
        </div>

        <div id="aList" class="list-cards" style="margin-top:.5rem;"></div>
      </div>

      <!-- PORTFOLIO TAB -->
      <div class="tab-panel" id="tab-portfolio">
        <div class="toolbar">
          <div class="toolbar-left">
            <input id="filterPortfolio" class="form-control" placeholder="Поиск по портфолио…">
          </div>
          <div class="toolbar-right">
            <span class="badge" id="pCount">—</span>
            <button class="btn accent" id="openAddWork">Добавить работу</button>
          </div>
        </div>

        <div class="admin-card admin-add collapse" id="addWorkCard" hidden>
          <h3 style="margin-top:0">Новая работа</h3>
          <div style="display:grid; gap:.75rem;">
            <input id="pTitle" class="form-control" placeholder="Заголовок">
            <textarea id="pDesc" class="form-control" rows="3" placeholder="Короткое описание"></textarea>
            <input id="pImg" class="form-control" type="file" accept="image/*">
            <div class="admin-actions">
              <button class="btn accent" id="pAdd">Сохранить</button>
              <button class="btn ghost" id="cancelAddWork">Отмена</button>
            </div>
          </div>
        </div>

        <div id="pList" class="list-cards" style="margin-top:1rem;"></div>
      </div>

      <!-- SETTINGS TAB -->
      <div class="tab-panel" id="tab-settings">
        <div class="admin-card">
          <h3 style="margin-top:0">Настройки</h3>
          <div class="muted">Здесь можно будет менять тему, пароль и т.п.</div>
        </div>
      </div>
    </section>
  </div>

  <div id="toaster" class="toaster" aria-live="polite"></div>
  `;

  // Логаут
  document.getElementById('aLogout').onclick = async () => {
    await fetch('api/logout.php', {method:'POST'});
    adminRenderLogin();
  };

  // Переключение табов
  document.querySelectorAll('.aside-link').forEach(btn=>{
    btn.onclick = () => {
      document.querySelectorAll('.aside-link').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      const tab = btn.dataset.tab;
      document.querySelectorAll('.tab-panel').forEach(p=>p.classList.remove('active'));
      document.getElementById('tab-'+tab).classList.add('active');
      // лениво подгружаем
      if (tab === 'services') adminLoadList();
      if (tab === 'portfolio') adminLoadPortfolioList();
    };
  });

  // Тулбар — раскрывашки «Добавить»
  function toggleCollapsible(id, btn, openText='Добавить', closeText='Скрыть'){
    const box = document.getElementById(id);
    const willOpen = !box.classList.contains('open');

    if (willOpen) {
      // сначала показать, потом добавить класс, чтобы анимация сработала
      box.hidden = false;
      requestAnimationFrame(() => box.classList.add('open'));
    } else {
      // сначала убираем класс (анимация закрытия), а по окончании — прячем
      box.classList.remove('open');
      box.addEventListener('transitionend', () => { box.hidden = true; }, { once: true });
    }

    btn.classList.toggle('ghost', willOpen);
    btn.classList.toggle('accent', !willOpen);
    btn.textContent = willOpen ? closeText : openText;
    btn.setAttribute('aria-expanded', String(willOpen));
  }

  const addServiceCard = document.getElementById('addServiceCard');
  const addWorkCard    = document.getElementById('addWorkCard');

  const openAddServiceBtn = document.getElementById('openAddService');
  openAddServiceBtn.classList.add('btn-toggle');
  openAddServiceBtn.onclick = ()=> toggleCollapsible('addServiceCard', openAddServiceBtn, 'Добавить услугу','Скрыть форму');

  document.getElementById('cancelAddService').onclick = ()=>{
    addServiceCard.classList.remove('open');
    openAddServiceBtn.classList.remove('ghost'); openAddServiceBtn.classList.add('accent');
    openAddServiceBtn.textContent = 'Добавить услугу';
    openAddServiceBtn.setAttribute('aria-expanded','false');
  };

  const openAddWorkBtn = document.getElementById('openAddWork');
  openAddWorkBtn.classList.add('btn-toggle');
  openAddWorkBtn.onclick = ()=> toggleCollapsible('addWorkCard', openAddWorkBtn, 'Добавить работу','Скрыть форму');

  document.getElementById('cancelAddWork').onclick = ()=>{
    addWorkCard.classList.remove('open');
    openAddWorkBtn.classList.remove('ghost'); openAddWorkBtn.classList.add('accent');
    openAddWorkBtn.textContent = 'Добавить работу';
    openAddWorkBtn.setAttribute('aria-expanded','false');
  };


// Добавление услуги (твой код, просто оставил как было)
  document.getElementById('aAdd').onclick = async () => {
    const name = document.getElementById('aName').value.trim();
    const description = document.getElementById('aDesc').value.trim();
    const features = document.getElementById('aFeat').value.split('\n').map(s=>s.trim()).filter(Boolean);
    const files = document.getElementById('aImgs').files;
    if (!name || !description) { toast('Заполните название и описание','warn'); return; }

    const r = await fetch('api/services.php', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ name, description, features })
    });
    if (!r.ok) { toast('Ошибка при добавлении услуги','error'); return; }
    const j = await r.json();
    const newId = j?.id ?? j?.insert_id;

    if (newId && files && files.length) {
      for (const file of files) {
        const fd = new FormData();
        fd.append('service_id', newId);
        fd.append('image', file);
        await fetch('api/upload_service_image.php', { method:'POST', body: fd });
      }
    }
    // очистка
    document.getElementById('aName').value = '';
    document.getElementById('aDesc').value = '';
    document.getElementById('aFeat').value = '';
    document.getElementById('aImgs').value = '';
    toggleCollapsible('addServiceCard', openAddServiceBtn, 'Добавить услугу','Скрыть форму');

    await adminLoadList();
    await loadServices();
    toast('Услуга добавлена!');
  };

  // Добавление работы (перенёс сюда — чтобы не ловить null)
  document.getElementById('pAdd').onclick = async () => {
    const title = document.getElementById('pTitle').value.trim();
    const description = document.getElementById('pDesc').value.trim();
    const file = document.getElementById('pImg').files[0];
    if (!title || !description) { toast('Заполните заголовок и описание','warn'); return; }

    const r = await fetch('api/portfolio.php', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ title, description })
    });
    if (!r.ok) { toast('Ошибка добавления','error'); return; }
    const { id } = await r.json();

    if (id && file) {
      const fd = new FormData();
      fd.append('portfolio_id', id);
      fd.append('image', file);
      await fetch('api/upload_portfolio_image.php', { method:'POST', body: fd });
    }

    document.getElementById('pTitle').value = '';
    document.getElementById('pDesc').value = '';
    document.getElementById('pImg').value = '';
    toggleCollapsible('addWorkCard', openAddWorkBtn, 'Добавить работу','Скрыть форму');

    await adminLoadPortfolioList();
    if (document.querySelector('#about.page-section.active')) loadPortfolio();
    toast('Работа добавлена!');
  };
  // Фильтры (по месту, без бэка)
  document.getElementById('filterServices').addEventListener('input', (e)=>{
    const q = e.target.value.trim().toLowerCase();
    document.querySelectorAll('#aList .list-card').forEach(card=>{
      const t = card.innerText.toLowerCase();
      card.style.display = t.includes(q) ? '' : 'none';
    });
  });
  document.getElementById('filterPortfolio').addEventListener('input', (e)=>{
    const q = e.target.value.trim().toLowerCase();
    document.querySelectorAll('#pList .list-card').forEach(card=>{
      const t = card.innerText.toLowerCase();
      card.style.display = t.includes(q) ? '' : 'none';
    });
  });

  // чекбоксы / массовые
  const checkAll = document.getElementById('checkAll');
  const bulkBar = document.querySelector('.bulk-actions');
  checkAll.onchange = ()=>{
    document.querySelectorAll('#aList .row-check input[type=checkbox]').forEach(c=>{ c.checked = checkAll.checked; });
    bulkBar.hidden = !checkAll.checked;
  };
  document.getElementById('bulkDelete').onclick = async ()=>{
    const ids = [...document.querySelectorAll('#aList .row-check input:checked')].map(c=>c.dataset.id);
    if (!ids.length) return;
    if (!confirm('Удалить выбранные услуги?')) return;
    for (const id of ids) {
      await fetch('api/services.php?id=' + id, { method:'DELETE' });
    }
    await adminLoadList();
    checkAll.checked = false;
    bulkBar.hidden = true;
    toast('Удалено');
  };

  // стартуем с услуг
  adminLoadList();
  // Init file drop for admin (multiple files with chips, like in drawer)
  const adminDrop = document.getElementById('adminFileDrop');
  if (adminDrop) {
    let input = adminDrop.querySelector('#aImgs') || adminDrop.querySelector('input[type="file"]');
    if (!input) {
      input = document.createElement('input');
      input.type = 'file';
      input.hidden = true;
      adminDrop.prepend(input);
    }
    input.multiple = true;
    const defaultAccept = '.dwg,.step,.igs,.stp,.dxf,.zip,.rar,.7z,.pdf';
    if (!input.getAttribute('accept')) input.setAttribute('accept', defaultAccept);

    let list = adminDrop.querySelector('#adminFileList');
    if (!list) {
      list = document.createElement('div');
      list.id = 'adminFileList';
      list.className = 'file-list';
      const legacy = adminDrop.querySelector('#adminFileName');
      if (legacy) legacy.style.display = 'none';
      adminDrop.appendChild(list);
    }

    const fmt = (b) => {
      if (b == null) return '';
      const u = ['Б','КБ','МБ','ГБ']; let i = 0; let n = b;
      while (n >= 1024 && i < u.length - 1) { n /= 1024; i++; }
      return `${n.toFixed(n < 10 ? 1 : 0)} ${u[i]}`;
    };

    function render(files) {
      if (!list) return;
      list.innerHTML = '';
      const has = files && files.length;
      adminDrop.classList.toggle('has-files', !!has);
      if (!has) return;
      [...files].forEach((f, idx) => {
        const item = document.createElement('div');
        item.className = 'file-chip';
        item.innerHTML = `
        <span>📄</span>
        <span class="name" title="${f.name}">${f.name}</span>
        <span class="size">${fmt(f.size)}</span>
        <button type="button" class="rm" aria-label="Удалить файл" data-i="${idx}">✕</button>
      `;
        list.appendChild(item);
      });
    }

    function removeAt(index) {
      const dt = new DataTransfer();
      [...(input.files || [])].forEach((f, i) => { if (i !== index) dt.items.add(f); });
      input.files = dt.files;
      render(input.files);
    }

    input.addEventListener('change', () => {
      render(input.files);
      adminDrop.classList.add('attached');
      setTimeout(() => adminDrop.classList.remove('attached'), 180);
    });

    list.addEventListener('click', (e) => {
      const btn = e.target.closest('.rm');
      if (!btn) return;
      e.preventDefault();
      e.stopPropagation();
      removeAt(+btn.dataset.i);
    });

    ['dragenter','dragover'].forEach(ev => {
      adminDrop.addEventListener(ev, e => { e.preventDefault(); e.stopPropagation(); adminDrop.classList.add('drag'); });
    });
    ['dragleave','dragend','drop'].forEach(ev => {
      adminDrop.addEventListener(ev, e => { e.preventDefault(); e.stopPropagation(); adminDrop.classList.remove('drag'); });
    });

    adminDrop.addEventListener('drop', (e) => {
      const files = e.dataTransfer?.files;
      if (!files || !files.length) return;
      const dt = new DataTransfer();
      [...(input.files || [])].forEach(f => dt.items.add(f));
      [...files].forEach(f => dt.items.add(f));
      input.files = dt.files;
      render(input.files);
      input.dispatchEvent(new Event('change', { bubbles:true }));
    });

    adminDrop.addEventListener('click', (e) => {
      if (e.target.closest('.rm')) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      if (adminDrop.tagName === 'LABEL') return;
      input.click();
    });
  }
}
function mountTabsIndicator(){
  const nav = document.querySelector('.aside-nav');
  if (!nav || nav.querySelector('.aside-indicator')) return;
  const indicator = document.createElement('div');
  indicator.className = 'aside-indicator';
  nav.appendChild(indicator);

  const setPos = (btn)=>{
    const r = btn.getBoundingClientRect();
    const rNav = nav.getBoundingClientRect();
    indicator.style.transform = `translateY(${btn.offsetTop + (r.height - 36)/2}px)`;
  };

  const active = nav.querySelector('.aside-link.active') || nav.querySelector('.aside-link');
  if (active) setPos(active);

  nav.querySelectorAll('.aside-link').forEach(btn=>{
    btn.addEventListener('click', ()=> setPos(btn));
  });
}
async function adminLoadList() {
  const list = document.getElementById('aList');

  // навешиваем обработчик "change" только ОДИН раз на весь список
  if (!list._changeBound) {
    list.addEventListener('change', async (e) => {
      const input = e.target.closest('input[type="file"][data-up-for]');
      if (!input) return;

      const sid = +input.dataset.upFor;
      const files = input.files;
      if (!sid || !files || !files.length) return;

      const progress = input.closest('.list-card').querySelector('.progress');
      if (progress) progress.hidden = false;
      for (const file of files) {
        const fd = new FormData();
        fd.append('service_id', sid);
        fd.append('image', file);
        await fetch('api/upload_service_image.php', { method:'POST', body: fd });
      }
      if (progress) progress.hidden = true;
      toast('Фото добавлено');
    });
    list._changeBound = true; // флаг «уже привязан»
  }

  list.innerHTML = '<div class="muted">Загрузка...</div>';

  try {
    const data = await adminFetchServices();
    document.getElementById('aCount').textContent = data.length;

    list.innerHTML = '';
    data.forEach(s => {
      const card = document.createElement('div');
      card.className = 'list-card';
      card.innerHTML = `
  <div class="top">
    <div style="display:flex; align-items:center; gap:.6rem;">
      <label class="row-check">
        <input type="checkbox" data-id="${s.id}">
      </label>
      ${s.cover ? `<img class="thumb" src="${escapeHtml(s.cover)}" alt="" />` : `<div class="thumb thumb--ph" aria-hidden="true"></div>`}
      <h4>#${s.id} ${escapeHtml(s.name)}</h4>
    </div>
    <div style="display:flex; gap:.5rem; align-items:center;">
      <label class="btn ghost btn-small">
        Добавить фото
        <input type="file" accept="image/*" data-up-for="${s.id}" style="display:none">
      </label>
      <button class="btn btn-small" data-edit="${s.id}">Редактировать</button>
      <button class="btn danger btn-small" data-id="${s.id}">Удалить</button>
    </div>
  </div>
  <div class="muted">${escapeHtml(s.description || '')}</div>
  ${(s.features?.length ? `<ul>${s.features.map(f=>`<li>${escapeHtml(f)}</li>`).join('')}</ul>` : '')}
  <div class="progress" hidden><div class="bar"></div></div>
`;
      list.appendChild(card);
    });

    // обработчики удаления можно перевешивать — элементы заново отрендерены
    list.querySelectorAll('button[data-id]').forEach(btn => {
      btn.onclick = async () => {
        if (!confirm('Удалить услугу?')) return;
        const r = await fetch('api/services.php?id=' + btn.dataset.id, { method: 'DELETE' });
        if (r.ok) adminLoadList(); else alert('Ошибка удаления');
      };
    });
    list.querySelectorAll('button[data-edit]').forEach(btn => {
      btn.onclick = () => openServiceEditor(+btn.dataset.edit);
    });

  } catch (e) {
    list.innerHTML = '<div class="muted">Не удалось загрузить список</div>';
  }
}

async function adminLoadPortfolioList() {
  const list = document.getElementById('pList');
  list.innerHTML = '<div class="muted">Загрузка...</div>';
  try {
    const r = await fetch('api/portfolio.php');
    const items = await r.json();
    document.getElementById('pCount').textContent = items.length;
    list.innerHTML = '';
    items.forEach(it => {
      const el = document.createElement('div');
      el.className = 'list-card';
      el.innerHTML = `
      <div class="top">
        <div style="display:flex; align-items:center; gap:.6rem;">
          ${it.image_path ? `<img class="thumb" src="${escapeHtml(it.image_path)}" alt="">`
              : `<div class="thumb thumb--ph" aria-hidden="true"></div>`}
          <h4>#${it.id} ${escapeHtml(it.title)}</h4>
        </div>
        <div style="display:flex; gap:.5rem;">
          <button class="btn btn-small" data-edit="${it.id}">Редактировать</button>
          <button class="btn danger btn-small" data-del="${it.id}">Удалить</button>
        </div>
      </div>
      <div class="muted">${escapeHtml(it.description||'')}</div>
    `;
      list.appendChild(el);
    });
    list.querySelectorAll('button[data-del]').forEach(btn => {
      btn.onclick = async () => {
        if (!confirm('Удалить работу из портфолио?')) return;
        const r = await fetch('api/portfolio.php?id='+btn.dataset.del, { method:'DELETE' });
        if (r.ok) adminLoadPortfolioList(); else alert('Ошибка удаления');
      };
    });
    list.querySelectorAll('button[data-edit]').forEach(btn => {
      btn.onclick = () => openPortfolioEditor(+btn.dataset.edit);
    });
  } catch(e){
    list.innerHTML = '<div class="muted">Не удалось загрузить список</div>';
  }
}
async function adminInitPage() {
  const logged = await adminIsLogged();
  if (logged) adminRenderDashboard(); else adminRenderLogin();
}

const __showPageHooks = [];
const __showPageOriginal = showPage;
window.showPage = function(pageId){
  __showPageOriginal(pageId);
  for (const fn of __showPageHooks) { try { fn(pageId); } catch(_){} }
};

__showPageHooks.push((pageId)=>{ if (pageId === 'admin') adminInitPage(); });
__showPageHooks.push((pageId)=>{ if (pageId === 'about'){ bindStatsObserver(); loadPortfolio(); } });

document.addEventListener('DOMContentLoaded', ()=>{
  const active = document.querySelector('.page-section.active')?.id;
  if (active) __showPageHooks.forEach(fn=>{ try{ fn(active); }catch(_){} });
});

document.addEventListener('click', (e) => {
  const btn = e.target.closest('.toggle-pass, #togglePass');
  if (!btn) return;

  const input = document.getElementById('admPass');
  if (!input) return;

  const isPwd = input.type === 'password';
  input.type = isPwd ? 'text' : 'password';
  btn.setAttribute('aria-label', isPwd ? 'Скрыть пароль' : 'Показать пароль');
});

// === Infinite Centered Carousel (swipe + clones) ===
(function(){
  const root = document.getElementById('workCarousel');
  if (!root) return;

  const track = root.querySelector('.ic-track');
  const prev  = root.querySelector('.ic-btn.prev');
  const next  = root.querySelector('.ic-btn.next');
  const dots  = root.querySelector('#workDots');

  // исходные карточки (без клонов)
  const originals = [...track.querySelectorAll('.ic-card')];
  const N = originals.length;
  if (N === 0) return;

  // сколько клонов с каждой стороны достаточно? 3 — с запасом
  const CLONE_COUNT = Math.min(3, N);

  // создаём клоны в начало и конец
  function cloneSide(items){
    return items.map(n => n.cloneNode(true));
  }
  const headClones = cloneSide(originals.slice(-CLONE_COUNT));
  const tailClones = cloneSide(originals.slice(0, CLONE_COUNT));

  headClones.forEach(n => track.insertBefore(n, track.firstChild));
  tailClones.forEach(n => track.appendChild(n));

  // рабочий список всех карточек после клонирования
  const all = [...track.querySelectorAll('.ic-card')];

  // индексы: сдвиг = количество клонов слева
  let offset = CLONE_COUNT;
  let active = 0; // индекс в пределах [0, N-1]

  // утилиты размеров
  const gapPx = () => parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap || '0');
  const slideW = () => {
    const first = all[offset]?.getBoundingClientRect();
    return (first?.width || 0) + gapPx();
  };

  // точки
  originals.forEach((_, i) => {
    const b = document.createElement('button');
    b.className = 'dot';
    b.type = 'button';
    b.addEventListener('click', () => goTo(i));
    dots.appendChild(b);
  });

  function syncDots(){
    dots.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('active', i === active));
  }

  // прокрутка к реальному индексу (0..N-1)
  function goTo(i, smooth = true){
    active = (i + N) % N;
    const targetIndexInAll = offset + active; // позиция с учётом клонов
    const left = targetIndexInAll * slideW() - getScrollPaddingLeft();
    track.scrollTo({ left, behavior: smooth ? 'smooth' : 'auto' });
    syncDots();
  }

  // чтение scroll-padding-left из стилей
  function getScrollPaddingLeft(){
    const val = getComputedStyle(track).getPropertyValue('scroll-padding-left');
    return parseFloat(val) || 0;
  }

  // нормализация: если ушли в клоны — мгновенно перепрыгиваем к оригиналу
  let normalizeTimer = null;
  function scheduleNormalize(){
    if (normalizeTimer) clearTimeout(normalizeTimer);
    normalizeTimer = setTimeout(normalize, 120); // после окончания инерции
  }
  function normalize(){
    const idx = Math.round((track.scrollLeft + getScrollPaddingLeft()) / slideW());
    const relative = idx - offset; // -> может быть вне [0..N-1]
    const normalized = ((relative % N) + N) % N;
    if (relative !== normalized){
      // мгновенный прыжок на соответствующую позицию
      active = normalized;
      const left = (offset + active) * slideW() - getScrollPaddingLeft();
      track.scrollTo({ left, behavior: 'auto' });
      syncDots();
    }else{
      // просто синхронизируем активную точку
      active = normalized;
      syncDots();
    }
  }

  // кнопки
  prev.addEventListener('click', () => goTo(active - 1));
  next.addEventListener('click', () => goTo(active + 1));

  // клавиатура
  root.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') next.click();
    if (e.key === 'ArrowLeft')  prev.click();
  });

  // свайпы/драг (pointer events)
  let dragging = false, startX = 0, startLeft = 0, pointerId = null;
  track.addEventListener('pointerdown', (e) => {
    dragging = true;
    pointerId = e.pointerId;
    startX = e.clientX;
    startLeft = track.scrollLeft;
    track.setPointerCapture(pointerId);
    track.classList.add('dragging');
  });
  track.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    track.scrollLeft = startLeft - (e.clientX - startX);
  });
  track.addEventListener('pointerup', (e) => {
    if (!dragging) return;
    dragging = false;
    track.releasePointerCapture(pointerId);
    track.classList.remove('dragging');

    // «прищёлкнем» к ближайшей карточке
    const idx = Math.round((track.scrollLeft + getScrollPaddingLeft()) / slideW());
    const relative = idx - offset;
    goTo(relative, true);
    scheduleNormalize();
  });
  track.addEventListener('pointercancel', () => {
    dragging = false;
    track.classList.remove('dragging');
    scheduleNormalize();
  });

  // следим за прокруткой (инерция/колёсико)
  track.addEventListener('scroll', scheduleNormalize, { passive: true });

  // ресайз — пересчёт позиций
  window.addEventListener('resize', () => {
    // после изменения ширины возвращаемся к текущему активу
    goTo(active, false);
  });

  // Инициализация: ставим на 1-й оригинальный слайд по центру
  // (после добавления клонов)
  requestAnimationFrame(() => {
    goTo(0, false);
    syncDots();
  });
})();
async function openService(id) {
  try {
    const r = await fetch(`api/services.php?id=${id}`); // <-- ЕД.Ч.
    if (!r.ok) {
      const text = await r.text();
      throw new Error(`HTTP ${r.status}: ${text}`);
    }
    const s = await r.json();
    renderServicePage(s);
    location.hash = `#service/${id}`;
    showPage('service');
  } catch (e) {
    console.error('openService failed:', e);
    alert('Не удалось открыть услугу. Проверь путь к API в консоли.');
  }
}

function renderServicePage(s) {
  const wrap = document.getElementById('service-view');

  const featuresHTML = (s.features && s.features.length)
      ? `<ul class="feature-list">${s.features.map(f => `<li>${escapeHtml(f)}</li>`).join('')}</ul>`
      : `<div class="muted">Особенности не указаны</div>`;

  const galleryHTML = (s.images && s.images.length)
      ? `
      <div class="gallery-grid">
        ${s.images.map(img => `
          <a href="${escapeHtml(img.path)}" class="g-item" target="_blank" rel="noopener">
            <img src="${escapeHtml(img.path)}" alt="${escapeHtml(img.alt || s.name || '')}">
          </a>
        `).join('')}
      </div>
    `
      : `<div class="muted">Фото пока нет</div>`;

  wrap.innerHTML = `
    <article class="service-article">
      <h2 style="margin:0 0 .5rem">${escapeHtml(s.name || '')}</h2>
      <p style="font-size:1.05rem; line-height:1.7">${escapeHtml(s.description || '')}</p>

      <hr class="hr-soft" style="margin:1.25rem 0">

      <h3 style="margin:0 0 .5rem">Галерея</h3>
      ${galleryHTML}

      <hr class="hr-soft" style="margin:1.25rem 0">

      <h3 style="margin:0 0 .5rem">Особенности</h3>
      ${featuresHTML}
    </article>
  `;
}


window.addEventListener('hashchange', handleHashOpen);
document.addEventListener('DOMContentLoaded', handleHashOpen);
document.addEventListener('click', (e) => {
  const a = e.target.closest('#backToServices');
  if (!a) return;
  e.preventDefault();
  // убираем #service/ID из адресной строки и показываем список
  history.replaceState(null, '', location.pathname + location.search);
  showPage('services');
});
function handleHashOpen(){
  const m = location.hash.match(/^#service\/(\d+)$/);
  if (m) {
    openService(+m[1]);
    return;
  }
  // если ушли со страницы услуги (хэш не совпал) — показываем список
  const active = document.querySelector('.page-section.active');
  if (active && active.id === 'service') {
    showPage('services');
  }
}
function escapeHtml(str='') {
  return String(str).replace(/[&<>"']/g, m => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'
  }[m]));
}
// === Contact Drawer ===
const drawer = document.getElementById('contactDrawer');
const backdrop = document.getElementById('drawerBackdrop');
const toggleBtn = document.getElementById('contactToggle');
const closeBtn = document.getElementById('drawerClose');
const drawerForm = document.getElementById('drawerContactForm');

function openDrawer(){
  if (!drawer || !backdrop) return;

  const lockBody = !matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (lockBody) {
    document.documentElement.classList.add('drawer-open');
    document.body.classList.add('drawer-open');
  }

  // двойной rAF: гарантируем, что браузер «увидит» стартовые стили
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      drawer.classList.add('open');
      backdrop.classList.add('open');
      toggleBtn?.setAttribute('aria-expanded','true');
      drawer.setAttribute('aria-hidden','false');
    });
  });
}

function closeDrawer(){
  if (!drawer || !backdrop) return;

  drawer.classList.remove('open');
  backdrop.classList.remove('open');

  const cleanup = () => {
    document.documentElement.classList.remove('drawer-open');
    document.body.classList.remove('drawer-open');
    drawer.removeEventListener('transitionend', cleanup);
    backdrop.removeEventListener('transitionend', cleanup);
  };
  drawer.addEventListener('transitionend', cleanup);
  backdrop.addEventListener('transitionend', cleanup);

  toggleBtn?.setAttribute('aria-expanded','false');
  drawer.setAttribute('aria-hidden','true');
}

// Клики
toggleBtn?.addEventListener('click', openDrawer);
closeBtn?.addEventListener('click', closeDrawer);
backdrop?.addEventListener('click', (e)=>{ if (e.target === backdrop) closeDrawer(); });

// ESC для закрытия
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && drawer?.classList.contains('open')) closeDrawer();
});

// Отправка формы (демо)
drawerForm?.addEventListener('submit', async function(e){
  
  e.preventDefault();
  const fd = new FormData(this);
  try {
    // TODO: отправка на ваш эндпоинт, например:
    // const r = await fetch('api/contact.php', { method:'POST', body: fd });
    // if (!r.ok) throw new Error('send_failed');
    alert('Заявка отправлена! Мы свяжемся с вами в течение 24 часов.');
    this.reset();
    closeDrawer();
  } catch(err){
    alert('Не удалось отправить сообщение. Попробуйте позже.');
  }
});

function scrollTopNow() {
  // двойной rAF — чтобы подождать отрисовку/изображения
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      // на всякий случай совместимость:
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    });
  });
}

let __statsDone = false;
function animateStats(container) {
  if (__statsDone) return;
  __statsDone = true;

  const nums = [...container.querySelectorAll('.stat .number[data-target]')];
  if (!nums.length) return;

  const ease = t => 1 - Math.pow(1 - t, 3); 
  const dur = 2100; 

  nums.forEach(el => {
    const target = parseFloat(el.dataset.target || '0');
    const suffix = el.dataset.suffix || '';
    const start = performance.now();
    function frame(now){
      const p = Math.min(1, (now - start)/dur);
      const v = Math.round(ease(p)*target);
      el.textContent = v + suffix;
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  });
}

let __statsObserver = null;
function bindStatsObserver() {
  if (__statsObserver || __statsDone) return;
  const statsContainer = document.querySelector('#about .stats-grid');
  if (!statsContainer) return;

  __statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && entry.intersectionRatio >= 0.35) {
        animateStats(statsContainer);
        __statsObserver?.disconnect();
        __statsObserver = null;
      }
    });
  }, { threshold: [0.35] });

  __statsObserver.observe(statsContainer);
}

(function(){
  const _show = showPage;
  window.showPage = function(pageId){
    _show(pageId);
    if (pageId === 'about') bindStatsObserver();
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  const active = document.querySelector('.page-section.active');
  if (active && active.id === 'about') bindStatsObserver();
});
// === Drawer file attach (robust: works with old HTML) ===
document.addEventListener('DOMContentLoaded', () => {
  const drop = document.getElementById('fileDrop');
  if (!drop) return; // нет дропзоны — выходим

  // 1) найдём/создадим input[type=file]
  let input = drop.querySelector('#fileInput') || drop.querySelector('input[type="file"]');
  if (!input) {
    input = document.createElement('input');
    input.type = 'file';
    input.hidden = true;
    drop.prepend(input);
  }
  // включим multiple и расширим accept (сохраним твой, если он был)
  input.multiple = true;
  const defaultAccept = '.dwg,.step,.igs,.stp,.dxf,.zip,.rar,.7z,.pdf';
  if (!input.getAttribute('accept')) input.setAttribute('accept', defaultAccept);

  // 2) список файлов: используем #fileList, а если его нет — создадим
  let list = drop.querySelector('#fileList');
  if (!list) {
    list = document.createElement('div');
    list.id = 'fileList';
    list.className = 'file-list';
    // если был старый #fileName — спрячем его
    const legacy = drop.querySelector('#fileName');
    if (legacy) legacy.style.display = 'none';
    drop.appendChild(list);
  }

  // ——— helpers ———
  const fmt = (b) => {
    if (b == null) return '';
    const u = ['Б','КБ','МБ','ГБ']; let i = 0; let n = b;
    while (n >= 1024 && i < u.length - 1) { n /= 1024; i++; }
    return `${n.toFixed(n < 10 ? 1 : 0)} ${u[i]}`;
  };

  function render(files) {
    if (!list) return;
    list.innerHTML = '';

    const has = files && files.length;
    drop.classList.toggle('has-files', !!has);
    if (!has) return;

    [...files].forEach((f, idx) => {
      const item = document.createElement('div');
      item.className = 'file-chip';
      item.innerHTML = `
        <span>📄</span>
        <span class="name" title="${f.name}">${f.name}</span>
        <span class="size">${fmt(f.size)}</span>
        <button type="button" class="rm" aria-label="Удалить файл" data-i="${idx}">✕</button>
      `;
      list.appendChild(item);
    });
  }

  function removeAt(index) {
    const dt = new DataTransfer();
    [...(input.files || [])].forEach((f, i) => { if (i !== index) dt.items.add(f); });
    input.files = dt.files;
    render(input.files);
  }

  // ——— events ———
  input.addEventListener('change', () => {
    render(input.files);
    drop.classList.add('attached');
    setTimeout(() => drop.classList.remove('attached'), 180);
  });

  list.addEventListener('click', (e) => {
    const btn = e.target.closest('.rm');
    if (!btn) return;
  e.preventDefault();                     
  e.stopPropagation();
    removeAt(+btn.dataset.i);
  });

  ['dragenter','dragover'].forEach(ev => {
    drop.addEventListener(ev, e => { e.preventDefault(); e.stopPropagation(); drop.classList.add('drag'); });
  });
  ['dragleave','dragend','drop'].forEach(ev => {
    drop.addEventListener(ev, e => { e.preventDefault(); e.stopPropagation(); drop.classList.remove('drag'); });
  });

  drop.addEventListener('drop', (e) => {
    const files = e.dataTransfer?.files;
    if (!files || !files.length) return;
    const dt = new DataTransfer();
    [...(input.files || [])].forEach(f => dt.items.add(f));
    [...files].forEach(f => dt.items.add(f));
    input.files = dt.files;
    render(input.files);
    input.dispatchEvent(new Event('change', { bubbles:true }));
  });

  // клик по зоне (кроме кнопок удаления) — открыть диалог выбора
  drop.addEventListener('click', (e) => {
    if (e.target.closest('.rm')) {          // ← клик по кнопке «удалить»
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    if (drop.tagName === 'LABEL') return;   // label сам откроет диалог
    input.click();
  });
});


async function loadPortfolio() {
  const grid = document.getElementById('portfolioGrid');
  if (!grid) return;
  renderPortfolioSkeletons();

  try {
    const r = await fetch('api/portfolio.php');
    if (!r.ok) throw new Error('load_failed');
    const items = await r.json();

    if (!Array.isArray(items) || !items.length) {
      grid.innerHTML = '<div class="data-state">Скоро здесь появятся новые проекты.</div>';
      return;
    }

    grid.innerHTML = items.map(it => `
      <article class="portfolio-item" tabindex="0" role="article" aria-label="${escapeHtml(it.title)}">
        ${it.image_path ? `<img src="${escapeHtml(it.image_path)}" alt="${escapeHtml(it.title)}" class="portfolio-img">` : `<div class="portfolio-img" role="presentation" aria-hidden="true"></div>`}
        <div class="portfolio-content">
          <h3>${escapeHtml(it.title)}</h3>
          <p>${escapeHtml(it.description)}</p>
        </div>
      </article>
    `).join('');
  } catch(e){
    console.error('portfolio load failed', e);
    grid.innerHTML = '<div class="data-state error">Не удалось загрузить портфолио. Попробуйте позже.</div>';
  }
}

// Подгрузка при открытии вкладки "О компании"
(function(){
  const prevShow = showPage;
  window.showPage = function(pageId){
    prevShow(pageId);
    if (pageId === 'about') {
      bindStatsObserver();  // у вас уже есть
      loadPortfolio();
    }
  };
})();

// Если стартуем сразу на "about"
document.addEventListener('DOMContentLoaded', () => {
  const active = document.querySelector('.page-section.active');
  if (active && active.id === 'about') loadPortfolio();
});

function toast(msg, type='ok'){
  const host = document.getElementById('toaster');
  if (!host) { alert(msg); return; }
  const el = document.createElement('div');
  el.className = 'toast' + (type==='error' ? ' error' : type==='warn' ? ' warn' : '');
  el.textContent = msg;
  host.appendChild(el);
  setTimeout(()=>{ el.style.opacity = '0'; el.style.transform='translateY(4px)'; }, 2600);
  setTimeout(()=> host.removeChild(el), 3200);
}

(function ensureModalHost(){
  if (document.getElementById('modalHost')) return;
  const host = document.createElement('div');
  host.id = 'modalHost';
  host.innerHTML = `
    <div class="modal-backdrop" data-close="1"></div>
    <div class="modal" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
      <header class="modal-head">
        <h3 id="modalTitle"></h3>
        <button class="icon-btn" data-close="1" aria-label="Закрыть">✕</button>
      </header>
      <div class="modal-body"></div>
      <footer class="modal-foot">
        <button class="btn ghost" data-close="1">Отмена</button>
        <button class="btn accent" id="modalSave">Сохранить</button>
      </footer>
    </div>
  `;
  document.body.appendChild(host);
  host.addEventListener('click', (e)=>{
    if (e.target.closest('[data-close]')) closeModal();
  });
})();
function openModal({title, bodyHTML, onSave}){
  const host = document.getElementById('modalHost');
  host.querySelector('#modalTitle').textContent = title || '';
  host.querySelector('.modal-body').innerHTML = bodyHTML || '';
  host.classList.add('open');
  const saveBtn = host.querySelector('#modalSave');
  saveBtn.onclick = async () => {
    try{ await onSave?.(); closeModal(); toast('Сохранено'); }
    catch(err){ console.error(err); toast('Ошибка сохранения','error'); }
  };
}
function closeModal(){
  const host = document.getElementById('modalHost');
  host.classList.remove('open');
}

// ===== styles for modal =====
(function injectModalCSS(){
  if (document.getElementById('modalCSS')) return;
  const s = document.createElement('style');
  s.id = 'modalCSS';
  s.textContent = `
  #modalHost{ position:fixed; inset:0; display:none; z-index:4000; }
  #modalHost.open{ display:block; }
  #modalHost .modal-backdrop{ position:absolute; inset:0; background:rgba(0,0,0,.55); }
  #modalHost .modal{
    position:relative; z-index:1; width:min(840px,96vw);
    margin:6vh auto; background:rgba(28,28,28,.95);
    border:1px solid rgba(255,255,255,.08); border-radius:16px; overflow:hidden;
    box-shadow:0 20px 60px rgba(0,0,0,.5);
  }
  .modal-head,.modal-foot{ display:flex; align-items:center; justify-content:space-between; gap:.6rem; padding:1rem; border-bottom:1px solid rgba(255,255,255,.06); }
  .modal-foot{ border-top:1px solid rgba(255,255,255,.06); border-bottom:0; }
  .modal-body{ padding:1rem; max-height:60vh; overflow:auto; display:grid; gap:.8rem; }
  .modal .grid{ display:grid; gap:.75rem; grid-template-columns:1fr; }
  .modal .row{ display:grid; gap:.4rem; }
  .modal label{ font-size:.9rem; color:#cfcfcf; }
  .modal .img-grid{ display:grid; grid-template-columns:repeat(auto-fill,minmax(120px,1fr)); gap:.6rem; }
  .modal .img-cell{ position:relative; }
  .modal .img-cell img{ width:100%; aspect-ratio:4/3; object-fit:cover; border-radius:10px; border:1px solid rgba(255,255,255,.12); }
  .modal .img-cell button{ position:absolute; top:6px; right:6px; }
  `;
  document.head.appendChild(s);
})();

async function openServiceEditor(id){
  // грузим детально
  const r = await fetch(`api/services.php?id=${id}`);
  if (!r.ok) { toast('Не удалось загрузить услугу','error'); return; }
  const s = await r.json();
  const feats = (s.features||[]).join('\n');

  openModal({
    title: `Редактирование услуги #${id}`,
    bodyHTML: `
      <div class="grid">
        <div class="row">
          <label>Название</label>
          <input id="seName" class="form-control" value="${escapeHtml(s.name||'')}" />
        </div>
        <div class="row">
          <label>Описание</label>
          <textarea id="seDesc" class="form-control" rows="5">${escapeHtml(s.description||'')}</textarea>
        </div>
        <div class="row">
          <label>Особенности (по одной в строке)</label>
          <textarea id="seFeat" class="form-control" rows="4">${escapeHtml(feats)}</textarea>
        </div>

        <div class="row">
          <label>Галерея</label>
          <div class="img-grid" id="seGallery">
            ${(s.images||[]).map(img => `
              <div class="img-cell" data-img-id="${img.id}">
                <img src="${escapeHtml(img.path)}" alt="">
                <button class="btn danger btn-small" data-del-img="${img.id}">Удалить</button>
              </div>
            `).join('')}
          </div>
          <label class="file-drop" id="seAddImgs">
            <input id="seFiles" type="file" accept="image/*" multiple hidden>
            <div class="file-drop-inner">
              <div class="file-ic">📎</div>
              <div><div class="file-main">Добавить фото</div><div class="file-sub">перетащите сюда или нажмите</div></div>
            </div>
            <div class="file-list" id="seFileList"></div>
          </label>
        </div>
      </div>
    `,
    onSave: async () => {
      const name  = document.getElementById('seName').value.trim();
      const desc  = document.getElementById('seDesc').value.trim();
      const feats = document.getElementById('seFeat').value.split('\n').map(s=>s.trim()).filter(Boolean);

      // 1) обновим текстовые поля (PUT/PATCH)
      const up = await fetch(`api/services.php?id=${id}`, {
        method:'PUT',
        headers:{ 'Content-Type':'application/json' },
        body: JSON.stringify({ name, description: desc, features: feats })
      });
      if (!up.ok) throw new Error('update_failed');

      // 2) загрузим новые картинки, если выбраны
      const files = document.getElementById('seFiles').files;
      if (files && files.length){
        for (const f of files){
          const fd = new FormData();
          fd.append('service_id', id);
          fd.append('image', f);
          const ur = await fetch('api/upload_service_image.php', { method:'POST', body: fd });
          if (!ur.ok) throw new Error('img_upload_failed');
        }
      }

      await adminLoadList();
      await loadServices();
    }
  });

  // локальная обработка превью выбранных файлов
  (function bindLocalFiles(){
    const input = document.getElementById('seFiles');
    const list  = document.getElementById('seFileList');
    const fmt = (b)=>{ const u=['Б','КБ','МБ','ГБ']; let i=0,n=b; while(n>=1024&&i<u.length-1){n/=1024;i++;} return `${n.toFixed(n<10?1:0)} ${u[i]}`; };
    const render = (files)=>{
      list.innerHTML = '';
      [...files].forEach((f,i)=>{
        const div = document.createElement('div');
        div.className = 'file-chip';
        div.innerHTML = `<span>📄</span><span class="name">${f.name}</span><span class="size">${fmt(f.size)}</span><button class="rm" data-i="${i}">✕</button>`;
        list.appendChild(div);
      });
    };
    input?.addEventListener('change', ()=> render(input.files));
    list?.addEventListener('click', (e)=>{
      const btn = e.target.closest('.rm'); if(!btn) return;
      const dt = new DataTransfer();
      [...input.files].forEach((f,i)=>{ if(i!=btn.dataset.i) dt.items.add(f); });
      input.files = dt.files; render(input.files);
    });
    document.getElementById('seAddImgs')?.addEventListener('click',(e)=>{
      if (e.target.closest('.rm')) { e.preventDefault(); e.stopPropagation(); return; }
      if (e.currentTarget.tagName !== 'LABEL') input.click();
    });
  })();

  // удаление существующих изображений (потребуется небольшой PHP-эндпоинт, см. ниже)
  const modalBody = document.querySelector('#modalHost .modal-body');
  modalBody.onclick = async (e) => {
    const btn = e.target.closest('[data-del-img]');
    if (!btn) return;

    if (!confirm('Удалить изображение?')) return;

    const imgId = +btn.dataset.delImg;
    const r = await fetch(`api/service_image.php?id=${imgId}`, { method:'DELETE' });
    if (!r.ok){ toast('Не удалось удалить','error'); return; }

    btn.closest('.img-cell')?.remove();
  };
}
async function openPortfolioEditor(id){
  // детальный запрос по портфолио
  const r = await fetch(`api/portfolio.php?id=${id}`);
  if (!r.ok){ toast('Не удалось загрузить элемент','error'); return; }
  const p = await r.json();

  openModal({
    title:`Редактирование портфолио #${id}`,
    bodyHTML: `
      <div class="grid">
        <div class="row">
          <label>Заголовок</label>
          <input id="peTitle" class="form-control" value="${escapeHtml(p.title||'')}">
        </div>
        <div class="row">
          <label>Описание</label>
          <textarea id="peDesc" class="form-control" rows="4">${escapeHtml(p.description||'')}</textarea>
        </div>
        <div class="row">
          <label>Текущее изображение</label>
          <div class="img-grid">
            ${p.image_path ? `<div class="img-cell"><img src="${escapeHtml(p.image_path)}" alt=""></div>` : `<div class="muted">Нет изображения</div>`}
          </div>
        </div>
        <div class="row">
          <label>Заменить изображение</label>
          <input id="peFile" type="file" accept="image/*" class="form-control">
        </div>
      </div>
    `,
    onSave: async ()=>{
      const title = document.getElementById('peTitle').value.trim();
      const desc  = document.getElementById('peDesc').value.trim();

      // 1) текстовые поля
      const up = await fetch(`api/portfolio.php?id=${id}`, {
        method:'PUT',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ title, description: desc })
      });
      if (!up.ok) throw new Error('port_update_failed');

      // 2) замена изображения (если выбрано)
      const f = document.getElementById('peFile').files[0];
      if (f){
        const fd = new FormData();
        fd.append('portfolio_id', id);
        fd.append('image', f);
        const ur = await fetch('api/upload_portfolio_image.php', { method:'POST', body: fd });
        if (!ur.ok) throw new Error('port_img_failed');
      }

      await adminLoadPortfolioList();
      // перерисуем публичную сетку, если вкладка «about» активна
      if (document.querySelector('#about.page-section.active')) loadPortfolio();
    }
  });
}
