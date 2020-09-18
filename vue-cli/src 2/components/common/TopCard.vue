<template>
  <div class="top-card">
      <div v-for="(item,index) in data" :key="index" class="box flex-v-center flex-between">
        <div class="flex-v-center">
          <span class="first imgs d-inline-block" v-if="index==0">
            <span class="font-mini">{{index+1}}</span>
          </span>
          <span class="second imgs d-inline-block" alt="" v-if="index==1">
            <span class="font-mini">{{index+1}}</span>
          </span>
          <span class="third imgs d-inline-block" alt="" v-if="index==2">
            <span class="font-mini">{{index+1}}</span>
          </span>
          <span class="usual imgs d-inline-block" alt="" v-if="index>2">
            <span class="font-mini" v-if="index<9">{{index+1}}</span>
            <span class="font-mini font-last" v-if="index==9">{{index+1}}</span>
          </span>
          <span class="top-card-title">{{item.name}}</span>
        </div>
        <div>{{item.num}}</div>

      </div>
  </div>
</template>

<script>

export default {
  name: 'TopCard',
  props: ['data'],
  data () {
    return {
    };
  },
  methods: {

  },
  mounted () {
  },
};
</script>
<style lang="scss" scoped>
.top-card{
  font-size: 13px;
  color: #333333;
  .box{
    background: #FCFCFC;
    margin-bottom:5px;
    padding:9px 15px;
    height: 30px;
    width: 100%;
  }
  .font-mini{
    font-size: 16px;
    color:white;
    position: relative;
    top: 6px;
    left: 5px;
  }
  .font-last{
    font-size: 14px;
    position: relative;
    top: 7px;
    left: 1px;
  }
  .first{
    background: url('~@/assets/image/content_paihangbang_01_icon_default@2x.png') no-repeat center;
    background-size:20px 24px;
    width: 20px;
    height: 24px;
    transform: scale(0.6);
  }
  .second{
    background: url('~@/assets/image/content_paihangbang_02_icon_default@2x.png') no-repeat center;
    background-size:20px 24px;
    width: 20px;
    height: 24px;
   transform: scale(0.6);
  }
  .third{
    background: url('~@/assets/image/content_paihangbang_03_icon_default@2x.png') no-repeat center;
    background-size:20px 24px;
    width: 20px;
    height: 24px;
    transform: scale(0.6);
  }
  .usual{
    background: url('~@/assets/image/content_paihangbang_04_icon_default@2x.png') no-repeat center;
    background-size:20px 24px;
    width: 20px;
    height: 24px;
    transform: scale(0.6);
  }
  .top-card-title{
    display: inline-block;
    margin-left:8px;
  }
}
</style>
