<template>
  <section class="film-card" >
      <section class="film-pic">
          <img :src="miniPoster" />
      </section>
      <section class="film-info">
        <p class="film-name">{{filmData.filmNameCn}}</p>
        <p>{{filmData.filmHeadDesc}}</p>
        <p>{{filmData.filmType}}</p>
        <p>{{filmData.filmReleaseTime}}</p>
      </section>
  </section>
</template>

<script>
import utils from "@/common/scripts/utils"
export default {
  props: {
    filmData: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      miniPoster: ""
    }
  },
  async created () {
    let [basicErr, basicData] = await utils.to(this.$services.operation.getActivityBasic({ type: "fridayFilm", activityId: this.activityId }))
    if (!basicErr) {
      this.miniPoster = basicData.miniPoster
    }
  }
}
</script>

<style lang="scss" scoped>
.film-card{
  height:rem(100);
  @include flex($jus:flex-start, $ali: flex-start);
  .film-pic{
    img{
      display: block;
      width: rem(100);
      height: rem(100);
      object-fit: cover;
      border-radius: rem(4);
      margin-right: rem(20);
    }
  }
  .film-info{
    height: rem(100);
    @include flex($flow:column,$jus:space-between,$ali:flex-start);
    p{
      font-size: rem(12);
      font-family: PingFang-SC-Medium, PingFang-SC;
      font-weight: 500;
      color: #FFFFFF;
      line-height: rem(17);
    }
    .film-name{
      font-size: rem(20);
      font-family: PingFang-SC-Bold, PingFang-SC;
      font-weight: bold;
      color: #FFFFFF;
      line-height: rem(28);
    }
  }
}
</style>
