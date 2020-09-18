import Vue from 'vue';
import { MessageBox, message, Option, Select, DatePicker, pagination, Loading, Dialog, aside, header, main, container, Button, Breadcrumb, BreadcrumbItem } from 'element-ui';
message.install = function (Vue, options) {
  Vue.prototype.$message = message;
};
MessageBox.install = function (Vue, options) {
  Vue.prototype.$MessageBox = MessageBox;
  Vue.prototype.$confirm = MessageBox.confirm;
  Vue.prototype.$alert = MessageBox.alert;
};
Vue.use(MessageBox);
Vue.use(message);
Vue.use(Option);
Vue.use(Select);
Vue.use(DatePicker);
Vue.use(pagination);
Vue.use(Loading);
Vue.use(Dialog);
Vue.use(aside);
Vue.use(header);
Vue.use(main);
Vue.use(container);
Vue.use(Button);
Vue.use(Breadcrumb);
Vue.use(BreadcrumbItem);
