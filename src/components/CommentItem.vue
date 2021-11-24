<template>
  <section class="comment-item">
      <header class="author">
        <div>
          <img :src="comment.userImage || 'https://g.smartcinema.com.cn/images/a49edc503dee4ea0a3d4243a36d4e20c-160-160.png'" />
          <div class="info">
            <span :style="{color}">{{comment.userName}}</span>
            <span class="time">{{comment.createTime}}</span>
          </div>
        </div>
        <div>
          <slot></slot>
        </div>
      </header>
      <p class="context"><ellipsis-text revealText="更多" line="5" :content="comment.content"></ellipsis-text></p>
      <div class="like-container">
        <img @click.stop="$emit('like',comment)" class="favorite" :src=" comment.like?'https://g.smartcinema.com.cn/images/bb29fc807e1946fcaa14a42f8e6f3618-36-38.png':'https://g.smartcinema.com.cn/images/8b14429d63fa4021acb2110af7fd9061-36-38.png'">
        <span>{{comment.totalNum}}</span>
      </div>
  </section>
</template>

<script>
import EllipsisText from "./EllipsisText"
export default {
  props: {
    comment: {
      type: Object,
      default: () => {}
    },
    color: {
      type: String,
      default: "#ffffff"
    }
  },
  components: {
    EllipsisText
  }
}
</script>

<style lang="scss" scoped>
.comment-item{
  width: 100%;
  padding:0 rem(15) rem(35);
  box-sizing: border-box;
  .author{
    font-size: 0;
    @include flex($jus:space-between ,$ali:center);
    &>div{
      @include flex($jus:flex-start ,$ali:center);
    }
    img{
      width: rem(40);
      height: rem(40);
      border-radius: 50%;
      margin-right: rem(10);
    }
    span{
      font-size:rem(14);
      font-weight:bold;
      font-family: PingFangSC-Semibold, PingFang SC;
      color:rgba(51,51,51,1);
      line-height:rem(20);
    }
    .like-num{
      width: rem(30);
    }
    .info{
      @include flex($flow: column,$ali:flex-start,$jus:space-between);
      height: rem(40);
      .time{
        font-size: rem(11);
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(255, 255, 255, 0.56);
        line-height: rem(16);
      }
    }

    .favorite{
      width: rem(18);
      height: rem(18);
      margin-right: rem(2);
    }
  }
  .context{
    font-size:rem(13);
    font-weight:500;
    color:rgba(255, 255, 255, 0.6);
    line-height:rem(18);
    margin-top: rem(9);
  }
  .like-container{
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-top: rem(8);
    .favorite{
      width: rem(18);
      height: rem(18);
      margin-right: rem(2);
    }
    span{
      width: rem(30);
      height:rem(16);
      font-size:rem(14);
      font-weight:bold;
      color:rgba(51,51,51,1);
      line-height:rem(16);
      margin-left: rem(2);
    }
  }
}
</style>
