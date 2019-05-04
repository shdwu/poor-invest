<template lang="pug">
  nav.navbar.navbar-light.bg-light.navbar-expand-lg
    .container
      router-link.navbar-brand(to='home')
        i.fa.fa-cube
        | 重庆市贫困人员就业情况或需要调查系统
      button.navbar-toggler(type='button' data-toggle='collapse' data-target='.navbar-collapse' aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation")
        span.navbar-toggler-icon
      .collapse.navbar-collapse
        ul.navbar-nav.mr-auto
          li.nav-item(:class="{active: title == 'home'}")
            router-link.nav-link(to='home') 首页
          li.nav-item(v-if="worker && worker.username == 'admin'" :class="{active: title == 'workers'}")
            router-link.nav-link(to='workers') 用户管理
          li.nav-item(:class="{active: title == 'contact'}")
            router-link.nav-link(to='contact') 联系我们
        ul.navbar-nav.navbar-right
          li.nav-item(v-if="!worker" :class="{active: title == 'login'}")
            router-link.nav-link(to='login') 登录
          li.nav-item.dropdown(v-else)
            a.nav-link.dropdown-toggle(href='#', data-toggle='dropdown')
              span(style="text-transform: none") {{worker.username}}
              i.caret
            .dropdown-menu
              router-link.dropdown-item(to='profile') 设置
              a.dropdown-item(href='#' @click='logout') 退出
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      title: 'login',
      worker: localStorage.worker? JSON.parse(localStorage.worker): false
    }
  },
  created() {
    this.$bus.on('changeWorker', this.changeWorker)
  },
  methods: {
    logout: function() {
      axios.get('/logout').then(() => {
        localStorage.removeItem("worker")
        this.$bus.emit('changeWorker')
        this.$router.go('login')
      })
    },
    changeWorker: function(worker) {
      this.worker = worker;
    }
  },
  watch: {
    "$route": function(to, from) {
      this.title = to.name
    }
  }
}
</script>

