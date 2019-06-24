let express = require('express');
let router = express.Router();
let dbUtil = require("../../dao/dbdao");
let md5Util = require("../../util/md5");

/* GET regis listing. */
router.get('/', function (req, res, next) {
    res.render('register/regis');
});

module.exports = router;
