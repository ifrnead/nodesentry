'use strict';
const fs = require('fs');
const http = require('http');
const dateformatter = require('date-format');

const downloadClientUrl = "http://localhost:7000/public/client.js";
const downloadClientFile = "client.js";

function formattedDate() {
  return dateformatter.asString(Date());
}

function log(text) {
  const datetime = formattedDate();
  console.log(`(${datetime}) ${text}`);
}

function downloadClient() {
  var file = fs.createWriteStream(downloadClientFile);
  var request = http.get(downloadClientUrl, (res) => {
    res.pipe(file);
    file.on('finish', () => {
      log("File downloaded.")
      file.close();
    });
  }).on('error', (error) => {
    fs.unlink(downloadClientFile);
  });

}

// Try to download the client as soon as the app starts
setImmediate(downloadClient);

// Try to download the updated client code every minute
setInterval(downloadClient, 1 * 60 * 1000)

function executeClient() {
  fs.stat(downloadClientFile, (err, stats) => {
    if (err) log("Error trying to get stats from file.");
    if (stats.isFile()) {
      var code = fs.readFileSync(downloadClientFile);

      // Insecure implementation... try to fix this.
      eval(code.toString());

    }
  });
}

// Try to execute the client 10s after the app starts
setTimeout(executeClient, 10 * 1000);

// Try to execute the client every 30 seconds
setInterval(executeClient, 30 * 1000);

log("Client running.");
