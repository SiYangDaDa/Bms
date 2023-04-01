var borrowAndReturnSql={
  // 添加借阅记录
  borrowBook(){
    return "insert into borrow_info (StudentId,BookId,BorrowDate,Days,ReturnDate) values (?,?,?,?,?)"
  },
  // 修改借阅状态（还书）
  returnBook(){
    return "update borrow_info set Status='已还书' where Id=?"
  },
  // 搜索借阅记录(只支持精准查询)
  searchBorrowRecord(offset,rows){
    return "select * from borrow_info where StudentId=? or BookId=? or BorrowDate=? or Days=? or ReturnDate=? or Status=? limit "+offset+","+rows
  },
  // 搜索借阅记录总数(只支持精准查询)
  searchBorrowRecordNum(){
    return "select count(Id) as num from borrow_info where StudentId=? or BookId=? or BorrowDate=? or Days=? or ReturnDate=? or Status=?"
  },
  
}

exports= module.exports=borrowAndReturnSql