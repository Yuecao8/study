//opt传入的数据
//keys 存入sessionStorage的 :key
//checkbox宽度
//destroyed () {
    window.sessionStorage.removeItem('site');
    window.sessionStorage.removeItem('type');
  },const siteSelect = JSON.parse(window.sessionStorage.getItem('site'));
      if (siteSelect) {
        const ids = [];
        siteSelect.forEach((vv) => {
          ids.push(vv.id);
        });
        param.site_id = ids.join(',');
      }
<template>
  <div class="checkbox-select d-inline-block">
      <label class="flex ellipsis" :style="{'width':widths}"><input name="all" type="checkbox" value="all" :checked="isCheckedAll()" @click="handleCheckAllChange()"/>全选 </label>
      <label  :style="{'width':widths}" class="ellipsis" :title="item.name" v-for="(item,key) in opt" :key="key"><input :checked="isCheckedItem(item)"  @change="changeCheckedItem(item)" :name="item.id" type="checkbox" :value="item.id" />{{item.name}}</label>
  </div>
</template>

<script>

export default {
  name: 'CheckboxSelect',
  props: ['opt', 'keys', 'widths'],
  data () {
    return {
      selectList: [],
      num: 0,
    };
  },
  methods: {
    // 全选
    isCheckedItem (item) {
      return this.selectList.findIndex(obj => obj.id === item.id) > -1;
    },
    changeCheckedItem (item) {
      if (this.selectList.findIndex(obj => obj.id === item.id) > -1) {
        this.selectList.splice(this.selectList.findIndex(obj => obj.id === item.id), 1);
      } else {
        this.selectList.push(item);
      }
    },
    isCheckedAll (value) {
      return this.selectList.length === this.opt.length;
    },
    handleCheckAllChange (value) {
      if (this.selectList.length === this.opt.length) {
        this.selectList = [];
      } else {
        this.selectList = [];
        this.opt.forEach((vv) => {
          this.selectList.push(vv);
        });
      }
    },
  },
  watch: {
    selectList (curVal, oldVal) {
      if (this.opt && this.opt.length) {
        window.sessionStorage.setItem(this.keys, JSON.stringify(curVal));
        this.$emit(`checkbox-${this.keys}`);
      }
    },
    opt (curVal, oldVal) {
      this.selectList = JSON.parse(window.sessionStorage.getItem(this.keys)) ? JSON.parse(window.sessionStorage.getItem(this.keys)) : JSON.parse(JSON.stringify(curVal));
    },
  },
  mounted () {
    this.selectList = JSON.parse(window.sessionStorage.getItem(this.keys)) ? JSON.parse(window.sessionStorage.getItem(this.keys)) : JSON.parse(JSON.stringify(this.opt));
  },
  destroyed () {
    window.sessionStorage.removeItem(this.keys);
  },
};
</script>

<style lang="scss" scoped>
label{
  font-size: 12px;
  color: #333333;
  line-height: 12px;
  display: inline-block;
}

</style>
