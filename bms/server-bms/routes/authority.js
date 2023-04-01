var express = require('express');
var jwt=require('jsonwebtoken')
const dbQuery=require('../db/dbfun/dbQuery')
const dbQuery2=require('../db/dbfun/dbQuery2')
const authoritySql=require('../db/sql/authority/authoritySql')
var router = express.Router();

// 查询功能权限
router.post('/getAuthority',async function(req, res, next) {
  try{
    var result=await dbQuery(authoritySql.getAuthority(req.body.type))
    res.send({
      code:1,
      msg:"查询成功！",
      data:result.data
    })
  }catch(err){
    res.send({
      code:0,
      msg:err
    })
  }
})


// 设置功能权限
router.post('/setAuthority',async function(req,res,next){
  try{
    var params=[req.body.value,req.body.id]
    await dbQuery2(authoritySql.setAuthority(req.body.type),params)
    res.send({
      code:1,
      msg:"权限修改成功！",
    })
  }catch(err){
    //TODO handle the exception
    res.send({
      code:0,
      msg:err
    })
  }
})



// 重置权限
router.post("/resetAuthority",async function(req,res,next) {
  try{
    await dbQuery2(authoritySql.resetAuthority(req.body.type))
    var result=await dbQuery(authoritySql.getAuthority(req.body.type))
    res.send({
      code:1,
      msg:"权限重置成功！",
      data:result.data
    })
  }catch(err){
    console.log(err)
    //TODO handle the exception
    res.send({
      code:0,
      msg:err
    })
  }
})

module.exports = router;
