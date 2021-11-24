<template>
  <div class="activityBanner">
    <img :src="bannerImage" />
  </div>
</template>
<script>
export default {
  props: {
    bannerImage: {
      type: String,
      default: ""
    }
  }
}
</script>
<style lang="scss" scoped>
.activityBanner{
  width: 100%;
  img{
    width: 100%;
    height: auto;
    object-fit: cover;
    display: block;
  }
}
</style>
