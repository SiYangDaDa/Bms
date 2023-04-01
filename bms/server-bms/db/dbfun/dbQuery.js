// 封装的该方法主要用于查询返回数据库查询的数据
const db=require('../db')
var dbQuery=function(sqlStr,paramsArr){
    return new Promise((res, rej) => {
        db.query(sqlStr,paramsArr,(err,results)=>{
            if(err){
                rej(err)
            }else{
                const obj={
                    code:1,
                    data:JSON.parse(JSON.stringify(results))
                }
                res(obj)
            }
        })
    })
}




module.exports=dbQuery