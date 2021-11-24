<template>
  <div class="home">
    <!-- <div class="banner" @click="bannerHandleClick">
      <img src="https://g.smartcinema.com.cn/images/0fc467bf858c450d9e8259ef136dac89-1500-1012.png" />
    </div> -->
    <sub-title title="精彩影片" />
    <!-- 横版抽屉 -->
    <div>
      <card v-for="item in horizontalList" :filmData="item" :key="item.filmId" @pay="payHandle" @toDetail="detailHandle" />
    </div>
    <!-- 竖版 -->
    <div class="list" v-if="portraitList">
      <div class="item" v-for="item in portraitList" :key="item.filmId" @click.stop="detailHandle(item, 'portrait')">
        <div class="thumb">
          <img :src="`${item.filmImgPath}`" alt/>
        </div>
        <div class="info">
          <div class="name">{{item.filmName}}</div>
          <div class="desc">导演：{{item.directorStr}}</div>
          <div class="desc">主演：{{item.starStr}}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import SubTitle from "@/components/SubTitle"
import Card from "@/components/Card"
import utils from "@/common/scripts/utils"
export default {
  data () {
    return {
      horizontalList: [], // 横版抽屉列表
      portraitList: [] // 竖版列表
    }
  },
  methods: {
    // 去购票/去观影点击
    payHandle (filmData) {
      this.$sensors.track(filmData.ticketNo ? "h5_watch_film" : "h5_buy_ticket", {
        sku_id: filmData.filmSku,
        film_name: filmData.filmName,
        post_type: "横版"
      })
      filmData.ticketNo ? this.$router.push({ name: "detail", query: { filmId: filmData.filmId } }) : this.$router.push({ name: "pay", query: { spuId: filmData.filmSpu } })
    },
    // 详情跳转
    detailHandle (item, type = "horizontal") {
      this.$sensors.track("h5_film_post_click", {
        sku_id: item.filmSku,
        film_name: item.filmName,
        post_type: type === "horizontal" ? "横版" : "竖版"
      })
      this.$router.push({ name: "detail", query: { filmId: item.filmId } })
    },
    // banner点击
    bannerHandleClick () {
      this.$sensors.track("h5_banner_click", {
        activity_id: "",
        activity_name: "观影积分返现",
        activity_url: location.href
      })
      this.$router.push({ name: "activity" })
    }
  },
  components: {
    SubTitle, Card
  },
  async mounted () {
    const loading = this.$toast.showLoading()
    let [err, data] = await utils.to(this.$services.home.getIndexList())
    this.$toast.close(loading)
    err ? this.$toast.showToast(err.msg) : data.orderBy.forEach(item => {
      (item.filmDrawerType === 110 && this.horizontalList.push(...item.list)) || (item.filmDrawerType === 140 && this.portraitList.push(...item.list))
    })
    this.$sensors.track("h5_spt_enter")
  }
}
</script>

<style lang="scss" scoped>
.home {
  background:rgba(245,245,245,1);
  min-height: 100%;
  .banner{
    font-size: 0;
    img{
      width: 100%;
      height: rem(240);
      object-fit: cover;
    }
  }
  .list {
    overflow: hidden;
    margin-left: rem(15);
    .item {
      float: left;
      margin-right: rem(7);
      margin-bottom: rem(15);
      width: rem(168);
      height: rem(326);
      background:rgba(255,255,255,1);
      overflow: hidden;
      border-radius: rem(4);
      .thumb {
        width: rem(168);
        height: rem(236);
        background: #666;

        img {
          display: block;
          width: 100%;
          height: 100%;
        }
      }

      .info {
        padding: rem(13) rem(13) 0;
        height: rem(90);
        box-sizing: border-box;
        background: #fff;

        .name {
          font-size: rem(16);
          font-weight: 700;
          color: #333;
          line-height: rem(22);
          margin-bottom: rem(3);
          text-align: center;
          @include text-ellipsis;
        }

        .desc {
          font-size: rem(12);
          color: #999;
          line-height: rem(18);
          text-align: center;
          @include text-ellipsis;
        }
      }
    }
  }
}
</style>
