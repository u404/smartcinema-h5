<template>
  <section class="sub-title">
    <p class="text">{{title}}</p>
    <slot></slot>
  </section>
</template>

<script>
export default {
  props: {
    title: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
    }
  }
}
</script>

<style lang="scss" scoped>
.sub-title{
    width: 100%;
    padding:rem(30) rem(15) rem(20);
    box-sizing: border-box;
    @include flex;
    .text{
      height:rem(22);
      font-size:rem(16);
      font-weight:700;
      color:rgba(51,51,51,1);
      line-height:rem(22);
      text-indent:rem(9);
      position: relative;
      &::before{
          content: "";
          position: absolute;
          width: rem(2);
          height: rem(14);
          border-radius: rem(2);
          background-color: #333333;
          left: 0;
          top: 0;
          bottom: 0;
          margin: auto;
      }
    }
}
</style>
