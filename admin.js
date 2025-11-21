// admin.js
// Chave única no localStorage
const STORAGE_KEY = 'recicla_users_v1';

// Elementos
const form = document.getElementById('userForm');
const nameInput = document.getElementById('userName');
const emailInput = document.getElementById('userEmail');
const listEl = document.getElementById('userList');
const searchInput = document.getElementById('searchInput');
const btnLimpar = document.getElementById('btnLimpar');
const btnExcluirTodos = document.getElementById('btnExcluirTodos');

// Util: carregar lista do localStorage
function loadUsers() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Erro ao ler LocalStorage', e);
    return [];
  }
}

// Util: salvar lista no localStorage
function saveUsers(users) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

// Formatação de data (dd/mm/yyyy hh:mm)
function formatDate(iso) {
  const d = new Date(iso);
  const pad = n => String(n).padStart(2,'0');
  return `${pad(d.getDate())}/${pad(d.getMonth()+1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

// Renderiza a lista (recebe array opcional para filtro)
function renderList(users = null) {
  const data = users || loadUsers();
  listEl.innerHTML = '';

  if (!data.length) {
    const li = document.createElement('li');
    li.textContent = 'Nenhum cadastro encontrado.';
    li.style.color = '#cfcfcf';
    listEl.appendChild(li);
    return;
  }

  data.forEach(item => {
    const li = document.createElement('li');
    li.style.display = 'flex';
    li.style.justifyContent = 'space-between';
    li.style.alignItems = 'center';
    li.style.padding = '10px';
    li.style.border = '1px solid rgba(255,255,255,0.06)';
    li.style.marginBottom = '8px';
    li.style.borderRadius = '6px';
    li.style.backgroundColor = '#0f0f0f';

    const left = document.createElement('div');
    left.style.maxWidth = '80%';
    left.innerHTML = `<strong>${escapeHtml(item.name)}</strong><br/>
                      <span style="font-size:13px;color:#bdbdbd">${escapeHtml(item.email)}</span><br/>
                      <span style="font-size:12px;color:#9a9a9a">Enviado: ${formatDate(item.date)}</span>`;

    const actions = document.createElement('div');

    const delBtn = document.createElement('button');
    delBtn.textContent = 'Excluir';
    delBtn.style.marginLeft = '8px';
    delBtn.className = 'submit';
    delBtn.style.backgroundColor = '#7a1f1f';
    delBtn.addEventListener('click', () => deleteItem(item.id));

    actions.appendChild(delBtn);

    li.appendChild(left);
    li.appendChild(actions);
    listEl.appendChild(li);
  });
}

// Evitar XSS simples nas strings
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Cadastrar novo usuário
form.addEventListener('submit', function (e) {
  e.preventDefault();
  const name = nameInput.value.trim();
  const email = emailInput.value.trim().toLowerCase();

  if (!name || !email) {
    alert('Preencha nome e e-mail.');
    return;
  }

  const users = loadUsers();

  const newItem = {
    id: Date.now().toString(), // id simples
    name,
    email,
    date: new Date().toISOString()
  };

  users.push(newItem);
  saveUsers(users);
  renderList();
  form.reset();
  nameInput.focus();
});

// Limpar campos
btnLimpar.addEventListener('click', () => {
  form.reset();
  nameInput.focus();
});

// Deletar item por id
function deleteItem(id) {
  const users = loadUsers();
  const filtered = users.filter(u => u.id !== id);
  saveUsers(filtered);
  renderList(filtered);
}

// Excluir todos
btnExcluirTodos.addEventListener('click', () => {
  const confirmDelete = confirm('Confirma exclusão de todos os cadastros?');
  if (!confirmDelete) return;
  localStorage.removeItem(STORAGE_KEY);
  renderList([]);
});

// Pesquisa (por nome ou e-mail)
searchInput.addEventListener('input', () => {
  const q = searchInput.value.trim().toLowerCase();
  const users = loadUsers();
  if (!q) {
    renderList(users);
    return;
  }
  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(q) ||
    u.email.toLowerCase().includes(q)
  );
  renderList(filtered);
});

// Inicializa render
renderList();
