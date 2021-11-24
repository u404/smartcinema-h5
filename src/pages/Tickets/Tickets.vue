<template>
  <div class="tickets">
    <div class="btn-share" @click.stop="shareHandle"></div>
    <div class="tickets-container">
      <div class="tickets-confirm" :style="'background: url('+filmData.filmHeadImg +') no-repeat 0 0 / cover;'">
        <span class="tickets-success"></span>
        <sapn class="tickets-text">预约成功，您已成为“为感动付费金牌评审”第{{rank}}位评委</sapn>
      </div>
      <div class="tickets-info">
        <div class="cell">
          <div>
            <span class="sub">片名</span>
            <span class="ticket-film-name">{{filmData.filmNameCn}}</span>
          </div>
        </div>
        <div class="cell">
          <div>
            <span class="sub">票类</span>
            <span class="con">限量点映场</span>
          </div>
        </div>
        <div class="cell">
          <div class="cell-num">
            <span class="sub">票数</span>
            <span class="con">1张</span>
          </div>
          <div class="cell-time">
            <span class="sub">时间</span>
            <span class="con">{{filmData.filmReleaseTime}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="tickets-btns">
      <span class="toMoveBtn" @click.stop="toMoviePlayPage(filmData)">{{filmData.skuStatus === 2?"周五16点开场":"进场观影"}}</span>
      <span class="toCreateBtn" @click.stop="toCreateMovieField(filmData)"></span>
      <span class="goBackBtn" @click.stop="$router.replace({name:'week'})">返回首页，稍后在放映厅中观看</span>
    </div>
  </div>
</template>
<script>
import utils from "@/common/scripts/utils"
import { mapState } from "vuex"
export default {
  data () {
    return {
      filmData: {},
      rank: "",
      shareData: {}
    }
  },
  computed: {
    ...mapState(["userCode"])
  },
  methods: {
    toMoviePlayPage ({ ticketNo, filmId, skuStatus }) {
      if (skuStatus === 2) {
        this.$router.replace({ name: "week" })
        return false
      }
      const schemeURL = `smartcinema://playMovie?ticketNum=${ticketNo}&ticketNo=${ticketNo}&filmId=${filmId}`
      this.$windvane.call("SCHYUIInterface.openNativePage", { schemeURL })
    },
    toCreateMovieField ({ skuId, filmNameCn }) {
      this.$sensors.track("purchase_complete_baochang", {
        sku_id: skuId,
        film_name: filmNameCn
      }, () => {
        // 跳转创建包场
        const schemeURL = `smartcinema://createPrivateField?createType=0`
        this.$windvane.call("SCHYUIInterface.openNativePage", { schemeURL })
      })
    },
    shareHandle () {
      this.$sensors.track("purchase_complete_share", {
        sku_id: this.filmData.skuId,
        film_name: this.filmData.filmNameCn
      }, () => {
        this.$windvane.call("SCHYUIInterface.openShareWindow", this.shareData)
      })
    }
  },
  async mounted () {
    this.$windvane.call("SCHYUIInterface.setShareInfo", { showShareBtn: 0 })
    const loading = this.$toast.showLoading()
    let [err, data] = await utils.to(
      this.$services.home.getFridayFilmDetail()
    )
    this.$toast.close(loading)
    if (err) {
      this.$toast.showToast(err.msg)
      return
    }
    this.filmData = data
    let qrCodeShareUrl = ""
    let [basicErr, basicData] = await utils.to(this.$services.operation.getActivityBasic({ type: "fridayFilm", activityId: this.activityId }))
    if (!basicErr) {
      qrCodeShareUrl = `https://h5.smartcinema.com.cn/index.html?ucode=${this.userCode}#/week?activityId=${basicData.id}`
    }
    let date = (new Date(data.releaseStartTime * 1000)).format("M月d日 hh:mm")
    let sharePromise = utils.to(this.$services.comment.getShareData({
      type: 0,
      filmId: this.filmData.filmId,
      skuId: this.filmData.skuId,
      beginTime: date,
      qrCodeShareUrl
    }))
    let rankPromise = utils.to(this.$services.comment.getJudgesRank())
    let [rankErr, rankData] = await rankPromise
    let [shareErr, shareData] = await sharePromise
    !rankErr && (this.rank = rankData)
    !shareErr && (this.shareData = shareData)
  }
}
</script>

<style lang="scss" scoped>
.tickets {
  min-height: 100%;
  background: rgba(17, 17, 17, 1);
  .btn-share{
    position: fixed;
    right: rem(20);
    top: rem(20);
    width: rem(24);
    height: rem(23);
    background: url(https://g.smartcinema.com.cn/images/0e79885d615146edbcd09bdefc95e682-48-46.png) 0 0 no-repeat;
    background-size:rem(24) rem(23);
  }
  .tickets-confirm{
    width: rem(261);
    height: rem(147);
    margin: rem(144) auto 0;
    position: relative;
    @include flex($flow: column,$jus:center);
    .tickets-success{
      display: block;
      width: rem(31);
      height: rem(31);
      background: url(https://g.smartcinema.com.cn/images/5d67e5da4027470fa4bbd329589eebb2-62-62.png) 0 0 no-repeat;
      background-size: rem(31) rem(31);
      z-index: 1;
    }
    .tickets-text{
      color: #FFFFFF;
      width: rem(192);
      margin-top: rem(14);
      z-index: 1;
    }
    &::before{
      content: "";
      background: rgba(0,0,0,0.3);
      display: block;
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 0;
    }
  }
  .tickets-info{
    padding-top: rem(0.1);
    width: rem(264);
    height: rem(175);
    margin: rem(27) auto 0;
    background: url(https://g.smartcinema.com.cn/images/b9d4b24daf8d47f49712b6f02eb9e48a-528-348.png) 0 0 no-repeat;
    background-size: rem(264) rem(175);
    .cell{
      width: rem(244);
      margin: rem(10) auto 0;
      @include flex();
      &>div{
        @include flex($jus:flex-start);
        text-indent: rem(11);
        width: 100%;
        height: rem(38);
        background: linear-gradient(90deg, #151515 0%, rgba(21, 21, 21, 0) 100%);
        border-radius: rem(3);
        span{
          white-space: nowrap;
          text-align: left;
        }
        .sub{
          font-size: rem(11);
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #999999;
          line-height: rem(16);
        }
        .con{
          font-size: rem(12);
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #FFFFFF;
          line-height: rem(17);
        }
        .ticket-film-name{
          font-size: rem(18);
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #D7BE97;
          line-height: rem(25);
        }
      }
      .cell-num{
        width: rem(85);
      }
      .cell-time{
        width: rem(156);
      }

    }
  }
  .tickets-container{
    padding-top: rem(0.1);
    height: 100%;
    background: url(https://g.smartcinema.com.cn/images/e343c979a8114d459b4c717a2abd04b1-750-636.png) 0 0 no-repeat, url(https://g.smartcinema.com.cn/images/f995913763c346fc8563ad04faf94460-750-136.png) 0 rem(316) no-repeat;
    background-size:rem(375) rem(318), rem(375) rem(68);
  }
  .tickets-btns{
    margin: rem(34) rem(17) 0;
    span{
      display: block;
    }
    .toMoveBtn,.toCreateBtn{
      width: rem(340);
      height: rem(52);
    }
    .toMoveBtn{
      background: linear-gradient(90deg,#E8BF8F 0%,#CC9361 100%);
      font-size: rem(18);
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: bold;
      color: #40373E;
      border-radius: rem(24);
      @include flex($jus:center);
    }
    .toCreateBtn{
      background: url(https://g.smartcinema.com.cn/images/3f1dbfc91aad42429f8bae2ac5710184-680-104.png) 0 0 no-repeat;
      background-size: rem(340) rem(52);
      margin-top: rem(10);
    }
    .goBackBtn{
      margin: rem(20) auto 0;
      padding-bottom: rem(45);
      text-align: center;
    }
  }
}
</style>
