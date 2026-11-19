//conectar com a API

//Definindo Express
const express = require('express');
const router = express.Router();

//Puxando serviços
const { normalizarCep, buscarCep } = require('../services/viacep');

//GET /api/cep/:cep -> 

router.get('/:cep', async (req, res) => {
    const cep = normalizarCep(req.params.cep);
    if (!cep) {
        return res.status(400).json({ erro: 'CEP inválido informe 8 digitos '});
    }

    try {
        const endereco = await buscarCep(cep);
        if (!endereco)
        return res.status(400).json({ erro: 'CEP não encontrado' });
        return res.json(endereco);
    } catch (err) {
        console.error('Erro ao consultar CEP', err.message);
        return res.status(502).json({ erro: 'Erro ao consultar o serviço do CEP '});
    }
});

module.exports = router;