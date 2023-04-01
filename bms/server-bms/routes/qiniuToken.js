var express = require('express');
let qiniu=require("qiniu")
var router = express.Router();

var accessKey = 'QAfAdvLNT7_xcvKFiqyU6q2h2KutSuheViHccCOY';
var secretKey = 'suYyIhOaNLRlQ538cIBiaJhRf0e0gg2KVbjoL8df';
var mac = new qiniu.auth.digest.Mac(accessKey, secretKey);

router.get('/uploadToken', function(req, res, next) {
	var options = {
	  scope: "bms001",//存储空间名
	};
	var putPolicy = new qiniu.rs.PutPolicy(options);
	var token=putPolicy.uploadToken(mac);//向七牛云后台发送接口
	res.json({token})
});

module.exports = router;