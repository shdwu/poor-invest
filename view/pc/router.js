import VueRouter from "vue-router";
import store from "./store.js"

// 路由组件
import Home from "./router/Home.vue";
import Login from "./router/Login.vue";
import Profile from "./router/Profile.vue";
import Workers from "./router/Workers.vue";
import InputExcel from "./router/InputExcel.vue";
import Settings from "./router/Settings.vue";

const routes = [
  {
    path: "/login",
    name: "login",
    component: Login
  },
  {
    path: "/home",
    name: "home",
    component: Home
  },{
    path: "/profile",
    name: "profile",
    component: Profile
  },
  {
    path: "/workers",
    name: "workers",
    component: Workers
  },
  {
    path: "/excel",
    name: "excel",
    component: InputExcel
  },
  {
    path: "/settings",
    name: "settings",
    component: Settings
  },
  {
    path: "/",
    redirect: { name: "home"}
  }
];

var router =  new VueRouter({
  mode: "history",
  base: "/pc",
  routes
});

router.beforeEach((to, from, next) => {
  if(!store.state.worker && to.name !== 'login') {
    return next({name: "login"})
  }else {
    store.commit("setTitle", to.name);
    next();
  }
})

export default router;
