import Vue from "vue";
import App from "./App.vue";
import VueRouter from "vue-router";
import VueBus from "vue-bus";
import router from "./router.js";
import "./scss/app.scss";
import "bootstrap/dist/js/bootstrap.js"
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(VueBus);
Vue.use(VueRouter);
Vue.use(ElementUI);
new Vue({
  router,
  render: h => h(App)
}).$mount("#app");