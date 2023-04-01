<template>
  <div id="returnBook">
    <Search :onShelve="true" passData="getOnShelve" type="bookInfo" style="margin:20px 0 0 20px"></Search>
    <BookInfo v-show="bookInfoList.length>0" :dataArr="bookInfoList"></BookInfo>
  </div>
</template>

<script>
// import {GetBooksByInputApi} from "../../http/api"
import BookInfo from "../../components/BookInfo.vue"
import Search from "../../components/Search.vue"
export default {
    name:"SearchBook",
    components:{
      BookInfo,
      Search
    },
    data() {
      return {
        bookInfoList:[],
      }
    },
    methods: {
      getBookInfo(data){
        this.bookInfoList=data
        console.log(this.bookInfoList)
      },
    },
    created() {
      
    },
    mounted() {
    // 全局事件总线
     this.$bus.$on("getOnShelve",(data)=>{this.getBookInfo(data)})
    },
    beforeDestroy(){
      // 关闭全局事件总线
      this.$bus.$off("getOnShelve")
    },
}
</script>

<style>

</style>