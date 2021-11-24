<template>
  <section class="card"  @click.stop="$emit('toDetail', filmData)" >
      <section class="pic">
          <img :src="filmData.posterUrl || filmData.filmImgPath" />
      </section>
      <section class="info">
          <article class="country">
              <p>{{filmData.director}}/{{filmData.filmCountry}}</p>
              <p>导演及国家</p>
          </article>
          <article class="type">
              <p>{{filmData.filmType}}</p>
              <p>影片类型</p>
          </article>
          <button class="buy btn" @click.stop="$emit('pay', filmData)">{{filmData.ticketNo? "去观影" : "去购票"}}</button>
      </section>
  </section>
</template>

<script>
export default {
  props: {
    filmData: {
      type: Object,
      default: () => {}
    }
  }
}
</script>

<style lang="scss" scoped>
.card{
    width: 100%;
    padding:0 rem(15) rem(30);
    box-sizing: border-box;
    .pic{
        font-size: 0;
        width:rem(345);
        height:rem(210);
        background:rgba(0,0,0,0.06);
        box-shadow:0 rem(8) rem(12) 0 rgba(0,0,0,0.15);
        img{
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius:rem(4);
        }
    }
    .info{
        margin-top: rem(12);
        width:rem(345);
        position: relative;
        @include flex;
        .type,.country{
            @include flex($flow:column, $ali:flex-start);
            &>p:first-of-type{
                width: rem(110);
                height:rem(17);
                font-size:rem(12);
                color:rgba(51,51,51,1);
                line-height:rem(17);
                @include text-ellipsis();
            }
            &>p:last-of-type{
                height:rem(16);
                font-size:rem(11);
                font-weight:400;
                color:rgba(153,153,153,1);
                line-height:rem(16);
            }
        }
        .type{
            position: absolute;
            left: 0;
            right: 0;
            margin: auto;
            width: rem(150);
            @include text-ellipsis();
            @include flex($flow:column);
            p{
                text-align: center;
            }
        }
        .buy{
            width: rem(71);
            height: rem(30);
            line-height: rem(30);
            border-radius: rem(15);
            font-size: rem(16);
            color: #ffffff;
            background-color: orange;
        }
    }
}
</style>
