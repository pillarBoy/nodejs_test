var express = require('express')
var server = express()
var bodyParser = require('body-parser')
var mysql = require('mysql');

// sql Promise
const checkSQL = function (sql) {
  return new Promise((resolve, reject) => {
    // host: '数据库地址如:localhost',
    // user: '数据库用户名',
    // password: '密码',
    // database:'数据库名'
    const connection = mysql.createConnection({host: '127.0.0.1', user: 'root', password: '', database: 'datasource'});
    let setChartSQL = `SET NAMES UTF8`;
    connection.query(setChartSQL);

    let getSQL = sql || `SELECT did,name,price,img_lg,material,detail FROM  kf_dish LIMIT  $start,$count`;
    connection.query(getSQL, function(err, rows, fields) {
      if (err) {
        reject(err);
        throw err;
      }
      resolve(rows);
    });
    connection.end();
  })
}

server.use(bodyParser.json()); // 支持json 格式
server.use(bodyParser.urlencoded({ extended: true})) // 支持默认 x-www-form-urlencoded

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
// get by page query {start: 0, count: 10}
router.get('/getbypage/*', (req, res) => {
  if (typeof req.query === 'object') {
    let { start, count } = req.query
    // 两个参数有效 查询数据库
    if (start && count) {
      // 规定 start 从 0 开始
      let num = start > 1 ? (start - 1) : 0;
      let counts = 0;
      // 查询总数量
      checkSQL('SELECT COUNT(*) AS count FROM kf_dish')
      .then((res) => {
        counts = res[0].count;
        if (start > counts) {
          res.status(200).json({code: '403', data: [], count: counts, msg: '查询失败，查询开始条件超出总记录条数'});
        }
      })
      .catch((err) => {
        res.status(500).json({code: 500, data: [], msg: '查询失败，服务器错误。'});
      })
      let sql = `SELECT did,name,price,img_lg,material,detail FROM kf_dish LIMIT ${num},${count}`;
      checkSQL(sql)
      .then((datas) => {
        res.status(200).json({code: 200, data: datas, count: counts, msg: 'get data success.'});
      })
      .catch((err) => {
        res.status(500).json({code: 500, data: [], msg: '查询失败，服务器错误。'});
      })
    } else {
      res.status(200).json({code: 102, msg: '参数错误'});
    }
  }
});

// get by kw
router.get('/getbykw/*', (req, res) => {
  let {kw, start = 0, pageSize = 5} = req.query;
  // 如果客户的 未提供查询开始位置 设置默认
  if (typeof kw === 'string' && kw.trim()) {
    let sql = `SELECT did,name,price,img_sm,material  FROM  kf_dish  WHERE name LIKE '%${kw}%' OR material LIKE '%${kw}%'  LIMIT  ${start},${pageSize}`
    checkSQL(sql)
    .then((result) => {
      res.status(200).json({code: 200, data: result, msg: 'success'});
    })
    .catch((err) => {
      res.status(500).json({code: 500, data: [], msg: '查询失败，服务器错误。'});
    })
  } else {
    res.status(200).json({code: 102, msg: '参数类型错误'});
  }
});

// get by id (id type string)
router.get('/getbyid/*', (req, res) => {
  let {id} = req.query;
  if (typeof id === 'string' && id.trim()) {
    let sql = `SELECT did,name,price,img_lg,material,detail FROM  kf_dish WHERE did=${id}`
    checkSQL(sql)
    .then((result) => {
      res.status(200).json({code: 200, data: result, msg: '查询成功'});
    })
    .catch((err) => {
      res.status(500).json({code: 500, data: [], msg: '查询失败，服务器错误。'});
    })
  } else {
    res.status(200).json({code: 102, msg: '参数类型错误'});
  }
})

// post 请求
// user_name, sex, phone, addr, did => string
// sex => boolean
router.post('/orderadd', (req, res) => {
  // 服务端接收到客户的的请求参数全部放在request 对象中，
  let {user_name, sex, phone, addr, did} = req.body;
  let order_time = (new Date()).getTime();
  console.log(order_time);
  if (!user_name.trim() || sex === undefined || !phone.trim() || !addr.trim() || !did.trim()) {
    res.json({code: 403, msg: '提交信息不全。'})
  } else {
    let sql = `INSERT INTO kf_order VALUES(NULL,'${phone}','${user_name}','${sex}','${order_time}','${addr}', '${did}')`;
    checkSQL(sql)
    .then((result) => {
      console.log(result);
      if (result) {
        res.json({code: 200, msg: '增加订单成功', order_id: `${did}`})
      }else {
        res.json({code: 403, msg: '订单失败', order_id: `${result.insertId}`})
      }
    })
    .catch((err) => {
      res.json({code: 403, msg: '服务器错误，订单失败。', order_id: `${err}`})
    })
  }
})

router.post('/order_getbyphone', (req, res) => {
  let {phone} = req.body;
  if (typeof phone === 'string' && phone.trim()) {
    var sql = `SELECT kf_order.oid,kf_order.user_name,kf_order.order_time,kf_dish.img_sm,kf_dish.did FROM kf_order,kf_dish WHERE kf_order.did=kf_dish.did AND kf_order.phone='${phone}'`;
    checkSQL(sql)
    .then((result) => {
      res.json({code: 200, msg: '查询成功', data: result});
    })
    .catch(err => {
      res.json({code: 501, msg: '查询失败'});
    })
  }else {
    res.json({code: 403, msg: '提交信息不全。'});
  }
})

// 请求根目录
server.use('/home', router)

server.listen(port)

console.log(`http://localhost:${port}`);
// http://localhost:8081/home/Alice
