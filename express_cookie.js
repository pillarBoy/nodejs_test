var express = require('express')
var cookieParser = require('cookie-parser')
var child_process = require('child_process')
var app = express()
 app.use(cookieParser())


 app.get('/', (req, res) => {
   console.log("Cookies: ", req.cookies);
 })

app.listen(8081)
child_process.exec('start http:localhost:8081')
