<template>
  <div class="refund-detail">
    <div class="refund-detail-head">
      <div class="refund-info">
        <p>商家处理中</p>
        <p class="refund-time">还剩余{{time}}</p>
      </div>
    </div>
    <div class="refund-detail-main">
      <h2>您已成功发起退款申请，请耐心等待商家处理</h2>
      <div class="refund-detail-desc">
        <p>● 商家同意或者超时未处理，系统将退款给您</p>
        <p>● 如果商家拒绝，您可以修改退款申请后再次发起，商家会重新处理</p>
      </div>
      <div class="refund-detail-digest">
        <h4>退款信息</h4>
        <FilmCard  :filmData="filmData" />
        <div class="refund-detail-reason">
          <p>退款原因：退费</p>
          <p>退款金额：¥ {{refundFee}}</p>
          <p>申请时间：{{refundTime}}</p>
        </div>
      </div>
      <div class="comment-btn" @click.stop="toComment">去评论</div>
    </div>
  </div>
</template>
<script>
import FilmCard from "@/components/FilmCard"
import utils from "@/common/scripts/utils"
export default {
  components: {
    FilmCard
  },
  data () {
    return {
      filmData: {},
      refundFee: 0,
      time: "",
      timeIntervel: "",
      from: ""
    }
  },
  destroyed () {
    clearInterval(this.timeIntervel)
  },
  async mounted () {
    this.from = this.$route.query.from || ""
    this.refundFee = this.$route.query.refundFee || 0
    const loading = this.$toast.showLoading()
    let [err, data] = await utils.to(
      this.$services.home.getFridayFilmDetail()
    )
    this.$toast.close(loading)
    if (err) {
      this.$toast.showToast(err.msg)
    }
    this.filmData = data
    // 倒计时
    var oldtime = new Date() // 传入的时间
    oldtime = oldtime.setDate(oldtime.getDate() + 1)// 模拟24小时后的时间
    // 时间换算

    this.timeIntervel = setInterval(() => {
      this.time = this.timer(oldtime)
    }, 1000)
  },
  methods: {
    timer (oldtime) {
      var newtime = new Date()
      var time = (oldtime - newtime) / 1000
      var h = parseInt(time / 60 / 60 % 24)
      var m = parseInt(time / 60 % 60)
      var s = parseInt(time % 60)
      return h + "小时" + m + "分钟" + s + "秒"
    },
    toComment () {
      this.$sensors.track("refund_finish_comment", {
        sku_id: this.filmData.skuId,
        film_name: this.filmData.filmNameCn,
        play_progress: this.filmData.playProgress ? (Number(this.filmData.playProgress / 60).toFixed(2) || 0) : 0
      }, () => {
        this.$router.replace({ name: "praise", query: { type: "comment", from: this.from } })
      })
    }
  },
  computed: {
    refundTime () {
      var date = new Date(this.filmData.refundApplyTime * 1000)// 时间戳为10位需*1000，时间戳为13位的话不需乘1000
      var Y = date.getFullYear() + "-"
      var M = (date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1) + "-"
      var D = (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + " "
      var h = (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ":"
      var m = (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) + ":"
      var s = (date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds())

      let strDate = Y + M + D + h + m + s
      return strDate
    }
  }
}
</script>
<style lang="scss" scoped>
.refund-detail{
  background: rgba(18, 18, 18, 1);
  padding: rem(0.1) 0 rem(10);
  min-height: 100%;
  .refund-detail-head{
    width: rem(345);
    height: rem(132);
    margin: rem(17) auto rem(15);
    background: url(https://g.smartcinema.com.cn/images/b01f9eceab7242aa947cc98c886205f3-120-116.png) rem(229) center no-repeat;
    background-size: rem(60) rem(58);
    background-color: rgba(29, 29, 29, 1);
    .refund-info{
      padding: rem(40) 0 0 rem(16);
      p{
        font-size: rem(20);
        font-family: PingFang-SC-Bold, PingFang-SC;
        font-weight: bold;
        color: #FFFFFF;
        line-height: rem(28);
      }
      .refund-time{
        font-weight: 500;
        font-size: rem(12);
        line-height: rem(17);
        margin-top: rem(10);
      }
    }
  }
  .refund-detail-main{
    width: rem(345);
    height: rem(536);
    margin: 0 auto;
    padding: rem(0.1) rem(15) 0;
    background-color: rgba(29, 29, 29, 1);
    h2{
      font-size: rem(14);
      font-family: PingFang-SC-Medium, PingFang-SC;
      font-weight: normal;
      color: #ECECEC;
      line-height: rem(20);
      margin: rem(17) 0;
    }
    .refund-detail-desc{
      padding: rem(30) 0;
      border-top: rem(1) solid rgba(255, 255, 255,0.08);
      border-bottom: rem(1) solid rgba(255, 255, 255,0.08);
      p{
        font-size: rem(12);
        font-family: PingFang-SC-Medium, PingFang-SC;
        font-weight: normal;
        color: #666666;
        line-height: rem(18);
      }
    }
    .refund-detail-digest{
      h4{
        font-size: rem(15);
        font-family: PingFang-SC-Medium, PingFang-SC;
        font-weight: normal;
        color: #ECECEC;
        line-height: rem(21);
        margin: rem(17) 0 rem(20);
      }
      .refund-detail-reason{
        margin-top: rem(22);
        p{
          font-size: rem(12);
          font-family: PingFang-SC-Medium, PingFang-SC;
          font-weight: normal;
          color: #999999;
          line-height: rem(12);
          margin-bottom: rem(8);
        }
      }
    }
    .comment-btn{
      width: rem(80);
      height: rem(36);
      border-radius: rem(16);
      background: linear-gradient(left top, #E8BF8F , #CC9361);
      font-size: rem(16);
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #40373E;
      line-height: rem(36);
      text-align: center;
      float: right;
      margin-top: rem(36);
    }
  }
}
</style>
