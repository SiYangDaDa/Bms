var express = require('express');
var jwt=require('jsonwebtoken')
const dbQuery=require('../db/dbfun/dbQuery')
const dbQuery2=require('../db/dbfun/dbQuery2')
const loginSql=require('../db/sql/login/loginSql')
const bookSql=require('../db/sql/books/booksSql')
const borrowAndReturnSql=require('../db/sql/borrowAndReturn/borrowAndReturnSql')
// const { param } = require('express/lib/request');
var router = express.Router();


// 借书
router.post('/borrowBook',async function(req, res, next) {
  try{
    // let params=[req.body.studentId,req.body.bookId,req.body.borrowDate,req.body.days,req.body.returnDate]
    var params=[req.body.studentId]
    // 查询该学号是否注册（借阅证）
    var result=await dbQuery(loginSql.isRegist(),params)
    if(result.data.length>0){
      // 判断账户是否禁用
      if(result.data[0].Status==1){
        // 判断账户是否有借阅权限
        if(result.data[0].Borrow==1){
          params=[-1,req.body.bookId]
          // 要借阅的书库存-1
          result=dbQuery2(bookSql.addBookNum(),params)
          params=[req.body.studentId,req.body.bookId,req.body.borrowDate,req.body.days,req.body.returnDate]
          dbQuery2(borrowAndReturnSql.borrowBook(),params)
          res.send({
            code:1,
            msg:"借阅成功！"
          })
        }else{
          res.send({
            code:0,
            msg:"该账户暂无借阅权限，请先解除禁用！"
          })
        }
      }else{
        res.send({
          code:0,
          msg:"该借阅证账户已禁用，请先解除禁用！"
        })
      }
    }else{
      var obj={
        code:0,
        msg:"借阅证不存在，请先办理借阅证！",
      }
      res.send(obj)
    }
  }catch(err){
    console.log(err)
    res.send({
      code:0,
      msg:err
    })
  }
})


// 通过搜索框查找借阅记录
router.post('/borrowInfo',async function(req, res, next) {
  try{
    const params=[req.body.searchInfo,req.body.searchInfo,req.body.searchInfo,req.body.searchInfo,req.body.searchInfo,req.body.searchInfo]
    const Num=await dbQuery(borrowAndReturnSql.searchBorrowRecordNum(),params)
    const result=await dbQuery(borrowAndReturnSql.searchBorrowRecord(req.body.offset,req.body.rows),params)
    res.send({
      code:1,
      msg:"查询成功！",
      num:Num.data[0].num,
      data:result.data
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



// 通过分页符查找借阅记录
router.post('/borrowInfoByPage',async function(req, res, next) {
  try{
    const params=[req.body.searchInfo,req.body.searchInfo,req.body.searchInfo,req.body.searchInfo,req.body.searchInfo,req.body.searchInfo]
    const result=await dbQuery(borrowAndReturnSql.searchBorrowRecord(req.body.offset,req.body.rows),params)
    res.send({
      code:1,
      msg:"查询成功！",
      data:result.data
    })
  }catch(e){
    //TODO handle the exception
    console.log(err)
    res.send({
      code:0,
      msg:err
    })
  }
})



// 还书
router.post('/returnBook',async function(req, res, next) {
  try{
    var params=[1,req.body.bookId]
    // 借阅的书库存+1
    await dbQuery2(bookSql.addBookNum(),params)
    // 修改借阅状态
    params=[req.body.id]
    await dbQuery2(borrowAndReturnSql.returnBook(),params)
    res.send({
      code:1,
      msg:"还书成功！"
    })
  }catch(err){
    res.send({
      code:0,
      msg:err
    })
  }
})




module.exports = router;
