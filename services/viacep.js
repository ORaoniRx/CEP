//Interação com API

function normalizarCep(cep) {
    const limpo = String(cep || '').replace(/\D/g, '');
    return /^\d{8}$/.test(limpo) ? limpo : null;
};

//consulta o viaCEP https://viacep.com.br/ ou null
//lançar erro se o serviço falhar.

async function buscarCep(cep) {
    const resposta = await fetch(`https://viacep.com.br/ws/${cep}/json`);
    if (!resposta.ok) throw new Error('Falha ao consultar o serviço do CEP');

    const dados = await resposta.json();
    if (dados.erro) return null;

    return {
        cep: dados.cep,
        logradouro: dados.logradouro,
        complemento: dados.complemento,
        bairro: dados.bairro,
        cidade: dados.cidade,
        estado: dados.estado,
        ibge: dados.ibge,
        gia: dados,
        ddd: dados
    };
}

module.exports = { normalizarCep, buscarCep };