import Vue from "vue";
import App from "./App.vue";
import VueRouter from "vue-router";
import VueBus from "vue-bus";
import router from "./router.js";
import "./scss/app.scss";
import "bootstrap/dist/js/bootstrap.js"

Vue.use(VueBus);
Vue.use(VueRouter);
new Vue({
  router,
  render: h => h(App)
}).$mount("#app");