var express = require('express');
var jwt=require('jsonwebtoken')
const dbQuery=require('../db/dbfun/dbQuery')
const loginSql=require('../db/sql/login/loginSql')
var router = express.Router();


router.post('/api/log',async function(req, res, next) {
  try{
    let params=[req.body.account,req.body.password]
    const result=await dbQuery(loginSql.login(),params)
    if(result.data.length>0){
      var scretkey="book_management_system"
      const tokenStr=jwt.sign({username:result.data[0].UserName},scretkey,{expiresIn:'7200s'})
      var obj={
        code:1,
        msg:"登陆成功！",
        token:tokenStr,
        data:result.data
      }
      res.send(obj)
    }else{
      var obj={
        code:0,
        msg:"用户名或密码有误！",
      }
      res.send(obj)
    }
  }catch(err){
    var obj={
      code:0,
      msg:err
    }
    res.send(obj)
  }
});

module.exports = router;
