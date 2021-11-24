<template>
  <section  class="user">
    <header class="info" @click="toLogin">
      <article class="base">
        <img class="headImage" :src="userInfo.uImage || 'https://g.smartcinema.com.cn/images/a49edc503dee4ea0a3d4243a36d4e20c-160-160.png'"/>
        <aside class="login">
          <p>{{login ? userInfo.uNickname : "未登录"}}</p>
          <p>{{login ? userInfo.uMobile : "点击登录，体验更多精彩"}}</p>
        </aside>
      </article>
      <aside class="arrow"></aside>
    </header>
    <div class="list-container">
      <list v-if="able" label="我的积分" @listClick="confirmShow = true" icon="https://g.smartcinema.com.cn/images/2d45d7fac198482cb47fd5f0b6e54c00-32-32.png"  arrow="arrow"><template v-slot:t_attr>{{ accountInfo.availablePoints || 0 }}</template></list>
      <list label="我的观影记录" icon="https://g.smartcinema.com.cn/images/cb0a760451634b06be0c2b5ef5b8cc05-32-32.png" >
        <section v-if="login">
          <HistorySlide @click="ticketHandle" :slideData="filmRecord" />
        </section>
      </list>
      <list @listClick="toContact" label="联系客服" icon="https://g.smartcinema.com.cn/images/97864262192e4644a0352babbe5023c3-32-32.png"  arrow="arrow"/>
    </div>
    <sc-confirm :confirmVisiable="confirmShow" msg="下载移动电影院APP" @cancel="confirmShow = false" @confirm="toDownload" confirmText="确定" cancelText="取消" ></sc-confirm>
  </section>
</template>

<script>
import List from "@/components/List"
import HistorySlide from "@/components/HistorySlide"
import ScConfirm from "@/components/ScConfirm"
import { mapState, mapActions } from "vuex"
export default {
  components: {
    List, HistorySlide, ScConfirm
  },
  data () {
    return {
      confirmShow: false
    }
  },
  methods: {
    ...mapActions([
      "getFilmeRecord"
    ]),
    // 登录跳转
    toLogin () {
      !this.login && this.$router.push({ name: "login", query: { redirect: this.$route.fullPath } })
    },
    // 联系我们
    toContact () {
      this.$toast.showToast("客服电话:400-620-1805")
    },
    // 观影记录播放
    ticketHandle (item) {
      this.$router.push({ name: "detail", query: { filmId: item.skuInfo.filmId } })
    },
    // 点击积分去下载
    toDownload () {
      this.$sensors.track("h5_mine_score_click", {
        score: this.accountInfo.availablePoints
      })
      this.confirmShow = false
      this.$callapp.gotoPage()
    }
  },
  computed: {
    ...mapState([
      "userInfo", "login", "filmRecord", "accountInfo"
    ]),
    able () {
      return this.login && this.accountInfo.status !== 1 && this.accountInfo.status !== 2
    }
  },
  created () {
    if (this.login) {
      this.getFilmeRecord()
    }
    this.$sensors.track("h5_mine_enter")
  }
}
</script>

<style lang="scss" scoped>
.user {
  @include flex(column, flex-start, stretch);
  min-height: 100%;
  .list-container{
    background-color: rgba(247,247,247,1);
    flex: 1;
  }
  .info{
    padding: rem(20) rem(15);
    background: #ffffff;
    @include flex;
    .base{
      @include flex($jus: center);
      img{
        display: block;
        border-radius: 50%;
        width: rem(80);
        height: rem(80);
        margin-right: rem(15);
      }
      .login{
        @include flex($flow:column, $ali: flex-start);
        p:first-of-type{
          height:rem(20);
          font-size:rem(20);
          font-weight:700;
          color:rgba(51,51,51,1);
          line-height:rem(20);
        }
        p:last-of-type{
          margin-top: rem(6);
          height:rem(20);
          font-size:rem(14);
          font-weight:400;
          color:rgba(105,107,111,1);
          line-height:rem(20);
        }
      }
    }
  }
}
</style>
