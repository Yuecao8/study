Vue.component('button-counter', {
    data: function () {
      return {
        count: 0
      }
    },
    template: '<button v-on:click="count++">You clicked me {{ count }} times.</button>'
  });
  Vue.component('sha', {
    data: function () {
      return {
        count: 0
      }
    },
    template: '<p @click="count++">你是一个傻子{{count}}</p>'
  })