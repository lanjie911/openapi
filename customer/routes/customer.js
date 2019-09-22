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
  console.info("[FORMATTED SQL]:%s", dbUtil.format(qryString, qryParams));

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
    res.json({ rs: 'NO', "user": "" });
    return;
  };

  dbUtil.query(qryString, qryParams, callbackfunc);
});

/**
 * 登录成功去主页面
 */
router.get('/maintab', function (req, res, next) {
  if (!req.session.loginUser) {
    res.redirect("/");
  }

  //查个人审核状态
  let qryString = "select * from real_name_p_verify where creator_id = ?;";
  let qryParams = [req.session.loginUser.userID];
  console.info("[FORMATTED SQL]:%s", dbUtil.format(qryString, qryParams));

  let mapresult = {};

  let callbackfunc = function (rs, fds) {
    if (rs && rs.length > 0) {
      // 有审核记录
      let record = rs[0];
      mapresult.pvrecord = record;
      mapresult.go = 100;
      
    }    
    // 查看企业实名信息
    qryString = "select * from real_name_e_verify where creator_id = ?;";
    console.info("[FORMATTED SQL]:%s", dbUtil.format(qryString, qryParams));
    dbUtil.query(qryString, qryParams, function(rs2,fds2){
      if (rs2 && rs2.length > 0) {
        // 有企业审核记录
        mapresult.evrecord = rs2[0];
        mapresult.to = 200;
      }
      res.render('customer/maintab', mapresult);
    });
  };

  dbUtil.query(qryString, qryParams, callbackfunc);
});

router.get('/quit', function (req, res, next) {
  req.session.destroy(function (err) {
    console.info("Session Destroied");
  });
  res.redirect("/");
});

module.exports = router;
