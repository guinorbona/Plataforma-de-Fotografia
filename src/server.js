require('dotenv').config();
const fs = require('fs');
const https = require('https');
const http = require('http');
const path = require('path');
const app = require('./app'); 

// Lê variáveis do .env
const PORT = process.env.PORT || 3000;
const ENABLE_HTTPS = process.env.ENABLE_HTTPS === 'true';

// Função para iniciar HTTPS
function startHttpsServer() {
  try {
    const keyPath = path.resolve(process.env.SSL_KEY_PATH);
    const certPath = path.resolve(process.env.SSL_CERT_PATH);

    // Carregar certificados
    const options = {
      key: fs.readFileSync(keyPath),
      cert: fs.readFileSync(certPath)
    };

    https.createServer(options, app).listen(443, () => {
      console.log('Servidor HTTPS rodando na porta 443');
    });

    // Subir HTTP para redirecionar para HTTPS
    http.createServer((req, res) => {
      res.writeHead(301, { Location: 'https://' + req.headers.host + req.url });
      res.end();
    }).listen(PORT, () => {
      console.log(`Redirecionamento HTTP ativo na porta ${PORT}`);
    });

  } catch (err) {
    console.error('Erro ao iniciar HTTPS:', err.message);
    console.error('Verifique se os caminhos SSL_KEY_PATH e SSL_CERT_PATH estão corretos');
    process.exit(1);
  }
}

// Função para iniciar HTTP normal
function startHttpServer() {
  app.listen(PORT, () => {
    console.log(`Servidor HTTP rodando em http://localhost:${PORT}`);
  });
}

// Seleciona o modo automático
if (ENABLE_HTTPS) {
  console.log('HTTPS ativado via .env');
  startHttpsServer();
} else {
  console.log('HTTPS desativado — iniciando HTTP padrão');
  startHttpServer();
}
