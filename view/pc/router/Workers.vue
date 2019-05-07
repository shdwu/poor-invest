<template lang='pug'>
  .container
    .page-header
      h4 用户列表
      el-button.btn.btn-primary(type="button" style="float: right; margin-top: 19px" @click="dialogFormVisible = true;editWorker={};isUpdate=false")
        i.fa.fa-plus-circle
        | 新增工作人员
      hr      
    el-table(:data="workers" stripe style="width: 100%")
      el-table-column(prop="username" label="用户名")
      el-table-column(prop="name" label="姓名")
      el-table-column(prop="phone" label="电话")
      el-table-column(fixed="right" label="操作" width="100")
        template(slot-scope="scope")
          el-button(@click="delWorker(scope.row)" type="text" size="small") 删除
          el-button(@click="updateWorker1(scope.row)" type="text" size="small") 编辑
    el-dialog(title="新增工作人员" :visible.sync="dialogFormVisible")
      el-form(:model = "editWorker")
        el-form-item(label="用户名" :label-width="formLabelWidth")
          el-input(v-model="editWorker.username")
        el-form-item(label="密码" :label-width="formLabelWidth")
          el-input(v-model="editWorker.password")
        el-form-item(label="是否为就业局用户" :label-width="formLabelWidth")
          el-radio(v-model="editWorker.isBureau" :label="false") 否 
          el-radio(v-model="editWorker.isBureau" :label="true") 是
        el-form-item(label="姓名" :label-width="formLabelWidth")
          el-input(v-model="editWorker.name")
        el-form-item(label="电话" :label-width="formLabelWidth")
          el-input(v-model="editWorker.phone")
      .dialog-footer(slot="footer")
        el-button(@click="dialogFormVisible = false") 取消
        el-button(v-if="!isUpdate" @click="addWorker") 确定
        el-button(v-if="isUpdate" @click="updateWorker2") 更新
</template>

<script>
import axios from 'axios';
import errorHandler from "../util/errorHandler.js";

export default {
  data() {
    return {
      workers: [],
      dialogFormVisible: false,
      isUpdate: false,
      editWorker: {
        username: "",
        password: "",
        isBureau: "",
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
      }).catch(errorHandler)
    },
    addWorker: function(worker) {
      axios.post("/postAddWorker", {
        username: this.editWorker.username,
        password: this.editWorker.password,
        isBureau: this.editWorker.isBureau,
        name: this.editWorker.name,
        phone: this.editWorker.phone
      }).then((res) => {
        this.$message(res.data)
        this.getWorkers();
        this.editWorker = {}
        this.dialogFormVisible = false
      }).catch(errorHandler);
    },
    delWorker: function(worker) {
      axios.get("/delWorker", {
        params: {
          id: worker._id
        }
      }).then((res) => {
        this.$message(res.data)
        this.getWorkers();
      }).catch(errorHandler)
    },
    updateWorker1: function(worker) {
      this.editWorker = worker;
      this.editWorker.password = "*******";
      this.dialogFormVisible = true;
      this.isUpdate = true;
    },
    updateWorker2: function() {
      axios.post("/updateWorker", {
        id: this.editWorker._id,
        username: this.editWorker.username,
        password: this.editWorker.password,
        isBureau: this.editWorker.isBureau,
        name: this.editWorker.name,
        phone: this.editWorker.phone
      }).then((res) => {
        this.$bus.emit("success", res.data.success)
        this.getWorkers();
        this.dialogFormVisible = false;
        this.isUpdate = false;
        this.editWorker = {}
      }).catch(errorHandler)
    }
  }
}
</script>
