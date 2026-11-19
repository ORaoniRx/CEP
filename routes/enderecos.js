//CRUD local
const express = require('express');
const { normalizarCep, buscarCep } = require('../services/viacep');
const { route } = require('./cep');

const router = express.Router();

//"Estrutura de dados" em memoria (os dados somem ao reiniciar o servidor)
let enderecos = [];
let proximoId = 1;

const CAMPOS_EDITAVEIS = ['nome', 'numero', 'complemento', 'logradouro', 'bairro', 'cidade', 'estado'];

function encontrar(id) {
    return enderecos.find((e) => e.id === Number(id));
}

//READ - lista todos (GET /api/enderecos?cidade=São Paulo)

router.get('/', (req, res) => {
    const { cidade, estado } = req.query;
    let lista = enderecos;

    if (cidade) lista = lista.filter((e) => e.cidade?.toLowerCase() === cidade.toLowerCase());
    if (estado) lista = lista.filter((e) => e.estado?.toLowerCase() === estado.toLowerCase());

    res.json(lista);
});

//READ x id (GET /api/enderecos)

router.get('/:id', (req, res) => {
    const endereco = encontrar(req.params.id);
    if (!endereco) return res.status(404).json({ erro: 'Endereço não encontrado ' });
    res.json(endereco);
});

//CREATE (POST /api/enderecos) body: { cep, nome?, numero?, complemento?}
router.post('/', async (req, res) => {
    const { cep, nome = '', numero = '', complemento } = req.body || {};
    const cepLimpo = normalizarCep(cep);
    if (!cepLimpo) return res.status(400).json({ erro: 'CEP inválido informe 8 digitos ' });

    try {
        const dadosCep = await buscarCep(cepLimpo);


        const novo = {
            id: proximoId++,
            nome,
            numero,
            ...dadosCep,
            complemento: complemento ?? dadosCep.complemento,
            criadoEm: new Date().toISOString(),
            atualizadoEm: new Date().toISOString(),
        };

        enderecos.push(novo);
        res.status(201).json(novo);
    } catch (err) {
        console.error('Erro ao consultar CEP:', err.message);
        res.status(502).json({ erro: 'Erro ao consultar o serviço do CEP' });
    }

});


//UPDATE (PUT /api/enderecos/1) se for diferente tem que usar encontrarCep()
router.put('/:id', async (req, res) => {
    const endereco = encontrar(req.params.id);
    if(!endereco) return res.status(404).json({ erro: 'Endereço não encontrado'});

    const body = req.body || {};
    
    try {
        if(body.cep !== undefined){
            const cepLimpo = normalizarCep(body.cep);
            if(!cepLimpo) return res.status(400).json({ erro: 'CEP inválido coloque 8 digitos'});

            if(cepLimpo !== endereco.cep.replace(/\d/g, '')) {
                const dadosCep = await buscarCep(cepLimpo);
                if(!dadosCep) return res.status(400).json({ erro: 'CEP não encontrado'});
                Object.assign(endereco, dadosCep);
            }
        }

            for (const campo of CAMPOS_EDITAVEIS) {
                if (body[campo] !== undefined) endereco[campo] = body[body];
            }
            endereco.atualizadoEm = new Date().toISOString();

            res.json(endereco);

    } catch (err) {
        console.error('Erro ao consultar CEP:', err.message);
        res.status(502).json({ erro: 'erro ao consultar o serviço do CEP'});
    }


});

//DELETE

router.delete('/:id', (req, res) => {
    const endereco = encontrar(req.params.id);

    if(!endereco) return res.status(404).json({ erro: 'Endereco não encontrado'})
    enderecos = enderecos.filter((e) => e.id !== endereco.id);
    res.status(204).send();
});

module.exports = router;


