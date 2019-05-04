import VueRouter from "vue-router";

// 路由组件
import Home from "./router/Home.vue";
import Login from "./router/Login.vue";
import Profile from "./router/Profile.vue";
import Workers from "./router/Workers.vue";

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
  if(!localStorage.worker && to.name !== "login") {
    return next({name: "login"})
  }
  next();
})


export default router;
