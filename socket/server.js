var app = require('express')()
var server = require('http').Server(app)

app.get('/', function(req, res) {
  res.sendfile(__dirname + '/index.html')
})

module.exports = server
