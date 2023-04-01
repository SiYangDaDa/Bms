// 这里连接数据库
const mysql=require('mysql');
// 连接数据库
const db = mysql.createPool({
    host:'127.0.0.1',
    user:'---',
    password:'---',
    database:'book_management_system',
    dateStrings:true,//保证前端显示层现实的时间格式与数据库中的时间格式一致
})
// 向外暴露
module.exports = db;