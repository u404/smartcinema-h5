<template>
  <div class="join">
    <h1>随时随地分享电影乐趣，与影迷嗨聊起来！</h1>
    <div class="concat-box">
      <div class="wx-info">
        <img src="https://g.smartcinema.com.cn/images/f66f152f7b9240e2b57b0d33b1e90d32-120-120.jpg"/>
        <span>移动电影院影迷群</span>
      </div>
      <div class="wx-code" @click.stop="confirmShow = true">
        <img src="https://g.smartcinema.com.cn/images/6b089aeee4894a9d9738eac0bf7cd9a6-302-296.png" />
      </div>
      <p>扫二维码，小助手邀你进群~</p>
    </div>
    <sc-confirm :confirmVisiable="confirmShow" msg="是否保存二维码？" cancelText="取消" confirmText="保存" @cancel="confirmShow=false" @confirm="download" ></sc-confirm>
  </div>
</template>
<script>
import ScConfirm from "@/components/ScConfirm"
import env from "@sc/lib-env"
export default {
  components: {
    ScConfirm
  },
  data () {
    return {
      confirmShow: false
    }
  },
  methods: {
    // canvas图片转base64
    convertImgToBase64 (url, callback, outputFormat) {
      const loading = this.$toast.showLoading()
      var img = new Image()
      img.crossOrigin = "Anonymous"
      img.onload = () => {
        var canvas = document.createElement("canvas")
        var ctx = canvas.getContext("2d")
        canvas.height = img.height
        canvas.width = img.width
        ctx.drawImage(img, 0, 0)
        var dataURL = canvas.toDataURL(outputFormat || "image/png")
        callback(dataURL)
        canvas = null
        this.$toast.close(loading)
      }
      img.src = url
    },
    download () {
      this.convertImgToBase64("https://g.smartcinema.com.cn/images/6b089aeee4894a9d9738eac0bf7cd9a6-302-296.png", (base64Img) => {
        this.$windvane.call("HYBaseAbility.saveToPhoto", { imgBase64: env.os.ios ? base64Img : "https://g.smartcinema.com.cn/images/6b089aeee4894a9d9738eac0bf7cd9a6-302-296.png" }).then(() => {
          this.confirmShow = false
        })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.join{
  background: #EDEDED;
  min-height: 100%;
  padding-top: rem(0.1);
  h1{
    font-size: rem(16);
    font-family: PingFangTC-Semibold, PingFangTC;
    font-weight: 600;
    color: #333333;
    line-height: rem(22);
    text-align: center;
    margin: rem(50) 0 rem(40);
  }
  .concat-box{
    width: rem(345);
    height: rem(408);
    margin: 0 auto;
    background: #fff;
    padding-top: rem(0.1);
    border-radius: rem(6);
    .wx-info{
      @include flex($jus: flex-start);
      margin: rem(33) 0 rem(36) rem(26);
      img{
        width: rem(50);
        height: rem(50);
        background: #D8D8D8;
        border-radius: rem(6);
        margin-right: rem(14);
      }
      span{
        font-size: rem(16);
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #333333;
        line-height: rem(22);
      }
    }
    .wx-code{
      font-size: 0;
      width: rem(226);
      height: rem(226);
      margin: 0 auto;
      img{
        width: 100%;
        height: 100%;
        background: #D8D8D8;
      }
    }
    p{
      margin-top: rem(32);
      font-size: rem(12);
      font-family: PingFang-SC-Medium, PingFang-SC;
      font-weight: 500;
      color: #999999;
      line-height: rem(17);
      text-align: center;
    }
  }
}
</style>
