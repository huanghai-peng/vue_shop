<template>
  <div class="add">
    <el-breadcrumb separator="/"
                   style="font-size: 12px;">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/goods' }">商品列表</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <!-- 添加商品提示 -->
      <el-alert title="添加商品信息"
                type="info"
                center
                show-icon>
      </el-alert>

      <!-- 步骤条 -->
      <el-steps :active="stepsIndex - 0"
                :space="200"
                align-center
                finish-status="success">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="商品完成"></el-step>
      </el-steps>

      <!-- tab标签页 -->
      <el-form :label-position="'top'"
               label-width="80px"
               :model="addGoodsForm"
               ref="addGoodsFormRefs"
               :rules="goodsFormRules">
        <el-tabs :tab-position="'left'"
                 v-model="stepsIndex"
                 :before-leave="tabClick">

          <el-tab-pane label="基本信息"
                       name="0">

            <el-form-item label="商品名称"
                          prop="goods_name">
              <el-input v-model="addGoodsForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格"
                          prop="goods_price">
              <el-input v-model="addGoodsForm.goods_price"
                        type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量"
                          prop="goods_weight">
              <el-input v-model="addGoodsForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量"
                          prop="goods_number">
              <el-input v-model="addGoodsForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类"
                          prop="goods_cat">
              <el-cascader v-model="addGoodsForm.goods_cat"
                           :options="categoriesData"
                           :props="props"
                           @change="handleChange"></el-cascader>
            </el-form-item>

          </el-tab-pane>
          <el-tab-pane label="商品参数"
                       name="1">
            <el-form-item :label="item.attr_name"
                          v-for="(item,index) in manyData"
                          :key="index">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="v"
                             v-for="(v,i) in item.attr_vals"
                             :key="i"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性"
                       name="2">
            <el-form-item :label="item.attr_name"
                          v-for="(item,index) in onlyData"
                          :key="index">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片"
                       name="3">
            <el-upload class="upload-demo"
                       action="http://127.0.0.1:8888/api/private/v1/upload"
                       :on-preview="handlePreview"
                       :on-remove="handleRemove"
                       list-type="picture"
                       :on-success="imgUrl"
                       :headers="authHeader">
              <el-button size="small"
                         type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容"
                       name="4">
            <quill-editor v-model="addGoodsForm.goods_introduce"
                          class="quill-box">
            </quill-editor>

            <el-button type="primary"
                       style="margin-top: 20px;"
                       @click="sureAddGoods">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 图片预览弹窗 -->
    <el-dialog title="图片预览"
               :visible.sync="imgDialogVisible"
               width="50%"
               @close="imgDialogVisible = false"
               class="imgDialog">
      <img :src="imgSrc"
           alt="">
    </el-dialog>
  </div>
</template>

<script>
import { getCategoriesData, getAttributesList, addGoods } from 'network/goods'
import _ from 'lodash'
export default {
  data() {
    return {
      stepsIndex: '0',
      addGoodsForm: {
        goods_name: '',
        goods_price: '',
        goods_weight: '',
        goods_number: '',
        goods_cat: [],
        pics: [],
        goods_introduce: '',
        attrs: [],
      },
      categoriesData: [],
      props: {
        label: 'cat_name',
        value: 'cat_id',
        expandTrigger: 'hover',
      },
      goodsFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' },
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' },
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' },
        ],
        goods_cat: [
          { required: true, message: '请选择商品分类', trigger: 'blur' },
        ],
      },
      manyData: [],
      onlyData: [],
      authHeader: {
        Authorization: sessionStorage.getItem('token'),
      },
      // 图片预览弹框控制
      imgDialogVisible: false,
      imgSrc: '',
    }
  },
  methods: {
    //   切换tabs时触发
    tabClick(activeName) {
      // 判断0的tab页面中的校检是否有错误，如果有错误，不需要跳转，并且弹出错误信息
      let rulesKey = Object.keys(this.goodsFormRules)
      const errorArr = []
      this.$refs.addGoodsFormRefs.validateField(rulesKey, (errMsg) => {
        if (errMsg) {
          errorArr.push(errMsg)
        }
      })

      // 如果有错误信息,则阻止它跳转
      if (errorArr.length != 0) {
        this.$message.error(errorArr[0])
        return false
      }

      if (activeName == 1) {
        this._getManyList()
      }

      if (activeName == 2) {
        this._getOnlyList()
      }

      return true
    },
    // 选中项发生改变
    handleChange() {
      if (this.addGoodsForm.goods_cat.length < 3) {
        this.addGoodsForm.goods_cat = []
        this.$message.warning('只能设置三级分类')
      }
    },
    // 点击文件移除时的钩子
    handleRemove(file, fileList) {
      // 将删除掉的图片，从pics中移除掉
      const index = this.addGoodsForm.pics.findIndex((item) => {
        return item.pic == file.response.data.tmp_path
      })

      this.addGoodsForm.pics.splice(index, 1)
      this.$message.success('图片删除成功')
    },
    //   点击文件上传时的预览钩子
    handlePreview(file) {
      this.imgSrc = file.response.data.url
      this.imgDialogVisible = true
    },
    // 图片上传成功
    imgUrl(response) {
      if (response.meta.status !== 200)
        return this.$message.error('图片上传失败')

      this.addGoodsForm.pics.push({ pic: response.data.tmp_path })
      this.$message.success('图片上传成功')
    },
    // 确定添加商品
     sureAddGoods() {
      this.$refs.addGoodsFormRefs.validate(async(valid) => {
        if (!valid) return

        let deep = _.cloneDeep(this.addGoodsForm)

        // 处理一下数据格式
        deep.goods_cat = deep.goods_cat.join(',')

        this.manyData.forEach((item) => {
          deep.attrs.push({
            attr_id: item.attr_id,
            attr_val: item.attr_vals,
          })
        })

        this.onlyData.forEach((item) => {
          deep.attrs.push({
            attr_id: item.attr_id,
            attr_val: item.attr_vals,
          })
        })

        const res = await addGoods(deep)
        if(res.meta.status !== 201) return this.$message.error('添加商品失败')

        this.$message.success('添加商品成功')

        this.$router.replace('/goods')
      })
    },
    /* ---------下面是网络请求 ------------- */
    async _getCategoriesData() {
      const res = await getCategoriesData()
      if (res.meta.status !== 200)
        return this.$message.error('获取商品分类数据失败')

      this.categoriesData = res.data
    },
    async _getManyList() {
      const res = await getAttributesList(
        this.addGoodsForm.goods_cat[this.addGoodsForm.goods_cat.length - 1],
        'many'
      )

      if (res.meta.status !== 200)
        return this.$message.error('获取商品参数列表失败')

      this.manyData = res.data

      this.manyData.attr_vals = this.manyData.forEach((item) => {
        item.attr_vals =
          item.attr_vals.length == 0 ? [] : item.attr_vals.split(' ')
      })

      console.log(this.manyData)
    },
    async _getOnlyList() {
      const res = await getAttributesList(
        this.addGoodsForm.goods_cat[this.addGoodsForm.goods_cat.length - 1],
        'only'
      )

      if (res.meta.status !== 200)
        return this.$message.error('获取商品属性列表失败')

      this.onlyData = res.data
      console.log(this.onlyData)
    },
  },
  created() {
    this._getCategoriesData()
  },
}
</script>

<style lang="scss" scoped>
.add {
  .box-card {
    margin-top: 10px;

    .el-steps {
      margin-top: 15px;
      margin-bottom: 15px;
    }
  }
}
.imgDialog img {
  width: 100%;
  height: 100%;
}

.quill-box /deep/ .ql-editor {
  height: 300px;
}
</style>