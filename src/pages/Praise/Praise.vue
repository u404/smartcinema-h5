<template>
  <div class="praise">
    <div class="film-container">
      <film-card :filmData="filmData" ></film-card>
    </div>
    <div class="comment-container">
      <div v-if="type==='comment'">
        <star-rate :allow-clear="false" active-color="#FFC000" font-size="0.8rem" v-model="score" />
        <div class="tags">
          <span v-for="(item,index) in currentTags" @click="checkTagHandle(item)" :key="index" :class="{'tag-active': (checkTags.indexOf(item) > -1)}" >{{item}}</span>
        </div>
        <div class="comment-box">
          <textarea class="input-hook" @blur.prevent="changeBlur" maxlength="420" v-model="content" placeholder='为感动付费金牌评审团自由点评'></textarea>
          <aside class="number" v-if="fontNo">首次评论15字可领<span>10</span>积分</aside>
        </div>
      </div>
      <div class="refund-tags" v-if="type==='refund'&&filmData.refundStatus === -1">
        <h3><span>自定义退费金额</span><span class="all" @click="refundNum = refundFee ">全部退款</span></h3>
        <input class="input-hook"  @blur.prevent="changeBlur" type="number" v-model="refundNum" :placeholder="`当前最大可退金额为${refundFee}元`" ref="refundInput" />
      </div>
      <div class="reward-tags" v-if="type==='reward'">
        <h3>选择感动付费金额</h3>
        <div class="amount">
          <span @click="checkAmountHandle(item)" :class="{'amount-active': rewardAmount == item && rewardNum !== rewardAmount}" v-for="(item, index) in amounts" :key="index">{{item}}<b>元</b></span>
          <span @click="checkAmountHandle(rewardNum)" :class="{'amount-active': (rewardAmount == rewardNum && rewardNum)}"><input class="input-hook"  @blur.prevent="changeBlur" type="number" v-model="rewardNum" placeholder="自定义金额"  ref="rewardInput"/></span>
        </div>
      </div>
      <div :class="{'praise-btn':true, disable: !btnDisable}"  @click.stop="submitHandle">确认</div>
    </div>
    <div class="result" v-show="isPay">
      <ul>
        <li class="close-btn" @click="isPay = false"></li>
        <li >请确认微信支付是否已完成</li>
        <li @click.stop="paySuccessHandle"><v-button title="已完成支付"></v-button></li>
        <li @click.stop="payFailedHandle">遇到问题，重新支付</li>
      </ul>
    </div>
    <sc-confirm :closable="false" :confirmVisiable="confirmShow" :msg="confirmMsg[type].msg" :cancelText="confirmMsg[type].cancelText" :confirmText="confirmMsg[type].confirmText" @cancel="from==='week'?toMoviePlayPage():cancelConfirmHandle()" @confirm="from==='week'?cancelConfirmHandle():toMoviePlayPage()" ></sc-confirm>
  </div>
</template>
<script>
import { mapMutations } from "vuex"
import FilmCard from "@/components/FilmCard"
import VButton from "@/components/VButton"
import StarRate from "vue-cute-rate"
import utils from "@/common/scripts/utils"
import env from "@sc/lib-env"
import axios from "@sc/lib-axios"
import ScConfirm from "@/components/ScConfirm"
export default {
  components: {
    FilmCard, StarRate, VButton, ScConfirm
  },
  inject: ["reload"],
  data () {
    return {
      content: "",
      score: 0,
      checkTags: [],
      tags: {
        refund: ["演技尴尬", "音乐跳戏", "题材老套", "主旨不明"],
        reward: ["演技在线", "神仙剧本", "视效惊艳", "音乐好评", "题材新颖", "镜头表达精准"]
      },
      refundNum: "",
      type: "refund",
      rewardNum: "",
      rewardAmount: -1,
      amounts: [10, 8, 6, 5, 2],
      commentTargetId: "",
      filmData: {},
      rewardId: "",
      confirmShow: false,
      times: 0,
      loading: false,
      isPay: false,
      refundFee: 0,
      from: "",
      confirmMsg: {
        reward: {
          msg: "您的心意已收到,感谢鼓励！",
          confirmText: "继续观影",
          cancelText: "去评论"
        },
        refund: {
          msg: "您已完成退费，来写点评论吧！",
          confirmText: "继续观影",
          cancelText: "去评论"
        },
        comment: {
          msg: "评论完成，感谢您的反馈",
          confirmText: "继续观影",
          cancelText: "互动进群"
        }
      }
    }
  },
  computed: {
    fontNo () {
      return 15 - this.content.length > 0 ? 15 - this.content.length : 0
    },
    currentTags () {
      let arr = []
      let tags = this.score && this.tags[this.score >= 3 ? "reward" : "refund"]
      this.checkTags.length && this.checkTags.forEach((item, index) => {
        if (tags.indexOf(item) > -1) {
          arr.push(item)
        }
      })
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.checkTags = arr
      return tags
    },
    btnDisable () {
      let disabled
      switch (this.type) {
        case "reward":
          disabled = Number(this.rewardAmount) > 0
          break
        case "refund":
          disabled = Number(this.refundNum) > 0
          break
        case "comment":
          disabled = this.score > 0 || !!this.content || this.checkTags.length > 0
          break
      }
      return disabled
    }
  },
  watch: {
    refundNum (v, ov) {
      if ((!/((^[1-9]\d*)|^0)(\.\d{0,2}){0,1}$/.test(v) && v !== "")) {
        this.refundNum = ov
      }
      if (Number(v) > this.refundFee) {
        this.refundNum = this.refundFee
      }
    },
    rewardNum (v, ov) {
      if ((!/((^[1-9]\d*)|^0)(\.\d{0,2}){0,1}$/.test(v) && v !== "")) {
        this.rewardNum = ov
      }
      this.rewardAmount = this.rewardNum || 0
    }
  },
  methods: {
    ...mapMutations(["RECORD_USERINFO"]),
    cancelConfirmHandle () {
      this.confirmShow = false
      if (this.type === "comment") {
        this.$router.replace({ name: "join" })
      } else {
        let from = this.from
        this.$router.replace({ name: "praise", query: { type: "comment", from } })
        this.reload()
      }
    },
    toMoviePlayPage () {
      if (this.from === "week") {
        this.$router.replace({ name: "week" })
      } else {
        this.$windvane.call("WVBaseUI.closeWebView")
      }
    },
    changeBlur () {
      if (env.os.ios) {
        setTimeout(() => {
          const scrollHeight = document.documentElement.scrollTop || document.body.scrollTop || 0
          window.scrollTo(0, Math.max(scrollHeight - 1, 0))
        }, 200)
      }
    },
    checkAmountHandle (item) {
      this.rewardAmount = item
    },
    checkTagHandle (item) {
      if (this.checkTags.indexOf(item) > -1) {
        this.checkTags.splice(this.checkTags.indexOf(item), 1)
      } else {
        this.checkTags.push(item)
      }
    },
    async submitHandle () {
      if (!this.btnDisable) return
      console.log("click")
      const loading = this.$toast.showLoading()
      if (this.type === "reward") {
        if (Number(this.rewardAmount) > 0) {
          let h5RunEnv = env.browser.inApp && env.os.ios ? 2 : 5
          let ticketNo = this.filmData.ticketNo
          let rewardFee = parseFloat(this.rewardAmount).toFixed(2)
          if (env.browser.inApp && env.os.ios) {
            // eslint-disable-next-line no-unused-vars
            let [err, data] = await utils.to(this.$services.order.payReward({ h5RunEnv, ticketNo, rewardFee }))
            if (err) {
              this.$toast.close(loading)
              this.$toast.showToast(err.msg)
              return
            }
            let nurl = `${location.origin}${location.pathname}#/praise?type=${this.type}&pay=1&rewardId=${data.rewardId}&from=${this.from}`
            let url = data.mwebUrl
            setTimeout(() => {
              this.rewardId = data.rewardId
              this.isPay = true
              this.$toast.close(loading)
            }, 2000)
            location.replace(nurl)
            location.replace(url)
          } else {
            this.$windvane.call("SCHYUIInterface.webOpenNativeReward", { ticketNo, rewardFee })
            setTimeout(() => {
              this.$toast.close(loading)
              this.isPay = true
            }, 2000)
          }
        } else {
          this.$toast.close(loading)
        }
      } else if (this.type === "refund") {
        if (Number(this.refundNum) > 0) {
          let ticketNo = this.filmData.ticketNo
          let refundType = 1
          let refundFee = parseFloat(this.refundNum).toFixed(2)
          // eslint-disable-next-line no-unused-vars
          let [err, data] = await utils.to(this.$services.order.payRefund({ refundType, ticketNo, refundFee, reason: "退费" }))
          this.$toast.close(loading)
          if (!err) {
            this.refundNum = ""
            this.$router.replace({ name: "refundDetail", query: { refundFee, from: this.from } })
          } else {
            if (err.msg === "已退款") {
              this.refundNum = ""
              this.$router.replace({ name: "refundDetail", query: { refundFee, from: this.from } })
            } else {
              this.$toast.showToast(err.msg)
            }
          }
        } else {
          this.$toast.close(loading)
        }
      } else if (this.type === "comment") {
        this.$toast.close(loading)
        this.addCommentHandle()
      }
    },
    async addCommentHandle (confirm = true) {
      const loading = this.$toast.showLoading()
      let commentTargetId = this.commentTargetId
      let content = this.content || "此用户没有填写评论。"
      let score = this.score
      let type = 9
      let tags = this.checkTags.length > 0 ? this.checkTags.join(",") : ""
      // eslint-disable-next-line no-unused-vars
      let [err, data] = await utils.to(this.$services.comment.addComment({ commentTargetId, content, score, type, tags }))
      this.$toast.close(loading)
      if (err) {
        this.$toast.showToast(err.msg)
        return
      }
      confirm && (this.confirmShow = true)
    },
    // 支付结果查询
    async getResultHandle (count, success) {
      let timer
      // eslint-disable-next-line no-unused-vars
      let [err, data] = await utils.to(this.$services.order.getRewardNotify({ rewardId: this.rewardId }))
      if (err) {
        this.times++
        timer = setTimeout(() => {
          if (this.times >= count) {
            this.$toast.close(this.loading)
            if (success) {
              this.$toast.showToast("查询失败，请重试")
            } else {
              this.isPay = false
            }
            this.times = 0
            return false
          } else {
            this.getResultHandle(count, success)
            clearTimeout(timer)
          }
        }, 2000)
      } else {
        this.$sensors.track("reward_finish_comment", {
          sku_id: this.filmData.skuId,
          film_name: this.filmData.filmNameCn,
          play_progress: this.filmData.playProgress ? (Number(this.filmData.playProgress / 60).toFixed(2) || 0) : 0
        }, () => {
          this.$toast.close(this.loading)
          this.isPay = false
          this.confirmShow = true
        })
      }
    },
    // 支付成功
    async paySuccessHandle () {
      if (!this.rewardId) {
        this.isPay = false
        return
      }
      this.loading = this.$toast.showLoading()
      this.getResultHandle(5, true)
    },
    // 点击支付失败，弹窗关闭
    payFailedHandle () {
      if (!this.rewardId) {
        this.isPay = false
        return
      }
      this.loading = this.$toast.showLoading()
      this.getResultHandle(2, false)
    },
    async fetchData () {
      this.rewardId = this.$route.query.rewardId || ""
      this.isPay = !!this.$route.query.pay
      const loading = this.$toast.showLoading()
      let [err, data] = await utils.to(
        this.$services.home.getFridayFilmDetail()
      )
      this.$toast.close(loading)
      if (err) {
        this.$toast.showToast(err.msg)
      }
      this.filmData = data
      this.commentTargetId = data.filmId
      this.refundFee = data.refundFee
      if (this.type === "refund" && data.refundStatus !== -1) {
        this.confirmShow = true
      }
    },
    systemRewardEvent (obj) {
      this.rewardId = obj.rewardId
      if (!this.rewardId) {
        this.isPay = false
      }
    }
  },
  async mounted () {
    this.type = this.$route.query.type
    this.from = this.$route.query.from || ""
    if (this.from === "week") {
      this.$set(this.confirmMsg[this.type], "confirmText", this.confirmMsg[this.type].cancelText)
      this.$set(this.confirmMsg[this.type], "cancelText", "回到首页")
    }
    if (env.browser.inApp) {
      this.$windvane
        .call("SCHYDataInterface.getUserInfo")
        .then(async ({ data, success }) => {
          if (success && data.u_token) {
            this.$sensors.login(data.u_id)
            axios.setUserToken(data.u_token)
            this.RECORD_USERINFO(data)
            this.fetchData()
          }
        })
        .catch(() => {})
      if (!env.os.ios) {
        new CustomEvent("SCHYUIInterface_rewardSuccess")
        window.addEventListener("SCHYUIInterface_rewardSuccess", (event) => {
          this.systemRewardEvent(event.data)
        })
        const el = document.documentElement || document.body
        const originHeight = el.clientHeight
        document.body.style.height = el.clientHeight + "px"
        window.addEventListener("resize", () => {
          const resizeHeight = el.clientHeight
          if (resizeHeight < originHeight) {
          } else {
            const likeArray = document.getElementsByClassName("input-hook")
            Array.from(likeArray, input => input.blur())
          }
        }, false)
      } else {
        this.$windvane.call("HYBaseDevice.getDeviceInfo").then(res => {
          let v = res.data.osVersion.split(".")[0]
          if (v >= 14) {
            this.$windvane.call("HYBaseAbility.closeKeyBoardToolBar")
            document.addEventListener("click", (e) => {
              try {
                if (!this.$refs.contentInput.contains(e.target) && ((this.type === "refund" && !this.$refs.refundInput.contains(e.target)) || (this.type === "reward" && !this.$refs.rewardInput.contains(e.target)))) {
                  this.type === "refund" && this.$refs.refundInput.blur()
                  this.type === "reward" && this.$refs.rewardInput.blur()
                  this.$refs.contentInput.blur()
                }
              } catch (error) {}
            })
          }
        })
      }
    } else { this.fetchData() }
  }
}
</script>
<style lang="scss" scoped>
.praise{
  background: rgba(18, 18, 18, 1);
  min-height: 100%;
  padding: rem(0.1) 0 rem(10);
  @include flex($flow: column);
  .film-container{
    width: rem(345);
    margin: rem(17) auto rem(10);
    background: rgba(29, 29, 29, 1);
    padding: rem(13) 0 rem(19) rem(15);
  }
  /deep/ .star-main{
    margin-left: rem(20);
  }
  .comment-container{
    flex:1;
    margin: 0 rem(15) rem(10);
    padding: rem(20) rem(15) rem(12);
    background: rgba(29, 29, 29, 1);
    @include flex($flow:column,$jus:space-between,$ali:flex-start);
    /deep/ .star-full{
      margin-right: rem(30);
      &:last-of-type{
        margin-right: 0;
      }
    }
    .tags{
      margin: rem(10) 0 rem(15);
      font-size: 0;
      span{
        display: inline-block;
        padding: rem(4) rem(8);
        font-size: rem(11);
        font-family: PingFang-SC-Medium, PingFang-SC;
        font-weight: 500;
        color: #999999;
        line-height: rem(16);
        border-radius: rem(15);
        border: rem(1) solid #979797;
        margin: 0 0 rem(8) rem(10);
        box-sizing: border-box;
      }
      .tag-active{
        border: rem(1) solid #FFFFFF;
        color: #FFFFFF;
      }
    }
    .comment-box{
      width: rem(315);
      height:rem(154);
      border-radius:rem(4);
      margin: 0 auto;
      position: relative;
      textarea{
        resize:none;
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        padding:rem(10) rem(12) rem(40);
        font-size:rem(16);
        font-weight:400;
        color:rgba(153,153,153,1);
        line-height:rem(24);
        word-break: break-all;
        background: rgba(216,216,216,0.04);
        border: none !important;
        cursor: pointer;
      }
      .number{
        position: absolute;
        bottom: rem(10);
        left: rem(15);
        height:rem(16);
        font-size:rem(12);
        font-weight:400;
        color:rgba(102,102,102,1);
        line-height:rem(16);
        span{
          color: #FF314A;
          padding: 0 rem(6);
        }
      }
    }
    .refund-tags{
      width: 100%;
      h3{
        @include flex($jus: space-between);
        margin: rem(24) 0 rem(10);
        span{
          font-size: rem(15);
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #FFFFFF;
          line-height: rem(21);
        }
        .all{
          color: #999990;
        }
      }
      input{
        width: 100%;
        height: 100%;
        border: none;
        background: transparent;
        font-size: rem(14);
        font-family: PingFang-SC-Medium, PingFang-SC;
        font-weight: 500;
        color: #ffffff;
        line-height: rem(20);
        padding-bottom: rem(20);
      }
      ::-webkit-input-placeholder { /* WebKit browsers */
        color: #999;
        font-size: rem(14);
      }
    }
    .reward-tags{
      h3{
        margin: rem(20) 0;
        font-size: rem(18);
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #FFFFFF;
        line-height: rem(25);
      }
      .amount{
        span{
          display: inline-block;
          width: rem(90);
          height: rem(40);
          border-radius: rem(4);
          border: rem(1) solid rgba(232, 191, 143, 0.5);
          font-size: rem(20);
          font-family: PingFang-SC-Bold, PingFang-SC;
          font-weight: bold;
          color: #E8BF8F;
          line-height: rem(40);
          text-align: center;
          margin:0 rem(22) rem(15) 0;
          box-sizing: border-box;
          &:nth-of-type(3),&:nth-of-type(6){
            margin-right: 0;
          }
          b{
            font-size: rem(12);
          }
          input{
            @include flex($ali: center);
            width: 100%;
            height: 100%;
            background: transparent;
            border: none;
            text-align: center;
            color: rgba(232, 191, 143, 1);
          }
          ::-webkit-input-placeholder { /* WebKit browsers */
            color: rgba(232, 191, 143, 1);
            font-size: rem(14);
          }
        }
        .amount-active{
          background: rgba(232, 191, 143, 1);
          color: #40373E;
          input{
            color: #40373E;
          }
        }
      }
    }
    .praise-btn{
      width: rem(315);
      height: rem(52);
      margin-top: rem(20);
      // background: url(https://g.smartcinema.com.cn/images/e1743944e1174520aa81a2bc98f04ad3-630-104.png) 0 0 no-repeat;
      // background-size: rem(315) rem(52);
      background: linear-gradient(left top, #E8BF8F , #CC9361);
      font-size: rem(18);
      border-radius: rem(26);
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: bold;
      color: #40373E;
      text-align: center;
      line-height: rem(52);
    }
    .disable{
      background:#666666 ;
      color: #999999;
    }
  }
  .result{
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background: rgba(0,0,0,.5);
    ul{
      position: absolute;
      width: getRem375(285);
      transform: translate(-50%, -50%);
      top: 50%;
      left: 50%;
      background: #ffffff;
      border-radius: getRem375(4);
      padding: getRem375(40) getRem375(22) getRem375(20);
      .close-btn{
        position: absolute;
        right: rem(-30);
        top: rem(-30);
        width: rem(30);
        height: rem(30);
        background: url(https://g.smartcinema.com.cn/images/973ac889e8074a7ea60bf9620ce86747-62-62.png) 0 0 no-repeat;
        background-size: 100% 100%;
      }
      li{
        @include flex($jus: center);
        color: rgba(17, 17, 17, 1);
        font-size: getRem375(18);
        &:nth-of-type(2){
          height:getRem375(25);
          font-size:getRem375(18);
          font-weight:700;
          color:rgba(51,51,51,1);
          line-height:getRem375(25);
        }
        &:last-of-type{
          height:getRem375(22);
          font-size:getRem375(16);
          font-weight:400;
          color:rgba(102,102,102,1);
          line-height:getRem375(22);
        }
        /deep/ .button {
          position: relative;
          bottom: 0;
          margin: getRem375(35) 0 getRem375(20);
          button{
            width: getRem375(240);
          }
        }
      }
    }
  }
}
</style>
