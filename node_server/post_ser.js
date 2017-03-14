var express = require('express')
var server = express()
var bodyParser = require('body-parser')

// 解决本地调试 跨域请求
server.all('*', function(req, res, next) {
res.header("Access-Control-Allow-Origin", "*");
res.header("Access-Control-Allow-Headers", "X-Requested-With");
res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
res.header("X-Powered-By",' 3.2.1');
res.header("Content-Type", "application/json;charset=utf-8");
next();
});


server.use(bodyParser.urlencoded({ extended: true}))

var port = process.env.PORT || 8081
var router = express.Router()
router.get('/get/:page/:name', (req, res) => {
  let {page, name} = req.params
  if (!page || page === '1') {
    res.send(`<h3>the page is ${page},and name is ${name}</h3>`);
  }else {
    res.send(`<h3>the next page is no defined!</h3>`);
  }
})

router.post('/login', (req, res) => {
  if(req.body.accesstoken === '30589745-03b5-4a53-85c7-df327fe17c48') {
    res.json({code: '200', data: [1,2,3,4,5], msg: 'welcome, Alice login success.'})
  } else {
    // res.status(401).send('accesstoken error!');
    res.status(500);
    // res.render('error', { error: err })
    res.json({code: '1001', data: [], msg: 'sorry, you need to use to get pars.'})
  }
})
router.post('/wklist', (req, res) => {
  var {page, projectCode} = req.body
  if (projectCode === 'T0001') {
    res.json({
      code: '200',
      data: [
        {
          wkNo: 'test001',
          wkStep: {
            steps: 'say hello',
            makeMn: 'make_money'
          }
        }
      ],
      msg: 'get data successful'
    })
  }else {
    res.send(`<h1>so sad to get nothing back</h1>`);
  }
})

server.use('/rooter', router)

server.listen(port)

console.log(port);
