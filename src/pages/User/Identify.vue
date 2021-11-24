<script>
import { mapState } from "vuex"
import env from "@sc/lib-env"
export default {
  data () {
    return {
      name: "",
      idcard: "",
      activityId: "",
      type: "summer2021"
    }
  },
  computed: {
    ...mapState([
      "userCode"
    ])
  },
  watch: {
    "idcard": function (value = "") {
      this.idcard = value.replace(/[^\d|xX]/g, "").substr(0, 18)
    }
  },

  methods: {
    resetPagePosition () {
      window.scrollTo(0, 0)
    },
    shareHandle () {
      env.browser.inApp ? this.$windvane.call("SCHYUIInterface.openShareWindow", { shareData: this.shareData }) : this.$shareCover().show()
    },
    setShare (code = "", activityId = "", shareInfo = {}) {
      const { shareTitle: title, shareDescription: desc, shareImage: img } = shareInfo
      let link = `${location.origin}/index.html?ucode=${code}#/operation/summer?source=user&activityId=${activityId}`
      this.shareData = {
        shareType: 0,
        shareTitle: title,
        shareContent: desc,
        shareThumImgUrl: img,
        shareResourceUrl: link
      }
    },
    getActivityBaseInfo (type, activityId) {
      return this.$services.operation.getActivityBasic({ type, activityId }).then(res => {
        this.setShare(this.userCode, res.id, res)
      }).catch((err) => {
        this.setShare()
        this.$toast.showToast(err.msg)
      })
    },

    confirmToIdentify () {
      if (this.name.length < 2) {
        this.$refs.nameElement.focus()
        this.$toast.showToast("请填写正确的证件姓名")
      } else if (!/^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/.test(this.idcard)) {
        this.$refs.idElement.focus()
        this.$toast.showToast("请填写正确的证件号码")
      } else {
        let loading = this.$toast.showLoading()
        this.$services.user.setAuthStatus({
          cardNo: this.idcard,
          cardName: this.name,
          activityId: this.activityId
        }).then(res => {
          this.$toast.close(loading)
          console.log("/points/cash/auth", res)
          this.$toast.showToast("提交成功")
          this.$sensors.track("auth_page_success")
          setTimeout(() => {
            this.$router.go(-1)
          }, 1500)
        }).catch(err => {
          console.error("/points/cash/auth", err)
          this.$toast.close(loading)
          this.$toast.showToast(err.msg)
        })
      }
    }
  },
  mounted () {
    this.activityId = this.$route.query.id
    this.$windvane.call("SCHYUIInterface.setShareInfo", { showShareBtn: 0 })
    this.getActivityBaseInfo(this.type, this.activityId)
    this.$sensors.track("auth_page")
  }
}
</script>

<template>
<div class="identify">
  <!-- <div class="identify-hd">新能源汽车抽奖</div> -->
  <div class="identify-bd">
    <!-- <div class="title">填写信息 获取抽奖码</div> -->
    <div class="form">
      <div class="form-item">
        <div class="label">真实姓名</div>
        <div class="input">
          <input ref="nameElement" type="input" autocomplete="off" v-model="name" maxlength="10" @blur="resetPagePosition"/>
        </div>
      </div>
      <div class="form-item">
        <div class="label">身份证号</div>
        <div class="input">
          <input ref="idElement" type="input" autocomplete="off" v-model="idcard" maxlength="18" @blur="resetPagePosition"/>
        </div>
      </div>
      <div class="tips">本期新能源汽车抽奖活动，以抽奖人在此填写的真实信息为准，不可更改，请认真填写。</div>
    </div>
  </div>
  <div class="button" @click.stop="confirmToIdentify">提交抽奖人信息</div>
  <div class="share-container">
    <span class="share-btn" @click.stop="shareHandle">去邀请</span>
  </div>
  <div class="footer-tips">如填写信息与本人身份不符，移动电影院有权收回奖品。</div>
</div>
</template>

<style lang="scss">
@import "~@/common/style/mixins.scss";

.identify {
  width: 100vw;
  height: 100%;
  background: url(https://g.smartcinema.com.cn/images/ea10e780b17342fca486dffb7b2a816e-750-128.png) bottom center no-repeat,url(https://g.smartcinema.com.cn/images/69525235a7604e4d8746397395d26710-750-2492.png) 0 0 no-repeat;
  background-size: 100%, cover;
  padding: rem(24) rem(15);

  &-hd {
    font-size: rem(20);
    line-height: rem(28);
    margin-bottom: rem(18);
    color: #000;
    font-weight: 600;
  }

  &-bd {
    .title {
      font-size: rem(20);
      color: #2F2F2F;
      font-weight: 600;
      margin-bottom: rem(32);
    }
  }
  .button {
    font-size: rem(16);
    color: #60523b;
    font-weight: 600;
    @include flex($jus: center);
    background-image: linear-gradient(to right, rgba(253, 243, 189, 1) 0%, rgba(243, 206, 135, 1) 100%);
    height: rem(40);
    border-radius: rem(20);
    width: rem(345);
    margin: rem(30) auto 0;
  }
  .form{
    background: #ffffff;
    width: rem(345);
    height: rem(189);
    border-radius: rem(6);
    padding: rem(0) rem(18);
    .form-item{
      // width: rem(345);
      margin: 0 auto;
      border-bottom: rem(1) solid  #EEEEEE;
      padding: rem(17) 0;
      @include flex();
      .label{
        font-size: rem(14);
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 100;
        color:  #000000;
        line-height: rem(20);
        white-space: nowrap;
        margin-left: rem(15);
      }
      .input{
        flex:1;
        input{
          display: block;
          margin: 0 rem(20);
          font-size: rem(14);
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 900;
          color: #000;
          line-height: rem(20);
          border: none;
          resize: none;
          flex: 1;
          &::-webkit-input-placeholder{
            color: #BABABA;
          }
        }
      }
    }
    .tips{
      font-size: rem(12);
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #CBCBCB;
      line-height: rem(17);
      margin-top: rem(19);
    }
  }
  .share-container{
    margin-top: rem(14);
    text-align: center;
    .share-btn{
      font-size: rem(13);
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #BFE2FF;
      line-height: rem(18);
      padding-bottom: rem(3);
      border-bottom: rem(1) solid #BFE2FF;
    }
  }
  .footer-tips{
    font-size: rem(12);
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #FFFFFF;
    line-height: rem(17);
    position: absolute;
    bottom: rem(74);
    left: 0;
    right: 0;
    margin: auto;
    text-align: center;
  }
}
</style>
