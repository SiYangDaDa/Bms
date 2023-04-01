<template>
  <div id="bookInfo-box">
    <PopUpLayer :isShow="isShow" :closePopUpLayer="closePopUpLayer" title="图书详情">
      <p class="booInfo-box"><span>位置：</span><span>{{bookInfo.Location}}</span></p>
      <p class="booInfo-box"><span>库存：</span><span>{{bookInfo.Stock}}</span></p>
      <p class="booInfo-box"><span>名称：</span><span>{{bookInfo.BookName}}</span></p>
      <p class="booInfo-box"><span>编辑：</span><span>{{bookInfo.Author}}</span></p>
      <p class="booInfo-box"><span>ISBN：</span><span>{{bookInfo.BookId}}</span></p>
      <p class="booInfo-box"><span>出版社：</span><span>{{bookInfo.Press}}</span></p>
      <p class="booInfo-box"><span>分类：</span><span>{{bookInfo.Type}}</span></p>
      <p class="booInfo-box"><span>描述：</span><span>{{bookInfo.BookDesc}}</span></p>
      <div class="btn">
        <el-button type="primary" @click="skipToBorrowBook(bookInfo.BookId)" v-if="$store.state.userInfo.type!=2">借阅</el-button>
        <el-button type="danger" @click="closePopUpLayer">取消</el-button>
      </div>
    </PopUpLayer>
    <div class="bookInfo" v-for="item in dataArr" :key="item.BookId" @click="closePopUpLayer(item)">
      <div class="bookInfo-img">
        <img :src="item.Cover" alt="">
      </div>
      <div class="bookInfo-content">
        <p class="content-text">{{item.BookName}}</p>
        <p class="content-text stock"><span>{{item.Location}}</span><span>{{item.Stock}}</span></p>
        <p class="content-text">{{item.BookDesc}}</p>
      </div>
    </div>
  </div>
</template>

<script>
import PopUpLayer from "../components/PopUpLayer.vue"
export default {
    name:"BookInfo",
    props:["dataArr"],
    components:{
      PopUpLayer,
    },
    data() {
      return {
        isShow:false,
        bookInfo:{},
      }
    },
    methods: {
      // 关闭或打开弹出层
      closePopUpLayer(it){
        if(it){
          this.bookInfo=it
        }else{
          this.bookInfo={}
        }
        this.isShow=!this.isShow
      },
      // 跳转到借书页面并传递图书ISBN
      skipToBorrowBook(id){
        this.$router.push({name:"borrowBook",params:{bookId:id}})
      },
    },
    created() {
    },
}
</script>

<style scoped>
  #bookInfo-box{
    display: flex;
    flex-wrap: wrap;
  }
  .booInfo-box{
    margin-bottom: 20px;
    width: 300px;
  }
  .booInfo-box>:first-child{
    color: #409EFF;
    font-size: 14px;
  }
  .booInfo-box>:last-child{
    font-size: 14px;
    color: #606266;
  }
  .bookInfo{
    width:160px;
    border-radius: 5px;
    padding: 5px;
    margin: 10px;
    background-color: rgba(158,159,160,0.2);
    box-sizing: border-box;
  }
  .bookInfo:hover{
    cursor: pointer;
  }
  .bookInfo-img{
    width: 100%;
  }
  .bookInfo-img>img{
    width: 150px;
    height: 190px;
  }
  .content-text{
    width: 150px;
    font-size: 14px;
    color: #606266;
    overflow: hidden;
    text-overflow: ellipsis; 
    display: -webkit-box;
    -webkit-line-clamp: 1; 
    -webkit-box-orient: vertical;
  }
  .stock{
    display: flex;
    justify-content: space-between;
  }
</style>