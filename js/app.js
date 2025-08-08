// Navigation
function showPage(pageId) {
  document.querySelectorAll('.page-section').forEach(p => p.classList.remove('active'));
  const sec = document.getElementById(pageId);
  if (!sec) { console.warn('No section #'+pageId); return; }
  sec.classList.add('active');
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  const active = document.querySelector(`[data-page="${pageId}"]`);
  if (active) active.classList.add('active');
}

function toggleNav() {
  document.getElementById('nav').classList.toggle('open');
}

document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    showPage(link.getAttribute('data-page'));
    document.getElementById('nav').classList.remove('open');
  });
});

// Services
let services = [];

async function loadServices() {
  const res = await fetch('api/services.php');
  services = await res.json();
  const container = document.getElementById('services-container');
  container.innerHTML = '';
  services.forEach((service, index) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
    <div class="card-icon-placeholder">${index + 1}</div>
      <h3>${service.name}</h3>
      <p>${service.description}</p>
      <ul>${service.features.map(f => `<li>${f}</li>`).join('')}</ul>
    `;
    container.appendChild(card);
  });
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

document.getElementById('contactForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const formData = new FormData(this);
  alert('Заявка отправлена! Мы свяжемся с вами в течение 24 часов.');
  this.reset();
});

setTimeout(openPopup, 45000);

document.addEventListener('DOMContentLoaded', loadServices);

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
  root.innerHTML = `
    <div class="admin-card" style="max-width:520px;margin:1rem auto;">
      <h3 style="margin-top:0">Введите логин и пароль администратора</h3>
      <p class="muted"></p>
	  <br>
      <div style="display:grid; gap:.75rem;">
        <input id="admUser" class="form-control" placeholder="Логин" autocomplete="username">
        <input id="admPass" class="form-control" type="password" placeholder="Пароль" autocomplete="current-password">
        <div class="admin-actions">
          <button class="btn accent" id="admLoginBtn">Войти</button>
        </div>
      </div>
    </div>`;
  document.getElementById('admLoginBtn').onclick = async () => {
    const username = document.getElementById('admUser').value.trim();
    const password = document.getElementById('admPass').value;
    const res = await fetch('api/login.php', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({username, password})});
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
    <div class="admin-grid">
      <div class="admin-card">
        <h3 style="margin-top:0">Добавить услугу</h3>
        <div style="display:grid; gap:.75rem;">
          <input id="aName" class="form-control" placeholder="Название услуги">
          <textarea id="aDesc" class="form-control" rows="4" placeholder="Описание услуги"></textarea>
          <textarea id="aFeat" class="form-control" rows="3" placeholder="Особенности (каждая с новой строки)"></textarea>
          <div class="admin-actions">
            <button class="btn accent" id="aAdd">Добавить</button>
            <button class="btn ghost" id="aLogout">Выйти</button>
          </div>
        </div>
      </div>
      <div>
        <div class="admin-card">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <h3 style="margin:0">Услуги</h3>
            <span class="badge" id="aCount">—</span>
          </div>
          <div id="aList" class="list-cards" style="margin-top:1rem;"></div>
        </div>
      </div>
    </div>`;

  document.getElementById('aLogout').onclick = async () => {
    await fetch('api/logout.php', {method:'POST'});
    adminRenderLogin();
  };

  document.getElementById('aAdd').onclick = async () => {
    const payload = {
      name: document.getElementById('aName').value.trim(),
      description: document.getElementById('aDesc').value.trim(),
      features: document.getElementById('aFeat').value.split('\n').map(s=>s.trim()).filter(Boolean)
    };
    if (!payload.name || !payload.description) { alert('Заполните название и описание'); return; }
    const r = await fetch('api/services.php', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload)});
    if (r.ok) { document.getElementById('aName').value=''; document.getElementById('aDesc').value=''; document.getElementById('aFeat').value=''; adminLoadList(); }
    else alert('Ошибка при добавлении');
  };

  adminLoadList();
}

async function adminLoadList() {
  const list = document.getElementById('aList');
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
          <h4>#${s.id} ${s.name}</h4>
          <button class="btn danger" data-id="${s.id}">Удалить</button>
        </div>
        <div class="muted">${s.description}</div>
        <ul>${(s.features||[]).map(f=>`<li>${f}</li>`).join('')}</ul>`;
      list.appendChild(card);
    });
    list.querySelectorAll('button[data-id]').forEach(btn => {
      btn.onclick = async () => {
        if (!confirm('Удалить услугу?')) return;
        const r = await fetch('api/services.php?id='+btn.dataset.id, {method:'DELETE'});
        if (r.ok) adminLoadList(); else alert('Ошибка удаления');
      };
    });
  } catch(e) {
    list.innerHTML = '<div class="muted">Не удалось загрузить список</div>';
  }
}

async function adminInitPage() {
  const logged = await adminIsLogged();
  if (logged) adminRenderDashboard(); else adminRenderLogin();
}

// Hook into navigation: when switching to admin page, initialize it
(function(){
  const oldShowPage = showPage;
  window.showPage = function(pageId){
    oldShowPage(pageId);
    if (pageId === 'admin') { adminInitPage(); }
  };
})();
