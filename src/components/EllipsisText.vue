<template>
  <div :class="['vx-ellipsis-text', showAll ? 'reveal' : '']" :style="{'max-height': maxHeight}">
    <div class="ellipsis-container" :style="{'-webkit-line-clamp': line, 'fontSize': revealWidth + 'px'}">
      <div class="ellipsis-content html" ref="txtContent" v-html="content" v-if="isHtml"></div>
      <div class="ellipsis-content more" ref="txtContent" v-else>{{content | trimEnter}}</div>
      <div class="ellipsis-ghost">
        <div class="ellipsis-placeholder" :style="{'height': maxHeight}"></div>
        <div :class="['ellipsis-more', isHtml ? 'html' : '']" :style="{'width': revealWidth + 'px', 'color': revealTextColor}" @click="more">{{revealText}}</div>
      </div>
    </div>
    <div class="ellipsis-fold-text" :style="{'color': foldTextColor}" v-if="showAll" @click="fold">{{foldText}}</div>
  </div>
</template>

<script>
export default {
  filters: {
    trimEnter (data) {
      return data ? data.replace(/[\r\n]/g, "") : ""
    }
  },
  props: {
    /* 文字内容 */
    content: {
      type: String
      // default: '这是一段示例文字，用来测试的。这是一段示例文字，用来测试的。这是一段示例文字，用来测试的。这是一段示例文字，用来测试的。这是一段示例文字，用来测试的。这是一段示例文字，用来测试的。这是一段示例文字，用来测试的。'
    },
    /* 展示几行文字 */
    line: {
      type: Number,
      default: 1
    },
    /* 点击更多时候是否触发展开操作 */
    triggerMore: {
      type: Boolean,
      default: true
    },
    /* 是否是html内容 */
    isHtml: {
      type: Boolean,
      default: false
    },
    /* 更多按钮宽度 */
    revealWidth: {
      type: Number,
      default: 70
    },
    /* 更多按钮文案 */
    revealText: {
      type: String,
      default: "全部"
    },
    /* 收起按钮文案 */
    foldText: {
      type: String,
      default: "收起"
    },
    /* 更多按钮颜色 */
    revealTextColor: {
      type: String,
      default: "#ffffff"
    },
    /* 收起按钮颜色 */
    foldTextColor: {
      type: String,
      default: ""
    },
    lineHeight: {
      type: Number,
      default: 20
    },
    fontSize: {
      type: Number,
      default: 14
    },
    showAll: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      defaultLineHeight: 0
    }
  },
  computed: {
    maxHeight () {
      return this.lineHeight * this.line + "px"
    }
  },
  watch: {
    content () {
      this.showAll = false
    }
  },
  mounted () {
    this.$nextTick(() => {
      let txtEle = this.$refs.txtContent
      if (txtEle.currentStyle) {
        this.fontSize = Number(txtEle.currentStyle.fontSize.replace("px", ""))
        this.lineHeight = Number(
          txtEle.currentStyle.lineHeight.replace("px", "")
        )
      } else {
        this.fontSize = Number(
          getComputedStyle(txtEle).fontSize.replace("px", "")
        )
        this.lineHeight = Number(
          getComputedStyle(txtEle).lineHeight.replace("px", "")
        )
      }
      this.defaultLineHeight = this.lineHeight
    })
    this.monitoring()
  },
  methods: {
    /* 展开 */
    more () {
      this.$emit("reveal")
      if (this.triggerMore) {
        this.showAll = true
        this.lineHeight = 9999
      }
    },
    /* 收起 */
    fold () {
      this.$emit("fold")
      this.showAll = false
      this.lineHeight = this.defaultLineHeight
    },
    monitoring () {
      this.$on("resetHandle", (res) => {
        this.fold()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
/*
 * 行高 h
 * 字号 f
 * 最大行数 n
 * ...更多容器的宽 w
 */
.vx-ellipsis-text {
  @keyframes width-change {
    0%,
    100% {
      width: 100%;
    }
    50% {
      width: 30%;
    }
  }
  position: relative;
  width: 100%;
  max-height: rem(66); /* h*n */
  line-height: rem(22); /* h */
  overflow: hidden;
  color: #333;
  .ellipsis-container {
    position: relative;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: rem(3); /* n */
    font-size: rem(70); /* w */
    color: transparent;
    span {
      display: -webkit-box;
    }
  }
  .ellipsis-content {
    vertical-align: top;
    color: rgba(255, 255, 255, 0.6);
    display: -webkit-box;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-box-orient: vertical;
    font-size: rem(14);
    white-space: pre-wrap;
  }
  .ellipsis-ghost {
    position: absolute;
    z-index: 1;
    top: 0;
    left: 50%;
    width: 100%;
    height: 100%;
    color: #000;
  }
  .ellipsis-ghost:before {
    content: '';
    display: block;
    float: right;
    width: 50%;
    height: 100%;
  }
  .ellipsis-placeholder {
    content: '';
    display: block;
    float: right;
    width: 50%;
    height: rem(66);
  }
  .ellipsis-more {
    float: right;
    text-align: right;
    font-size: rem(14);
    width: rem(50);
    height: rem(22);
    margin-top: rem(-22);
    cursor: pointer;
    color: #999999;
    padding-left: rem(20);
    background:#111111;
  }
  .ellipsis-fold-text {
    position: relative;
    z-index: 5;
    cursor: pointer;
    font-size: rem(12);
    color: #999999;
  }
  &.reveal {
    max-height: auto !important;
    .ellipsis-container {
      display: block !important;
    }
  }
}
</style>
