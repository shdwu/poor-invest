<template lang="pug">
  div.container
    .page-header
      h4 用户列表
      hr
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
          el-button(@click="delPoorCell(scope.$index, scope.row)" type="text" size="small") 删除
          el-button(@click="updatePoorCell1(scope.$index, scope.row)" type="text" size="small") 编辑
    el-pagination(background layout="total, prev, pager, next" :total="num" @current-change="getPoorCells")
    el-dialog(title="编辑贫困人员信息" :visible.sync="dialogFormVisible")
      el-form(:model="editPoorCell" label-width="80px" size="mini" label-position="left")
        h4 贫困户基本信息
        hr
        el-row(:gutter="20")
          el-col(:span="12") 
            el-form-item(label="乡镇" label-width="100px")
              el-input(v-model="editPoorCell.adds_1")
          el-col(:span="12")
            el-form-item(label="村社" label-width="100px")
              el-input(v-model="editPoorCell.adds_2")
        el-row(:gutter="20")
          el-col(:span="12")
            el-form-item(label="组" label-width="100px")
              el-input(v-model="editPoorCell.adds_3")
          el-col(:span="12")
            el-form-item(label="姓名" label-width="100px")
              el-input(v-model="editPoorCell.name")
        el-row(:gutter="20")
          el-col(:span="12")
            el-form-item(label="户编号" label-width="100px")
              el-input(v-model="editPoorCell.cell.cellCode")
          el-col(:span="12")
            el-form-item(label="身份证号" label-width="100px")
              el-input(v-model="editPoorCell.userCode")
        h4 就业情况
        hr
        el-row(:gutter="20")
          el-col(:span="12")
            el-form-item(label="联系电话" label-width="100px")
              el-input(v-model="editPoorCell.phone")
          el-col(:span="12")
            el-form-item(label="就业情况" label-width="100px")
              el-input(v-model="editPoorCell.jobState")
        el-row(:gutter="20")
          el-col(:span="12")
            el-form-item(label="无劳动力状态" label-width="100px")
              el-input(v-model="editPoorCell.state")
          el-col(:span="12")
            el-form-item(label="就业类型" label-width="100px")
              el-input(v-model="editPoorCell.jobType")
        el-row(:gutter="20")
          el-col(:span="12")
            el-form-item(label="具体工种" label-width="100px")
              el-input(v-model="editPoorCell.workType")
          el-col(:span="12")
            el-form-item(label="就业地" label-width="100px")
              el-input(v-model="editPoorCell.jobAdd")
        el-row(:gutter="20")
          el-col(:span="12")
            el-form-item(label="工资" label-width="100px")
              el-input(v-model="editPoorCell.salary")
          el-col(:span="12")
            el-form-item(label="是否有培训意愿" label-width="100px")
              el-input(v-model="editPoorCell.train")
        el-row
          el-col(:span="12")
            el-form-item(label="培训意愿项目" label-width="100px")
              el-input(v-model="editPoorCell.trainItem")
          el-col(:span="12")
            el-form-item(label="未就业原因" label-width="100px")
              el-input(v-model="editPoorCell.noJobSeason")
        h4 帮扶责任人基本信息
        hr
        el-row(:gutter="20")
          el-col(:span="12")
            el-form-item(label="姓名" label-width="80px")
              el-input(v-model="editPoorCell.helpPerson.name")
          el-col(:span="12")
            el-form-item(label="职务" label-width="80px")
              el-input(v-model="editPoorCell.helpPerson.position")
        el-row(:gutter="20")
          el-col(:span="12")
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
      dialogFormVisible: false,
      num: 0,
      page: 0
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.getPoorCells();
    })
  },
  methods: {
    delPoorCell(index, poorCell) {
      axios.get("/delPoorCell",{
        params: {
          id: poorCell._id
        }
      }).then(() => {
        this.$message("删除成功");
        this.getPoorCells();
      }).catch((res) => {
        this.$message.error(res.data);
      })
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
    getPoorCells(page) {
      axios.get("/poorCells", {
        params: {
          page
        }
      }).then((res) => {
        this.poorCells = res.data.poorCells;
        this.num = res.data.num,
        this.page = res.data.page
      }).catch(errorHandler);
    }
  }
}
</script>

<style scoped>
  form h4 {
    font-size: 14px;
  }

  div.el-pagination {
    text-align: right;
  }
</style>

