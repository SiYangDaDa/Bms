var express = require('express')
var jwt=require('jsonwebtoken')
const dbQuery=require('../db/dbfun/dbQuery')
const dbQuery2=require('../db/dbfun/dbQuery2')
const bookSql=require('../db/sql/books/booksSql')
var router = express.Router();

//获取可用的分类
router.post('/getType',async function(req, res, next) {
  try{
    var result=await dbQuery(bookSql.getType())
    console.log(res.data)
    res.send({
      code:1,
      msg:"图书分类获取成功！",
      data:result.data
    })
  }catch(err){
    res.send({
      code:0,
      msg:err
    })
  }
})



//获取禁用的分类
router.post('/getForbidType',async function(req, res, next) {
  try{
    const result=await dbQuery(bookSql.getForbidType())
    res.send({
      code:1,
      msg:"图书分类禁用成功！",
      data:result.data
    })
  }catch(err){
    console.log(err)
    res.send({
      code:0,
      msg:err
    })
  }
})



// 修改图书分类的状态
router.post('/setBooksType',async function(req, res, next) {
  try{
    var params=[req.body.status]
    await dbQuery2(bookSql.setBooksTypeStatus(req.body.typeList),params)
    res.send({
      code:1,
      msg:"分类状态修改成功！",
    })
  }catch(err){
    console.log(err)
    res.send({
      code:0,
      msg:err
    })
  }
})



// 删除图书分类
router.post('/deleteBooksType',async function(req, res, next) {
  try{
    await dbQuery2(bookSql.deleteBooksTypeStatus(req.body.typeList))
    res.send({
      code:1,
      msg:"分类状态删除成功！",
    })
  }catch(err){
    console.log(err)
    res.send({
      code:0,
      msg:err
    })
  }
})



// 添加图书分类
router.post('/addBooksType',async function(req,res,next) {
  try{
    const params=[req.body.newType]
    var result=await dbQuery(bookSql.typeIsIn(),params)
    if(result.data.length==0){
      await dbQuery2(bookSql.addBookType(),params)
      var result2=await dbQuery(bookSql.getType())
      res.send({
        code:1,
        msg:"分类添加成功！",
        data:result2.data
      })
    }else{
      res.send({
        code:0,
        msg:"该分类已添加，请勿重复添加！",
      })
    }
  }catch(err){
    //TODO handle the exception
    console.log(err)
    res.send({
      code:0,
      msg:err
    })
  }
})




// 新图书入库
router.post('/addNewBook',async function(req, res, next) {
  try{
    var params=[req.body.bookNum]
    var result=await dbQuery(bookSql.getBooksInfo(),params)
    if(result.data.length>0){
      res.send({
        code:0,
        msg:"该图书已入库，请前往添加数量！"
      })
    }else{
      params=[req.body.bookNum,req.body.bookName,req.body.desc,req.body.position,req.body.num,req.body.author,req.body.press,req.body.price,req.body.imgUrl,req.body.type]
      result=await dbQuery(bookSql.addNewBook(),params)
      res.send({
        code:1,
        msg:"添加成功！"
      })
    }
  }catch(err){
    res.send({
      code:0,
      msg:err
    })
  }
})


// 图书数量添加
router.post('/addBookNum',async function(req, res, next) {
  try{
    var params=[req.body.bookNum]
    var result=await dbQuery(bookSql.getBooksInfo(),params)
    if(result.data.length>0){
      params=[req.body.num,req.body.bookNum]
      result=await dbQuery2(bookSql.addBookNum(),params)
      res.send({
        code:1,
        msg:"添加成功！"
      })
    }else{
      res.send({
        code:0,
        msg:"该图书未入库，请先添加图书！"
      })
    }
  }catch(err){
    res.send({
      code:0,
      msg:err
    })
  }
})


// 输入框搜索获取图书信息
router.post('/bookInfo',async function(req, res, next) {
  console.log(req.body.onShelve)
    try{
      var result
      var results
      var sqlStr
      var params=[req.body.searchInfo,req.body.searchInfo,req.body.searchInfo,req.body.searchInfo,req.body.searchInfo,req.body.searchInfo,req.body.searchInfo,req.body.searchInfo,req.body.searchInfo]
      if(req.body.operateType==0){
        // operateType为0进行精查询
        if(req.body.onShelve){
          results=await dbQuery(bookSql.accurateNum().onShelve,params)
          sqlStr=bookSql.accurateGetBooksInfo(req.body.offset,req.body.rows).onShelve
        }else{
          results=await dbQuery(bookSql.accurateNum().all,params)
          sqlStr=bookSql.accurateGetBooksInfo(req.body.offset,req.body.rows).all
        }
        
      }else{
        // operateType为1进模糊查询
        if(req.body.onShelve){
          results=await dbQuery(bookSql.fuzzyNum().onShelve,params)
          sqlStr=bookSql.fuzzyGetBooksInfo(req.body.offset,req.body.rows).onShelve
        }else{
          results=await dbQuery(bookSql.fuzzyNum().all,params)
          sqlStr=bookSql.fuzzyGetBooksInfo(req.body.offset,req.body.rows).all
        }
      }
      if(results.data[0].num>0){
        result=await dbQuery(sqlStr,params)
        res.send({
          code:1,
          total:results.data[0].num,
          data:result.data,
          msg:"查询成功！"
        })
      }else{
        res.send({
          code:2,
          total:0,
          msg:"暂无匹配项，换个搜索条件试试！"
        })
      }
    }catch(err){
      res.send({
        code:0,
        msg:err
      })
    }
})


// 分页符通过分页获取图书信息
router.post('/bookInfoByPage',async function(req, res, next) {
    try{
      var result
      var params=[req.body.searchInfo,req.body.searchInfo,req.body.searchInfo,req.body.searchInfo,req.body.searchInfo,req.body.searchInfo,req.body.searchInfo,req.body.searchInfo,req.body.searchInfo]
      if(req.body.operateType==0){
        // operateType为0进行精查询
        if(req.body.onShelve){
          result=await dbQuery(bookSql.accurateGetBooksInfo(req.body.offset,req.body.rows).onShelve,params)
        }else{
          result=await dbQuery(bookSql.accurateGetBooksInfo(req.body.offset,req.body.rows).all,params)
        }
      }else{
        // operateType为1进模糊查询
        if(req.body.onShelve){
          result=await dbQuery(bookSql.fuzzyGetBooksInfo(req.body.offset,req.body.rows).onShelve,params)
        }else{
          result=await dbQuery(bookSql.fuzzyGetBooksInfo(req.body.offset,req.body.rows).all,params)
        }
      }
      res.send({
        code:1,
        data:result.data,
        msg:"搜索成功！"
      })
    }catch(err){
      res.send({
        code:0,
        msg:err
      })
    }
})


// 设置图书上下架
router.post('/bookStatus',async function(req, res, next) {
    try{
      var params=[req.body.status,req.body.bookNum]
      var result=dbQuery2(bookSql.setBookStatus(),params)
      res.send({
        code:1,
        msg:"设置成功！"
      })
    }catch(err){
      res.send({
        code:0,
        msg:err
      })
    }
})


// 删除图书
router.post('/deleteBook',async function(req, res, next) {
    try{
      var params=[req.body.bookNum]
      var result=dbQuery2(bookSql.deleteBook(),params)
      res.send({
        code:1,
        msg:"删除成功！"
      })
    }catch(err){
      res.send({
        code:0,
        msg:err
      })
    }
})


// 更新图书价格
router.post('/setPrice',async function(req, res, next) {
    try{
      var params=[req.body.price,req.body.bookNum]
      var result=dbQuery2(bookSql.ressetPrice(),params)
      res.send({
        code:1,
        msg:"设置成功！"
      })
    }catch(err){
      res.send({
        code:0,
        msg:err
      })
    }
})


// 更新图书位置
router.post('/setLocation',async function(req, res, next) {
    try{
      var params=[req.body.location,req.body.bookNum]
      var result=dbQuery2(bookSql.resetLocation(),params)
      res.send({
        code:1,
        msg:"设置成功！"
      })
    }catch(err){
      res.send({
        code:0,
        msg:err
      })
    }
})


// 修改库存
router.post('/setStock',async function(req, res, next) {
    try{
      var params=[req.body.stock,req.body.bookNum]
      var result=dbQuery2(bookSql.setBookStock(),params)
      res.send({
        code:1,
        msg:"设置成功！"
      })
    }catch(err){
      res.send({
        code:0,
        msg:err
      })
    }
})


// 添加图书分类
router.post('/addBookType',async function(req, res, next) {
    try{
      var params=[req.body.type]
      var result=dbQuery(bookSql.selectTypeIsIn(),params)
      if(result.data.length>0){
        res.send({
          code:0,
          msg:"该分类已存在！"
        })
      }else{
        dbQuery2(bookSql.addBookType(),params)
        res.send({
          code:1,
          msg:"分类添加成功！"
        })
      }
    }catch(err){
      res.send({
        code:0,
        msg:err
      })
    }
})


// 删除图书分类
router.post('/deleteBookType',async function(req, res, next) {
    try{
      var params=[req.body.id]
      dbQuery2(bookSql.deleteBookType(),params)
      res.send({
        code:1,
        msg:"删除成功！"
      })
    }catch(err){
      res.send({
        code:0,
        msg:err
      })
    }
})

module.exports = router
