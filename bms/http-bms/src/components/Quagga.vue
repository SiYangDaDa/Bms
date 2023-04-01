<template>
<!-- 该组件主要用于识别图片中的条形码并返回码号 -->
  <div>
    <i class="iconfont icon-tupianshibie picture" @click="chooseCode"></i>
    <!-- <i class="iconfont icon-saoma-06 barCode"></i> -->
    <input class="input-barCode" ref="chooseCode" v-if="isUploadBarCode"  @change="toQR"  type="file" accept="image/*" capture="camera">
  </div>
</template>
<script type="text/ecmascript-6">
  import Quagga from 'quagga'
  export default {
    name: 'Quagga',
    props:['getCode'],
    data() {
      return {
        isUploadBarCode: true, // 控制销毁
      }
    },
    methods: {
      chooseCode(){
        this.$refs["chooseCode"].dispatchEvent(new MouseEvent('click'))
      },
      // 图片 识别 条形码
      toQR(e) {
        const that = this
        const file0 = e.target.files[0]
        this.isUploadBarCode = false
        Quagga.decodeSingle({
          inputStream: {
            name : 'image',
            type : 'ImageStream',
            // size: 1600, 指定图片的大小
            singleChannel: false,
          },
          locator: {
            patchSize: 'medium',
            halfSample: false
          },
          numOfWorkers: 1,
          decoder: { 
            // 条形码的类型
            readers: ['ean_reader','code_128_reader','ean_8_reader','code_39_reader','code_39_vin_reader','codabar_reader','upc_reader','upc_e_reader','i2of5_reader','2of5_reader','code_93_reader']
          },
          locate: true,
          src: URL.createObjectURL(file0)
        },(result) => {
          if (result && result.codeResult) {
            // this.$bus.$emit("getBarCode",result.codeResult.code)
            this.passCode(result.codeResult.code)
          } else {
            that.$message.warning({
              message:"识别失败，请手动输入",
              duration:"2000",
              offset:110,
              showClose:true
            })
          }
          this.isUploadBarCode = true
        })
      },
      passCode(code){
        console.log(code)
        this.getCode(code)
      }
    }
  }
</script>

<style>
  .picture,.barCode{
    font-size: 21px !important;
    color: #409EFF !important;
  }
  .picture:hover,.barCode:hover{
    cursor: pointer;
  }
  .input-barCode{
    opacity: 0;
    position: fixed;
    top: -1000px;
  }
</style>
