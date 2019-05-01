import VueRouter from "vue-router";

// 路由组件
import Home from "./router/Home.vue";
import Login from "./router/Login.vue";

const routes = [
  {
    path: "/login",
    name: "login",
    component: Login
  },
  {
    path: "/home",
    name: "home",
    componest: Home
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
  if(!sessionStorage.user && to.name != "login") {
    next({name: "login"})
  }
  next();
})


export default router;
