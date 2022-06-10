<template>
  <div class="goods">
    <el-breadcrumb separator="/"
                   style="font-size: 12px;">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入内容"
                    v-model="goodsForm.query"
                    clearable
                    @change="searchQuery">
            <el-button slot="append"
                       icon="el-icon-search"
                       @click="searchQuery"></el-button>
          </el-input>
        </el-col>
        <el-col :span="8">
          <el-button type="primary"
                     @click="addGoods">添加商品</el-button>
        </el-col>
      </el-row>

      <!-- 表格 -->
      <el-table :data="goodsList"
                style="width: 100%"
                border>
        <el-table-column type="expand">
          <template #default="scoped">
            <el-form label-position="left"
                     inline
                     class="demo-table-expand">

              <el-form-item label="商品名称"
                            label-width="120px">
                {{ scoped.row.goods_name }}
              </el-form-item>

              <el-form-item label="商品价格"
                            label-width="120px">
                {{ scoped.row.goods_price | newPrice }}
              </el-form-item>

              <el-form-item label="库存"
                            label-width="120px">
                {{ scoped.row.goods_number }}
              </el-form-item>

              <el-form-item label="重量"
                            label-width="120px">
                {{ scoped.row.goods_weight }}
              </el-form-item>
              <el-form-item label="商品状态"
                            label-width="120px">
                {{ scoped.row.goods_state== 0 ? '未通过' : scoped.row.goods_state== 1 ? '审核中' : '已审核'}}
              </el-form-item>
              <el-form-item label="添加时间"
                            label-width="120px">
                {{ scoped.row.add_time | day }}
              </el-form-item>
              <el-form-item label="更新时间"
                            label-width="120px">
                {{ scoped.row.upd_time | day }}
              </el-form-item>
              <el-form-item label="是否是热销品"
                            label-width="120px">
                <i class="el-icon-success"
                   v-if="scoped.row.is_promote"
                   style="color: lightgreen;"></i>
                <i class="el-icon-error"
                   v-else
                   style="color: #f00;"></i>
              </el-form-item>
              <el-form-item label="热销品数量"
                            label-width="120px">
                {{ scoped.row.hot_mumber }}
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column type="index"
                         width="50"
                         label="#">
        </el-table-column>
        <el-table-column label="商品名称"
                         prop="goods_name">
        </el-table-column>
        <el-table-column label="商品价格(元)"
                         prop="goods_price"
                         width="95px">
        </el-table-column>
        <el-table-column label="商品重量(克)"
                         prop="goods_weight"
                         width="95px">
        </el-table-column>
        <el-table-column label="创建时间"
                         prop="add_time"
                         width="160px">
          <template #default="scoped">
            {{scoped.row.add_time | day }}
          </template>
        </el-table-column>
        <el-table-column label="操作"
                         width="135px">
          <template #default="scoped">
            <el-button type="primary"
                       icon="el-icon-edit"
                       size="mini"
                       round
                       @click="editGoodClick(scoped.row.goods_id)"></el-button>
            <el-button type="danger"
                       icon="el-icon-delete"
                       size="mini"
                       round
                       @click="deleteGoodClick(scoped.row.goods_id)"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="goodsForm.pagenum - 0"
                     :page-sizes="[1, 2, 5, 10]"
                     :page-size="goodsForm.pagesize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total">
      </el-pagination>
    </el-card>

    <!-- 修改商品弹框 -->
    <el-dialog title="修改商品信息"
               :visible.sync="editGoodDialogVisible"
               @close="CancelEditGoodsDialog">
      <el-form :model="editGoodsform"
               :rules="editGoodsRules"
               ref="EditGoodsRuleForm">
        <el-form-item label="商品名称"
                      :label-width="'80px'"
                      prop="goods_name">
          <el-input v-model="editGoodsform.goods_name"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="商品价格"
                      :label-width="'80px'"
                      prop="goods_price">
          <el-input v-model="editGoodsform.goods_price"
                    autocomplete="off" type="number"></el-input>
        </el-form-item>
        <el-form-item label="库存"
                      :label-width="'80px'"
                      prop="goods_number">
          <el-input v-model="editGoodsform.goods_number"
                    autocomplete="off" type="number"></el-input>
        </el-form-item>
        <el-form-item label="商品重量"
                      :label-width="'80px'"
                      prop="goods_weight">
          <el-input v-model="editGoodsform.goods_weight"
                    autocomplete="off" type="number"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="editGoodDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="sureEditGoods">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getGoodsList, getIdfetchGoods,putGoods,removeGoods } from 'network/goods'
import { dayjs } from 'plugins'
export default {
  data() {
    return {
      goodsForm: {
        query: '',
        pagenum: 1,
        pagesize: 5,
      },
      goodsList: [],
      total: 0,
      editGoodsform: {},
      editGoodDialogVisible: false,
      goodsId:0,
      editGoodsRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' },
        ],
        goods_number: [
          { required: true, message: '请输入库存数量', trigger: 'blur' },
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' },
        ],
      },
    }
  },
  methods: {
    // 搜索商品
    searchQuery() {
      this._getGoodsList()
    },
    handleSizeChange(val) {
      // 切换条数
      this.goodsForm.pagesize = val
      this._getGoodsList()
    },
    handleCurrentChange(val) {
      // 切换页面
      this.goodsForm.pagenum = val
      this._getGoodsList()
    },
    // 点击修改商品弹框
    async editGoodClick(id) {
      // 获取当前点击商品的名称，价格，库存，重量，并且显示弹框
      this.goodsId = id
      const res = await getIdfetchGoods(id)
      if (res.meta.status !== 200)
        return this.$message.error('查询当前商品失败')

      this.editGoodsform = res.data

      this.editGoodDialogVisible = true

    },
    // 关闭修改商品弹框
    CancelEditGoodsDialog() {
      this.$refs.EditGoodsRuleForm.resetFields()
      this.editGoodsform = {}
      this.editGoodDialogVisible = false
    },
    // 确定修改商品
    sureEditGoods(){
        // 确定提交编辑商品
      this.$refs.EditGoodsRuleForm.validate(async (valid) => {
        if (!valid) return

        // 发送请求，修改商品
        const res = await putGoods(this.goodsId,this.editGoodsform)
        if (res.meta.status !== 200)
          return this.$message({
            type: 'error',
            message: '修改商品失败',
          })

        this.editGoodDialogVisible = false

        this.$message({
          type: 'success',
          message: '修改商品成功',
        })

        // 修改成功，重新获取数据，更新表格
        this._getGoodsList()
      })
    },
    // 删除商品
    deleteGoodClick(id){
        // 删除商品
      this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          const res = await removeGoods(id)
          if (res.meta.status !== 200)
            return this.$message({
              type: 'error',
              message: '删除商品失败',
            })

          this.$message({
            type: 'success',
            message: '删除成功!',
          })
          // 重新请求数据
          this._getGoodsList()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
    // 点击添加商品
    addGoods(){
        // 跳转到添加商品页面
        this.$router.push('/goods/add');
    },
    /* ------- 下面是网络请求 -------- */
    async _getGoodsList() {
      const res = await getGoodsList(this.goodsForm)
      if (res.meta.status !== 200)
        return this.$message.error('获取商品列表数据失败')

      this.goodsList = res.data.goods
      this.goodsForm.pagenum = res.data.pagenum
      this.total = res.data.total

      console.log(this.goodsList)
    },
  },
  created() {
    this._getGoodsList()
  },
  filters: {
    day(old) {
      return dayjs(old * 1000).format('YYYY-MM-DD HH:mm:ss')
    },
    newPrice(old) {
      return old.toFixed(2)
    },
  },
}
</script>

<style lang="scss" scoped>
.goods {
  .box-card {
    margin-top: 10px;

    .el-table {
      margin-top: 10px;
      margin-bottom: 10px;
      font-size: 12px;

      .demo-table-expand {
        padding: 20px 50px;

        .el-form-item {
          margin-right: 0;
          margin-bottom: 0;
          width: 100%;
        }
      }
    }
  }
}

.demo-table-expand /deep/ .el-form-item__label {
  color: #99a9bf;
}
</style>