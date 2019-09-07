var express = require('express');
var router = express.Router();
let md5Util = require("../util/md5");
let vcodeUtil = require("../util/vcode");
let dbUtil = require("../dao/dbdao");

/* GET home page. */
router.get('/', function (req, res, next) {
  res.redirect("/custo");
});

/**
 * 验证码请求
 */
router.get("/vcode", function (req, res, next) {
  console.log("[Verify Code Begin]...");
  console.log(req.session);
  let imgData = vcodeUtil.getCode(req, res);
  res.setHeader('Content-Type', 'image/svg+xml');
  res.write(String(imgData.img));
  res.end();
});

/**
 * 处理登录请求
 */
router.post('/login', function (req, res, next) {

  let acc = req.body.acc;
  let pwd = md5Util.md5(req.body.pwd);
  let vcode = req.body.vcode;

  console.log("acc %s login and pwd is %s and vcode is %s", acc, pwd, vcode);

  // 比较验证码
  let serverVCode = req.session.captcha;
  if (vcode != serverVCode) {
    res.json({ rs: 'LoginError' });
    req.session.captcha = null;
    return;
  }

  req.session.captcha = null;

  let qryString = "SELECT user_id FROM reg_user WHERE mobile=? AND passwd=?";
  let qryParams = [acc, pwd];
  console.info("[FORMATTED SQL]:%s",dbUtil.format(qryString,qryParams));

  let callbackfunc = function (rs, fds) {
    if (rs && rs.length > 0) {
      let record = rs[0];
      //增加session
      req.session.loginAdmin = {};
      req.session.loginAdmin.userID = record.user_id;
      req.session.loginAdmin.mobile = acc;
      res.json({ rs: 'LoginOK', "admin": req.session.loginAdmin });
      return;
    }
    res.json({ rs: 'LoginError' });
    return;
  };

  dbUtil.query(qryString, qryParams, callbackfunc);



  //res.render('index', { title: 'Express' });
});

module.exports = router;
