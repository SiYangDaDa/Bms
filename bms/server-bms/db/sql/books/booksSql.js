// 0表示否，1表示是
// 有关商品操作的sql语句
var booksSql={
  // 根据图书编号查询图书信息
  getBookInfoByBookId(){
    return "select * from books_info where BookId=?"
  },
  // 精准查询图书信息
  accurateGetBooksInfo(offset,rows){
    // return 'select * from books_info where BookId=? or BookName=? or Location=? or Stock=? or Author=? or Press=? or Price=? or Status=? or Type=? limit '+offset+","+rows
    return {
      all: 'select * from books_info where BookId=? or BookName=? or Location=? or Stock=? or Author=? or Press=? or Price=? or Status=? or Type=? limit '+offset+","+rows,
      onShelve: 'select * from books_info where (BookId=? or BookName=? or Location=? or Stock=? or Author=? or Press=? or Price=? or Status=? or Type=?) and Status="上架" limit '+offset+","+rows
    }
  },
  // 符合精准查询条件的数据的条数
  accurateNum(){
    // return "select count(BookId) as num from books_info where BookId=? or BookName=? or Location=? or Stock=? or Author=? or Press=? or Price=? or Status=? or Type=?"
    return {
      all:"select count(BookId) as num from books_info where BookId=? or BookName=? or Location=? or Stock=? or Author=? or Press=? or Price=? or Status=? or Type=?",
      onShelve:"select count(BookId) as num from books_info where (BookId=? or BookName=? or Location=? or Stock=? or Author=? or Press=? or Price=? or Status=? or Type=?) and Status='上架'"
    }
  },
  // 模糊查询图书信息
  fuzzyGetBooksInfo(offset,rows){
    // return 'select * from books_info where BookId like ? or BookName like ? or Location like ? or Stock like ? or Author like ? or Press like ? or Price like ? or Status like ? or Type like ? limit '+offset+","+rows
    return {
      all:'select * from books_info where BookId like ? or BookName like ? or Location like ? or Stock like ? or Author like ? or Press like ? or Price like ? or Status like ? or Type like ? limit '+offset+","+rows,
      onShelve:'select * from books_info where (BookId like ? or BookName like ? or Location like ? or Stock like ? or Author like ? or Press like ? or Price like ? or Status like ? or Type like ?) and Status="上架" limit '+offset+","+rows
    }
  },
  // 符合模糊查询条件的数据的条数
  fuzzyNum(){
    // return 'select count(BookId) as num from books_info where BookId like ? or BookName like ? or Location like ? or Stock like ? or Author like ? or Press like ? or Price like ? or Status like ? or Type like ?'
    return {
      all:'select count(BookId) as num from books_info where BookId like ? or BookName like ? or Location like ? or Stock like ? or Author like ? or Press like ? or Price like ? or Status like ? or Type like ?',
      onShelve:'select count(BookId) as num from books_info where (BookId like ? or BookName like ? or Location like ? or Stock like ? or Author like ? or Press like ? or Price like ? or Status like ? or Type like ?) and Status="上架"'
    }
  },
  // 获取可用的图书分类
  getType(){
    return "select * from books_type where Status='启用'"
  },
  // 获取禁用的图书分类
  getForbidType(){
    return "select * from books_type where Status='禁用'"
  },
  // 查询是否存在某个分类
  typeIsIn(){
    return "select * from books_type where Type=?"
  },
  // 设置图书的分类状态
  setBooksTypeStatus(typeList){
    var num=0
    str="update books_type set Status=? where Id="
    typeList.forEach((ele)=>{
      num++
      if(num==typeList.length){
        str=str+ele
      }else{
        str=str+ele+" or Id="
      }
    })
    return str
  },
  // 删除图书的分类
  deleteBooksTypeStatus(typeList){
    var num=0
    str="delete from books_type where Id="
    typeList.forEach((ele)=>{
      num++
      if(num==typeList.length){
        str=str+ele
      }else{
        str=str+ele+" or Id="
      }
    })
    return str
  },
  // 添加图书分类
 addBookType(){
   return "insert into books_type (Type) values (?)"
 },
  // 添加新图书
  addNewBook(){
    return "insert into books_info (BookId,BookName,BookDesc,Location,Stock,Author,Press,Price,Cover,Type) values (?,?,?,?,?,?,?,?,?,?)"
  },
  // 添加图书数量
  addBookNum(){
    return "update books_info set Stock=Stock+? where BookId=?"
  },
  // 设置图书库存
  setBookStock(){
    return "update books_info set Stock=? where BookId=?"
  },
  // 图书上下架
  setBookStatus(){
    return "update books_info set Status=? where BookId=?"
  },
  // 删除图书
  deleteBook(){
    return "delete books_info where BookId=?"
  },
  // 更新图书价格
  ressetPrice(){
    return "update books_info set Price=? where BookId=?"
  },
  // 更新图书位置
  resetLocation(){
    return "update books_info set Location=? where BookId=?"
  },
  // 设置图书分类状态
  setBookTypeStatus(){
    return "update books_type set Status=? where Id=?"
  },
  // 删除图书分类
  deleteBookType(){
    return "delete books_type where Id=?"
  },
  // 查询要添加的图书分类是否存在
  selectTypeIsIn(){
    return "select * from books_info where Type=?"
  },
  
}

exports= module.exports=booksSql
