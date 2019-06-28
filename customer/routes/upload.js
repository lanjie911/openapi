var express = require('express');
var router = express.Router();
let multer = require('multer');
let fs = require('fs');
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


router.post('/person', uploadp.single('pidImg'), function (req, res, next) {

  if (!req.file) {
    res.json({ rs: "ERROR", text: "FILE UPLOAD FAIL" });
    return;
  }

  let fileName = req.file.filename;
  let fileType = req.file.mimetype.substr(6);
  let fileNewName = "upload/person/" + fileName + "." + fileType;

  fs.rename('upload/person/'+fileName,fileNewName,function(err){
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

router.post('/enterprise', uploade.single('eidImg'), function (req, res, next) {

  if (!req.file) {
    res.json({ rs: "ERROR", text: "FILE UPLOAD FAIL" });
    return;
  }

  let fileName = req.file.filename;
  let fileType = req.file.mimetype.substr(6);
  let fileNewName = "upload/enterprise/" + fileName + "." + fileType;

  fs.rename('upload/enterprise/'+fileName,fileNewName,function(err){
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
