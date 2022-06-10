<template>
  <div class="params">
    <el-breadcrumb separator="/"
                   style="font-size: 12px;">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品参数</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <!-- 选择分类提示提示 -->
      <el-alert title="注意: 只允许为第三级分类设置相关参数!"
                type="info"
                effect="dark"
                show-icon
                :closable="false">
      </el-alert>

      <!-- 选择分类框 -->
      <div class="cate-box">
        <span>选择商品分类：</span>
        <el-cascader v-model="cateValue"
                     :options="cateData"
                     :props="props"
                     @change="handleChange"></el-cascader>
      </div>
      <!-- tabs标签页区域 -->
      <el-tabs v-model="activeName"
               @tab-click="handleClick">
        <el-tab-pane label="用户管理"
                     name="many">
          <el-button type="primary"
                     size="mini" @click="addAttrDialog = true" :disabled="isBtn">添加参数</el-button>
        </el-tab-pane>
        <el-tab-pane label="配置管理"
                     name="only">
          <el-button type="primary"
                     size="mini" @click="addAttrDialog = true" :disabled="isBtn">添加属性</el-button>
        </el-tab-pane>
      </el-tabs>

      <!-- 表格区域 -->
      <el-table :data="attrData"
                style="width: 100%"
                border
                class="table-box">
        <el-table-column type="expand"
                         class="expand-column">
          <template #default="scoped">

            <el-tag :key="index"
                    v-for="(tag,index) in scoped.row.attr_vals"
                    closable
                    :disable-transitions="false"
                    @close="handleClose(scoped.row,index)">
              {{tag}}
            </el-tag>
            <el-input class="input-new-tag"
                      v-if="scoped.row.iptTagVisible"
                      v-model="scoped.row.iptTagValue"
                      ref="saveManyTagInput"
                      size="small"
                      @keyup.enter.native="handleInputConfirm(scoped.row)"
                      @blur="handleInputConfirm(scoped.row)">
            </el-input>
            <el-button v-else
                       class="button-new-tag"
                       size="small"
                       @click="showInput(scoped.row)">+ New Tag</el-button>
          </template>
        </el-table-column>
        <el-table-column type="index"
                         width="50"
                         label="#">
        </el-table-column>
        <el-table-column label="参数名称"
                         prop="attr_name">
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scoped">
            <el-button type="primary"
                       icon="el-icon-edit"
                       size="mini"
                       @click="editAttrClick(scoped.row)">编辑</el-button>
            <el-button type="danger"
                       icon="el-icon-delete"
                       size="mini"
                       @click="deleteAttrClick(scoped.row.attr_id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加动态参数和静态属性 -->
    <el-dialog :title="'添加' + [activeName == 'many' ? '动态参数':'静态属性']"
               :visible.sync="addAttrDialog"
               @close="CancelAddAttrDialog">
      <el-form :model="addAttrForm"
               ref="addAttrRuleRorm"
               :rules="addAttrRules">
        <el-form-item :label="activeName == 'many' ? '动态参数':'静态属性'"
                      :label-width="'80px'"
                      prop="attr_name">
          <el-input v-model="addAttrForm.attr_name"
                    autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="addAttrDialog = false">取 消</el-button>
        <el-button type="primary"
                   @click="sureAddAttr">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑商品参数和静态属性弹框 -->
    <el-dialog :title="'修改' +  [activeName == 'many' ? '动态参数':'静态属性']"
               :visible.sync="editAttrDialog"
               @close="CancelEditAttrDialog">
      <el-form :model="editAttrForm"
               ref="editAttrRuleRorm"
               :rules="editAttrRules">
        <el-form-item :label="activeName == 'many' ? '动态参数':'静态属性'"
                      :label-width="'80px'"
                      prop="attr_name">
          <el-input v-model="editAttrForm.attr_name"
                    autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="editAttrDialog = false">取 消</el-button>
        <el-button type="primary"
                   @click="sureEditAttr">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getCategoriesData, getAttributesList } from 'network/goods'
import { putCateAttr, getIdAttr, removeAttr,addArrt } from 'network/params'
export default {
  data() {
    return {
      cateData: [],
      props: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
      },
      cateValue: [],
      attrData: [],
      activeName: 'many',
      isBtn:true,
      // 控制修改弹窗
      editAttrDialog: false,
      editAttrForm: {},
      editAttrRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' },
        ],
      },
      addAttrForm:{},
        // 控制添加弹窗
      addAttrDialog:false,
      addAttrRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' },
        ],
      },
    }
  },
  methods: {
    // 监听选择框
    handleChange(value) {
      if (value.length < 3) {
        this.$message.warning('只允许为第三级分类设置相关参数!')
        this.cateValue = []
        this.attrData= []
        this.isBtn = true
        return false
      }

      this.isBtn = false

      // 获取参数数据
      this._getAttrData()

      return true
    },
    // 监听标签页切换
    handleClick() {
      // 如果用户没有选择商品分类，则提示用户选择商品分类
      if (this.cateValue.length == 0)
        return this.$message.warning('请选择商品分类')

      this._getAttrData()
    },
    // 监听关闭tag
    handleClose(row, index) {
      // 在当前页面中删除
      row.attr_vals.splice(index, 1)

      // 更新数据
      this._putCateAttr(row)
    },
    // 监听显示input
    showInput(row) {
      row.iptTagVisible = true

      this.$nextTick((_) => {
        this.$refs.saveManyTagInput.$refs.input.focus()
      })
    },

    // 监听input失去焦点
    handleInputConfirm(row) {
      let inputValue = row.iptTagValue.trim()
      if (inputValue.length > 0) {
        row.attr_vals.push(inputValue)

        this._putCateAttr(row)
      }
      row.iptTagVisible = false
      row.iptTagValue = ''
    },
    // 监听编辑按钮
    async editAttrClick(row) {
      const res = await getIdAttr(
        this.cateValue[this.cateValue.length - 1],
        row.attr_id,
        row.attr_sel,
        row.attr_vals.join()
      )

      if (res.meta.status !== 200)
        return this.$message.error('获取参数数据失败')

      this.editAttrForm = res.data

      console.log(this.editAttrForm)

      this.editAttrDialog = true
    },
    // 关闭编辑参数弹窗
    CancelEditAttrDialog() {
      this.editAttrDialog = false
      this.$refs.editAttrRuleRorm.resetFields()
      this.editAttrForm = {}
    },
    // 确定编辑参数
    sureEditAttr() {
      this.$refs.editAttrRuleRorm.validate(async (valid) => {
        if (!valid) return

        const res = await putCateAttr(
          this.cateValue[this.cateValue.length - 1],
          this.editAttrForm.attr_id,
          this.editAttrForm.attr_name,
          this.editAttrForm.attr_sel,
          this.editAttrForm.attr_vals
        )

        console.log(res)
        if (res.meta.status !== 200)
          return this.$message({
            type: 'error',
            message: '更新参数失败',
          })

        this.$message({
          type: 'success',
          message: '更新参数成功',
        })

        this.editAttrDialog = false

        this._getAttrData()
      })
    },
    // 删除参数
    deleteAttrClick(id) {
      this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          const res = await removeAttr(
            this.cateValue[this.cateValue.length - 1],
            id
          )
          if (res.meta.status !== 200)
            return this.$message({
              type: 'error',
              message: '删除参数失败',
            })

          this.$message({
            type: 'success',
            message: '删除成功!',
          })

          this._getAttrData()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
    // 关闭添加参数弹窗
    CancelAddAttrDialog() {
      this.addAttrDialog = false
      this.$refs.addAttrRuleRorm.resetFields()
      this.addAttrForm = {}
    },
    // 确定添加参数
    sureAddAttr() {
      this.$refs.addAttrRuleRorm.validate(async (valid) => {
        if (!valid) return

        const res = await addArrt(
          this.cateValue[this.cateValue.length - 1],
          this.addAttrForm.attr_name,
          this.activeName,
          ''
        )

        console.log(res)
        if (res.meta.status !== 201)
          return this.$message({
            type: 'error',
            message: '添加参数失败',
          })

        this.$message({
          type: 'success',
          message: '添加参数成功',
        })

        this.addAttrDialog = false

        this._getAttrData()
      })
    },
    /* --------- 下面是网络请求 ----------- */
    // 获取所有分类列表数据
    async _getCategoriesData() {
      const res = await getCategoriesData()
      if (res.meta.status !== 200)
        return this.$message.error('获取商品分类数据失败')
      this.cateData = res.data
    },
    // 获取参数数据
    async _getAttrData() {
      const res = await getAttributesList(
        this.cateValue[this.cateValue.length - 1],
        this.activeName
      )

      if (res.meta.status !== 200)
        return this.$message.error('获取动态参数列表数据失败')

      res.data.forEach((item) => {
        item.attr_vals =
          item.attr_vals.length == 0 ? [] : item.attr_vals.split(' ')
        item.iptTagVisible = false
        item.iptTagValue = ''
      })

      this.attrData = res.data

    },

    // 更新参数
    async _putCateAttr(row) {
      console.log(this.cateValue[this.cateValue.length - 1])
      const res = await putCateAttr(
        this.cateValue[this.cateValue.length - 1],
        row.attr_id,
        row.attr_name,
        row.attr_sel,
        row.attr_vals.join(' ')
      )

      if (res.meta.status !== 200) return this.$message.error('更新数据失败')

      this.$message.success('更新数据成功')
    },
  },
  created() {
    this._getCategoriesData()
  },
}
</script>

<style lang="scss" scoped>
.params {
  .box-card {
    margin-top: 10px;

    .cate-box {
      margin: 15px 0;
    }
  }
}

.table-box {
  margin-top: 15px;
}

.table-box /deep/ .el-table__expanded-cell {
  padding: 20px 50px;
}

.el-tag {
  margin: 7px;
}

.input-new-tag {
  width: 100px;
}
</style>