var express = require('express');
var router = express.Router();
let dbUtil = require("../../dao/dbdao");
let md5Util = require("../../util/md5");


router.get('/login', function (req, res, next) {
    if (req.session.loginAdmin) {
        res.render('admin/admin', req.session.loginAdmin);
        return;
    }
    res.redirect("../");
});

router.get('/logout', function (req, res, next) {
    req.session.destroy(function (err) {
        console.info("Session Destroied");
    });
    res.redirect("../");
});

router.post('/resetpwd', function (req, res, next) {
    if (!req.session.loginAdmin) {
        res.send("{rs:'FAILED'}");
        return;
    }
    console.warn("merchant is %s,admin %s is modifing password now.", req.session.loginAdmin.merchantId, req.session.loginAdmin.adminId);
    let jsonRs = {};
    jsonRs.rs = 'OK';

    let oldPwd = md5Util.md5(req.body.oldPwd);
    let newPwd = md5Util.md5(req.body.newPwd);
    console.log("[SQL Param]<oldPwd> is %s", oldPwd);
    console.log("[SQL Param]<newPwd> is %s", newPwd);

    let updateSQL = "UPDATE merchant_admin SET admin_pwd=? WHERE admin_id=? and admin_pwd=? and merchant_id=?";
    let params = [newPwd, req.session.loginAdmin.adminId, oldPwd, req.session.loginAdmin.merchantId];

    dbUtil.execute(updateSQL, params, function (exeResult) {
        if (exeResult.affectedRows == 1) {
            jsonRs.rs = 'OK';
        } else {
            jsonRs.rs = 'ERROR';
        }
        res.json(jsonRs);
    });
});

// 查询访问明细
router.post('/qry_app_list', function (req, res, next) {

    let jsonRs = {};

    if (!req.session.loginAdmin) {
        jsonRs.rs = "ERROR";
        res.json(jsonRs);
        return;
    }
    req.session.touch();

    // 这里的查询都得加上商户id
    let sql = "SELECT * FROM app_service";
    let paras = [];

    dbUtil.query(sql,paras,function(rs,flds){
        res.json(rs);
    });
});

module.exports = router;
