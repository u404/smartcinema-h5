<template>
  <section class="comment">
    <sub-title title="评论" />
    <section class="write">
      <textarea maxlength="420" v-model="commentText" placeholder="请输入评论内容"></textarea>
      <aside class="number">剩余<span>{{fontNo}}</span>个字符</aside>
    </section>
  </section>
</template>

<script>
import SubTitle from "@/components/SubTitle"
export default {
  components: {
    SubTitle
  },
  data () {
    return {
      commentText: ""
    }
  },
  methods: {},
  computed: {
    fontNo () {
      return 420 - this.commentText.length
    }
  }
}
</script>

<style lang="scss" scoped>
.comment {
  background: rgba(247, 247, 247, 1);
  min-height: 100vh;
  .write{
    width:rem(345);
    height:rem(273);
    background:rgba(255,255,255,1);
    border-radius:rem(4);
    margin: 0 auto;
    position: relative;
    textarea{
      border: none;
      resize:none;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      padding:rem(10) rem(12) rem(40);
      font-size:rem(16);
      font-weight:400;
      color:rgba(153,153,153,1);
      line-height:rem(24);
      word-spacing: all;
    }
    .number{
      position: absolute;
      bottom: rem(12);
      right: rem(10);
      height:rem(16);
      font-size:rem(12);
      font-weight:400;
      color:rgba(102,102,102,1);
      line-height:rem(16);
      span{
        color: #CC8C44;
        padding: 0 rem(6);
      }
    }
  }
}
</style>
