<template lang="pug">
  div.container
    .page-header
      h4 用户信息
      hr
    form
      .form-group.row
        label.col-sm-3.col-form-label.text-right(for='name') 姓名
        .col-sm-7
          input.form-control(type='text' v-model='worker.name' placeholder='姓名' required)
      .form-group.row
        label.col-sm-3.col-form-label.text-right(for='phone') 电话
        .col-sm-7
          input.form-control(type='text' v-model='worker.phone' placeholder='电话' required)
      .form-group.row
        .offset-sm-3.col-sm-4
          button.col-sm-3.btn.btn-primary(type="button" @click = "doUpdate")
            i.fa.fa-pencil
            | 更新
    .page-header
      h4 修改密码
      hr
    form
      .form-group.row
        label.col-sm-3.col-form-label.text-right(for='password') 新密码
        .col-sm-7
          input.form-control(type='password' v-model='password' placeholder='新密码' required)
      .form-group.row
        label.col-sm-3.col-form-label.text-right(for='confirmPassword') 再输入一次
        .col-sm-7
          input.form-control(type='password' v-model='confirmPassword' placeholder='再输入一次' required)
      .form-group.row
        .offset-sm-3.col-sm-4
          button.col-sm-4.btn.btn-primary(type="button" @click = "doUpdatePassword")
            i.fa.fa-lock
            | 修改密码
</template>

<script>
import axios from 'axios';
import { error } from 'util';

export default {
  data() {
    return {
      worker: JSON.parse(localStorage.worker),
      password: '',
      confirmPassword: ''
    }
  },
  methods: {
    doUpdate: function(event) {
      axios.post('/postUpdate', {
        name: this.worker.name,
        phone: this.worker.phone
      }).then((response) => {
        localStorage.worker = JSON.stringify(response.data);
        this.$bus.emit('updateWorker', response.data);
        this.$bus.emit('success', [{msg: "更新成功"}]);
      }).catch(err => {
        if(err.response.status == 401) {
          localStorage.removeItem('worker');
          this.$bus.emit('updateWorker');
          this.$router.go({ name: 'login'});
        }
        this.$bus.emit('errors', err.response.data.errors)
      })
    },
    doUpdatePassword: function(event) {
      if(this.password !== this.confirmPassword) {
        this.$bus.emit('errors', [{msg: "两次输入的密码不匹配"}]);
        return;
      }
      axios.post('/postUpdatePassword', {
        password: this.password,
        confirmPassword: this.confirmPassword
      }).then((response) => {
        localStorage.worker = JSON.stringify(response.data);
        this.$bus.emit('success', [{msg: "更新成功"}]);
      }).catch(err => {
        if(err.response.status == 401) {
          localStorage.removeItem('worker');
          this.$router.go({ name: 'login'});
        }
        this.$bus.emit('errors', err.response.data.errors)
      })
    }
  }
}
</script>

<style lang="sass" scoped>
  
</style>

