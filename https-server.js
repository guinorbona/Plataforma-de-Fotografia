const https = require('https');
const express = require('express');
const fs = require('fs');
const app = express();

const options = {
  key: fs.readFileSync('./certificados/privkey.pem'),
  cert: fs.readFileSync('./certificados/cert.pem')
};

app.get('/', (req, res) => {
  res.send('Conexão segura ativa.');
});

https.createServer(options, app).listen(3001, () => {
  console.log('Servidor HTTPS ativo na porta 3001');
});
