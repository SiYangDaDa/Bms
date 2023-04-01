const authoritySql={
  // 获取功能权限列表
  getAuthority(type){
    if(type==0){
      return "select * from superadmin_authority"
    }else if(type==1){
      return "select * from admin_authority"
    }else if(type==2){
      return "select * from student_authority"
    }
  },
  // 修改功能权限
  setAuthority(type){
    if(type==0){
      return "update superadmin_authority set Type=? where Id=?"
    }else if(type==1){
      return "updeate admin_authority set Type=? where Id=?"
    }else if(type==2){
      return "update student_authority set Type=? where Id=?"
    }
  },
  // 重置权限
  resetAuthority(type){
    if(type==0){
      return "update superadmin_authority set Type=DefaultType"
    }else if(type==1){
      return "update admin_authority set Type=DefaultType"
    }else if(type==2){
      return "update student_authority set Type=DefaultType"
    }
  },
}

exports=module.exports=authoritySql