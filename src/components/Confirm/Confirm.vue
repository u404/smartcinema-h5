<template>
  <div class="confirm" v-if="show" @click.self="closable && close()" >
      <div class="confirm-container">
        <div class="confirm-inner" >
          <header v-if="title">{{title}}</header>
          <p :style="`color:${msgColor}`" v-html="msg"></p>
          <div>
            <span v-if="cancelText" :style="`color:${cancelTextColor}`" @touchstart.prevent="cancelClick" class="close">{{ cancelText }}</span>
            <span v-if="confirmText"  :style="`color:${confirmTextColor}`" @touchstart.prevent="confirmClick">{{ confirmText }}</span>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ""
    },
    msg: {
      type: String,
      default: ""
    },
    cancelText: {
      type: String,
      default: ""
    },
    confirmText: {
      type: String,
      default: ""
    },
    confirmVisiable: {
      type: Boolean,
      default: false
    },
    cancelTextColor: {
      type: String,
      default: ""
    },
    confirmTextColor: {
      type: String,
      default: ""
    },
    msgColor: {
      type: String,
      default: ""
    },
    closable: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      show: false,
      promiseStatus: null
    }
  },
  methods: {
    confirm () {
      let _this = this
      this.show = true
      return new Promise(function (resolve, reject) {
        _this.promiseStatus = { resolve, reject }
      })
    },
    close () {
      let _this = this
      this.show = false
      return new Promise(function (resolve, reject) {
        _this.promiseStatus = { resolve, reject }
      })
    },
    cancelClick () {
      this.show = false
      this.promiseStatus && this.promiseStatus.reject()
    },
    confirmClick () {
      this.show = false
      this.promiseStatus && this.promiseStatus.resolve()
    }
  }
}
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
