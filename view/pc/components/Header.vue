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
          li.nav-item(:class="[title == 'home' ? active : '']")
            router-link.nav-link(to='home') 首页
          li.nav-item(v-if="worker && worker.username == 'admin'" :class="[title == 'workers'] ? 'active' : ''")
            router-link.nav-link(to='worker') 用户管理
          li.nav-item(:class="[title == 'contact' ? 'active': '']")
            router-link.nav-link(to='contact') 联系我们
        ul.navbar-nav.navbar-right
          li.nav-item(v-if="!worker" :class="[title == 'login' ? 'active' : '']")
            router-link.nav-link(to='login') 登录
          li.nav-item.dropdown(v-else)
            a.nav-link.dropdown-toggle(href='#', data-toggle='dropdown')
              span(style="text-transform: none") {{worker.username}}
              i.caret
            ul.dropdown-menu
              li
                a(href='/pc/worker') 设置
              li.divider
              li
                a(href='/pc/logout') 退出
</template>

<script>
export default {
  data() {
    return {
      title: 'login',
      worker: undefined
    }
  },
  watch: {
    "$route": (to, from) => {
      this.title = to.name
    }
  }
}
</script>

