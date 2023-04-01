<template>
  <div id="home">
    <div id="bar">
      <el-menu
        :default-active="$router.path"
        router
        class="el-menu-demo"
        mode="horizontal"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b">
        <el-submenu index="1">
          <template slot="title">处理中心</template>
          <el-menu-item index="/home/searchBook" v-if="authorityList.SearchBook==1">找书</el-menu-item>
          <el-menu-item index="/home/borrowBook" v-if="authorityList.BorrowBook==1">借书</el-menu-item>
          <el-menu-item index="/home/returnBook" v-if="authorityList.ReturnBook==1">还书</el-menu-item>
          <el-menu-item index="/home/returnBook" v-if="$store.state.userInfo.type==2">借书记录</el-menu-item>
        </el-submenu>
        <el-submenu index="2" v-if="(authorityList.SetBookStock==1)||(authorityList.BookWarehousing==1)||(authorityList.BookOnShelve==1)||(authorityList.SetBookType==1)||(authorityList.AddAdmin==1)||(authorityList.SetAccountAuthority==1)||(authorityList.BorrowingCard==1)">
          <template slot="title">我的工作台</template>
          <el-menu-item index="/home/borrowingCerTificate" v-if="authorityList.BorrowingCard==1">借阅证</el-menu-item>
          <el-submenu index="2-2">
            <template slot="title" v-if="(authorityList.SetBookStock==1)||(authorityList.BookWarehousing==1)||(authorityList.BookOnShelve==1)||(authorityList.SetBookType==1)">图书管理</template>
            <el-menu-item index="/home/books" v-if="(authorityList.SetBookStock==1)||(authorityList.BookWarehousing==1)">图书添加</el-menu-item>
            <el-menu-item index="/home/booksSet" v-if="(authorityList.BookOnShelve==1)||(authorityList.SetBookType==1)">图书设置</el-menu-item>
          </el-submenu>
          <el-submenu index="2-3" v-if="(authorityList.AddAdmin==1)||(authorityList.SetAccountAuthority==1)">
            <template slot="title">人员设置</template>
            <el-menu-item index="/home/adminManage" v-if="authorityList.AddAdmin==1">管理员添加</el-menu-item>
            <el-menu-item index="/home/authoritySet" v-if="authorityList.SetAccountAuthority==1">权限设置</el-menu-item>
          </el-submenu>
        </el-submenu>
        <el-submenu index="3">
          <template slot="title">个人中心</template>
          <el-menu-item index="/home/userInfo">个人信息</el-menu-item>
          <el-menu-item index="/home/password" v-if="authorityList.SetPassword==1">重置密码</el-menu-item>
          <el-menu-item @click="isLogout">退出登录</el-menu-item>
        </el-submenu>
      </el-menu>
    </div>
    <div id="home-content">
      <router-view></router-view>
    </div>
    <div id="top-left">
      <i class="el-icon-user-solid top-left-user"><span class="hello-user">{{userInfo.userName}}</span></i>
      <i class="el-icon-switch-button quit" @click="dialogVisible = true"></i>
    </div>
    <div id="quit">
      <el-dialog
        title="提示"
        :visible.sync="dialogVisible"
        width="30%"
        >
        <span>确定退出登录？</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="logout">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {GetAuthorityApi} from "../../http/api"
export default {
    name:"Home",
    data() {
      return {
        dialogVisible: false,
        userInfo:{},
        authorityList:[]
      }
    },
    methods: {
      // 打开退出登录弹出层
      isLogout(){
        this.dialogVisible=true
      },
      // 退出登录
      logout(){
        this.$store.commit("logout")
        sessionStorage.clear()
        this.$router.push({name:"login"})
      },
      // 获取权限列表
      async getAuthority(){
        var params={
          type:sessionStorage.getItem('type')
        }
        const res=await GetAuthorityApi(params)
        if(res.data.code==1){
          this.setAuthority(res.data.data)
          this.$store.commit("getAuthority",this.authorityList)
        }else{
          this.$message.error({
            message:res.data.msg,
            duration:2000,
            offset:110,
            showClose:true
          })
        }
      },
      // 设置权限列表
      setAuthority(arr){
        let obj={
          SetPassword:null,
          BorrowingCard:null,
          BookWarehousing:null,
          BookOnShelve:null,
          SetBookType:null,
          SetBookStock:null,
          SearchBook:null,
          BorrowBook:null,
          ReturnBook:null,
          OverdueTreatment:null,
          SetAccountAuthority:null,
          SetAdminAuthority:null,
          StudentAuthority:null,
          AddAdmin:null
        }
        arr.forEach(ele => {
          // obj[ele.AuthorityName]=ele.Type
          if(ele.AuthorityName=="SetPassword "||ele.AuthorityName=="SetPassword"){
            obj.SetPassword=ele.Type
          }else if(ele.AuthorityName=="BorrowingCard "||ele.AuthorityName=="BorrowingCard"){
            obj.BorrowingCard=ele.Type
          }else if(ele.AuthorityName=="BookWarehousing "||ele.AuthorityName=="BookWarehousing"){
            obj.BookWarehousing=ele.Type
          }else if(ele.AuthorityName=="BookOnShelve "||ele.AuthorityName=="BookOnShelve"){
            obj.BookOnShelve=ele.Type
          }else if(ele.AuthorityName=="SetBookType "||ele.AuthorityName=="SetBookType"){
            obj.SetBookType=ele.Type
          }else if(ele.AuthorityName=="SetBookStock "||ele.AuthorityName=="SetBookStock"){
            obj.SetBookStock=ele.Type
          }else if(ele.AuthorityName=="SearchBook "||ele.AuthorityName=="SearchBook"){
            obj.SearchBook=ele.Type
          }else if(ele.AuthorityName=="BorrowBook "||ele.AuthorityName=="BorrowBook"){
            obj.BorrowBook=ele.Type
          }else if(ele.AuthorityName=="ReturnBook "||ele.AuthorityName=="ReturnBook"){
            obj.ReturnBook=ele.Type
          }else if(ele.AuthorityName=="OverdueTreatment "||ele.AuthorityName=="OverdueTreatment"){
            obj.OverdueTreatment=ele.Type
          }else if(ele.AuthorityName=="SetAccountAuthority "||ele.AuthorityName=="SetAccountAuthority"){
            obj.SetAccountAuthority=ele.Type
          }else if(ele.AuthorityName=="SetAdminAuthority "||ele.AuthorityName=="SetAdminAuthority"){
            obj.SetAdminAuthority=ele.Type
          }else if(ele.AuthorityName=="StudentAuthority "||ele.AuthorityName=="StudentAuthority"){
            obj.StudentAuthority=ele.Type
          }else if(ele.AuthorityName=="AddAdmin "||ele.AuthorityName=="AddAdmin"){
            obj.AddAdmin=ele.Type
          }
        })
        this.authorityList=obj
      },
    },
    created() {
      this.getAuthority()
      this.$store.commit('setUserInfo')
      this.userInfo=this.$store.state.userInfo
    },
}
</script>

<style scoped>
  #top-left{
    position: fixed;
    top: 0;
    height: 61px;
    display: flex;
    align-items: center;
    right: 20px;
    color: #fff;
    font-size: 20px;
    z-index: 21;
  }
  .top-left-user{
    margin-right: 20px;
  }
  .hello-user{
    font-size: 16px;
  }
  .quit:hover{
    cursor: pointer;
    color: red;
  }
  #bar{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 20;
  }
  #home-content{
    position: fixed;
    left: 0;
    right: 0;
    top: 61px;
    bottom: 0;
    overflow: hidden;
  }
</style>