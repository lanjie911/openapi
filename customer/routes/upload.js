var express = require('express');
var router = express.Router();
let multer = require('multer');
let fs = require('fs');
let dbUtil = require("../dao/dbdao");

let uploadp = multer({
  dest: "upload/person",
  limits: {
    files: 1,
    fileSize: 1000000
  },
  fileFilter: function (req, file, callback) {
    if (!req.session.loginAdmin) {
      callback(null, false);
      return;
    }
    callback(null, true);
  }
});

let uploade = multer({
  dest: "upload/enterprise",
  limits: {
    files: 1,
    fileSize: 1000000
  },
  fileFilter: function (req, file, callback) {
    if (!req.session.loginAdmin) {
      callback(null, false);
      return;
    }
    callback(null, true);
  }
});

let m_storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'store/person')
  },
  filename: function (req, file, cb) {
    let fileType = file.mimetype.substr(6);
    let user_id = req.session.loginUser.userID;
    let newFileName = file.fieldname + '-' + user_id + "." + fileType;
    console.log(file.fieldname + "====" + newFileName);
    cb(null, newFileName);
  }
})

let uploadCus = multer({
  storage: m_storage,
  limits: {
    files: 3,
    fileSize: 512000
  },
  fileFilter: function (req, file, callback) {
    if (!req.session.loginUser) {
      // 没有session就不要传文件了
      callback(null, false);
      return;
    }
    // 处理文件写入
    callback(null, true);
  }
}).any();

router.post('/custup', function (req, res, next) {

  uploadCus(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // 发生错误
      res.json({ rs: "ERROR", text: "FILE UPLOAD FAIL -1" });
      return;
    } else if (err) {
      // 发生错误
      res.json({ rs: "ERROR", text: "FILE UPLOAD FAIL -2" });
      return;
    }

    // 一切顺利
    if (!req.session.loginUser) {
      res.json({ rs: "ERROR", text: "FILE UPLOAD FAIL 1" });
      return;
    }
  
    if (!req.files) {
      res.json({ rs: "ERROR", text: "FILE UPLOAD FAIL 2" });
      return;
    }
  
    console.log("FILE COUNT IS " + req.files.length);
    if (req.files.length < 3) {
      res.json({ rs: "ERROR", text: "FILE UPLOAD FAIL 3" });
      return;
    }
  
    // 写入数据库
    let sql = "INSERT INTO real_name_p_verify (person_id_url_0,person_id_url_1,person_id_url_2,creator_id,audit_stat)VALUES(?,?,?,?,?)";
    let parray = [];
    let user_id = req.session.loginUser.userID;
  
    for (var i = 0; i < req.files.length; i++) {
      let f = req.files[i];
      let fileType = f.mimetype.substr(6);
      let newFileName = f.fieldname + '-' + user_id + "." + fileType;
      if (f.fieldname == "p-id-0") {
        parray[0] = newFileName;
      }
      if (f.fieldname == "p-id-1") {
        parray[1] = newFileName;
      }
      if (f.fieldname == "p-id-2") {
        parray[2] = newFileName;
      }
    }
    parray[3] = user_id;
    parray[4] = 1;
  
    dbUtil.query(sql, parray, function (results, fields) {
      res.json({ rs: "OK", text: "200" });
    });
  })
});

router.post('/enterprise', uploade.single('eidImg'), function (req, res, next) {

  if (!req.file) {
    res.json({ rs: "ERROR", text: "FILE UPLOAD FAIL" });
    return;
  }

  let fileName = req.file.filename;
  let fileType = req.file.mimetype.substr(6);
  let fileNewName = "upload/enterprise/" + fileName + "." + fileType;

  fs.rename('upload/enterprise/' + fileName, fileNewName, function (err) {
    console.log(err);
  });

  // 返回结果
  let resp = {};
  resp.rs = "OK";
  resp.text = "上传成功";
  resp.filepath = fileNewName;
  resp.filetype = fileType;

  res.json(resp);
});

module.exports = router;
