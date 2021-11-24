<template>
  <section @click="$emit('listClick')" :class="{ 'list': true, 'border': border}">
    <article class="title">
      <p class="label"><img v-if="icon" class="icon" :src="icon" />{{label}}</p>
      <p class="arrow" v-if="arrow"><slot name="t_attr"></slot></p>
    </article>
    <slot></slot>
  </section>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default: ""
    },
    arrow: {
      type: Boolean,
      default: false
    },
    border: {
      type: Boolean,
      default: true
    },
    icon: {
      type: String,
      default: ""
    }
  },
  data () {
    return {
    }
  }
}
</script>

<style lang="scss" scoped>
.list{
    padding: rem(20)  0;
    position: relative;
    .title{
      @include flex;
      margin-left: rem(15);
      padding-right:rem(15);
    }
    p{
      height:rem(20);
      font-size:rem(14);
      font-weight:400;
      color:rgba(51,51,51,1);
      line-height:rem(20);
    }
    .label{
      @include flex;
      img{
        width: rem(16);
        height: rem(16);
        margin-right: rem(10);
      }
    }
    .arrow{
      min-height: rem(14);
      padding-right: rem(20);
      background: url(https://g.smartcinema.com.cn/images/8cb5474f9d294ce19766838ccba577b2-28-28.png) center right no-repeat;
      background-size: rem(14);
    }
}
.border::after{
  content: "";
  width: rem(345);
  display: block;
  margin: 0 auto;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  border-bottom: rem(1) solid #E3E3E3;
}
</style>
