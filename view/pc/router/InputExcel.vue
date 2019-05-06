<template lang="pug">
  div.container
    .page-header
      h4 用户列表
      el-upload(class="upload-demo" action="/excel/upload" name="excel" :on-success="handleRet" :on-error="errorHandler")
        el-button(size="small" type="primary") 点击上传解析
      hr
      el-button(size="medium" type="primary" style="float: right; margin: 20px" @click="enterDb") 入库
    el-table(:data="poorCells" stripe style="width: 100%")
      el-table-column(type="index" width="50")
      el-table-column(label="贫困户基本信息")
        el-table-column(prop="adds_1" label="乡镇")
        el-table-column(prop="adds_2" label="村社")
        el-table-column(prop="adds_3" label="组")
        el-table-column(prop="name" label="姓名")
        el-table-column(prop="cell.cellCode" label="户编号")
        el-table-column(prop="userCode" label="身份证号" width="200")
        el-table-column(prop="phone" label="联系电话" width="120")
      el-table-column(label="就业情况")
        el-table-column(prop="jobState" label="就业情况")
        el-table-column(prop="state" label="无劳动力状态")
        el-table-column(prop="jobType" label="就业类型")
        el-table-column(prop="workType" label="具体工种")
        el-table-column(prop="jobAdd" label="就业地")
        el-table-column(prop="salary" label="工资")
        el-table-column(prop="train" label="是否有培训意愿")
        el-table-column(prop="trainItem" label="培训意愿项目")
        el-table-column(prop="noJobSeason" label="未就业原因")
      el-table-column(label="帮扶责任人基本信息")
        el-table-column(prop="helpPerson.name" label="姓名")
        el-table-column(prop="helpPerson.position" label="职务" width="200")
        el-table-column(prop="helpPerson.phone" label="联系电话" width="120")
      el-table-column(fixed="right" label="操作" width="100")
        template(slot-scope="scope")
          el-button(@click="delPoorCell(scope.$index)" type="text" size="small") 删除
          el-button(@click="updatePoorCell1(scope.$index, scope.row)" type="text" size="small") 编辑
    el-dialog(title="编辑贫困人员信息" :visible.sync="dialogFormVisible")
      el-form(:model="editPoorCell" label-width="80px" size="mini" label-position="right")
        h4 贫困户基本信息
        hr
        el-row(:gutter="20")
          el-col(:span="8") 
            el-form-item(label="乡镇" label-width="80px")
              el-input(v-model="editPoorCell.adds_1")
          el-col(:span="8")
            el-form-item(label="村社" label-width="40px")
              el-input(v-model="editPoorCell.adds_2")
          el-col(:span="8")
            el-form-item(label="组" label-width="20px")
              el-input(v-model="editPoorCell.adds_3")
        el-row(:gutter="30")
          el-col(:span="12")
            el-form-item(label="姓名" label-width="100px")
              el-input(v-model="editPoorCell.name")
          el-col(:span="12")
            el-form-item(label="户编号" label-width="100px")
              el-input(v-model="editPoorCell.cell.cellCode")
        el-row(:gutter="30")
          el-col(:span="12")
            el-form-item(label="身份证号" label-width="100px")
              el-input(v-model="editPoorCell.userCode")
          el-col(:span="12")
            el-form-item(label="联系电话" label-width="100px")
              el-input(v-model="editPoorCell.phone")
        h4 就业情况
        hr
        el-row(:gutter="30")
          el-col(:span="12")
            el-form-item(label="就业情况" label-width="100px")
              el-input(v-model="editPoorCell.jobState")
          el-col(:span="12")
            el-form-item(label="无劳动力状态" label-width="100px")
              el-input(v-model="editPoorCell.state")
        el-row(:gutter="30")
          el-col(:span="12")
            el-form-item(label="就业类型" label-width="100px")
              el-input(v-model="editPoorCell.jobType")
          el-col(:span="12")
            el-form-item(label="具体工种" label-width="100px")
              el-input(v-model="editPoorCell.workType")
        el-row(:gutter="30")
          el-col(:span="12")
            el-form-item(label="就业地" label-width="100px")
              el-input(v-model="editPoorCell.jobAdd")
          el-col(:span="12")
            el-form-item(label="工资" label-width="100px")
              el-input(v-model="editPoorCell.salary")
        el-row(:gutter="30")
          el-col(:span="12")
            el-form-item(label="是否有培训意愿" label-width="100px")
              el-input(v-model="editPoorCell.train")
          el-col(:span="12")
            el-form-item(label="培训意愿项目" label-width="100px")
              el-input(v-model="editPoorCell.trainItem")
        el-row
          el-col(:span="24")
            el-form-item(label="未就业原因" label-width="100px")
              el-input(v-model="editPoorCell.noJobSeason")
        h4 帮扶责任人基本信息
        hr
        el-row(:gutter="8")
          el-col(:span="8")
            el-form-item(label="姓名" label-width="80px")
              el-input(v-model="editPoorCell.helpPerson.name")
          el-col(:span="8")
            el-form-item(label="职务" label-width="80px")
              el-input(v-model="editPoorCell.helpPerson.position")
          el-col(:span="8")
            el-form-item(label="联系电话" label-width="80px")
              el-input(v-model="editPoorCell.helpPerson.phone")
      .dialog-footer(slot="footer")
        el-button(@click="dialogFormVisible = false") 取消
        el-button(@click="updatePoorCell2") 确定
</template>

<script>
import axios from "axios";
import errorHandler from "../util/errorHandler.js";

export default {
  data() {
    return {
      poorCells: [],
      editPoorCell: {
        cell: {},
        helpPerson: {}
      },
      formLabelWidth: "130px",
      dialogFormVisible: false
    }
  },
  methods: {
    handleRet(res) {
      this.poorCells = res;
    },
    errorHandler,
    delPoorCell(index) {
      if(index >= 0)
        this.poorCells.splice(index, 1);
    },
    updatePoorCell1(index, poorCell) {
      this.dialogFormVisible = true;
      this.editPoorCell = poorCell;
      this.editPoorCell.index = index;
    },
    updatePoorCell2() {
      this.poorCells[this.editPoorCell.index] = this.editPoorCell;
      this.dialogFormVisible = false;
    },
    enterDb() {
      axios.post("/enterDb", this.poorCells).then(()=> {
        this.$message("入库成功")
        this.poorCells = [];
      }).catch(errorHandler)
    }
  }
}
</script>

<style scoped>
  form h4 {
    font-size: 14px;
  }
</style>

