'use strict';
const http = require('http')
const fs = require('fs')
const dateformatter = require('date-format');

function formattedDate() {
  return dateformatter.asString(Date())
}

function log(text) {
  let datetime = formattedDate()
  console.log(`(${datetime}) ${text}`)
}

/*
1.  Verificar se existe um arquivo de id no diretorio
2. Se não existir requisitar o id via rest-api-/ping e guardar o resultado
   no arquivo id
3. Se existir o arquivo chamar o rest-api-/ping/id e guardar o resultado no
   log
*/

// Temporary
if (fs.existsSync("id.json")){
    fs.unlinkSync("id.json")
}

let configdir = '/home/alumni/.nodesentry'

if (!fs.existsSync(configdir)){
    fs.mkdirSync(configdir);
}

let file = configdir + "/id.json"

fs.stat(file, (err, stats) => {
  if (!err && stats.isFile()) {
    var obj = JSON.parse(fs.readFileSync(file))

    let uuid = obj.uuid

    let url = 'http://node-sentry.appspot.com/ping/' + uuid

    http.get(url, (res) => {
      console.log("Cliente conectou no servidor.")
      res.on('data', (chunk) => {
        console.log(`BODY: ${chunk}`)
      })
    }).on('error', (error) => {
      console.log(`Got error: ${error.message}`)
    })

  } else {

    let url = 'http://node-sentry.appspot.com/ping'

    http.get(url, (res) => {
      console.log("Cliente conectou no servidor.")
      res.on('data', (chunk) => {
        console.log(`BODY: ${chunk}`)

        // salvar o arquivo
        var obj = JSON.parse(chunk)
        var str = JSON.stringify(obj)

        fs.writeFile(file, str, (err) => {
          if (err) {
            return console.log(err);
          }
          console.log("The file was saved!");
        })

      })
    }).on('error', (error) => {
      console.log(`Got error: ${error.message}`)
    })

  }
})
