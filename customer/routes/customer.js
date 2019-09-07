var express = require('express');
var router = express.Router();
let md5Util = require("../util/md5");
let vcodeUtil = require("../util/vcode");
let dbUtil = require("../dao/dbdao");

/* GET customer home page. */
router.get('/', function (req, res, next) {
  res.render('customer', { title: '聚合信息开发者平台' });
});

module.exports = router;
