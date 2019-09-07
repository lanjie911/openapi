let express = require('express');
let router = express.Router();
let dbUtil = require("../../dao/dbdao");
let md5Util = require("../../util/md5");
let validator = require("../../util/util");

/* GET regis listing. */
router.get('/', function (req, res, next) {
    res.render('register/regcus', { title: '开放平台注册' });
});

/**
 * 注册验证码
 */
router.post('/reg_sms_vcode', function (req, res, next) {
    let vcode = req.body.vcode;
    let mobile = req.body.mobile;
    let serverVCode = req.session.captcha;
    if (vcode != serverVCode) {
        res.json({ rs: 'VCODE_ERR', text: '验证码错误' });
        req.session.captcha = null;
        return;
    }

    req.session.captcha = null;

    // 验证手机号
    if (!validator.checkPhone(mobile)) {
        res.json({ rs: 'MBL_ERR', text: '手机号码格式不正确' });
        return;
    }

    // 是否已经注册过
    let isRegSQL = "SELECT COUNT(1) total FROM reg_user WHERE mobile=?";
    let paras = [];
    paras.push(mobile);

    console.info("[FORMATTED SQL]:%s",dbUtil.format(isRegSQL,paras));

    dbUtil.query(isRegSQL, paras, function (rs, fields) {
        if (rs[0].total > 0) {
            res.json({ rs: 'USER_ERR', text: '已经注册过了' });
            return;
        }

        // 上一次发送的时长
        let lastTimeSend = "SELECT COUNT(1) total FROM reg_sms_vcode WHERE mobile=? AND TIMESTAMPDIFF(SECOND,created_time,NOW(6))<60";
        console.info("[FORMATTED SQL]:%s",dbUtil.format(lastTimeSend,paras));
        dbUtil.query(lastTimeSend,paras,function(rs,fields){
            if (rs[0].total > 0) {
                res.json({ rs: 'USER_ERR', text: '两次发送间隔不足60秒，请稍等' });
                return;
            }

            // 总发送量
            let sumSend = "SELECT COUNT(1) total FROM reg_sms_vcode WHERE mobile=?";
            console.info("[FORMATTED SQL]:%s",dbUtil.format(sumSend,paras));
            dbUtil.query(sumSend,paras,function(rs,fields){
                if (rs[0].total > 5) {
                    res.json({ rs: 'USER_ERR', text: '总计发送次数过多，暂时无法注册' });
                    return;
                }

                // 都没问题的话就发送
                let new6Vcode = validator.generateVCode();
                console.info("[A NEW 6 BIT CODE GEN]:%s",new6Vcode);
                // 插入发送表
                let vcodeSender = "INSERT INTO reg_sms_vcode(mobile,vcode,created_time)VALUES(?,?,NOW(6))";
                paras.push(new6Vcode);
                console.info("[FORMATTED SQL]:%s",dbUtil.format(vcodeSender,paras));
                dbUtil.update(vcodeSender,paras,function(){
                    // 调用Java服务，发送短信
                    // TODO
                    res.json({ rs: 'OK', text: '验证码已发送到手机' });
                })

            });
        });
    })
});

/**
 * 注册用户
 */
router.post('/reg_a_user', function (req, res, next) {
    let vcode = req.body.vcode;
    let mobile = req.body.mobile;
    let scode = req.body.scode;
    let serverVCode = req.session.captcha;

    if (vcode != serverVCode) {
        res.json({ rs: 'VCODE_ERR', text: '验证码错误' });
        req.session.captcha = null;
        return;
    }

    req.session.captcha = null;

    // 验证手机号
    if (!validator.checkPhone(mobile)) {
        res.json({ rs: 'MBL_ERR', text: '手机号码格式不正确' });
        return;
    }

    // 是否已经注册过
    let isRegSQL = "SELECT COUNT(1) total FROM reg_user WHERE mobile=?";
    let paras = [];
    paras.push(mobile);

    console.info("[FORMATTED SQL]:%s",dbUtil.format(isRegSQL,paras));

    dbUtil.query(isRegSQL, paras, function (rs, fields) {
        if (rs[0].total > 0) {
            res.json({ rs: 'USER_ERR', text: '已经注册过了' });
            return;
        }

        // 是否能找到对应的手机验证码
        let hasVCode = "DELETE FROM reg_sms_vcode WHERE mobile = ?";
        console.info("[FORMATTED SQL]:%s",dbUtil.format(hasVCode,paras));
        dbUtil.query(hasVCode,paras,function(rs,fields){
            if (rs.affectedRows < 1) {
                res.json({ rs: 'USER_ERR', text: '短信验证码错误' });
                return;
            }

            // 插入用户表
            let passwd = mobile.substr(5);
            let md5passwd = md5Util.md5(passwd);
            let createUser = "INSERT INTO reg_user (mobile,created_time,passwd)VALUES(?,NOW(6),?)";
            paras.push(md5passwd);
            console.info("[FORMATTED SQL]:%s",dbUtil.format(createUser,paras));
            dbUtil.query(createUser,paras,function(rs,fields){
                if (rs.affectedRows != 1) {
                    res.json({ rs: 'USER_ERR', text: '注册用户失败，内部执行错误' });
                    return;
                }
                res.json({ rs: 'OK', text: '注册用户成功，密码默认为手机后6位，请尽快登录修改密码' });
            });
        });
    })
});

module.exports = router;
