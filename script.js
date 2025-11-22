// selecionar elemntos

const tipoServico = document.getElementById('tipoServico');
const interField = document.getElementById('interField');
const tradField = document.getElementById('tradField');
const form = document.getElementById('orcamentoForm');
const resultBox = document.getElementById('resultBox');

// Mostrar/ocultar blocos conforme tipo selecionado

tipoServico.addEventListener('change', (e) => {
      const val = e.target.value;
      if(val === 'interpretacao'){
        interField.style.display = '';
        tradField.style.display = 'none';
      } else {
        interField.style.display = 'none';
        tradField.style.display = '';
      }
    resultBox.innerHTML = '<div class="result-item">Preencha o formulário e clique <strong>Calcular</strong>.</div>';
    })

 // Função utilitária de formatação monetária (BRL)
function formatBRL(num){
  return num.toLocaleString('pt-BR', { style:'currency', currency:'BRL' });
    }

// Calcular interpretação
function calcularInterpretacao(){
  const tipoEvento = document.getElementById('tipoEvento').value;
  const tempoMin = parseFloat(document.getElementById('tempoEvento').value) || 0;
  const gravado = document.getElementById('gravado').value === 'sim';
  // valor hora base
  let valorHora = 144.00;
  if(tipoEvento === 'artistico'){
        valorHora = 192.00;
  }

// quantidade de interpretes (regra: <=60 ->1, >60 ->2)
  const qtdInterpretes = (tempoMin <= 60) ? 1 : 2;
  const tempoHoras = tempoMin / 60;
  const valorTotalHoras = valorHora * tempoHoras * qtdInterpretes;
  const percentualImagem = gravado ? 0.10 : 0;
  const valorDireitoImagem = valorTotalHoras * percentualImagem;
  const totalPagar = valorTotalHoras + valorDireitoImagem;
  const imposto = totalPagar * 0.155;

return {
    modalidade:'Interpretação',
    valorHora,
    qtdInterpretes,
    tempoMin,
    tempoHoras,
    valorTotalHoras,
    percentualImagem,
    valorDireitoImagem,
    totalPagar,
    imposto
  };
}


// Calcular tradução
  function calcularTraducao(){
    const tipoMaterial = document.getElementById('tipoMaterial').value;
    const tempoMin = parseFloat(document.getElementById('tempoVideo').value) || 0;
    const legendagem = document.getElementById('legendagem').value === 'sim';
    // determinar valor por minuto
    let valorMinuto = 60.00; // default filmes/doc/documentario/videoBook
    if(tipoMaterial === 'propaganda'){
      valorMinuto = 250.00;
    } else {
    // se legendar => 96 por minuto (especificação)
    if(legendagem) valorMinuto = 96.00;
      else valorMinuto = 60.00;
    }
    const valorBase = valorMinuto * tempoMin;
    const percentualImagem = 0.30; // 30% para tradução
    const valorDireitoImagem = valorBase * percentualImagem;
    const totalPagar = valorBase + valorDireitoImagem;
    const imposto = totalPagar * 0.155;

    return {
      modalidade:'Tradução',
      tipoMaterial,
      legendagem,
      valorMinuto,
      tempoMin,
      valorBase,
      percentualImagem,
      valorDireitoImagem,
      totalPagar,
      imposto
      };
    }

// Montar o HTML de resultados
    function renderResultado(obj){
      resultBox.innerHTML = ''; // limpar
      if(obj.modalidade === 'Interpretação'){
        const template = `
          <div class="result-item"><strong>Modalidade:</strong> ${obj.modalidade}</div>
          <div class="result-item"><strong>Valor da hora por intérprete:</strong> <span class="money">${formatBRL(obj.valorHora)}</span></div>
          <div class="result-item"><strong>Quantidade de intérpretes:</strong> ${obj.qtdInterpretes}</div>
          <div class="result-item"><strong>Tempo total do evento:</strong> ${obj.tempoMin} minutos (${obj.tempoHoras.toFixed(2)} horas)</div>
          <div class="result-item"><strong>Valor total das horas:</strong> <span class="money">${formatBRL(obj.valorTotalHoras)}</span></div>
          <div class="result-item"><strong>Percentual de direito de imagem:</strong> ${(obj.percentualImagem*100).toFixed(1)}%</div>
          <div class="result-item"><strong>Valor do direito de imagem:</strong> <span class="money">${formatBRL(obj.valorDireitoImagem)}</span></div>
          <div class="result-item"><strong>Valor total a ser pago:</strong> <span class="money">${formatBRL(obj.totalPagar)}</span></div>
          <div class="result-item"><strong>Imposto (15,5%):</strong> <span class="money">${formatBRL(obj.imposto)}</span></div>
        `;
        resultBox.innerHTML = template;
      } else {
        // tradução
        const leg = obj.legendagem ? 'Sim' : 'Não';
        const tipoMap = {
          videobook: 'VideoBook',
          programa_tv: 'Programa de TV',
          propaganda: 'Propaganda de Marcas',
          filme: 'Filme',
          documentario: 'Documentário'
        };
        const template = `
          <div class="result-item"><strong>Modalidade:</strong> ${obj.modalidade} (${tipoMap[obj.tipoMaterial] || obj.tipoMaterial})</div>
          <div class="result-item"><strong>Valor por minuto:</strong> <span class="money">${formatBRL(obj.valorMinuto)}</span></div>
          <div class="result-item"><strong>Tempo total:</strong> ${obj.tempoMin} minutos</div>
          <div class="result-item"><strong>Valor total (sem direito de imagem):</strong> <span class="money">${formatBRL(obj.valorBase)}</span></div>
          <div class="result-item"><strong>Percentual de direito de imagem:</strong> ${(obj.percentualImagem*100).toFixed(1)}%</div>
          <div class="result-item"><strong>Valor do direito de imagem:</strong> <span class="money">${formatBRL(obj.valorDireitoImagem)}</span></div>
          <div class="result-item"><strong>Valor total a ser pago:</strong> <span class="money">${formatBRL(obj.totalPagar)}</span></div>
          <div class="result-item"><strong>Imposto (15,5%):</strong> <span class="money">${formatBRL(obj.imposto)}</span></div>
        `;
        resultBox.innerHTML = template;
      }
    }

// Submissão do formulário
    form.addEventListener('submit', (ev) => {
      ev.preventDefault();
      // escolhe serviço
      if(tipoServico.value === 'interpretacao'){
        // validações básicas
        const tempo = parseFloat(document.getElementById('tempoEvento').value);
        if(!tempo || tempo <= 0){
          alert('Informe um tempo válido para o evento (minutos).');
          return;
        }
        const resultado = calcularInterpretacao();
        renderResultado(resultado);
      } else {
        const tempo = parseFloat(document.getElementById('tempoVideo').value);
        if(!tempo || tempo <= 0){
          alert('Informe um tempo válido para o material (minutos).');
          return;
        }
        const resultado = calcularTraducao();
        renderResultado(resultado);
      }
    });

// Inicializa visual com interpretação visível
    tipoServico.dispatchEvent(new Event('change'));