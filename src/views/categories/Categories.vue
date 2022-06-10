<template>
  <div class="categories">
    <el-breadcrumb separator="/"
                   style="font-size: 12px;">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <el-button type="primary"
                 @click="addCateClick">添加分类</el-button>

      <!-- 树形表格区域 -->
      <zk-table class="tb-cate"
                index-text="#"
                show-index
                stripe
                border
                :data="categoriesData"
                :columns="columns"
                :expand-type="false"
                :selection-type="false">

        <template slot="isok"
                  slot-scope="scope">
          <i class="el-icon-success"
             v-if="scope.row.cat_deleted == false"
             style="color: lightGreen"></i>
          <i class="el-icon-error"
             v-else
             style="color: red"></i>
        </template>

        <template slot="level"
                  scope="scope">
          <el-tag type="primary"
                  size="mini"
                  v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success"
                  size="mini"
                  v-else-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag type="warning"
                  size="mini"
                  v-else>三级</el-tag>
        </template>
        <template slot="opt"
                  scope="scope">
          <el-button type="primary"
                     icon="el-icon-edit"
                     size="mini"
                     @click="putCateClick(scope.row.cat_id)">编辑</el-button>
          <el-button type="danger"
                     icon="el-icon-delete"
                     size="mini"
                     @click="deleteCateClick(scope.row.cat_id)">删除</el-button>
        </template>
      </zk-table>

      <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="cateForm.pagenum - 0"
                     :page-sizes="[3, 5, 7, 10]"
                     :page-size="cateForm.pagesize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total">
      </el-pagination>
    </el-card>

    <!-- 修改商品分类弹框 -->
    <el-dialog title="编辑分类"
               :visible.sync="editCateDialogVisible"
               @close="CancelEditCateDialog">
      <el-form :model="editCategoriesForm"
               :rules="editCateRules"
               ref="EditCateRuleForm">
        <el-form-item label="分类名称"
                      :label-width="'80px'"
                      prop="cat_name">
          <el-input v-model="editCategoriesForm.cat_name"
                    autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="editCateDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="sureEditCate">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 修改商品分类弹框 -->
    <el-dialog title="添加分类"
               :visible.sync="addCateDialogVisible"
               @close="CancelAddCateDialog">
      <el-form :model="addCategoriesForm"
               :rules="addCateRules"
               ref="addCateRuleForm">
        <el-form-item label="分类名称"
                      :label-width="'80px'"
                      prop="cat_name">
          <el-input v-model="addCategoriesForm.cat_name"
                    autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="父级分类"
                      :label-width="'80px'">
          <el-cascader :options="fatherCateData"
                       :props="props"
                       clearable
                       @change="handleChange"
                       v-model="cateValue"></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="sureAddCate">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getCategoriesData,
  getIdCate,
  putCategory,
  removeCategory,
  addCategory,
} from 'network/categories'
export default {
  data() {
    return {
      // 控制添加分类对话框
      addCateDialogVisible: false,
      categoriesData: [],
      columns: [
        { label: '分类名称', prop: 'cat_name' },
        {
          label: '是否有效',
          prop: 'cat_deleted',
          type: 'template',
          template: 'isok',
        },
        {
          label: '分类等级',
          prop: 'cat_level',
          type: 'template',
          template: 'level',
        },
        {
          label: '操作',
          type: 'template',
          template: 'opt',
        },
      ],
      cateForm: {
        type: [1, 2, 3],
        pagenum: 0,
        pagesize: 5,
      },
      total: 0,
      // 控制编辑分类对话框
      editCateDialogVisible: false,
      editCategoriesForm: {},
      cartId: null,
      editCateRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
        ],
      },
      addCategoriesForm: {
        cat_pid: 0,
        cat_name: '',
        cat_level: 0,
      },
      addCateRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
        ],
      },
      fatherCateData: [],
      props: {
        label: 'cat_name',
        value: 'cat_id',
        checkStrictly: true,
      },
      cateValue:[]
    }
  },
  methods: {
    handleSizeChange(val) {
      // 切换条数
      this.cateForm.pagesize = val
      this._getCategoriesData()
    },
    handleCurrentChange(val) {
      // 切换页面
      this.cateForm.pagenum = val
      this._getCategoriesData()
    },
    // 监听编辑分类
    async putCateClick(id) {
      this.cartId = id
      const res = await getIdCate(id)
      if (res.meta.status !== 200)
        return this.$message.error('查询编辑分类数据失败')

      this.editCategoriesForm = res.data
      console.log(res)

      this.editCateDialogVisible = true
    },
    // 关闭修改分类弹框
    CancelEditCateDialog() {
      this.$refs.EditCateRuleForm.resetFields()
      this.editCategoriesForm = {}
      this.editCateDialogVisible = false
    },
    // 确定修改分类
    sureEditCate() {
      // 确定提交编辑商品分类
      this.$refs.EditCateRuleForm.validate(async (valid) => {
        if (!valid) return

        // 发送请求，修改分类
        const res = await putCategory(
          this.cartId,
          this.editCategoriesForm.cat_name
        )
        if (res.meta.status !== 200)
          return this.$message({
            type: 'error',
            message: '修改商品分类失败',
          })

        this.editCateDialogVisible = false

        this.$message({
          type: 'success',
          message: '修改商品分类成功',
        })

        // 修改成功，重新获取数据，更新表格

        this._getCategoriesData()
      })
    },
    // 监听删除分类
    deleteCateClick(id) {
      // 删除商品分类
      this.$confirm('此操作将永久删除该商品分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          const res = await removeCategory(id)
          if (res.meta.status !== 200)
            return this.$message({
              type: 'error',
              message: '删除商品分类失败',
            })

          this.$message({
            type: 'success',
            message: '删除成功!',
          })
          // 重新请求数据
          this._getCategoriesData()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
    // 监听添加分类按钮
    async addCateClick() {
      // 获取分类列表一级和二级数据
      const res = await getCategoriesData({ type: [2] })
      if (res.meta.status !== 200)
        return this.$message.error('获取一级二级分类数据失败')

      this.fatherCateData = res.data
      console.log(res)
      this.addCateDialogVisible = true
    },
    // 关闭添加分类弹框
    CancelAddCateDialog() {
      this.$refs.addCateRuleForm.resetFields()
      this.addCategoriesForm = {}
      this.addCateDialogVisible = false
    },
    // 监听级联选择器
    handleChange(value) {
        if(value.length > 0) {
             this.addCategoriesForm.cat_pid = this.cateValue[
                 this.cateValue.length -1 
             ]
             this.addCategoriesForm.cat_level = value.length
        }else{
            this.addCategoriesForm.cat_pid = 0
            this.addCategoriesForm.cat_level = 0
        }
    },
    // 确定添加分类
    sureAddCate() {
        this.$refs.addCateRuleForm.validate(async (valid) => {
        if (!valid) return

      const res = await addCategory(this.addCategoriesForm)
      
      if(res.meta.status !== 201) return this.$message.error('添加分类失败')

      this.$message.success('添加分类成功')

      this.addCateDialogVisible = false

      this._getCategoriesData()
    })},
    /* ------ 下面是网络请求 -------- */
    async _getCategoriesData() {
      const res = await getCategoriesData(this.cateForm)
      if (res.meta.status !== 200)
        return this.$message.error('获取商品分类列表数据失败')

      this.categoriesData = res.data.result
      this.cateForm.pagenum = res.data.pagenum + 1
      this.cateForm.pagesize = res.data.pagesize
      this.total = res.data.total
    },
  },
  created() {
    this._getCategoriesData()
  },
}
</script>

<style lang="scss" scoped>
.categories {
  .box-card {
    margin-top: 10px;

    .tb-cate {
      margin: 10px 0;
    }
  }
}
</style>