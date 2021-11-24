<template>
  <div :class="{container: true}" >
    <div class="comment">
      <img src="https://g.smartcinema.com.cn/images/5522f50fe138426f933586ba47b68ba9-690-450.jpg" />
    </div>
    <div class="list" v-if="dataList">
      <div class="item" v-for="item in dataList" :key="item.filmId"  @click.stop="toMovieDetailPage(item)" >
        <div class="thumb">
          <img :src="`${item.imageUrl}`" alt/>
        </div>
        <div class="info">
          <div class="name">{{item.filmName}}</div>
        </div>
        <div class="btn">
          <button @click.stop="onItemClicked(item)">{{item.ticketNo?(item.ticketStatus ===2?"购买":"观影"):"购买"}}</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import env from "@sc/lib-env"
export default {
  data () {
    return {
      dataList: null,
      timeoutNum: 0
    }
  },
  created () {
    env.browser.inApp && this.requestPageData()
  },
  methods: {
    requestPageData () {
      let loading = this.$toast.showLoading()
      this.$services.operation.getActivityFilms({ type: "shiyishanxi" }).then(res => {
        this.$toast.close(loading)
        this.dataList = res
      }).catch(e => {
        this.$toast.close(loading)
        if (e.code === "ECONNABORTED" && e.msg.indexOf("timeout") !== -1 && this.timeoutNum < 3) {
          this.timeoutNum += 1
          this.requestPageData()
        } else if (e.code === 400001001) {
          const schemeURL = `smartcinema://mine`
          this.$windvane.call("SCHYUIInterface.openNativePage", { schemeURL })
        } else {
          this.$toast.showToast(e.msg)
        }
      })
    },
    loginCheck (cb, data) {
      this.$windvane.call("SCHYDataInterface.getUserInfo").then((res) => {
        if (res.success && res.data.u_token) {
          cb && cb(data)
        } else {
          this.$windvane.call("SCHYUIInterface.showLoginPage", {
            refreshWhenLogin: "0"
          }).then(res => {
            res.success && cb && cb(data)
          })
        }
      })
    },
    onItemClicked (item) {
      this.loginCheck(this.toCheckItem, item)
    },
    toCheckItem (item) {
      const {
        spuId,
        ticketNo,
        filmId,
        skuId,
        ticketSkuStatus
      } = item
      if (ticketNo) {
        if (ticketSkuStatus === 2) {
          this.$windvane.call("SCHYUIInterface.openBuyWindow", {
            spuId,
            skuId,
            screenType: 0,
            beginTimestamp: 0
          }).then(res => {
            this.requestPageData()
          })
        } else {
          this.toMoviePlayPage(ticketNo, filmId)
        }
      } else {
        this.$windvane.call("SCHYUIInterface.openBuyWindow", {
          spuId,
          skuId,
          screenType: 0,
          beginTimestamp: 0
        }).then(res => {
          this.requestPageData()
        })
      }
    },
    toMoviePlayPage (ticketNo, filmId) {
      const schemeURL = `smartcinema://playMovie?ticketNum=${ticketNo}&ticketNo=${ticketNo}&filmId=${filmId}`
      this.$windvane.call("SCHYUIInterface.openNativePage", { schemeURL })
    },
    toMovieDetailPage (item) {
      this.$windvane.call("SCHYUIInterface.openNativePage", {
        schemeURL: `smartcinema://movieDetail?filmId=${item.filmId}`
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  width: rem(375);
  background-color: rgba(17,17,17,1);
  padding-bottom: rem(30);
  min-height: 100vh;
  padding-top: rem(0.1);
  .comment{
    width: rem(345);
    margin: rem(20) auto 0;
    font-size: 0;
    img{
      display: block;
      width: 100%;
      height: 100%;
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
      }
    }
  }
}
</style>
