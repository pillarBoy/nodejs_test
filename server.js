var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var urlencodedParser = bodyParser.urlencoded({extended: false})

app.use(express.static('public'))

app.get('/home', (req, res) => {
  res.sendFile( __dirname + '/'+'index.html')
})

app.get('/pross_get', (req, res) => {
  var response = {
    first_name:req.query.first_name,
    last_name:req.query.last_name
  };
  console.log(response);
  res.end(JSON.stringify(response));
})

app.post('/process_post', urlencodedParser, (req, res) => {
  var response = {
    first_name: req.body.first_name,
    last_name: req.body.last_name
  };
  console.log(response);
  res.end(JSON.stringify(response));
})

var server = app.listen(8083, () => {
  var host = server.address().address
  var port = server.address().port
  console.log('http://%s:%s', host, port);
})
