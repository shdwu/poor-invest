<template lang='pug'>
  .container
    .page-header
      h4 用户列表
      el-button.btn.btn-primary(type="button" style="float: right; margin-top: 19px" @click="dialogFormVisible = true")
        i.fa.fa-plus-circle
        | 新增工作人员
      hr      
    el-table(:data="workers" stripe style="width: 100%")
      el-table-column(prop="username" label="用户名")
      el-table-column(prop="name" label="姓名")
      el-table-column(prop="phone" label="电话")
    el-dialog(title="新增工作人员" :visible.sync="dialogFormVisible")
      el-form(:model = "editWorker")
        el-form-item(label="用户名" :label-width="formLabelWidth")
          el-input(v-model="editWorker.username")
        el-form-item(label="密码" :label-width="formLabelWidth")
          el-input(v-model="editWorker.password")
        el-form-item(label="姓名" :label-width="formLabelWidth")
          el-input(v-model="editWorker.name")
        el-form-item(label="电话" :label-width="formLabelWidth")
          el-input(v-model="editWorker.phone")
      .dialog-footer(slot="footer")
        el-button(@click="dialogFormVisible = false") 取消
        el-button(@click="dialogFormVisible = false") 确定
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      workers: [],
      dialogFormVisible: false,
      editWorker: {
        username: "",
        password: "",
        name: "",
        phone: ""
      },
      formLabelWidth: "130px"
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.getWorkers();
    })
  },
  methods: {
    getWorkers: function() {
      axios.get("/workers").then((res) => {
        this.workers = res.data.workers
      }).catch((err) => {
        if(err.response.status == 401) {
          localStorage.removeItem('worker');
          this.$router.go({ name: 'login'});
        }
      })
    }
  }
}
</script>
