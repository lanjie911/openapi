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
  merchant_iden varchar(128) NOT NULL COMMENT '盖章营业执照的地址',
  `keycode` varchar(128) NOT NULL COMMENT '营业执照号码',
  PRIMARY KEY (`merchant_id`),
  UNIQUE KEY `idx_keycode` (`keycode`),
  UNIQUE KEY idx_host_mobile(host_mobile),
  UNIQUE KEY idx_host_iden(host_iden),
  UNIQUE KEY idx_mer_name(merchant_name)
);

