const login={
  // 用户登录
  login(){
    return 'select * from user_info where UserId=? and Password=?'
  },
  // 检测账户是否注册
  isRegist(){
    return 'select * from user_info where UserId=?'
  },
  // 注册账户
  regist(){
    return 'insert into user_info (UserId,UserName,Phone,Type,Password) values (?,?,?,?,?)'
  }
}

exports= module.exports=login