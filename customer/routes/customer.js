var express = require('express');
var router = express.Router();
let md5Util = require("../util/md5");
let vcodeUtil = require("../util/vcode");
let dbUtil = require("../dao/dbdao");

/* GET customer home page. */
router.get('/', function (req, res, next) {
  res.render('customer', { title: '聚合信息开发者平台' });
});

/**
 * 开发者登录
 */
router.get('/login', function (req, res, next) {

  let acc = req.query.acc;
  let pwd = md5Util.md5(req.query.pwd);

  let qryString = "SELECT user_id FROM reg_user WHERE mobile=? AND passwd=?";
  let qryParams = [acc, pwd];
  console.info("[FORMATTED SQL]:%s",dbUtil.format(qryString,qryParams));

  let callbackfunc = function (rs, fds) {
    if (rs && rs.length > 0) {
      let record = rs[0];
      //增加session
      req.session.loginUser = {};
      req.session.loginUser.userID = record.user_id;
      req.session.loginUser.mobile = acc;
      res.json({ rs: 'OK', "user": req.session.loginUser });
      return;
    }
    res.json({ rs: 'NO', "user": ""});
    return;
  };

  dbUtil.query(qryString, qryParams, callbackfunc);
});

/**
 * 登录成功去主页面
 */
router.get('/maintab', function (req, res, next) {
  res.render('customer/maintab', { title: '聚合信息开发者平台' });
});

router.get('/quit', function (req, res, next) {
  res.render('customer', { title: '聚合信息开发者平台' });
});

module.exports = router;
