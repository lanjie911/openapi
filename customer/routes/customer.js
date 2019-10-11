var express = require('express');
var router = express.Router();
let md5Util = require("../util/md5");
let vcodeUtil = require("../util/vcode");
let dbUtil = require("../dao/dbdao");
let ckUtil = require("../util/util");

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

router.get('/new',function(req,res,next){
  let scode = req.session.captcha;
  let vcode = req.query.vcode;
  if(vcode != scode){
    console.log("ERROR VCode Of Regis scode is "+scode+" vcode is "+vcode);
    res.json({rs:"FAIL",text:"验证码不一致"});
    return;
  }
  let acc = req.query.acc;
  if(!ckUtil.checkPhone(acc)){
    res.json({rs:"FAIL",text:"注册账号不是手机号"});
    return;
  }
  let pwd = req.query.pwd;
  if(!ckUtil.checkPwd(pwd)){
    res.json({rs:"FAIL",text:"密码格式不符合要求"});
    return;
  }
  pwd = md5Util.md5(req.query.pwd);

  let sql = "INSERT INTO reg_user (mobile,created_time,passwd)VALUES(?,NOW(),?)";
  let paras = [acc,pwd];
  try{
    dbUtil.query(sql, paras, function(rs,fds){
      if (rs) {
        res.json({rs:"OK",text:"OK"});
      }else{
        res.json({rs:"FAIL",text:"SQL Error"});
      }
    });
  }catch(e){
    res.json({rs:"FAIL",text:"SQL ERROR"});
  }

});

module.exports = router;
