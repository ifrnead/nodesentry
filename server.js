'use strict';
const express = require('express')
const gcloud = require('gcloud')
const uuid = require('node-uuid')

// App initialization
var app = express()

// Database initialization
var ds = gcloud.datastore({
  projectId: 'node-sentry'
  // keyFilename: 'service.json'
})

// App configuration
app.enable('trust proxy')

// Handling static contents
app.use('/public', express.static('public'))

// Exposing methods
app.get('/', (req, res) => {
  res.send("Sistema de controle e monitoramento das VM do curso de Tecnologia em Informática para Internet.");
})

// Exposing methods to get utilization
app.get('/ping/:id', (req, res) => {

  let now = new Date().toJSON()
  let req_id = req.params.id
  let req_headers = req.headers

  console.log("Got request at: '" + now + "' of id: '" + req_id + "' from ip: '" + req_ip + "'")

  var query = ds.createQuery('PingMachine')
    .filter('uuid', '=', req_id)
    .limit(1)

  ds.runQuery(query, (err, results) => {
    if (!err) {
      if (results.length == 1) {

        let result = results[0]
        let entity_uuid = result.data.uuid

        var key = ds.key('PingEntry')
        var data = {
          uuid: entity_uuid,
          headers: req_headers,
          created_at: now
        }

        ds.save({
          key: key,
          data: data
        }, (err) => {
          if (!err) {
            res.json({
              key: key,
              data: data
            })
            console.log("This request was delivered.")
          } else {
            res.json({})
            console.log("Failed with error: " + err)
          }
        })

      } else {
        res.json({})
        console.log("PingMachine identity not found.")
      }
    }
  })

})

app.get('/ping', (req, res) => {

  let now = new Date().toJSON()
  let random_id = uuid.v4()

  console.log("Get request at '" + now + "' to generate id: '" + random_id + "'")

  var key = ds.key(['PingMachine', random_id])
  var data = {
    uuid: random_id,
    created_at: now
  }

  ds.save({
    key: key,
    data: data
  }, (err) => {
    if (!err) {
      res.json({
        uuid: random_id
      })
      console.log("This request was delivered.")
    } else {
      res.json({})
      console.log("Failed with error: " + err)
    }
  })

})

// Handling server error (500)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
})

// Handling file not found error (404)
app.use((req, res, next) => {
  res.status(404).send("Sorry can\'t find that!");
})

// Exposing service on port 8080
app.listen(8080, () => {
  console.log("Server running at http://localhost:8080/");
})
