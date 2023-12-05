/* Autor: Fábio Assunção Vitorino
   Data: 20/10/2023 */

   function verificarFinanciamento() {
    // Obtenção dos valores dos elementos do formulário
    var financiamento = parseFloat(document.getElementById('financiamento').value);
    var parcelas = parseInt(document.getElementById('parcelas').value);
    var pessoa = document.querySelector('input[name="pessoa"]:checked');
    var empreenda = document.querySelector('input[name="empreenda"]:checked');
    var atividadeUmAno = document.querySelector('input[name="atividadeUmAno"]:checked');
    var primeiroCredito = document.querySelector('input[name="primeiroCredito"]:checked');

    // Validação dos valores de entrada
    if (financiamento < 200 || financiamento > 21000) {
        alert('O valor do financiamento deve estar entre 200 e 21.000 reais.');
        return;
    }

    else if (parcelas < 6 || parcelas > 36) {
        alert('O número de parcelas deve estar entre 6 e 36.');
        return;
    }

    // Verificação das seleções de rádio
    if (!financiamento || isNaN(financiamento)) {
        alert('Por favor, preencha o campo Valor Financiado com um número válido.');
        return;
    }
    if (!parcelas || isNaN(parcelas)) {
        alert('Por favor, preencha o campo Número de Parcelas com um número válido.');
        return;
    }
    if (!pessoa) {
        alert('Por favor, selecione Pessoa Física ou Jurídica.');
        return;
    } else {
        pessoa = pessoa.value;
    }

    if (!empreenda) {
        alert('Por favor, selecione Linha 1 ou Linha 2.');
        return;
    } else {
        empreenda = empreenda.value;
    }

    if (!atividadeUmAno) {
        alert('Por favor, informe se a atividade é exercida há mais de um ano.');
        return;
    } else {
        atividadeUmAno = atividadeUmAno.value;
    }

    if (!primeiroCredito) {
        alert('Por favor, informe se é seu primeiro crédito.');
        return;
    } else {
        primeiroCredito = primeiroCredito.value;
    }

    // Cálculo dos valores com base nas seleções
    if (pessoa === 'fisica' && primeiroCredito === 'sim') {
        financiamento = Math.min(financiamento, 8000);
        if (empreenda === 'Linha 1') {
            parcelas = Math.min(parcelas, 24);
        } else if (empreenda === 'Linha 2') {
            parcelas = Math.min(parcelas, 30);
        }
    } else if (pessoa === 'fisica' && primeiroCredito === 'nao') {
        financiamento = Math.min(financiamento, 15000);
        if (empreenda === 'Linha 1') {
            parcelas = Math.min(parcelas, 24);
        } else if (empreenda === 'Linha 2') {
            parcelas = Math.min(parcelas, 30);
        }
    } else if (pessoa === 'juridica' && atividadeUmAno === 'nao') {
        financiamento = Math.min(financiamento, 12000);
        if (empreenda === 'Linha 1') {
            parcelas = Math.min(parcelas, 30);
        } else if (empreenda === 'Linha 2') {
            parcelas = Math.min(parcelas, 36);
        }
    } else if (pessoa === 'juridica' && atividadeUmAno === 'sim') {
        if (empreenda === 'Linha 1') {
            parcelas = Math.min(parcelas, 30);
        } else if (empreenda === 'Linha 2') {
            parcelas = Math.min(parcelas, 36);
        }
    }

    
    // Cálculo de financiamento
    var dadosFinanciamento = calcularFinanciamento(financiamento, parcelas, pessoa, empreenda);
    
    // Exibição dos resultados
    exibirFinanciamento(dadosFinanciamento, parcelas);
}

function calcularFinanciamento(financiamento, parcelas, pessoa, empreenda) {
    var juros;
    var taxa;
    var valorTotal;
    var valorParcela;
    var carencia;

    // Cálculos com base nas seleções
    if (empreenda === 'Linha 1') {
        parcelas -= 1;
    } else if (empreenda === 'Linha 2') {
        parcelas -= 2;
    }
    
    if (pessoa === 'fisica') {
        juros = 0.008; // 0.8% ao mês (9.6% a.a.)
        taxa = 0;
        valorTotal = financiamento * Math.pow(1 + juros, parcelas);
    } else if (pessoa === 'juridica') {
        juros = 0.0035; // 0.35% ao mês (4.2% a.a.)
        taxa = 0.00001 * financiamento * parcelas; // 0.001% do valor do crédito * parcelas
        valorTotal = (financiamento + taxa) * Math.pow(1 + juros, parcelas);
    }
    
    valorParcela = valorTotal / parcelas;
    
    // Carência automática
    if (empreenda === 'Linha 1') {
        carencia = 30;
    } else if (empreenda === 'Linha 2') {
        carencia = 60;
    }

    return {
        carencia: carencia.toFixed(0),
        valorTotal: valorTotal.toFixed(2),
        valorParcela: valorParcela.toFixed(2),
        juros: (juros * 100).toFixed(2),
        parcelas: parcelas.toFixed(0),
        financiamento: financiamento.toFixed(2),
        fda: taxa.toFixed(2)
    };
}

function exibirFinanciamento(dados) {
    // Exibição dos resultados no documento
    document.getElementById('carencia').textContent = '*carência automática de ' + dados.carencia + ' dias*';
    document.getElementById('valorFinanciado').textContent = 'Valor financiado: R$ ' + dados.financiamento;
    document.getElementById('valorTotal').textContent = 'Valor total pago do financiamento: R$ ' + dados.valorTotal;
    document.getElementById('valorParcela').textContent = `Parcelas: ${dados.parcelas} x R$ ${dados.valorParcela}`;
    document.getElementById('juros').textContent = 'Juros ao mês: ' + dados.juros + '%';
}

// Evento que dispara o cálculo ao carregar o documento
document.addEventListener('DOMContentLoaded', function() {
   var btCalcular = document.getElementById("btCalcular");
   btCalcular.addEventListener("click", verificarFinanciamento);
});
