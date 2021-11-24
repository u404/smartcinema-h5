<template>
  <section class="slide" v-if="actorData">
    <article>
      <swiper class="swiper-container" :options="swiperOption" ref="mySwiper" @someSwiperEvent="callback">
        <swiper-slide v-for="item in actorData" :key="item.castName">
          <img :src="item.imgPath || 'https://g.smartcinema.com.cn/images/79e3e567f8ab4baa8e7d57525fc0120f-650-650.jpg'" />
          <span class="name">{{item.castName}}</span>
          <span class="role">{{item.roleName}}</span>
        </swiper-slide>
      </swiper>
    </article>
  </section>
</template>

<script>
export default {
  props: {
    actorData: Object,
    default: []
  },
  data () {
    return {
      swiperOption: {
        pagination: ".swiper-pagination",
        spaceBetween: 0,
        slidesPerView: "auto",
        freeMode: true,
        observer: true,
        observeParents: true,
        observeSlideChildren: true
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.slide{
  display: block;
  overflow: hidden;
  &>article{
    padding-left: rem(15);
    overflow: visible;

    .swiper-container{
      width: 100%;
      overflow: inherit;

      .swiper-slide{
        font-size: 0;
        width:rem(100) !important;
        margin-right: rem(15);
        @include flex($flow: column, $ali: flex-start);
        img{
          width:rem(100);
          height:rem(100);
          margin-bottom:rem(12);
          object-fit: cover;
          border-radius:rem(4);
        }
        span{
          display: block;
          width: 100%;
          text-align: center;
          @include text-ellipsis;
        }
        .name{
          // height:rem(16);
          font-size:rem(16);
          font-weight:400;
          color:rgba(102,102,102,1);
          // line-height:rem(16);
        }
        .role{
          height:rem(13);
          font-size:rem(12);
          font-weight:400;
          color:rgba(153,153,153,1);
          line-height:rem(13);
          margin-top: rem(6);
        }
      }
    }
  }
}
</style>
