#注册用户表
DROP TABLE IF EXISTS reg_user;
CREATE TABLE reg_user(
  user_id BIGINT NOT NULL AUTO_INCREMENT COMMENT '注册用户的主键，自增',
  mobile VARCHAR(32) NOT NULL COMMENT '注册用户的手机号',
  created_time DATETIME NOT NULL DEFAULT NOW() COMMENT '注册的时间',
  passwd VARCHAR(128) NOT NULL COMMENT '默认密码为手机号后六位',

  PRIMARY KEY (user_id),
  UNIQUE KEY idx_mobile(mobile)
);

#注册发短信表
DROP TABLE IF EXISTS reg_sms_vcode;
CREATE TABLE reg_sms_vcode(
  mobile VARCHAR(32) NOT NULL COMMENT '注册的手机号',
  vcode VARCHAR(16) NOT NULL COMMENT '发送的验证码',
  created_time DATETIME NOT NULL DEFAULT NOW() COMMENT '验证码发送时间',

  KEY idx_mobile(mobile),
  KEY idx_mobile_vcode (mobile,vcode)
);

#应用表
DROP TABLE IF EXISTS app_service;
CREATE TABLE app_service (
  app_id BIGINT NOT NULL AUTO_INCREMENT COMMENT '应用id，自增',
  app_code VARCHAR(64) NOT NULL COMMENT '应用的编号，一般是取MD5',
  app_type SMALLINT NOT NULL DEFAULT 1 COMMENT '应用类型 1-短信，2-OCR，3-大数据',
  app_ip VARCHAR(64)  NOT NULL COMMENT '',
  app_desc VARCHAR(128) NULL COMMENT '',
  app_key VARCHAR(128) NOT NULL COMMENT '',
  creator_id BIGINT NOT NULL COMMENT '',
  created_time DATETIME NOT NULL DEFAULT NOW() COMMENT '',

  PRIMARY KEY (app_id),
  UNIQUE KEY idx_app_code(app_code)
);

#企业表
DROP TABLE IF EXISTS merchant;
CREATE TABLE `merchant` (
  `merchant_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `merchant_name` varchar(64) NOT NULL COMMENT '商户姓名',
  `created_time` datetime(3) NOT NULL,
  `description` varchar(512) DEFAULT NULL,
  `merchant_status` smallint(6) NOT NULL DEFAULT '1' COMMENT '商家状态1-正常，其他不正常',
  host_name varchar(32) NOT NULL COMMENT '法人姓名',
  host_mobile varchar(32) NOT NULL COMMENT '法人手机号',
  host_iden varchar(32) NOT NULL COMMENT '法人身份证号',
  merchant_iden varchar(128) NOT NULL COMMENT '社会统一信用码',
  `keycode` varchar(128) NOT NULL COMMENT '营业执照号码',
  PRIMARY KEY (`merchant_id`),
  UNIQUE KEY `idx_keycode` (`keycode`),
  UNIQUE KEY idx_host_mobile(host_mobile),
  UNIQUE KEY idx_host_iden(host_iden),
  UNIQUE KEY idx_mer_name(merchant_name)
);

