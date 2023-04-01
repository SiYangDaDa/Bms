// 封装的该方法主要用于插入、更新、删除数据库的数据
const db=require('../db')
var dbQuery2=function(sqlStr,paramsArr){
    return new Promise((res, rej) => {
        db.query(sqlStr,paramsArr,(err,results)=>{
            if(err){
                rej(err)
            }else{
                const obj={
                    code:1,
                    msg:"操作成功！"
                }
                res(obj)
            }
        })
    })
}




module.exports=dbQuery2