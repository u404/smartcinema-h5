<template>
  <div class="summer-result" >
    <img :src="inApp? 'https://g.smartcinema.com.cn/images/fe42a5b5a1cd4c989e6c70357beec568-750-3378.png': 'https://g.smartcinema.com.cn/images/ba5a55ac173148b48991e2a70d0b6d87-750-3708.png'" />
  </div>
</template>
<script>
import env from "@sc/lib-env"
export default {
  data () {
    return {
      inApp: env.browser.inApp
    }
  }
}
</script>
<style lang="scss" scoped>
.summer-result{
  img{
    display: block;
    width: 100%;
  }
}
</style>
