var express = require('express');
var jwt=require('jsonwebtoken')
const dbQuery=require('../db/dbfun/dbQuery')
const dbQuery2=require('../db/dbfun/dbQuery2')
const loginSql=require('../db/sql/login/loginSql')
var router = express.Router();

// 注册账户、办理借阅证
router.post('/api/reg',async function(req, res, next) {
  try{
    var params=[req.body.account]
    var result=await dbQuery(loginSql.isRegist(),params)
    if(result.data.length>0){
      res.send({
        code:0,
        msg:"该用户名已注册！"
      })
    }else{
      params=[req.body.account,req.body.name,req.body.phone,req.body.type,req.body.password]
      result=await dbQuery2(loginSql.regist(),params)
      res.send({
        code:1,
        msg:"注册成功(密码123456)！"
      })
    }
    
  }catch(err){
    res.send({
      code:0,
      msg:err
    })
  }
});

module.exports = router;
