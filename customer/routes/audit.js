var express = require('express');
var router = express.Router();

router.post('/person_promote', function (req, res, next) {

  if (!req.session.loginAdmin) {
    res.json({ rs: "ERROR", text: "NO SESSION" });
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

module.exports = router;
