document.addEventListener('DOMContentLoaded', function () {

  var SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxe5FFkJc9xmF6ejYU1uW-OLF8f52KIkE2ITZprnDRGPe6Hf7XRL6-wsI9d_bq57RHssA/exec';

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
    definirStatus(statusEl, 'Enviando...', null);

    var dados = { sheet: form.dataset.sheet, campos: {}, arquivos: {} };

    new FormData(form).forEach(function (valor, chave) {
      if (!(valor instanceof File)) {
        dados.campos[chave] = valor;
      }
    });

    // Checkbox desmarcado não entra no FormData; garante o valor explícito
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
        if (pendentes === 0) enviar(dados, statusEl, botao, form);
      };
      leitor.onerror = function () {
        pendentes--;
        if (pendentes === 0) enviar(dados, statusEl, botao, form);
      };
      leitor.readAsDataURL(arquivo);
    });
  }

  function enviar(dados, statusEl, botao, form) {
    fetch(SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(dados)
    })
      .then(function (resposta) { return resposta.json(); })
      .then(function (resultado) {
        botao.disabled = false;
        if (resultado && resultado.ok) {
          definirStatus(statusEl, 'Enviado com sucesso!', 'sucesso');
          form.reset();
        } else {
          definirStatus(statusEl, 'Não foi possível enviar. Tente novamente.', 'erro');
        }
      })
      .catch(function () {
        botao.disabled = false;
        definirStatus(statusEl, 'Erro de conexão. Tente novamente.', 'erro');
      });
  }

  function definirStatus(elemento, texto, tipo) {
    if (!elemento) return;
    elemento.textContent = texto;
    elemento.className = 'form-status' + (tipo ? ' ' + tipo : '');
  }
});
