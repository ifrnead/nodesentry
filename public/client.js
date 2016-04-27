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
