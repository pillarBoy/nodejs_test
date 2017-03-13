var express = require('express')
var server = express()
var bodyParser = require('body-parser')

server.use(bodyParser.urlencoded({ extended: true}))

var port = process.env.PORT || 8080
var router = express.Router()

router.get('/:page/:size', (req, res) => {
  let {page, size} = req.params
  res.send('<h1>Hello node serve'+page+':'+size+'</h1>')
})

server.use('/home', router)

server.listen(port)

console.log(port);
