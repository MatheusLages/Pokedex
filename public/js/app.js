// O site e a API são servidos pelo mesmo JSON Server.
const API = '/pokemons';
const lista = document.getElementById('lista');
const busca = document.getElementById('busca');
const tipo = document.getElementById('tipo');
const ordem = document.getElementById('ordem');
const aviso = document.getElementById('aviso');
let pokemons = [];
let apenasFavoritos = false;
const cores = {Planta:'#eaf5e9',Veneno:'#f1eafa',Fogo:'#fff0e6',Água:'#e8f2fc',Voador:'#eef0fc',Inseto:'#f2f5df',Normal:'#f1eee9',Elétrico:'#fff6d7',Terra:'#f6ebde',Fada:'#fbeaf3',Psíquico:'#fce9ef',Lutador:'#f5e8e4',Pedra:'#efeee4',Fantasma:'#efebf8',Gelo:'#e4f7f7',Dragão:'#e9e8fc'};
function escapar(texto) {
  return String(texto).replace(/[&<>"']/g, letra => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[letra]));
}
function numero(valor) { return String(valor).padStart(3, '0'); }
function imagem(pokemon) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${Number(pokemon.numero)}.png`;
}
function tiposHTML(tipos) {
  return tipos.map(t => `<span class="type-badge" style="--tint:${cores[t] || '#eef0f5'}">${escapar(t)}</span>`).join('');
}
function mostrarErro(mensagem) { aviso.textContent = mensagem; aviso.classList.remove('d-none'); }
function renderizar() {
  const termo = busca.value.trim().toLocaleLowerCase('pt-BR');
  const resultado = pokemons.filter(p =>
    (p.nome.toLocaleLowerCase('pt-BR').includes(termo) || (termo !== '' && Number(termo) === p.numero) || numero(p.numero).includes(termo)) &&
    (!tipo.value || p.tipos.includes(tipo.value)) && (!apenasFavoritos || p.favorito)
  ).sort((a,b) => ordem.value === 'nome' ? a.nome.localeCompare(b.nome,'pt-BR') : a.numero-b.numero);
  document.getElementById('contador').textContent = `${resultado.length} Pokémon encontrados`;
  document.getElementById('totalFavoritos').textContent = pokemons.filter(p=>p.favorito).length;
  document.getElementById('vazio').classList.toggle('d-none', resultado.length > 0);
  document.getElementById('tituloLista').textContent = apenasFavoritos ? 'Meus favoritos' : 'Todos os Pokémon';
  lista.innerHTML = resultado.map(p => `<div class="col-12 col-sm-6 col-lg-4 col-xl-3"><article class="pokemon-card">
    <div class="art" style="--tint:${cores[p.tipos[0]] || '#eef0f5'}"><span class="number">#${numero(p.numero)}</span>
    <img src="${imagem(p)}" alt="${escapar(p.nome)}" loading="lazy" width="155" height="155">
    <button class="favorite" data-favorito="${p.id}" aria-label="${p.favorito?'Remover':'Adicionar'} ${escapar(p.nome)} ${p.favorito?'dos':'aos'} favoritos" aria-pressed="${p.favorito}">${p.favorito?'★':'☆'}</button></div>
    <div class="p-3 pt-1"><h3 class="h5 fw-bold">${escapar(p.nome)}</h3><div class="mb-3">${tiposHTML(p.tipos)}</div><button class="btn details-btn" data-detalhes="${p.id}">Ver detalhes <span aria-hidden="true">↗</span></button></div></article></div>`).join('');
  lista.querySelectorAll('img').forEach(img=>img.addEventListener('error',()=>{img.alt='Imagem indisponível';},{once:true}));
}
async function carregar() {
  try {
    const resposta = await fetch(API);
    if (!resposta.ok) throw new Error('Falha ao carregar');
    pokemons = await resposta.json();
    const tipos = [...new Set(pokemons.flatMap(p=>p.tipos))].sort((a,b)=>a.localeCompare(b,'pt-BR'));
    tipos.forEach(t=>tipo.add(new Option(t,t)));
    renderizar();
  } catch (erro) {
    lista.innerHTML = '';
    mostrarErro('Não foi possível carregar a Pokédex. Inicie o projeto com npm start e acesse http://localhost:3000. Atualize a página para tentar novamente.');
  }
}
async function alternarFavorito(id, botao) {
  const pokemon = pokemons.find(p=>String(p.id)===id);
  botao.disabled = true;
  aviso.classList.add('d-none');
  try {
    const resposta = await fetch(`${API}/${encodeURIComponent(id)}`, {method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({favorito:!pokemon.favorito})});
    if (!resposta.ok) throw new Error('Falha ao salvar');
    const salvo = await resposta.json();
    pokemon.favorito = salvo.favorito;
    renderizar();
  } catch (erro) { mostrarErro('Não foi possível salvar o favorito. Verifique se o JSON Server está ativo e tente novamente.'); }
  finally { botao.disabled = false; }
}
function detalhes(id) {
  const p = pokemons.find(p=>String(p.id)===id);
  document.getElementById('nomeDetalhes').textContent = `#${numero(p.numero)} · ${p.nome}`;
  document.getElementById('corpoDetalhes').innerHTML = `<img class="detail-image" src="${imagem(p)}" alt="${escapar(p.nome)}"><div class="text-center mb-3">${tiposHTML(p.tipos)}</div><p class="text-secondary">${escapar(p.descricao)}</p><div class="row g-3"><div class="col-6"><div class="stat"><small>Altura</small><strong>${p.altura.toLocaleString('pt-BR')} m</strong></div></div><div class="col-6"><div class="stat"><small>Peso</small><strong>${p.peso.toLocaleString('pt-BR')} kg</strong></div></div></div>`;
  bootstrap.Modal.getOrCreateInstance(document.getElementById('modalDetalhes')).show();
}
busca.addEventListener('input', renderizar);
tipo.addEventListener('change', renderizar);
ordem.addEventListener('change', renderizar);
document.getElementById('favoritos').addEventListener('click', function(){
  apenasFavoritos = !apenasFavoritos;
  this.setAttribute('aria-pressed',apenasFavoritos);
  this.classList.toggle('active',apenasFavoritos);
  renderizar();
});
lista.addEventListener('click',event=>{
  const favorito = event.target.closest('[data-favorito]');
  const detalhe = event.target.closest('[data-detalhes]');
  if (favorito) alternarFavorito(favorito.dataset.favorito, favorito);
  if (detalhe) detalhes(detalhe.dataset.detalhes);
});
carregar();
