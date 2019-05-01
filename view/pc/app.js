import Vue from "vue";
import App from "./App.vue";
import VueRouter from "vue-router";
import router from "./router.js";
import "./scss/app.scss";

Vue.use(VueRouter);
new Vue({
  router,
  render: h => h(App)
}).$mount("#app");