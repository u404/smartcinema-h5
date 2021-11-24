<template>
  <section class="video">
    <video-player class="video-player-box"
      ref="videoPlayer"
      :options="playerOptions"
      :playsinline="true"
      @play="onPlayerPlay($event)"
      @pause="onPlayerPause($event)"
      @statechanged="playerStateChanged($event)"
      @ready="playerReadied"
      @error="onPlayerError($event)"
      @waiting="onPlayerWaiting($event)"
      @playing="onPlayerPlaying($event)">
    </video-player>
  </section>
</template>
<script>
import "video.js/dist/video-js.css"
import { videoPlayer } from "vue-video-player"
import "videojs-contrib-hls"

export default {
  components: {
    videoPlayer
  },
  props: {
    filmData: Object
  },
  data () {
    return {
      first: false,
      playerOptions: {
        width: document.documentElement.clientWidth,
        autoplay: false,
        fluid: true,
        muted: false,
        language: "zh-CN",
        controlBar: {
          remainingTimeDisplay: false
        }
      }
    }
  },
  mounted () {
    this.player.src(this.filmData.video[0].videoUrl)
    this.player.poster(this.filmData.video[0].videoImg)
  },
  computed: {
    player () {
      return this.$refs.videoPlayer.player
    }
  },
  methods: {
    // listen event
    onPlayerPlay (player) {
      player.loadingSpinner.hide()
    },
    onPlayerPause (player) {
    },
    playerStateChanged (playerCurrentState) {},
    playerReadied (player) {
    },
    onPlayerWaiting (player) {
      player.loadingSpinner.show()
    },
    onPlayerPlaying (player) {
    },
    onPlayerError (player) {
      this.$toast.showToast("播放遇到问题，请稍候")
    }
  }
}
</script>
<style lang="scss" scoped>
.video{
  position: relative;
  .test{
    position: absolute;
    top: 0;
    right: 0;
    z-index: 999;
    color: #fff;
  }
  /deep/ .vjs-big-play-button{
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    width: rem(59);
    height: rem(59);
    background: url(https://g.smartcinema.com.cn/images/b7628966b4564825a0b780b5cdc0b4ce-118-118.png) 0 0 no-repeat;
    background-size: 100% 100%;
    border: none;
    &::after{
      content: "";
      display: none !important;
    }
    .vjs-icon-placeholder{
      display: none;
    }
  }
  /deep/ .vjs-poster{
    background-size: cover;
  }
  /deep/ .vjs-time-control{
    display:block;
  }
}
</style>
