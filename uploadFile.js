var express = require('express')
var app = express()
var fs = require('fs')

var bodyParser = require('body-parser')
var multer = require('multer')

app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: false}))
app.use(multer({dest: '/tmp/'}).array('image'))

app.get('/home', (req, res) => {
  res.sendFile( __dirname +'/'+'index.html')
})

app.post('/file_upload', (req, res) => {
  console.log(req.files[0]);
  let des_file = __dirname + '/' + req.files[0].originalname;
  fs.readFile( req.files[0].path, (err, data) => {
    fs.writeFile(des_file, data, (err) => {
      if (err) {
        console.log(err);
      }else {
        response = {
          message: "File uploaded sucessfull",
          filename: req.files[0].originalname
        };
        console.log(response);
        res.end(JSON.stringify(response))
      }
    })
  })
})

const server = app.listen(8081, ()=>{
  let host = server.address().address;
  let port = server.address().port
  console.log("http://%s:%s", host, port);
})
