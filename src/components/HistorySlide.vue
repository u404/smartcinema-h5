<template>
  <section class="slide" v-if="slideData && slideData.length>0">
    <article>
      <swiper class="swiper-container" :options="swiperOption" ref="mySwiper" @someSwiperEvent="callback">
        <swiper-slide v-for="(item,index) in slideData" :key="index" >
          <img :src="item.skuInfo.filmPosterUrl" @click="handleClick(item)" />
          <span class="name">{{item.skuInfo.filmName}}</span>
        </swiper-slide>
      </swiper>
    </article>
  </section>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default: ""
    },
    arrow: {
      type: Boolean,
      default: false
    },
    border: {
      type: Boolean,
      default: true
    },
    icon: {
      type: String,
      default: ""
    },
    slideData: {
      type: Object
    }
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
  },
  methods: {
    handleClick (item) {
      this.$emit("click", item)
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
        width:rem(160) !important;
        margin-right: rem(10);
        @include flex($flow: column, $ali: flex-start);
        img{
          width:rem(160);
          height:rem(98);
          box-shadow:0 rem(8) rem(12) 0 rgba(0,0,0,0.15);
          border-radius:rem(2);
          margin: rem(15) 0 rem(10);
          object-fit: cover;
        }
        .name{
          height:rem(20);
          font-size:rem(14);
          font-weight:400;
          color:rgba(51,51,51,1);
          line-height:rem(20);
          @include text-ellipsis;
        }
      }
    }
  }
}
</style>
