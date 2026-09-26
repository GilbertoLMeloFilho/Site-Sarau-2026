
document.addEventListener('DOMContentLoaded', function () {

  var SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxe5FFkJc9xmF6ejYU1uW-OLF8f52KIkE2ITZprnDRGPe6Hf7XRL6-wsI9d_bq57RHssA/exec';

  // Elementos do popup
  var popup = document.getElementById('popup');
  var mensagem = document.getElementById('mensagem');
  var loading = document.getElementById('loading');
  var fecharPopup = document.getElementById('fecharPopup');

  // Fecha o popup pelo botão X
  if (fecharPopup) {
    fecharPopup.addEventListener('click', function () {
      popup.style.display = 'none';
    });
  }

  // Função para exibir o popup
  function mostrarPopup(texto, carregando) {
    if (!popup || !mensagem || !loading) return;

    popup.style.display = 'flex';
    mensagem.textContent = texto;
    loading.style.display = carregando ? 'block' : 'none';
  }

  // Formulários
  var formularios = document.querySelectorAll('form[data-sheet]');

  formularios.forEach(function (form) {
    form.addEventListener('submit', function (evento) {
      evento.preventDefault();
      processarEnvio(form);
    });
  });

  function processarEnvio(form) {
    var statusEl = form.querySelector('.form-status');
    var botao = form.querySelector('button[type="submit"]');
    var camposArquivo = form.querySelectorAll('input[type="file"]');

    botao.disabled = true;

    // Exibe o popup de carregamento
    mostrarPopup('Enviando...', true);
    definirStatus(statusEl, 'Enviando...', null);

    var dados = {
      sheet: form.dataset.sheet,
      campos: {},
      arquivos: {}
    };

    new FormData(form).forEach(function (valor, chave) {
      if (!(valor instanceof File)) {
        dados.campos[chave] = valor;
      }
    });

    // Checkbox desmarcado recebe valor explícito
    form.querySelectorAll('input[type="checkbox"]').forEach(function (cb) {
      dados.campos[cb.name] = cb.checked;
    });

    var pendentes = 0;

    camposArquivo.forEach(function (input) {
      if (input.files && input.files[0]) pendentes++;
    });

    if (pendentes === 0) {
      enviar(dados, statusEl, botao, form);
      return;
    }

    camposArquivo.forEach(function (input) {
      var arquivo = input.files[0];
      if (!arquivo) return;

      var leitor = new FileReader();

      leitor.onload = function () {
        dados.arquivos[input.name] = {
          nome: arquivo.name,
          tipo: arquivo.type,
          base64: leitor.result.split(',')[1]
        };

        pendentes--;

        if (pendentes === 0) {
          enviar(dados, statusEl, botao, form);
        }
      };

      leitor.onerror = function () {
        pendentes--;

        if (pendentes === 0) {
          enviar(dados, statusEl, botao, form);
        }
      };

      leitor.readAsDataURL(arquivo);
    });
  }

  function enviar(dados, statusEl, botao, form) {
    fetch(SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify(dados)
    })
      .then(function (resposta) {
        return resposta.json();
      })
      .then(function (resultado) {
        botao.disabled = false;

        if (resultado && resultado.ok) {
          mostrarPopup('Enviado com sucesso!', false);
          definirStatus(statusEl, 'Enviado com sucesso!', 'sucesso');
          form.reset();

        } else {
          mostrarPopup('Não foi possível enviar. Tente novamente.', false);
          definirStatus(statusEl, 'Não foi possível enviar. Tente novamente.', 'erro');
        }
      })
      .catch(function () {
        botao.disabled = false;

        mostrarPopup('Erro de conexão. Tente novamente.', false);
        definirStatus(statusEl, 'Erro de conexão. Tente novamente.', 'erro');
      });
  }

  function definirStatus(elemento, texto, tipo) {
    if (!elemento) return;

    elemento.textContent = texto;
    elemento.className = 'form-status' + (tipo ? ' ' + tipo : '');
  }

  // Campo condicional de participantes
var quant = document.getElementById('num-participantes');
var nome_part = document.getElementById('caixa_nome_part');

if (quant && nome_part) {
    quant.addEventListener('input', function () {
        if (Number(quant.value) >= 2) {
            nome_part.style.display = 'block';
        } else {
            nome_part.style.display = 'none';
        }
    });
}

    const quadrado = document.querySelector('#quadrado-flutuante');

    function moverAleatorio() {
      // Largura e altura máxima garantindo que o quadrado não passe da tela
      const larguraMax = window.innerWidth - 70;
      const alturaMax = window.innerHeight - 70;

      // Sorteia coordenadas aleatórias
      const novaX = Math.floor(Math.random() * larguraMax);
      const novaY = Math.floor(Math.random() * alturaMax);

      // Aplica a nova posição via CSS Transform
      quadrado.style.transform = `translate(${novaX}px, ${novaY}px)`;
    }

    // Move imediatamente ao carregar
    moverAleatorio();

    // Re-calcula e move a cada 3.5 segundos (mesmo tempo da transition)
    setInterval(moverAleatorio, 30000);

    // Ajusta os limites caso a janela seja redimensionada
    window.addEventListener('resize', moverAleatorio);

    const inputArquivo = document.getElementById("anexar-arquivo");
    const nomeArquivo = document.getElementById("nome-arquivo");

    inputArquivo.addEventListener("change", function () {
    if (this.files.length > 0) {
        nomeArquivo.textContent = this.files[0].name;
    } else {
        nomeArquivo.textContent = "Click to upload image";
    }

    document.addEventListener("DOMContentLoaded", function () {

    const params = new URLSearchParams(window.location.search);
    const musicaURL = params.get("musica");

    const campoMusica = document.getElementById("musica");

    console.log("URL:", window.location.href);
    console.log("Parâmetro musica:", musicaURL);

    if (musicaURL && campoMusica) {
        campoMusica.value = musicaURL;
    }

});
})})