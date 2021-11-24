<template>
  <section :class="{'national':true,'ruleShow':ruleCover}">
    <div class="rule-btn" @click="ruleCoverClickHandle">活动规则</div>
    <div class="comment">
      <img src="https://g.smartcinema.com.cn/images/19aa94b6d87b47e6bb3289304d604903-690-640.jpg" />
    </div>
    <div class="list" v-if="dataList" :style="isBuy?'':'padding-bottom: 1.6rem;'">
      <div class="item" v-for="item in dataList" :key="item.filmId" @click.stop="toDetailPage(item)">
        <div class="thumb">
          <img :src="`${item.imageUrl}`" alt/>
        </div>
        <div class="info">
          <div class="name">{{item.filmName}}</div>
        </div>
        <div class="btn">
          <button :class="{disable: item.ticketStatus===2 &&item.ticketNo }"  @click.stop="onItemClicked(item)">{{item.ticketNo?(item.ticketStatus ===2?"已观影":"观影"):"查看"}}</button>
        </div>
      </div>
    </div>
    <!-- 规则 -->
    <section class="rule-container" @click.self="ruleCover = false" v-if="ruleCover">
      <article class="rule-wrapper">
        <section class="rule">
          <h2><span class="title">活动规则</span></h2>
          <article class="context-container">
            <section class="context-wrapper">
              <p class="subtitle">【活动时间】</p>
              <p>2020年10月1日00:00:00—2020年10月8日23:59:59</p>
              <p class="subtitle">【活动玩法】</p>
              <p> 活动期间，用户付5元购买1份“双节通兑影券“，即可观看全部活动影片。</p>
              <p>1.限活动期间观看，不限影片，但每部影片仅限观看1次；</p>
              <p>2.每位用户仅限购买1份</p>
              <p>3.仅限10月1日-10月8日使用观影，过期作废。</p>
              <p class="subtitle">【活动规则&注意】</p>
              <p>1.仅限活动期间按规则购票的用户参与；</p>
              <p>2.仅限凭本活动页内指定的影片参与活动，活动页之外的影片不参与活动；</p>
              <p>3.购票后请在2020年10月8日前（包括10月8日）使用，过期作废；</p>
              <p>4.本活动中“双节通兑影券“售出后，不可退换；</p>
              <p>5.用户必须绑定微信支付才可以购票，未绑定微信支付或因帐号认证问题支付失败的，由用户自己承担；</p>
              <p>6.如用户以任何不正当手段或舞弊方式参与本活动，一经发现，移动电影院有权对该用户的账号进行异常标记。</p>
              <p>7.如果用户存在违规行为（包括但不限于洗钱、虚假交易、赌博、恶意套现、作弊），移动电影院将取消用户的活动资格、并有权撤销相关违规交易，同时依照相关规则进行处理；</p>
              <p>8.如因不可抗力或情势变更（包括但不限于重大自然灾害事件、政府主管部分指令停止举办或调整、活动遭受严重网络攻击或系统故障等）导致本活动无法继续举办的，则移动电影院可决定暂停或终止本活动，并可依相关法律法规的规定主张免责；</p>
              <p>*本活动最终解释权归移动电影院所有</p>
            </section>
          </article>
        </section>
        <p class="close" @click="ruleCover = false"></p>
      </article>
    </section>
    <v-button v-if="!isBuy" title="1票畅快观影" @click="payHandle"></v-button>
  </section>
</template>

<script>
import { mapState, mapMutations } from "vuex"
import utils from "@/common/scripts/utils"
import VButton from "@/components/VButton"
import axios from "@sc/lib-axios"
import env from "@sc/lib-env"
export default {
  data () {
    return {
      ruleCover: false,
      inApp: env.browser.inApp,
      dataList: [],
      isBuy: true,
      spuId: "",
      filmData: {}
    }
  },
  components: {
    VButton
  },
  methods: {
    ...mapMutations([
      "RECORD_USERINFO", "RECORD_POINTS", "SHARE_CONFIG"
    ]),
    toDetailPage (item) {
      this.$sensors.track("activity_page_img_click", {
        activity_id: "20201001",
        activity_name: "国庆打包购买活动",
        sku_id: item.skuId,
        film_name: item.filmName
      })
      this.$router.push({ name: "detail", query: { filmId: item.filmId, buy: 0 } })
    },
    ruleCoverClickHandle () {
      this.ruleCover = true
      this.$sensors.track("activity_rule_click", {
        activity_id: "20201001",
        activity_name: "国庆打包购买活动"
      })
    },
    async onItemClicked (item) {
      if (item.ticketStatus === 2) {
        return
      }
      if (item.ticketNo) {
        let filmId = item.filmId
        env.browser.inApp ? this.toMoviePlayPage(item.ticketNo, filmId) : this.$router.push({ name: "detail", query: { filmId: item.filmId, buy: 1 } })
      } else {
        this.toDetailPage(item)
      }
    },
    payHandle () {
      let spuId = this.spuId
      if (!this.login && env.browser.inApp) {
        if (this.openType === "poplayer" && env.os.ios) {
          this.$toast.showToast("请登录后参与本活动")
          setTimeout(() => {
            this.$windvane.call("SCHYPoplayerInterface.closePoplayer")
          }, 2000)
        } else {
          this.$windvane.call("SCHYUIInterface.showLoginPage", {
            refreshWhenLogin: "0"
          }).then(async ({ data, success }) => {
            if (success) {
              this.$sensors.login(data.u_id)
              this.RECORD_USERINFO(data)
              axios.setUserToken(data.u_token)
              this.listFetch()
              this.getBaseInfo(data.u_id)
            } else {
              this.listFetch()
            }
          }).catch(() => {
            this.listFetch()
          })
        }
      } else {
        if (this.accountInfo.status && this.accountInfo.status === 2) {
          this.$toast.showToast("您的账号存在异常，无法参加本次活动")
          return
        }
        this.$sensors.track("activity_page_buy", {
          activity_id: "20201001",
          activity_name: "国庆打包购买活动",
          sku_id: "",
          film_name: this.filmData.filmName
        })
        this.login ? this.$router.push({ name: "pay", query: { spuId, skip: "collection" } }) : this.$router.push({ name: "login" })
      }
    },
    async listFetch () {
      const loading = this.$toast.showLoading()
      let listPromise = utils.to(this.$services.operation.getActivityFilms({ type: "shiyi" }))
      let detailPromise = utils.to(this.$services.home.getFilmDetail({ filmId: "5002618911097798" }))
      let [listErr, listData] = await listPromise
      let [detailErr, detailData] = await detailPromise
      listErr ? this.$toast.showToast(listErr.msg) : (this.dataList = listData)
      let codes = []
      let hadTicket = true
      if (!listErr) {
        listData.forEach(item => {
          codes.push(item.giveCode)
          if (!item.ticketNo) {
            hadTicket = false
          }
        })
      }
      if (!detailErr) {
        this.filmData = detailData
        this.isBuy = !!detailData.filmTicketNum
        this.spuId = detailData.spuId
      }
      if (!!detailData.filmTicketNum && !hadTicket) {
        // eslint-disable-next-line no-unused-vars
        let [acceptErr, acceptData] = await utils.to(this.$services.order.acceptTicket({ giveCode: codes.join(",") }))
        if (!acceptErr) {
          this.listFetch()
        }
      }
      this.$toast.close(loading)
    },
    toMoviePlayPage (ticketNo, filmId) {
      const schemeURL = `smartcinema://playMovie?ticketNum=${ticketNo}&ticketNo=${ticketNo}&filmId=${filmId}`
      this.$windvane.call("SCHYUIInterface.openNativePage", { schemeURL })
    },
    async getBaseInfo (uid) {
      let codePromise = utils.to(this.$services.user.getuserCode({ "X-User-Id": uid }))
      let pointsPromise = utils.to(this.$services.user.getUserPoints({ "X-User-Id": uid }))
      let [codeErr, codeData] = await codePromise
      let [pointstErr, pointsData] = await pointsPromise
      if (!codeErr) {
        let url = `${location.origin + location.pathname}?ucode=${codeData.code}${location.hash}`
        this.SHARE_CONFIG({
          title: "9.2分佳片今日上映，速来！院线电影5元看8部",
          desc: "随时随地，一票通兑，畅快观影过长假！",
          link: url,
          img: "https://g.smartcinema.com.cn/images/c2c6177269e6458c9a8537dfa9c2a4cf-120-120.jpg", // 分享图标
          jsApiList: ["chooseWXPay"]
        })
      }
      !pointstErr && this.RECORD_POINTS(pointsData)
    }
  },
  computed: {
    ...mapState([
      "login", "accountInfo"
    ])
  },
  async created () {
    window.location.replace("https://h5.smartcinema.com.cn/tools/activity-end.html")
    // if (env.browser.inApp) {
    //   this.$windvane.call("WVBaseUI.setWebViewBounces", { closeBounces: 1 })
    //   this.$windvane.call("SCHYDataInterface.getUserInfo").then(async ({ data, success }) => {
    //     if (success && data.u_token) {
    //       this.$sensors.login(data.u_id)
    //       this.RECORD_USERINFO(data)
    //       axios.setUserToken(data.u_token)
    //       this.listFetch()
    //       this.getBaseInfo(data.u_id)
    //     } else {
    //       this.listFetch()
    //     }
    //   }).catch(() => {
    //     this.listFetch()
    //   })
    // } else {
    //   this.listFetch()
    // }
    // this.$sensors.track("activity_page_enter", {
    //   activity_id: "20201001",
    //   activity_name: "国庆打包购买活动"
    // })
  }
}
</script>

<style lang="scss" scoped>
.national {
  background-color: rgba(17,17,17,1);
  padding-bottom: rem(30);
  min-height: 100vh;
  padding-top: rem(0.1);
  &.ruleShow{
    width: 100%;
    position: fixed;
  }
  .comment{
    width: rem(345);
    margin: rem(20) auto 0;
    font-size: 0;
    img{
      width: 100%;
      height: 100%;
      display: block;
      border-radius: rem(6);
      object-fit: cover;
    }
  }
  .list {
    overflow: hidden;
    margin-left: rem(15);
    margin-top: rem(20);
    .item {
      position:relative;
      float: left;
      margin-right: rem(7);
      margin-bottom: rem(15);
      width: rem(168);
      overflow: hidden;
      background: #1E1E1E;
      border-radius: rem(4);
      .thumb {
        width: rem(168);
        height: rem(232);
        background: #666;
        overflow: hidden;

        img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }

      .info {
        padding: 0 rem(10) ;
        margin:rem(12) auto rem(10) ;
        box-sizing: border-box;
        @include flex($jus:center);
        height: rem(42);
        .name {
          font-family:PingFangSC-Semibold,PingFang SC;
          letter-spacing: rem(0.51);
          font-size: rem(15);
          font-weight: 600;
          color:rgba(216,216,216,1);
          line-height: rem(21);
          text-align: center;
          text-overflow: -o-ellipsis-lastline;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          line-clamp: 2;
          -webkit-box-orient: vertical;
        }
      }
      .btn{
        padding: 0 rem(10) rem(10);
        button{
          display: block;
          width:rem(148);
          height:rem(32);
          background:url(https://g.smartcinema.com.cn/images/2ba1b2988d5b4682a33211919095cb1a-296-64.png) 0 0 no-repeat;
          background-size: rem(148) rem(32);
          border-radius:rem(2);
          font-size:rem(16);
          font-family:PingFangSC-Semibold,PingFang SC;
          font-weight:600;
          color: #40373E;
        }
        .disable{
          background: rgba(102, 102, 102, 1);
          color: rgba(153, 153, 153, 1);
        }
      }
    }
  }
  .rule-btn{
    position: absolute;
    right: 0;
    top: rem(30);
    width: rem(27);
    height: rem(70);
    background:url(https://g.smartcinema.com.cn/images/bf54ce8240bc42ccb49a9427cbe3f92e-108-278.png);
    background-size: 100% 100%;
    font-size:rem(12);
    font-weight:700;
    color:rgba(108,51,0,1);
    line-height:rem(14);
    writing-mode:vertical-lr;
    @include flex($jus:center);
  }
  .rule-container{
    width: 100%;
    height: 100%;
    position: fixed;
    left: 0;
    top: 0;
    background: rgba(0,0,0,0.66);
    z-index: 999;
    .rule-wrapper{
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%);
      .rule{
        width: rem(300);
        height: rem(432);
        background: #fff;
        border-radius: rem(8);
        h2{
          height: rem(60);
          border-bottom: #E6E6E6 solid rem(1);
          @include flex($jus:center);
          .title{
            height:rem(31);
            font-size:rem(22);
            font-weight:500;
            color:rgba(108,51,0,1);
            line-height:rem(31);
            padding: 0 rem(53);
            background: url(https://g.smartcinema.com.cn/images/c08cea1e39f74b51a2dced3e60f3ec0f-152-72.png) 0 center no-repeat, url(https://g.smartcinema.com.cn/images/94e3904ce27f42b6929a53ebdd1007d3-152-72.png) right center no-repeat;
            background-size: rem(38) rem(18);
          }
        }
        .context-container{
          margin: rem(20) rem(23) rem(14);
          height: rem(338);
          overflow: hidden;
          .context-wrapper{
            height: 100%;
            overflow-y: auto;
            text-align: justify;
            p{
              font-size:rem(14);
              font-weight:500;
              color:#999999;
              line-height:rem(24);
              &.subtitle{
                color: #333333;
              }
            }
          }
        }
      }
      .close{
        margin: rem(20) auto 0;
        width: rem(30);
        height: rem(30);
        background: url(https://g.smartcinema.com.cn/images/bcc537e4bd7c426493cc5440fb992249-120-120.png);
        background-size: 100% 100%;
      }
    }
  }
  /deep/ .button{
    position: fixed;
    bottom: rem(30);
    left: 0;
    right: 0;
    margin: auto;
    button{
      color: rgba(64, 55, 62, 1);
      background: url(https://g.smartcinema.com.cn/images/fbbfd9d8c7fd49b49851fb1a2ea5c4cd-1380-160.png) 0 0 no-repeat;
      background-size: cover;
    }
  }
}
</style>
