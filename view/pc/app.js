import Vue from "vue";
import App from "./App.vue";
import VueRouter from "vue-router";
import VueBus from "vue-bus";
import router from "./router.js";
import "./scss/app.scss";
import "bootstrap/dist/js/bootstrap.js"
import ElementUI from 'element-ui';
import store from "./store.js";


Vue.use(VueBus);
Vue.use(VueRouter);
Vue.use(ElementUI);


const vue = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");

export default vue;