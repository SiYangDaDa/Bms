<template>
<!-- 该组件是一个弹出层 -->
  <div id="pop-up-layer-box" v-if="isShow">
    <div class="pop-up-layer">
        <i class="el-icon-close" @click="closePopUpLayer"></i>
        <p class="tltle">{{title}}</p>
        <slot></slot>
        <!-- <div id="btn-box">
            <el-button type="primary" @click="submit">确定</el-button>
            <el-button type="danger" @click="closePopUpLayer">取消</el-button>
        </div> -->
    </div>
  </div>
</template>

<script>
export default {
    name:"PopUpLayer",
    props:['isShow','closePopUpLayer','title'],
    data() {
        return {

        }
    },
    methods: {
        close(){
            this.closePopUpLayer()
        }
    },
    created() {
        
    },
}
</script>

<style scoped>
    #pop-up-layer-box{
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(158,159,160,0.5);
        z-index: 99999;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .pop-up-layer{
        background-color:#fff;
        box-shadow:2px 2px 2px 1px rgba(0, 0, 0, 0.2) ;
        padding:10px 50px 20px 50px;
        border-radius: 15px;
        position: relative;
    }
    .el-icon-close{
        color: gray !important;
        font-size: 20px !important;
        font-weight: bold;
        position: absolute;
        top: 10px;
        right: 10px;
    }
    .tltle{
        text-align: center;
        color: #303133;
        font-weight: bold;
        margin-bottom: 20px;
    }
</style>