<template>
  <div id="search">
    <div class="search-box">
        <el-input placeholder="请输入内容" v-model="searchInfo" class="input-with-select">
            <el-select v-model="select" slot="prepend" placeholder="请选择" v-if="(type!='borrowInfo')&&(type!='otherUsersAuthority')&&(type!='adminAuthority')">
                <el-option label="精确" value="0"></el-option>
                <el-option label="模糊" value="1"></el-option>
            </el-select>
        </el-input>
        <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
        <div class="pages-box">
            <el-pagination
                :hide-on-single-page="true"
                background
                ref="pages"
                @current-change="chaggePage"
                layout="prev, pager, next"
                :page-size="rows"
                :total="total">
            </el-pagination>
        </div>
    </div>
  </div>
</template>

<script>
import {GetBooksByInputApi,GetBooksByPageApi,GetBorrowInfoApi,GetBorrowInfoByPageApi,GetUserInfoApi,GetForbidenAcccountApi,GetBorrowForbidenAccountApi} from "../http/api"
export default {
    name:"Search",
    props:["passData","onShelve","type"],
    data() {
        return {
            searchInfo:"",
            select:"1",//区分精准查询还是模糊查询
            offset:0,//当前页数最后一行
            rows:2,//每次搜索行数
            total:0,//记录总数
            fisrstSearchInfo:""//输入框清空之前的搜索内容
        }
    },
    watch:{
        select:{
            handler(){
                console.log(this.select,typeof(this.select))
            }
        }
    },
    methods: {
        search(){
            if(this.type=="bookInfo"){
                this.getBoosInfo()
            }else if(this.type=="borrowInfo"){
                this.getBorrowInfo()
            }else if(this.type=="otherUsersAuthority"||this.type=="adminAuthority"){
                this.getUserInfo()
            }
        },
        // 通过输入框获取借阅信息
        async getBorrowInfo(){
            if(!this.searchInfo) return this.$message.warning({
                                    message:"请输入搜索条件！",
                                    duration:"2000",
                                    offset:110,
                                    showClose:true
                                })
            this.total=0
            this.offset=0
            this.fisrstSearchInfo=this.searchInfo
            const params={
                offset:this.offset,
                rows:this.rows,
                searchInfo:this.searchInfo
            }
            const res=await GetBorrowInfoApi(params)
            console.log(res.data,res.data.num)
            if(res.data.code==1){
                this.$message.success({
                    message:res.data.msg,
                    offset:110,
                    duration:2000,
                    showClose:true
                })
                this.$bus.$emit(this.passData,res.data.data)
                this.total=res.data.num
                this.searchInfo=""
            }else{
                this.$message.error({
                    message:res.data.msg,
                    duration:"2000",
                    offset:110,
                    showClose:true
                })
                this.searchInfo=""
            }
        },
        // 通过分页符获取借阅信息
        async getBorrowInfoByPage(){
            const params={
                searchInfo:this.fisrstSearchInfo,
                offset:this.offset,
                rows:this.rows
            }
            const res=await GetBorrowInfoByPageApi(params)
            if(res.data.code==1){
                this.$bus.$emit(this.passData,res.data.data)
            }else{
                this.$message.error({
                    message:res.data.msg,
                    duration:"2000",
                    offset:110,
                    showClose:true
                })
            }
        },
        // 输入框获取图书信息
        async getBoosInfo(){
            this.total=0
            this.offset=0
            var str
            if(this.select==0){
                str=this.searchInfo
            }else{
                str="%"+this.searchInfo+"%"
            }
            if(!this.searchInfo) return this.$message.warning({
                message:"请输入搜索条件！",
                duration:"2000",
                offset:110,
                showClose:true
            })
            const params={
                searchInfo:str,
                offset:0,
                rows:this.rows,
                onShelve:this.onShelve,
                operateType:Number(this.select)
            }
            const res=await GetBooksByInputApi(params)
            if(res.data.code==1){
                this.$message.success({
                    message:res.data.msg,
                    duration:"2000",
                    offset:110,
                    showClose:true
                })
                this.$bus.$emit(this.passData,res.data.data)
                this.fisrstSearchInfo=params.searchInfo
                this.searchInfo=""
                this.total=res.data.total
            }else if(res.data.code==2){
                this.$message.warning({
                    message:res.data.msg,
                    duration:"2000",
                    offset:110,
                    showClose:true
                })
                this.searchInfo=""
            }else{
                this.$message.error({
                    message:res.data.msg,
                    duration:"2000",
                    offset:110,
                    showClose:true
                })
                this.searchInfo=""
            }
        },
        // 通过分页符获取图书信息
        async getBookInfoByPage(){
            const params={
                searchInfo:this.fisrstSearchInfo,
                offset:this.offset,
                rows:this.rows,
                onShelve:this.onShelve,
                operateType:Number(this.select)
            }
            const res=await GetBooksByPageApi(params)
            if(res.data.code==1){
                console.log(this.$bus)
                this.$bus.$emit(this.passData,res.data.data)
            }else{
                this.$message.error({
                    message:res.data.msg,
                    duration:"2000",
                    offset:110,
                    showClose:true
                })
            }
        },
        // 分页符获取信息
        async chaggePage(page){
            // this.offset=(this.$refs["pages"]._data.internalCurrentPage-1)*this.rows
            this.offset=(page-1)*this.rows
            if(this.type=="bookInfo"){
                this.getBookInfoByPage()
            }else if(this.type=="borrowInfo"){
                this.getBorrowInfoByPage()
            }else if(this.type=="otherUsersAuthority"||this.type=="adminAuthority"){
                if(this.fisrstSearchInfo=="账户禁用"){
                    return this.getForbidenAccountByPage()
                }else if(this.fisrstSearchInfo=="借阅证禁用"){
                    return this.getBorrowForbidenAccountByPage()
                }
                this.getUserInfoByPage()
            }
        },
        // 通过搜索框获取用户信息
        async getUserInfo(){
            this.total=0
            this.offset=0
            if(!this.searchInfo) return this.$message.warning({
                                    message:"请输入搜索条件！",
                                    duration:"2000",
                                    offset:110,
                                    showClose:true
                                })
            if(this.searchInfo=="账户禁用"){
                this.fisrstSearchInfo=this.searchInfo
                return this.getForbidenAccount()
            }else if(this.searchInfo=="借阅证禁用"&&this.type=="otherUsersAuthority"){
                this.fisrstSearchInfo=this.searchInfo
                return this.getBorrowForbidenAccount()
            }
            var params
            if(this.type=="adminAuthority"){
                params={
                    offset:this.offset,
                    rows:this.rows,
                    searchInfo:this.searchInfo,
                    operateType:0
                }
            }else if(this.type=="otherUsersAuthority"){
                params={
                    offset:this.offset,
                    rows:this.rows,
                    searchInfo:this.fisrstSearchInfo,
                    operateType:1
                }
            }
            const res=await GetUserInfoApi(params)
            console.log(res.data.data)
            if(res.data.code==1){
                this.total=res.data.num
                this.fisrstSearchInfo=this.searchInfo
                this.searchInfo=""
                if(res.data.num==0){
                    this.$message.warning({
                        message:"暂无匹配项，请换个搜索条件再试试！",
                        duration:2000,
                        offset:110,
                        showClose:true
                    })
                }else{
                    this.$bus.$emit(this.passData,res.data.data)
                    this.$message.success({
                        message:res.data.msg,
                        duration:2000,
                        offset:110,
                        showClose:true
                    })
                }
            }else{
                this.$message.error({
                        message:res.data.msg,
                        duration:2000,
                        offset:110,
                        showClose:true
                    })
            }
        },
        // 通过分页符获取用户信息
        async getUserInfoByPage(){
            if(!this.searchInfo) return this.$message.warning({
                                    message:"请输入搜索条件！",
                                    duration:"2000",
                                    offset:110,
                                    showClose:true
                                })
            var params
            if(this.type=="adminAuthority"){
                params={
                    offset:this.offset,
                    rows:this.rows,
                    searchInfo:this.searchInfo,
                    operateType:0
                }
            }else if(this.type=="otherUsersAuthority"){
                params={
                    offset:this.offset,
                    rows:this.rows,
                    searchInfo:this.searchInfo,
                    operateType:1
                }
            }
            const res=await GetUserInfoApi(params)
            this.$bus.$emit(this.passData,res.data.data)
        },
        // 获取账户禁用的用户信息
        async getForbidenAccount(){
            var params={
                offset:this.offset,
                rows:this.rows,
                type:null
            }
            if(this.type=="adminAuthority"){
                params.type=1
            }else if(this.type=="otherUsersAuthority"){
                params.type=2
            }
            const res=await GetForbidenAcccountApi(params)
            this.searchInfo=""
            if(res.data.code==1){
                if(res.data.num==0){
                    this.$message.warning({
                        message:"暂无匹配信息！",
                        duration:2000,
                        offset:110,
                        showClose:true
                    })
                }else{
                    this.totla=res.data.num
                    this.$bus.$emit(this.passData,res.data.data)
                    this.$message.success({
                        message:res.data.msg,
                        duration:2000,
                        offset:110,
                        showClose:true
                    })
                }
            }else{
                this.$message.error({
                    message:res.data.msg,
                    duration:2000,
                    offset:110,
                    showClose:true
                })
            }
        },
        // 分页符获取禁用的账户信息
        async getForbidenAccountByPage(){
            var params={
                offset:this.offset,
                rows:this.rows,
                type:null
            }
            if(this.type=="adminAuthority"){
                params.type=1
            }else if(this.type=="otherUsersAuthority"){
                params.type=2
            }
            const res=await GetForbidenAcccountApi(params)
            if(res.data.code==1){
                this.$bus.$emit(this.passData,res.data.data)
            }else{
                this.$message.error({
                    message:res.data.msg,
                    duration:2000,
                    offset:110,
                    showClose:true
                })
            }
        },
        // 获取借阅证禁用的账户信息
        async getBorrowForbidenAccount(){
            var params={
                offset:this.offset,
                rows:this.rows
            }
            const res=await GetBorrowForbidenAccountApi(params)
            this.searchInfo=""
            if(res.data.code==1){
                if(res.data.num==0){
                    this.$message.warning({
                        message:"暂无匹配信息！",
                        duration:2000,
                        offset:110,
                        showClose:true
                    })
                }else{
                    this.$bus.$emit(this.passData,res.data.data)
                    this.$message.success({
                        message:res.data.msg,
                        duration:2000,
                        offset:110,
                        showClose:true
                    })
                }
            }else{
                this.$message.error({
                    message:res.data.msg,
                    duration:2000,
                    offset:110,
                    showClose:true
                })
            }
        },
        // 分页符获取借阅证禁用的账户信息
        async getBorrowForbidenAccountByPage(){
            var params={
                offset:this.offset,
                rows:this.rows
            }
            const res=await GetBorrowForbidenAccountApi(params)
            if(res.data.code==1){
                this.$bus.$emit(this.passData,res.data.data)
            }else{
                this.$message.error({
                    message:res.data.msg,
                    duration:2000,
                    offset:110,
                    showClose:true
                })
            }
        },
    },
}
</script>

<style scoped>
    .search-box{
        width: 350px;
        display: flex;
        align-items: center;
    }
    .pages-box{
        position: fixed;
        bottom: 10px;
        right:0;
    }
</style>