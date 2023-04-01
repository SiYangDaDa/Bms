var express = require('express');
var jwt=require('jsonwebtoken')
const dbQuery=require('../db/dbfun/dbQuery')
const dbQuery2=require('../db/dbfun/dbQuery2')
const loginSql=require("../db/sql/login/loginSql")
const userSql=require('../db/sql/user/userSql')
var router = express.Router();

// 修改用户信息
router.post('/setUserInfo',async function(req, res, next) {
  try{
    var params=[]
    if(req.body.type==0){
      params=[req.body.phone,req.body.account]
    }else if(req.body.type==1){
      params=[req.body.name,req.body.phone,req.body.account]
    }
    var result=await dbQuery2(userSql.resetUserInfo(req.body.type),params)
    res.send({
      code:1,
      msg:"修改成功！"
    })
  }catch(err){
    res.send({
      code:0,
      msg:err
    })
  }
});


// 重置密码
router.post('/password',async function(req,res,next){
  try{
    var params=[req.body.account,req.body.password]
    var result=await dbQuery(loginSql.login(),params)
    if(result.data.length>0){
      params=[req.body.newPassword,req.body.account]
      result=await dbQuery2(userSql.resetPassword(),params)
      res.send({
        code:1,
        msg:"密码重置成功！"
      })
    }else{
      res.send({
        code:0,
        msg:"账户或密码错误！"
      })
    }
  }catch(err){
    res.send({
      code:0,
      msg:err
    })
  }
})


// 添加管理员
router.post('/addAdmin',async function(req, res, next) {
  try{
    
    var params=[req.body.account]
    var result= await dbQuery(loginSql.isRegist(),params)
    if(result.data.length>0){
      res.send({
        code:0,
        msg:"该账户已注册！"
      })
    }else{
      const type=1
      params=[req.body.account,req.body.name,req.body.phone,type]
      await dbQuery2(userSql.addAdmin(),params)
      res.send({
        code:1,
        msg:"添加成功！"
      })
    }
  }catch(err){
    console.log(err)
    res.send({
      code:0,
      msg:err
    })
  }
});



// 查找用户信息
router.post('/getUserInfo',async function(req,res,next) {
  try{
    var params
    var result
    var result2
    if(req.body.operateType==0){
      params=[req.body.searchInfo,req.body.searchInfo,req.body.searchInfo]
      result2=await dbQuery(userSql.NumOfUserInfo(0,req.body.offset,req.body.rows),params)
      result=await dbQuery(userSql.selectUserInfo(0,req.body.offset,req.body.rows),params)
    }else{
      params=[req.body.searchInfo,req.body.searchInfo,req.body.searchInfo]
      result2=await dbQuery(userSql.NumOfUserInfo(1,req.body.offset,req.body.rows),params)
      result=await dbQuery(userSql.selectUserInfo(1,req.body.offset,req.body.rows),params)
    }
    res.send({
      code:1,
      msg:"搜索成功！",
      data:result.data,
      num:result2.data[0].num
    })
  }catch(err){
    //TODO handle the exception
    console.log(err)
    res.send({
      code:0,
      msg:err
    })
  }
})



// 获取账户禁用的用户信息
router.post("/getForbidenAccount",async function(req,res,next) {
  try{
    const params=[req.body.type]
    const result=await dbQuery(userSql.getFobidenUsersNum(req.body.offset,req.body.rows),params)
    const result2=await dbQuery(userSql.getFobidenUsers(req.body.offset,req.body.rows),params)
    res.send({
      code:1,
      num:result.data[0].num,
      data:result2.data,
      msg:"查询成功！"
    })
  }catch(err){
    //TODO handle the exception
    console.log(err)
    res.send({
      code:0,
      msg:err
    })
  }
})



// 获取借阅权限禁用的用户信息
router.post("/getBorrowForbidenAccount",async function(req,res,next) {
  try{
    const result=await dbQuery(userSql.getBorrowForbidenUsersNum(req.body.offset,req.body.rows))
    const result2=await dbQuery(userSql.getBorrowForbidenUsers(req.body.offset,req.body.rows))
    res.send({
      code:1,
      num:result.data[0].num,
      data:result2.data,
      msg:"查询成功！"
    })
  }catch(err){
    //TODO handle the exception
    console.log(err)
    res.send({
      code:0,
      msg:err
    })
  }
})




// 修改账户信息
router.post("/setAccountInfo",async function(req,res,next) {
  try{
    const params=[req.body.UserName,req.body.Phone,req.body.Password,req.body.Status,req.body.Borrow,req.body.OverdueNum,req.body.Id,req.body.UserId]
    await dbQuery(userSql.setAccountInfo(),params)
    res.send({
      code:1,
      msg:'信息修改成功！'
    })
  }catch(err){
    //TODO handle the exception
    console.log(err)
    res.send({
      code:0,
      msg:err
    })
  }
})




module.exports = router;
