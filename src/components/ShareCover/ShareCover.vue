
<template>
  <div class="share-container" v-if="coverVisiable" @click.self="close">
    <div class="share-tips"></div>
  </div>
</template>

<script>
export default {
  props: {
    coverVisiable: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    show () {
      this.coverVisiable = true
    }
  }
}
</script>

<style lang="scss" scoped>
.share-container{
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background:rgba(0, 0, 0, 0.85);
  z-index: 1000;
  .share-tips{
    width: rem(126);
    height: rem(62);
    position: absolute;
    top: rem(9);
    right: rem(24);
    background: url(https://g.smartcinema.com.cn/images/df51abfc2c424e4594b8ca3ebd24144a-252-124.png) 0 0 no-repeat;
    background-size: cover;
  }
}
</style>
