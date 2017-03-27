var express = require('express')
var server = express()
var bodyParser = require('body-parser')

server.use(bodyParser.json()); // 支持json 格式
// server.use(bodyParser.urlencoded({ extended: true})) // 支持默认 x-www-form-urlencoded

server.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type,Accept");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By",' 3.2.1');
  res.header("Access-Control-Allow-Credentials", true); // 允许发送cookie 认证
  res.header("Content-Type", "application/json; charset=utf-8");
  next();
});

var port = process.env.PORT || 8081
var router = express.Router()
// jsonp
router.get('/jp/:callback', (req, res) => {
  console.log(req.params)
  let callback = req.params.callback
  let data = {test: 'msg', code: 200}
  res.jsonp(`${callback}(${JSON.stringify(data)})`)
})

// request 请求   response 响应
router.get('/:name', (request, response) => {
  // 服务端接收到客户的的请求参数全部放在request 对象中，
  var params = request.params
  // 接收到一个请求时，在git bash把请求的参数log出来
  console.log(params)
  // 给客户端，需要的响应 200 表示连接成功
  response.status(200)
  // 给客户的响应对应的数据 （json 表示以json格式发送数据）
  response.json({name: params, msg: 'your request is success.'})
})

// post 请求
router.post('/say', (request, response) => {
  // 服务端接收到客户的的请求参数全部放在request 对象中，
  var {names} = request.body
  // 接收到一个请求时，在git bash把请求的参数log出来
  new Promise((resolve, reject) => {
    // 模拟数据等待
    setTimeout(() => {
      // 给客户端，需要的响应 200 表示连接成功
      response.status(200)
      // 给客户的响应对应的数据 （json 表示以json格式发送数据）
      response.json({name: names, say: function () {alert('I just want to talk to you hello.')}, msg: 'your post request is success.'})
      resolve()
    }, 1000)
  })


})

// 请求根目录
server.use('/home', router)

server.listen(port)

console.log(`http://localhost:${port}`);
// http://localhost:8081/home/Alice
