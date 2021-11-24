<template>
  <section class="photo" v-if="photos">
    <section class="photo-box-1" v-if="photos.length>0">
      <img v-if="photos[0]&&photos[0].imgPath" class="img-1" :src="photos[0].imgPath" />
      <section>
        <img v-if="photos[1]&&photos[1].imgPath" class="img-2" :src="photos[1].imgPath" />
        <img v-if="photos[2]&&photos[2].imgPath" class="img-3" :src="photos[2].imgPath" />
      </section>
    </section>
    <section class="photo-box-2" v-if="photos.length>=3">
      <img v-if="photos[3]&&photos[3].imgPath" class="img-4" :src="photos[3].imgPath" />
      <img v-if="photos[4]&&photos[4].imgPath" class="img-5"  :src="photos[4].imgPath" />
    </section>
    <section class="photo-box-3" v-show="showAll" v-if="photos.length>5">
      <template v-for="(item,index) in photos">
        <img v-if="index>=5"  :key="item" :src="item.imgPath" />
      </template>
    </section>
    <div v-if="photos.length>5" class="show" @click.stop="showHandle">{{ showAll ? "收起" : "展开" }}</div>
  </section>
</template>

<script>
export default {
  props: {
    photos: {
      type: Object
    }
  },
  mounted () {
    this.monitoring()
  },
  data () {
    return {
      showAll: false
    }
  },
  methods: {
    showHandle () {
      this.showAll = !this.showAll
    },
    monitoring () {
      this.$on("resetHandle", (res) => {
        this.showAll = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.photo{
  width: rem(347);
  margin: auto;
  @include flex($flow:row wrap,$ali:flex-start);
  .photo-box-1,.photo-box-2{
    width: 100%;
    @include flex();
  }
  img{
    display: block;
    width: rem(347);
    height: rem(184);
    object-fit: cover;
    margin-top: rem(4);
    &.img-1{
      width: rem(222);
      height: rem(330);
      margin-top: 0;
    }
    &.img-2{
      width: rem(121);
      height: rem(205);
      margin-top: 0;
    }
    &.img-3{
      width: rem(121);
      height: rem(121);
    }
    &.img-4{
      width: rem(121);
      height: rem(121);
    }
    &.img-5{
      width: rem(222);
      height: rem(121);
    }
  }
  .show{
    padding: rem(10) 0;
    text-align: center;
    width: 100%;
  }
}
</style>
