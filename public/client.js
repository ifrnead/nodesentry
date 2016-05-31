'use strict';
const http = require('http');

http.get("http://node-sentry.appspot.com/public/test.xml", (res) => {
  console.log("Cliente conectou no servidor.");
  console.log(res.headers);
  console.log(res.statusCode);
  console.log(res.statusMessage);
  console.log(res.url);
  res.on('data', (chunk) => {
    console.log(`BODY: ${chunk}`);
  });
}).on('error', (error) => {
  console.log(`Got error: ${error.message}`);
});

/*
1.  Verificar se existe um arquivo de id no diretorio
2. Se não existir requisitar o id via rest-api-/ping e guardar o resultado
   no arquivo id
3. Se existir o arquivo chamar o rest-api-/ping/id e guardar o resultado no
   log
*/
