<template>
  <section class="button">
    <button @click="$emit('click')">{{title}}</button>
  </section>
</template>

<script>
export default {
  props: {
    size: {
      type: String,
      default: "large"
    },
    title: {
      type: String,
      default: "按钮"
    }
  },
  data () {
    return {
    }
  }
}
</script>

<style lang="scss" scoped>
.button{
    button{
      @include flex($jus: center);
      width: rem(345);
      height: rem(44);
      line-height: rem(44);
      border-radius:rem(24);
      font-size:rem(16);
      font-weight:500;
      background:rgba(204,140,68,1);
      color: #ffffff;
      margin: 0 auto;
    }
}
</style>
