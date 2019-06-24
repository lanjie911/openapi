let express = require('express');
let router = express.Router();
let dbUtil = require("../../dao/dbdao");
let md5Util = require("../../util/md5");
let validator = require("../../util/util");

/* GET regis listing. */
router.get('/', function (req, res, next) {
    res.render('register/regis', { title: '开放平台注册' });
});

/**
 * 注册验证码
 */
router.post('/reg_sms_vcode', function (req, res, next) {
    let vcode = req.body.vcode;
    let mobile = req.body.mobile;
    let serverVCode = req.session.captcha;
    if (vcode != serverVCode) {
        res.json({ rs: 'VCODE_ERR', text:'验证码错误' });
        req.session.captcha = null;
        return;
    }
    // 验证手机号
    if(!validator.checkPhone(mobile)){
        res.json({ rs: 'MBL_ERR', text:'手机号码格式不正确' });
        return;
    }

    res.json({ rs: 'OK', text:'验证码OK' });
});

module.exports = router;
