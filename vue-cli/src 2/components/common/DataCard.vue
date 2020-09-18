/***显示数据的卡片
** beforeImg
** options:{
**   colorStyle:,// colorStyle 颜色风格
**   title:,//标题
**   brief:,//右侧小字
**   num:,//数字
**   beforeImg:,brief前面的图标
**   afterImg:
**   afterUrl:
**  }
**
****/
<template>
  <div class="data-card" :class="options.colorStyle">
      <div class="flex-v-center flex-between">
        <span class="card-title">{{options.title}}</span>
        <span class="flex-v-center">
          <span class="before-img" v-if="options.beforeImg"></span>
           <span class="card-title">{{options.brief}}</span>
          <span class="after-img" v-if="options.afterImg"></span>
        </span>
      </div>
      <div class="card-num">{{localString(options.num)}}</div>
  </div>
</template>

<script>

export default {

  name: 'DataCard',
  props: ['options'],
  data () {
    return {

    };
  },
  methods: {
    localString (num) {
      console.log(this.checkRate(num));
      if (this.checkRate(num)) {
        return parseInt(num, 10).toLocaleString();
      }
      return num;
    },
    checkRate (input) {
      if (!/^\d+$/.test(input)) {
        // alert(“请输入数字……”);
        return false;
      } else {
        return true;
      }
    },
  },
  mounted () {
  },
};
</script>

<style lang="scss" scoped>
.data-card{
  width: 255px;
  padding:20px;
  color: #FFFFFF;
  .card-title{
      font-size: 12px;
      line-height: 12px;
  }
  .card-num{
    margin-top:12px;
    font-size: 30px;
    line-height: 30px;
  }
  .before-img{
    @include icon-img('~@/assets/logo.png',10px,10px,10px,10px);
  }
  // .after-img{
  //   @include icon-img('~@/assets/image/content_help_icon_default@2x.png',10px,10px,10px,10px);
  // }
}
.green-style{
    width: 255px;
    height: 94px;
    @include img-retina('~@/assets/image/content_zhibiao02_01_bg_default.png','~@/assets/image/content_zhibiao02_01_bg_default@2x.png',255px,94px);
}
.purple-style{
    width: 255px;
    height: 94px;
    @include img-retina('~@/assets/image/content_zhibiao02_05_bg_default.png','~@/assets/image/content_zhibiao02_05_bg_default@2x.png',255px,94px);
}
.blue-style{
  width: 255px;
  height: 94px;
  @include img-retina('~@/assets/image/content_zhibiao02_03_bg_default.png','~@/assets/image/content_zhibiao02_03_bg_default@2x.png',255px,94px);
}
.red-style{
   width: 255px;
  height: 94px;
  @include img-retina('~@/assets/image/content_zhibiao02_02_bg_default.png','~@/assets/image/content_zhibiao02_02_bg_default@2x.png',255px,94px);
}
.orange-style{
   width: 255px;
  height: 94px;
  @include img-retina('~@/assets/image/content_zhibiao02_04_bg_default.png','~@/assets/image/content_zhibiao02_04_bg_default@2x.png',255px,94px);
}
</style>
