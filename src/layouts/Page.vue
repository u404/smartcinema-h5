<template>
  <h5-fail-panel v-if="error"></h5-fail-panel>
  <h5-loading-panel v-else-if="loading"></h5-loading-panel>
  <div class="page" v-else>
    <section v-if="$route.meta.slogan && !inApp && sloganVisible"  class="slogan-container">
      <Slogan :show="sloganVisible" @close="closeSloganHandle" />
    </section>
    <section class="page-container">
      <transition :name="transitionName">
          <router-view v-if="isRouterAlive" class="page-view"></router-view>
      </transition>
    </section>
    <section v-if="$route.meta.footer && !inApp" class="tabbar-container">
      <TabBar />
    </section>
  </div>
</template>

<script>
import TabBar from "@/components/TabBar"
import Slogan from "@/components/Slogan"
import env from "@sc/lib-env"
import { mapState, mapMutations } from "vuex"
export default {
  props: {
    error: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  provide () {
    return {
      reload: this.reload
    }
  },
  computed: {
    ...mapState([
      "sloganVisible"
    ])
  },
  components: {
    TabBar, Slogan
  },
  data () {
    return {
      transitionName: "",
      inApp: env.browser.inApp,
      isRouterAlive: true
    }
  },
  methods: {
    ...mapMutations([
      "CHANGE_SLOGAN_VISIBLE"
    ]),
    reload () {
      this.isRouterAlive = false
      this.$nextTick(function () {
        this.isRouterAlive = true
      })
    },
    closeSloganHandle () {
      this.$sensors.track("h5_app_download_close")
      this.CHANGE_SLOGAN_VISIBLE()
    }
  },
  watch: {
    "$route" (to, from) {
      if (!from.name) return

      if (to.meta.index > from.meta.index) {
        this.transitionName = "sleft"
      } else {
        this.transitionName = "sright"
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.page {
  height: 100%;
  margin: 0 auto;
  position: relative;
  @include flex(column, flex-start, stretch);
  @include font12;
  .slogan-container{
    height: rem(56);
  }
  .tabbar-container{
    height: rem(56);
  }
  .page-container{
    flex: 1;
    overflow-y: auto;
    > * {
      flex: 1 0 auto;
      position: relative;
      width: 100%;
    }
  }
  .sleft-enter-active,
  .sleft-leave-active,
  .sright-enter-active,
  .sright-leave-active {
    transition: all 0.3s cubic-bezier(0.55, 0, 0.1, 1);
    position: absolute;
    top: 0;
    left: 0;
  }

  .sleft-enter,
  .sright-leave-to {
    transform: translateX(100%);
  }
  .sleft-leave-to,
  .sright-enter {
    transform: translateX(-100%);
  }
}
</style>
