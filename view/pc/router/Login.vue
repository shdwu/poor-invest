<template lang="pug">
  div.container
    .page-header
      h4 用户登录
      hr
    form
      input(type='hidden', name='_csrf', value=_csrf)
      .form-group.row
        label.col-sm-3.col-form-label.text-right(for='username') 用户名
        .col-sm-7
          input.form-control(type='text' v-model='username' placeholder='用户名' autofocus required)
      .form-group.row
        label.col-sm-3.col-form-label.text-right(for='password') 密码
        .col-sm-7
          input.form-control(type='password' v-model='password' placeholder='密码' required)
      .form-group.row
        label.col-sm-3.col-form-label.text-right(for='code' style="padding-top: 20px") 验证码
        .col-sm-4(style="padding-top: 12px")
          input.form-control(type='text' v-model='code' placeholder='验证码' required)
        .col-sm-3
          img(src="/getCaptcha" class="img-fluid" alt="验证码")
      .form-group.row
        .offset-sm-3.col-sm-7
          button.col-sm-3.btn.btn-primary(type="button" @click = "doLogin")
            i.fa.fa-user
            | 登录
      .form-group.row
        .offset-sm-3.col-sm-7
          hr
</template>

<script>
import axios from 'axios';
import { error } from 'util';

export default {
  data() {
    return {
      username: '',
      password:'',
      code:''
    }
  },
  methods: {
    doLogin: function(event) {
      axios.post('/postLogin', {
        username: this.username,
        password: this.password,
        code: this.code
      }).catch(err => {
        this.$bus.emit('errors', err)
      })
    }
  }
}
</script>

<style lang="sass" scoped>
  .page-header {
    margin: 1.5rem 0;

    & > h4 {
      font-size: 20px
    }
  }
</style>

