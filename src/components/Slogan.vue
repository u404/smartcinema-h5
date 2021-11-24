<template>
  <section class="slogan" v-if="show">
    <p><img src="https://g.smartcinema.com.cn/images/2b6c630950c34f1691e56503e98f60d6-294-44.png"/></p>
    <p class="download" @click="confirmShow = true">下载</p>
    <span class="close-btn" @click="$emit('close')"></span>
    <sc-confirm :confirmVisiable="confirmShow" msg="下载移动电影院APP" @cancel="confirmShow = false" @confirm="downLoadHandle" confirmText="确定" cancelText="取消" ></sc-confirm>
  </section>
</template>

<script>
import ScConfirm from "./ScConfirm"
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  components: {
    ScConfirm
  },
  data () {
    return {
      confirmShow: false
    }
  },
  methods: {
    downLoadHandle () {
      this.$sensors.track("h5_app_download")
      this.confirmShow = false
      this.$callapp.gotoPage()
    }
  }
}
</script>

<style lang="scss" scoped>
.slogan{
    width: 100%;
    padding:0 rem(15);
    height: rem(56);
    box-sizing: border-box;
    background: #000000;
    z-index: 999;
    @include flex;
    .download{
      width: rem(76);
      height: rem(26);
      background: url(https://g.smartcinema.com.cn/images/3efd06aaaa5f4ee3835f45383bf3a774-152-52.png);
      background-size: 100% 100%;
      @include flex($jus:center);
      font-size:rem(12);
      font-weight:500;
      color:rgba(255,255,255,1);
      line-height:rem(17);
      margin-left: rem(70);
    }
    img{
      width: rem(146);
      height: rem(22);
    }
    .close-btn{
      width: rem(20);
      height: rem(20);
      background: url(https://g.smartcinema.com.cn/images/bcc537e4bd7c426493cc5440fb992249-120-120.png);
      background-size: 100% 100%;
    }
}
</style>
