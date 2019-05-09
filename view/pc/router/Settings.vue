<template lang="pug">
  .container.shadow.p-3.mb-5.bg-white.rounded
    el-collapse(v-model="activeName" accordion)
      el-collapse-item(title="乡镇/村社设置" name="adds")
        el-tree(:data="adds" :render-content="renderContent" :expand-on-click-node="false")
        el-button(type="primary" style="margin: 10px" @click="updateAddr") 保存
      el-collapse-item(title="就业情况选项设置")
        el-tag(:key="jobStateType" v-for="jobStateType in jobStateTypes" closable :disable-transitions="false" @close="handleClose(tag)") {{jobStateType}}
        el-input.input-new-tag(v-model="newJobStateType" v-if="inputVisible" size="small" ref="saveTagInput" @keyup.enter.native="handleInputConfirm")
        el-button.button-new-tag(v-else size="small" @click="showInput") + 新增就业情况
</template>

<script>
import axios from "axios";
import errorHandler from "../util/errorHandler.js";

export default {
  data() {
    return {
      jobStateTypes: [],
      newJobStateType: "",
      inputVisible: false,
      activeName: "",
      adds: []
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.getAdds();
      vm.getJobStateTypes();
    })
  },
  methods: {
    getJobStateTypes() {
      axios.get("/getJobStateType").then((res) => {
        this.jobStateTypes = res.data
      })
    },
    handleClose(tag) {
      this.jobStateTypes.splice(this.jobStateTypes.indexOf(tag), 1);
      axios.post("/postJobStateType", { jobStateTypes: this.jobStateTypes }).then(() => {
      }).catch(errorHandler);
    },
    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.focus();
      });
    },
    handleInputConfirm() {
      let inputValue = this.newJobStateType;
      this.newJobStateType = "";
      if (inputValue) {
        this.jobStateTypes.push(inputValue);
        axios.post("/postJobStateType", { jobStateTypes: this.jobStateTypes }).then(() => {
        }).catch(errorHandler);
      }
      this.inputVisible = false;
      this.inputValue = '';
    },
    getAdds() {
      axios.get("/getAdds").then((res) => {
        this.adds = res.data
      })
    },
    updateAddr() {
      axios.post("/updateAddr", {adds: this.adds}).then(() => {
        this.$message("更新成功")
      }).catch(errorHandler)
    },
    append(data) {
      this.$prompt("请输入城镇名",{
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(({ value }) => {
          let newChild;
          if(data.label) {
            newChild = { adds_1: value, children: [] };
          } else if(data.adds_1) {
            newChild = { adds_2: value};
          }
          if (!data.children) {
            this.$set(data, 'children', []);
          }
          data.children.push(newChild);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          });       
        });
      
    },

    remove(node, data) {
      const parent = node.parent;
      const children = parent.data.children || parent.data;
      const index = children.findIndex(d => d.id === data.id);
      children.splice(index, 1);
    },
    renderContent(h, { node, data, store }) {
      if(data.label) {
        return (<span style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;">
            <span>
              <span>{data.label}</span>
            </span>
            <span>
              <el-button size="mini" type="text" on-click={ () => this.append(data) }>新增</el-button>
            </span>
          </span>)
      }
      if(data.adds_1) {
        return (<span style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;">
            <span>
              <span>{data.adds_1}</span>
            </span>
            <span>
              <el-button size="mini" type="text" on-click={ () => this.append(data) }>新增</el-button>
              <el-button size="mini" type="text" on-click={ () => this.remove(node, data) }>删除</el-button>
            </span>
          </span>)
      }
      if(data.adds_2) {
        return (<span style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;">
            <span>
              <span>{data.adds_2}</span>
            </span>
            <span>
              <el-button size="mini" type="text" on-click={ () => this.remove(node, data) }>删除</el-button>
            </span>
          </span>)
      }
          
    }
  }
}
</script>

<style lang="sass" scoped>
  .el-collapse-item {
    text-align: right
  }
  .container {
    width: 70%;
    margin-top: 20px;
  }
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>

