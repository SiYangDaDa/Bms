const user={
  // 用户个人或超管更改用户信息
  resetUserInfo(type){
    if(type==0){
      return 'update user_info set Phone=? where UserId=?'
    }else if(type==1){
      return 'update user_info set UserName=?,Phone=? where UserId=?'
    }
  },
  // 重置账户密码
  resetPassword(){
    return 'update user_info set Password=? where UserId=?'
  },
  // 添加管理员账户
  addAdmin(){
    return "insert into user_info (UserId,UserName,Phone,Type) values (?,?,?,?)"
  },
  // 设置账户状态
  setAccountType(){
    return "update user_info set Status=? where UserId=?"
  },
  // 查找用户信息
  selectUserInfo(typeNum,offset,rows){
    if(typeNum==0){
      // 查找管理员信息
      return "select * from user_info where (UserId=? or UserName=? or Phone=?) and type=1 limit "+offset+","+rows
    }else if(typeNum==1){
      // 查找学生账户信息
      return "select * from user_info where (UserId=? or UserName=? or Phone=?) and type=2 limit "+offset+","+rows
    }
  },
  // 查找符合条件的用户信息条数
  NumOfUserInfo(typeNum,offset,rows){
    if(typeNum==0){
      // 查找管理员信息
      return "select count(Id) as num from user_info where (UserId=? or UserName=? or Phone=?) and type=1 limit "+offset+","+rows
    }else if(typeNum==1){
      // 查找学生账户信息
      return "select count(Id) as num from user_info where (UserId=? or UserName=? or Phone=?) and type=2 limit "+offset+","+rows
    }
  },
  // 查找账户禁用的用户信息
  getFobidenUsers(offset,rows){
    return "select * from user_info where Status=0 and Type=? limit "+offset+","+rows
  },
  // 查找账户禁用的用户信息条数
  getFobidenUsersNum(offset,rows){
    return "select count(Id) as num from user_info where Status=0 and Type=? limit "+offset+","+rows
  },
  // 查找借阅权限禁用的用户信息
  getBorrowForbidenUsers(offset,rows){
    return "select * from user_info where Borrow=0 and Type=2 limit "+offset+","+rows
  },
  // 查找借阅权限禁用的用户信息条数
  getBorrowForbidenUsersNum(offset,rows){
    return "select count(Id) as num from user_info where Borrow=0 and Type=2 limit "+offset+","+rows
  },
  // 修改账户信息
  setAccountInfo(){
    return "update user_info set UserName=?,Phone=?,Password=?,Status=?,Borrow=?,OverdueNum=? where Id=? and UserId=?"
  },
}

exports= module.exports=user



