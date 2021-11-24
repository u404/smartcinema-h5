<template>
  <section class="contact">
    <sub-title title="联系客服" />
    <section class="input-container">
      <input type="text" v-model="contact"  placeholder="[选填]请留下您的联系方式，邮箱、QQ、或手机号"/>
    </section>
    <section class="write">
      <textarea maxlength="200" v-model="text" placeholder="请输入您想反馈的问题"></textarea>
      <aside class="number"><span>{{fontNo}}</span>/200</aside>
      <article class="upload">
        <label for=""></label>
      </article>
    </section>
    <v-button title="提交反馈"></v-button>
  </section>
</template>

<script>
import SubTitle from "@/components/SubTitle"
import VButton from "@/components/VButton"
export default {
  components: {
    SubTitle, VButton
  },
  data () {
    return {
      text: "",
      contact: ""
    }
  },
  methods: {},
  computed: {
    fontNo () {
      return 200 - this.text.length
    }
  }
}
</script>

<style lang="scss" scoped>
.contact {
  background: rgba(247, 247, 247, 1);
  min-height: 100vh;
  .input-container,.write{
    width:rem(345);
    background:rgba(255,255,255,1);
    border-radius:rem(4);
    margin: 0 auto;
    position: relative;
    margin-bottom: rem(15);
  }
  .input-container{
    height:rem(46);
    input[type="text"]{
      border: none;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      padding: rem(11) rem(12);
      font-size:rem(14);
      font-weight:400;
      color:rgba(153,153,153,1);
      line-height:rem(24);
    }
  }
  .write{
    height:rem(280);
    margin-bottom: rem(30);
    textarea{
      border: none;
      resize:none;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      padding:rem(10) rem(12) rem(84);
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
        // color: #CC8C44;
        padding: 0 rem(6);
      }
    }
    .upload{
      position: absolute;
      left: rem(13);
      bottom: rem(13);
      label{
        display: block;
        width: rem(60);
        height: rem(60);
        background: url(https://g.smartcinema.com.cn/images/51ab724fd2be483c831a79c28fb40358-120-120.png) no-repeat;
        background-size: 100% 100%;
      }
    }
  }
}
</style>
