<?php
session_start();
require __DIR__ . '/../api/db.php';
$logged_in = isset($_SESSION['admin']) && $_SESSION['admin'] === true;
?>
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Админ — Управление услугами</title>
  <link rel="stylesheet" href="/css/style.css"/>
  <style>
    .admin-container { max-width: 960px; margin: 40px auto; padding: 24px; background: var(--bg-light, #2d2d2d); border-radius: var(--radius, 8px); }
    .login-card { max-width: 420px; margin: 80px auto; padding: 24px; background: var(--bg-light, #2d2d2d); border-radius: var(--radius, 8px); }
    .form-row { display:flex; gap:12px; margin:12px 0; }
    .form-row input, textarea { width:100%; padding:12px; border-radius:8px; border:1px solid #444; background:#1f1f1f; color:#e8e8e8; }
    .btn { padding: 10px 16px; border:0; border-radius:8px; cursor:pointer; }
    .btn.accent { background: var(--accent, #ffad00); }
    .muted { opacity: .8; }
    .list { margin-top:24px; display:grid; gap:12px; }
    .card { padding:16px; background:#1f1f1f; border-radius:8px; border:1px solid #333; }
    .topbar { display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; }
    .danger { background:#8b0000; color:white; }
  </style>
</head>
<body>
  <div class="admin-container" id="app">
    <div class="topbar">
      <h1>Личный кабинет администратора</h1>
      <div>
        <a class="btn" href="/">← На сайт</a>
        <button class="btn" id="logoutBtn" style="display:none">Выйти</button>
      </div>
    </div>
    <div id="content"></div>
  </div>

<script>
const state = { loggedIn: <?= $logged_in ? 'true' : 'false' ?> };

function h(tag, attrs={}, html='') {
  const el = document.createElement(tag);
  Object.entries(attrs).forEach(([k,v])=> el.setAttribute(k,v));
  el.innerHTML = html;
  return el;
}

function renderLogin() {
  const box = h('div', {class:'login-card'});
  box.innerHTML = `
    <h2>Вход в админ-панель</h2>
    <p class="muted">Введите логин и пароль администратора.</p>
    <div class="form-row"><input id="loginUser" placeholder="Логин" autocomplete="username"></div>
    <div class="form-row"><input id="loginPass" type="password" placeholder="Пароль" autocomplete="current-password"></div>
    <div class="form-row">
      <button class="btn accent" id="loginSubmit">Войти</button>
    </div>`;
  document.getElementById('content').replaceChildren(box);
  document.getElementById('logoutBtn').style.display = 'none';
  document.getElementById('loginSubmit').onclick = async () => {
    const username = document.getElementById('loginUser').value.trim();
    const password = document.getElementById('loginPass').value;
    const res = await fetch('/api/login.php', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({username, password})});
    if(res.ok) {
      state.loggedIn = true; renderAdmin();
    } else { alert('Неверные учетные данные'); }
  };
}

async function fetchServices() {
  const r = await fetch('/api/services.php');
  if (!r.ok) throw new Error('Не удалось загрузить услуги');
  return await r.json();
}

function renderAdmin() {
  const wrap = h('div');
  wrap.innerHTML = `
    <div class="card">
      <h3>Добавить новую услугу</h3>
      <div class="form-row"><input id="serviceName" placeholder="Название услуги"></div>
      <div class="form-row"><textarea id="serviceDescription" rows="4" placeholder="Описание услуги"></textarea></div>
      <div class="form-row"><textarea id="serviceFeatures" rows="3" placeholder="Особенности (каждая с новой строки)"></textarea></div>
      <div class="form-row"><button class="btn accent" id="addBtn">Добавить услугу</button></div>
    </div>
    <div class="list" id="list"></div>`;
  document.getElementById('content').replaceChildren(wrap);
  document.getElementById('logoutBtn').style.display = 'inline-block';
  document.getElementById('logoutBtn').onclick = async () => {
    await fetch('/api/logout.php', {method:'POST'}); state.loggedIn=false; renderLogin();
  };
  document.getElementById('addBtn').onclick = async () => {
    const payload = {
      name: document.getElementById('serviceName').value.trim(),
      description: document.getElementById('serviceDescription').value.trim(),
      features: document.getElementById('serviceFeatures').value.split('\n').map(s=>s.trim()).filter(Boolean)
    };
    const r = await fetch('/api/services.php', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload)});
    if (r.ok) { alert('Услуга добавлена'); loadList(); }
    else { const t = await r.text(); alert('Ошибка: '+t); }
  };
  loadList();
}

async function loadList() {
  const list = document.getElementById('list'); list.innerHTML = '<div class="muted">Загрузка...</div>';
  try {
    const data = await fetchServices();
    list.innerHTML = '';
    data.forEach(s => {
      const card = h('div', {class:'card'});
      card.innerHTML = '<div class="topbar"><strong>#'+s.id+' '+s.name+'</strong><button class="btn danger" data-id="'+s.id+'">Удалить</button></div>' +
        '<div class="muted">'+s.description+'</div>' +
        '<ul>'+ (s.features||[]).map(f=>'<li>'+f+'</li>').join('') +'</ul>';
      list.appendChild(card);
    });
    list.querySelectorAll('button[data-id]').forEach(btn => {
      btn.onclick = async () => {
        if (!confirm('Удалить услугу?')) return;
        const r = await fetch('/api/services.php?id='+btn.dataset.id, {method:'DELETE'});
        if (r.ok) loadList(); else alert('Ошибка удаления');
      };
    });
  } catch(e){ list.innerHTML = '<div class="muted">Не удалось загрузить список</div>'; }
}

state.loggedIn ? renderAdmin() : renderLogin();
</script>
</body>
</html>
