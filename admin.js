const nomeInput = document.getElementById('nome');
const emailInput = document.getElementById('email');
const listaEl = document.getElementById('lista_usuarios');
const btnLimpar = document.getElementById('botao_limpar');
const btnExcluirTodos = document.getElementById('botao_excluir');
const pesquisaInput = document.getElementById('pesquisa');

function lerDados() {
  const dados = localStorage.getItem('bancoDadosRecicla');
  if (dados) {
    return JSON.parse(dados);
  } else {
      return [];
  }
}

function salvarDados(lista) {
  const jsonLista = JSON.stringify(lista);
  localStorage.setItem('bancoDadosRecicla', jsonLista);
}

function pegarDataAtual() {
  const dataAtual = new Date();
  const dia = dataAtual.getDate();
  const mes = dataAtual.getMonth() + 1;
  const ano = dataAtual.getFullYear();
  const hora = dataAtual.getHours();
  const minutos = dataAtual.getMinutes();  
  return `${dia}/${mes}/${ano} às ${hora}:${minutos}`;
}

function renderizar() {
  listaEl.innerHTML = "";
  const usuarios = lerDados();
  const termo = pesquisaInput.value;    
  for (let i = 0; i < usuarios.length; i++) {
    const usuario = usuarios[i];      
    let exibir = true;
    if (termo) {
      if (!usuario.nome.match(termo) && !usuario.email.match(termo)) {
        exibir = false;
      }
    }
    if (exibir) {
      const li = document.createElement('li');
      li.className = "item_lista";
      li.innerHTML = `
      <div>
        <strong>${usuario.nome}</strong>
        <span>${usuario.email}</span>
        <span style="font-size: 11px; color: #666;">Data: ${usuario.data}</span>
      </div>
      <button class="botao_lixeira" onclick="excluirUsuario('${usuario.id}')"><i class="fa-solid fa-trash"></i></button>`;
      listaEl.appendChild(li);
    }
  }
}

function cadastrarUsuario() {
  if (nomeInput.value.length == 0 || emailInput.value.length == 0) {
    alert("Preencha todos os campos");
  } else {
    const novoUsuario = {
      id: new Date(),
      nome: nomeInput.value,
      email: emailInput.value,
      data: pegarDataAtual()
    };
    const lista = lerDados();
    lista.push(novoUsuario);
    salvarDados(lista);
    nomeInput.value = "";
    emailInput.value = "";    
    renderizar();
    }
}

btnLimpar.addEventListener('click', function() {
  nomeInput.value = "";
  emailInput.value = "";
});

window.excluirUsuario = function(id) {
  const lista = lerDados();
  const novaLista = [];  
  for (let i = 0; i < lista.length; i++) {
    if (String(lista[i].id) != String(id)) {
        novaLista.push(lista[i]);
    }
  }  
  salvarDados(novaLista);
  renderizar();
};

btnExcluirTodos.addEventListener('click', function() {
  localStorage.removeItem('bancoDadosRecicla');
  renderizar();
});

function pesquisar() {
    renderizar();
}

renderizar();