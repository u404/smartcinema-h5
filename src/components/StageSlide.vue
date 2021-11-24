<template>
  <section class="slide">
    <article>
      <swiper class="swiper-container" :options="swiperOption" ref="mySwiper" @someSwiperEvent="callback">
        <swiper-slide v-for="item in 8" :key="item">
          <img src="https://pic4.huanxi.com/8a9eb00f70c9011b0170ed55d9a969e1.jpg?x-oss-process=image/resize,m_fill,h_184,w_306" />
        </swiper-slide>
      </swiper>
    </article>
  </section>
</template>

<script>
export default {
  props: {
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
        width:rem(192) !important;
        margin-right: rem(8);
        @include flex($flow: column, $ali: flex-start);
        img{
          width:rem(192);
          height:rem(108);
          border-radius:rem(4);
        }
      }
    }
  }
}
</style>
