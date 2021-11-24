<template>
  <div class="dialog" v-if="confirmVisiable" @click.self="closable && $emit('close')">
      <div class="dialog-box" :class="{'year': year}">
        <div class="dialog-inner" >
          <header v-if="confirmTitle">{{confirmTitle}}</header>
          <p :style="`color:${msgColor}`" v-html="msg"></p>
          <div>
            <span v-if="cancelText" :style="`color:${cancelTextColor}`" @click="$emit('cancel')" class="close">{{ cancelText }}</span>
            <span v-if="confirmText"  :style="`color:${confirmTextColor}`" @click="$emit('confirm')">{{ confirmText }}</span>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
export default {
  props: {
    confirmTitle: {
      type: String,
      default: ""
    },
    msg: {
      type: String,
      default: ""
    },
    cancelText: {
      type: String,
      default: ""
    },
    confirmText: {
      type: String,
      default: ""
    },
    confirmVisiable: {
      type: Boolean,
      default: false
    },
    closable: {
      type: Boolean,
      default: true
    },
    cancelTextColor: {
      type: String,
      default: ""
    },
    confirmTextColor: {
      type: String,
      default: ""
    },
    msgColor: {
      type: String,
      default: ""
    },
    year: {
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
@media all and (orientation : portrait){
  .dialog{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;
    .dialog-box{
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      box-sizing: border-box;
      padding: rem(10);
      width: rem(295);
      border-radius: rem(8);
        &.year{
        position: relative;
        z-index: 1;
        padding: rem(10);
        background: url(https://g.smartcinema.com.cn/images/4f64d45260b04514a8a4cdc08c60e51c-602-868.png) 0 0 no-repeat;
        background-size: cover;
        // &::before{
        //   content: "";
        //   position: absolute;
        //   top: rem(-4);
        //   left: 0;
        //   width: rem(295);
        //   height: rem(70);
        //   background: url(https://g.smartcinema.com.cn/images/7955c88704c1421ba05cc5c406ffa9ab-600-148.png) 0 0 no-repeat;
        //   background-size: cover;
        //   z-index: 2;
        // }
      }
    }
  }
  .dialog-inner{
    background: rgba(255,255,255,1);
    padding-top: rem(24);
    header{
      font-size: rem(22);
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #333333;
      line-height: rem(30);
      margin-bottom: rem(13);
      text-align: center;
    }
    p{
      padding: 0 rem(22) rem(24);
      font-size:rem(16);
      font-weight:400;
      color:rgba(17,17,17,1);
      line-height:rem(24);
      text-align: center;
    }
    div{
      display: flex;
      align-items: center;
      width: 100%;
      height: rem(48);
      border-top: rem(1) solid rgba(136,136,136,0.28);
      span{
        flex: 1;
        display: flex;
        height: 100%;
        align-items: center;
        justify-content: center;
        font-size:rem(16);
        font-weight:500;
        color:rgba(255,49,74,1);
        box-sizing: border-box;
      }
      .close{
        color: rgba(153,153,153,1);
        border-right: rem(1) solid rgba(136,136,136,0.28);
      }
    }
  }
}
/* 设备横屏时调用该段css代码 */
@media all and (orientation : landscape){
  .dialog{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;
    .dialog-inner{
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: rem(200);
      background: rgba(255,255,255,1);
      border-radius: rem(8);
      p{
        padding: rem(12) rem(11);
        font-size:rem(10);
        font-weight:400;
        color:rgba(17,17,17,1);
        line-height:rem(15);
        text-align: center;
      }
      div{
        display: flex;
        align-items: center;
        width: 100%;
        height: rem(30);
        border-top: rem(1) solid rgba(136,136,136,0.28);
        span{
          flex: 1;
          display: flex;
          height: 100%;
          align-items: center;
          justify-content: center;
          font-size:rem(10);
          font-weight:500;
          color:rgba(255,49,74,1);
          box-sizing: border-box;
        }
        .close{
          color: rgba(153,153,153,1);
          border-right: rem(1) solid rgba(136,136,136,0.28);
        }
      }
    }
  }
}
</style>
