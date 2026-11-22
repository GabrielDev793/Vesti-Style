// ==================================
// VESTIÊ STILE - PERFIL
// ==================================

const paginas = document.querySelectorAll('.pagina');
const tituloPagina = document.getElementById('titulo-pagina');

let paginaAtual = 'pagina-perfil';

// ==================================
// NAVEGAÇÃO INTERNA
// ==================================

function mostrarPagina(id) {
  paginas.forEach(pagina => {
    pagina.classList.toggle('ativa', pagina.id === id);
  });

  paginaAtual = id;

  const titulos = {
    'pagina-perfil': '',
    'pagina-editar': 'Editar perfil',
    'pagina-estilo': 'Meu estilo',
    'pagina-salvos': 'Looks salvos',
    'pagina-preferencias': 'Preferências',
    'pagina-configuracoes': 'Configurações'
  };

  // O título não existe no HTML; sem esta verificação o script quebrava aqui
  // e o "Meu estilo" nunca era atualizado.
  if (tituloPagina) tituloPagina.textContent = titulos[id] || '';

  document.getElementById('btn-config-topo').style.visibility =
    id === 'pagina-perfil' ? 'visible' : 'hidden';

  carregarLooksSalvos();
  carregarMeuEstilo();

  window.scrollTo({ top: 0, behavior: 'instant' });
}

document.querySelectorAll('[data-pagina]').forEach(botao => {
  botao.addEventListener('click', () => {
    mostrarPagina(botao.dataset.pagina);
  });
});

document.getElementById('btn-config-topo')
  .addEventListener('click', () => {
    mostrarPagina('pagina-configuracoes');
  });

document.getElementById('editar-perfil')
  .addEventListener('click', () => {
    mostrarPagina('pagina-editar');
  });

document.getElementById('atalho-salvos')
  .addEventListener('click', () => {
    mostrarPagina('pagina-salvos');
  });

document.querySelector('.voltar')
  .addEventListener('click', evento => {
    if (paginaAtual !== 'pagina-perfil') {
      evento.preventDefault();
      mostrarPagina('pagina-perfil');
    }
  });

// Contadores demonstrativos
['btn-seguidores', 'btn-seguindo'].forEach(id => {
  document.getElementById(id).addEventListener('click', () => {
    alert('A lista de usuários estará disponível futuramente.');
  });
});

// ==================================
// DADOS DO PERFIL
// ==================================

const nomeUsuario = document.getElementById('nome-usuario');
const bioUsuario = document.getElementById('bio-usuario');

const editarNome = document.getElementById('editar-nome');
const editarBio = document.getElementById('editar-bio');

const fotoUsuario = document.getElementById('foto-usuario');
const previewFoto = document.getElementById('preview-foto');

let dadosPerfil = {
  nome: 'apollo',
  bio: 'Estilo é uma forma de se expressar.',
  foto: 'imagens/foto-perfil.jpg'
};

try {
  const dadosSalvos = JSON.parse(
    localStorage.getItem('vestiePerfil') || 'null'
  );

  if (dadosSalvos) {
    dadosPerfil = { ...dadosPerfil, ...dadosSalvos };
  }
} catch (erro) {
  console.warn('Não foi possível carregar o perfil.');
}

function atualizarPerfil() {
  nomeUsuario.textContent = dadosPerfil.nome;
  bioUsuario.textContent = dadosPerfil.bio;

  editarNome.value = dadosPerfil.nome;
  editarBio.value = dadosPerfil.bio;

  fotoUsuario.src = dadosPerfil.foto;
  previewFoto.src = dadosPerfil.foto;
}

function salvarPerfil() {
  try {
    localStorage.setItem(
      'vestiePerfil',
      JSON.stringify(dadosPerfil)
    );
    return true;
  } catch (erro) {
    alert('Não foi possível salvar o perfil neste navegador.');
    return false;
  }
}

// ==================================
// EDITAR NOME E BIOGRAFIA
// ==================================

document.getElementById('form-editar')
  .addEventListener('submit', evento => {
    evento.preventDefault();

    const nome = editarNome.value.trim();
    const bio = editarBio.value.trim();

    if (!nome) {
      alert('Digite um nome de usuário.');
      return;
    }

    dadosPerfil.nome = nome;
    dadosPerfil.bio = bio;

    if (salvarPerfil()) {
      atualizarPerfil();
      mostrarPagina('pagina-perfil');
    }
  });

// ==================================
// ALTERAR FOTO
// ==================================

document.getElementById('nova-foto')
  .addEventListener('change', evento => {

    const arquivo = evento.target.files[0];

    if (!arquivo) return;

    if (!arquivo.type.startsWith('image/')) {
      alert('Selecione uma imagem válida.');
      return;
    }

    if (arquivo.size > 2 * 1024 * 1024) {
      alert('Escolha uma imagem de até 2 MB.');
      return;
    }

    const leitor = new FileReader();

    leitor.onload = () => {
      const fotoAnterior = dadosPerfil.foto;

      dadosPerfil.foto = leitor.result;

      if (salvarPerfil()) {
        atualizarPerfil();
      } else {
        dadosPerfil.foto = fotoAnterior;
      }
    };

    leitor.readAsDataURL(arquivo);
  });

// ==================================
// LOOKS SALVOS
// ==================================

const looksDisponiveis = {
  casual: {
    nome: 'Look casual',
    imagem: 'imagens/look-casual.jpg'
  },
  urbano: {
    nome: 'Look urbano',
    imagem: 'imagens/look-urbano.jpg'
  },
  elegante: {
    nome: 'Look elegante',
    imagem: 'imagens/look-elegante.jpg'
  },
  trabalho: {
    nome: 'Look para trabalho',
    imagem: 'imagens/look-trabalho.jpg'
  }
};

function obterLooksSalvos() {
  try {
    const salvos = JSON.parse(
      localStorage.getItem('vestieLooksSalvos') || '[]'
    );

    return Array.isArray(salvos) ? salvos : [];
  } catch {
    return [];
  }
}

function carregarLooksSalvos() {
  const salvos = obterLooksSalvos();

  const grade = document.getElementById('grade-salvos');
  const vazio = document.getElementById('salvos-vazio');

  // Mostra a quantidade real de looks salvos
  document.getElementById('numero-looks').textContent =
    salvos.length;

  grade.innerHTML = '';

  const looksValidos = salvos.filter(id => looksDisponiveis[id]);

  vazio.style.display =
    looksValidos.length === 0 ? 'block' : 'none';

  looksValidos.forEach(id => {
    const look = looksDisponiveis[id];

    const card = document.createElement('article');
    card.className = 'look-salvo';

    const imagem = document.createElement('img');
    imagem.src = look.imagem;
    imagem.alt = look.nome;

    const info = document.createElement('div');
    info.className = 'look-salvo-info';

    const titulo = document.createElement('h3');
    titulo.textContent = look.nome;

    const remover = document.createElement('button');
    remover.textContent = '♡ Remover dos salvos';

    remover.addEventListener('click', () => {
      const atualizados = obterLooksSalvos()
        .filter(item => item !== id);

      localStorage.setItem(
        'vestieLooksSalvos',
        JSON.stringify(atualizados)
      );

      carregarLooksSalvos();
    });

    info.append(titulo, remover);
    card.append(imagem, info);
    grade.appendChild(card);
  });
}

// ==================================
// MEU ESTILO
// ==================================

const estilos = {
  Casual: {
    imagem: 'imagens/look-casual.png',
    descricao:
      'Você prefere conforto, leveza e peças versáteis ' +
      'para aproveitar todos os momentos.'
  },
  Urbano: {
    imagem: 'imagens/look_urbano.png',
    descricao:
      'Você gosta de produções modernas, práticas ' +
      'e com personalidade.'
  },
  Elegante: {
    imagem: 'imagens/look-elegante.png',
    descricao:
      'Você valoriza sofisticação, harmonia e ' +
      'peças que se destacam pela elegância.'
  },
  'Clássico': {
    imagem: 'imagens/look-trabalho.png',
    descricao:
      'Você prefere peças atemporais, combinações ' +
      'refinadas e um visual equilibrado.'
  }
};

function carregarMeuEstilo() {
  let estiloSalvo = null;

  try {
    estiloSalvo = localStorage.getItem('vestieMeuEstilo');
  } catch (erro) {
    console.warn('Não foi possível acessar o resultado do quiz.', erro);
  }

  const estilo = estilos[estiloSalvo];

  const nome = document.getElementById('nome-estilo');
  const imagem = document.getElementById('imagem-estilo');
  const descricao = document.getElementById('descricao-estilo');

  // Elementos do cartão de estilo exibido no perfil principal.
  const textoCartao = document.querySelector('.estilo-info p');
  const imagemCartao = document.querySelector('.estilo-imagem img');

  if (estilo) {
    if (nome) nome.textContent = estiloSalvo;

    if (imagem) {
      imagem.src = estilo.imagem;
      imagem.alt = `Look do estilo ${estiloSalvo}`;
    }

    if (descricao) descricao.textContent = estilo.descricao;

    if (textoCartao) {
      textoCartao.textContent = `Seu estilo: ${estiloSalvo}`;
    }

    if (imagemCartao) {
      imagemCartao.src = estilo.imagem;
      imagemCartao.alt = `Look do estilo ${estiloSalvo}`;
    }
  } else {
    if (nome) nome.textContent = 'Descubra seu estilo';

    if (descricao) {
      descricao.textContent =
        'Faça o quiz e descubra as combinações ' +
        'que mais combinam com você.';
    }

    if (textoCartao) textoCartao.textContent = 'Seu estilo: Não definido';
  }
}

// Atualiza o estilo ao voltar para a página (ex.: botão voltar do navegador)
window.addEventListener('pageshow', carregarMeuEstilo);

// ==================================
// PREFERÊNCIAS
// ==================================

let preferencias = {
  estilos: [],
  cores: []
};

try {
  const armazenadas = JSON.parse(
    localStorage.getItem('vestiePreferencias') || 'null'
  );

  if (armazenadas) preferencias = armazenadas;
} catch {
  console.warn('Preferências não disponíveis.');
}

document.querySelectorAll('.chip').forEach(botao => {
  const estilo = botao.dataset.estilo;

  if (preferencias.estilos.includes(estilo)) {
    botao.classList.add('selecionado');
  }

  botao.addEventListener('click', () => {
    botao.classList.toggle('selecionado');
  });
});

document.querySelectorAll('.cor-preferencia').forEach(botao => {
  const cor = botao.dataset.cor;

  if (preferencias.cores.includes(cor)) {
    botao.classList.add('selecionada');
  }

  botao.addEventListener('click', () => {
    botao.classList.toggle('selecionada');
  });
});

document.getElementById('salvar-preferencias')
  .addEventListener('click', () => {

    preferencias.estilos = [
      ...document.querySelectorAll('.chip.selecionado')
    ].map(item => item.dataset.estilo);

    preferencias.cores = [
      ...document.querySelectorAll(
        '.cor-preferencia.selecionada'
      )
    ].map(item => item.dataset.cor);

    try {
      localStorage.setItem(
        'vestiePreferencias',
        JSON.stringify(preferencias)
      );

      alert('Preferências salvas com sucesso!');
      mostrarPagina('pagina-perfil');
    } catch {
      alert('Não foi possível salvar as preferências.');
    }
  });

// ==================================
// INICIALIZAÇÃO
// ==================================

atualizarPerfil();
carregarLooksSalvos();
carregarMeuEstilo();
mostrarPagina('pagina-perfil');

// ==================================
// HISTÓRICO DE LOOKS GERADOS LOCALMENTE
// ==================================
function carregarHistorico() {
  const grade=document.getElementById('grade-historico');
  if(!grade)return;
  grade.replaceChildren();
  const lista=Vestie.historico();
  for(const look of lista){
    const card=document.createElement('article');card.className='look-salvo';
    const img=document.createElement('img');img.alt=look.titulo||'Look criado';img.src=Object.values(look.pecas||{})[0]?.imagem||'assets/sem-imagem.svg';
    const info=document.createElement('div');info.className='look-salvo-info';
    const titulo=document.createElement('h3');titulo.textContent=look.titulo||'Look personalizado';
    const data=document.createElement('p');data.textContent=(look.estilo||'Look')+' • '+new Date(look.criadoEm).toLocaleDateString('pt-BR')+(look.origem==='ia'?' • IA':' • Prévia');
    const acoes=document.createElement('div');acoes.className='mini-acoes';
    const reabrir=document.createElement('a');reabrir.href='montar.html?reabrir='+encodeURIComponent(look.id);reabrir.textContent='Reabrir';
    const favorito=document.createElement('button');favorito.type='button';favorito.textContent=look.favorito?'♥ Favorito':'♡ Favoritar';favorito.addEventListener('click',()=>{const atual=Vestie.historico();const item=atual.find(x=>x.id===look.id);if(item){item.favorito=!item.favorito;Vestie.salvar('vestieLooksCriados',atual);carregarHistorico();}});
    const excluir=document.createElement('button');excluir.type='button';excluir.textContent='Excluir';excluir.addEventListener('click',()=>{if(confirm('Excluir este look do histórico?')){Vestie.salvar('vestieLooksCriados',Vestie.historico().filter(x=>x.id!==look.id));carregarHistorico();carregarLooksSalvos();}});
    acoes.append(reabrir,favorito,excluir);info.append(titulo,data,acoes);card.append(img,info);grade.append(card);
  }
  if(!lista.length){const p=document.createElement('p');p.textContent='Você ainda não criou looks. Comece na aba Montar.';p.className='descricao-secao';grade.append(p);}
  const numero=document.getElementById('numero-looks');numero.textContent=lista.length+obterLooksSalvos().length;
  document.getElementById('salvos-vazio').style.display=lista.length||obterLooksSalvos().length?'none':'block';
}
const carregarLooksSalvosOriginal=carregarLooksSalvos;
carregarLooksSalvos=function(){carregarLooksSalvosOriginal();carregarHistorico();};
carregarHistorico();
// câmera frontal e fallback pela galeria
const cameraPerfil=document.getElementById('nova-foto-camera');
document.getElementById('foto-camera')?.addEventListener('click',()=>cameraPerfil.click());
cameraPerfil?.addEventListener('change',async e=>{const file=e.target.files?.[0];if(!file)return;try{const foto=await Vestie.imagemArquivo(file);const anterior=dadosPerfil.foto;dadosPerfil.foto=foto;if(salvarPerfil())atualizarPerfil();else dadosPerfil.foto=anterior;}catch(err){alert(err.message);}});
// fotos pela galeria também são otimizadas para evitar exceder o espaço local
const galeriaPerfil=document.getElementById('nova-foto');
// listener original permanece como fallback.
if(new URLSearchParams(location.search).get('salvos')==='1')mostrarPagina('pagina-salvos');