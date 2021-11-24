<template>
  <footer>
        <ul>
            <li v-for="item in list" :key="item.val" @click="changeBarHandle(item.val)">
              <img :src="item.val==barVal ? item.activeIcon : item.icon" />
              <p :class="item.val==barVal&&'active'">{{item.name}}</p>
            </li>
        </ul>
    </footer>
</template>
<script>
export default {
  name: "TabBar",
  data () {
    return {
      list: [
        {
          name: "放映厅",
          val: "home",
          icon: "https://g.smartcinema.com.cn/images/dcf061ba547243ed9622dc3eb8b06ac4-48-48.png",
          activeIcon: "https://g.smartcinema.com.cn/images/056c7f340b364a8c85207e99c4f8c3d6-48-48.png"
        },
        {
          name: "我的",
          val: "user",
          icon: "https://g.smartcinema.com.cn/images/968e823eed014170bd8927e2570710dd-48-48.png",
          activeIcon: "https://g.smartcinema.com.cn/images/8d39237c004349aebce7070e88223097-48-48.png"
        }
      ]
    }
  },
  computed: {
    barVal () {
      return this.$route.path === "/" ? "home" : this.$route.path.substr(1)
    }
  },
  methods: {
    changeBarHandle (val) {
      this.barVal = val
      this.$router.push({ name: val })
    }
  }
}
</script>
<style lang="scss" scoped>
  footer{
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 100;
    height: rem(56);
    background: #ffffff;
    box-shadow: rem(5) 0 rem(5) #eee;
    ul{
        list-style: none;
        margin: 0;
        height:100%;
        font-size: rem(16);
        @include flex($jus: space-around);
        li{
          @include flex($jus: space-around);
          flex-direction: column;
          align-items: center;
          img{
            width: rem(24);
            height: rem(24);
          }
          p{
            font-size:rem(12);
            color:rgba(153,153,153,1);
            line-height:rem(17);
          }
        }
    }
    .active{
        color: #CC8C44;
    }
  }
</style>
