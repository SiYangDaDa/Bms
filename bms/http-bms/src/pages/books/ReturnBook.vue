<template>
  <div id="returnBook">
    <Search passData="passBorrowInfo" type="borrowInfo" style="margin:20px 0 0 20px"></Search>
    <div class="searchResult-box" :style="'height:'+chooseItemHeight">
      <div class="table" v-show="searchResult.length>0">
        <div class="table-title">
          <div>ISBN</div>
          <div>学号</div>
          <div>借书日期</div>
          <div>借书时长</div>
          <div>应还日期</div>
          <div>逾期天数</div>
          <div>状态</div>
          <div>操作</div>
        </div>
        <div class="table-content" v-for="(item,index) in searchResult" :key="item.Id">
          <el-tooltip class="item" effect="dark" :content="item.BookId.toString()" placement="top">
            <div class="table-content-item">{{item.BookId}}</div>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" :content="item.StudentId.toString()" placement="top">
            <div class="table-content-item">{{item.StudentId}}</div>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" :content="item.BorrowDate" placement="top">
            <div class="table-content-item">{{item.BorrowDate}}</div>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" :content="item.Days.toString()" placement="top">
            <div class="table-content-item">{{item.Days}}</div>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" :content="item.ReturnDate" placement="top">
            <div class="table-content-item">{{item.ReturnDate}}</div>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" :content="item.OverdueDays.toString()" placement="top">
            <div class="table-content-item">{{item.OverdueDays}}</div>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" :content="item.Status" placement="top">
            <div class="table-content-item">{{item.Status}}</div>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" :disabled="true" placement="top">
            <div class="table-content-item lastItem"><el-button class="elBtn" :disabled="item.Status=='已还书'? true : false " @click="returnBook(item.Id,index)">一键还书</el-button></div>
          </el-tooltip>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {ReturnBookApi} from "../../http/api"
import Search from "../../components/Search.vue"
export default {
    name:"ReturnBook",
    components:{
        Search,
    },
    data() {
      return {
        searchResult:[],//搜索结果
        chooseItemHeight:0,
      }
    },
    methods: {
      // 获取页面高度，并计算标签高度
      getHeight(){
          this.chooseItemHeight=(window.innerHeight-200)+'px'
      },
      // 获取查询到的借阅信息
      getBorrowInfo(data){
        this.searchResult=data
      },
      // 还书
      async returnBook(id,idx){
        const params={
          id
        }
        const res=await ReturnBookApi(params)
        if(res.data.code==1){
          this.searchResult[idx].Status="已还书"
          this.$message.success({
            message:res.data.msg,
            duration:2000,
            offset:110,
            showClose:true
          })
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
    mounted() {
    // 全局事件总线
     this.$bus.$on("passBorrowInfo",(data)=>{this.getBorrowInfo(data)})
    },
    beforeDestroy(){
      // 关闭全局事件总线
      this.$bus.$off("passBorrowInfo")
    },
}
</script>

<style scoped>
  .table-title,.table-content{
    display: flex;
    justify-content: center;
  }
  .table-title>div,.table-content>.item{
    width: 10vw;
    text-align: center;
    line-height: 40px;
    height: 40px;
    overflow: hidden;
  }
  .table-content-item{
    color:gray;
    font-size: 14px;
    width: 10vw;
    padding: 0 5px;
    box-sizing: border-box;
    border-top: 1px solid rgba(158,159,160,0.5);
  }
  .table-content-item:hover{
    cursor: pointer;
    background-color: #EBEEF5;
  }
  .lastItem:hover{
    background-color: white;
  }
  .elBtn{
    color: #409EFF;
    border: none !important;
  }
</style>