//BIBLIOTECAS
const express = require('express');
const path = require('path');

//Importando as pastas das rotas
const cepRoutes = require('./routes/cep');
const enderecosRoutes = require('./routes/endereco');

//configurando express
const app = express();
const PORT = process.env.PORT || 3000;

//arquivos estaticos (index.html e script.js)
//Usando para ativar a pasta public
app.use(express.static(path.join(__dirname,'public')));

//ROTAS API
app.use('/api/cep', cepRoutes);
app.use('/api/enderecos', enderecosRoutes);

//ROTAS NÃO ENCONTRADA
app.use('./api', (req, res) => {
    res.status(404).json({ erro: 'Rota não encontrada' });
});


//Escutando o servidor, no caso a porta
app.listen(PORT, () => {
    console.log(`servidor rodando em: http://localhost:${PORT}`)
});