<template>
  <div class="orders">
    <el-breadcrumb separator="/"
                   style="font-size: 12px;">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容"
                    v-model="ordersInfo.query"
                    class="input-with-select"
                    @change="searchQuery">
            <el-button slot="append"
                       icon="el-icon-search"
                       @click="searchQuery"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- 表格区域 -->
      <el-table :data="ordersList"
                style="width: 100%"
                border>
        <el-table-column type="index"
                         :index="1"
                         label="#">
        </el-table-column>
        <el-table-column prop="order_number"
                         label="订单编号"
                         width="180">
        </el-table-column>
        <el-table-column prop="order_price"
                         label="订单价格"
                         width="180">
        </el-table-column>
        <el-table-column prop="order_pay"
                         label="是否付款">
          <template #default="scoped">
            <el-tag type="danger"
                    v-if="scoped.row.order_pay == 0">未付款</el-tag>
            <el-tag type="success"
                    v-else>已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send"
                         label="是否发货">
        </el-table-column>
        <el-table-column prop="create_time"
                         label="下单时间">
          <template #default="scoped">
            {{scoped.row.create_time | day}}
          </template>
        </el-table-column>
        <el-table-column label="操作"
                         width="200px">
          <template #default="scoped">
            <el-tooltip class="item"
                        effect="dark"
                        content="修改地址"
                        placement="top-start">
              <el-button type="primary"
                         icon="el-icon-edit"
                         size="mini"
                         round
                         @click="editAddress"></el-button>
            </el-tooltip>

            <el-tooltip class="item"
                        effect="dark"
                        content="物流状态"
                        placement="top-start">
              <el-button type="success"
                         icon="el-icon-location-outline"
                         size="mini"
                         round
                         @click="logisticsProgressClick"></el-button>
            </el-tooltip>

          </template>
        </el-table-column>
      </el-table>

      <!-- 页码区域 -->
      <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="ordersInfo.pagenum - 0"
                     :page-sizes="[1, 2, 5, 10]"
                     :page-size="ordersInfo.pagesize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total">
      </el-pagination>

      <!-- 修改地址对话框 -->
      <el-dialog title="收货地址"
                 :visible.sync="editDialogFormVisible"
                 @close="editAdressClose">
        <el-form :model="formInfo"
                 :rules="addressRules"
                 ref="editAdressRefs">
          <el-form-item label="省市区县"
                        :label-width="'90px'"
                        prop="address1">
            <el-cascader v-model="formInfo.address1"
                         :options="options"
                         :props="{ expandTrigger: 'hover' }"></el-cascader>
          </el-form-item>

          <el-form-item label="详细地址"
                        :label-width="'90px'"
                        prop="address2">
            <el-input v-model="formInfo.address2"
                      autocomplete="off"></el-input>
          </el-form-item>

        </el-form>
        <div slot="footer"
             class="dialog-footer">
          <el-button @click="editDialogFormVisible = false">取 消</el-button>
          <el-button type="primary"
                     @click="sureEditAdress">确 定</el-button>
        </div>
      </el-dialog>

      <!-- 物流进度 -->
      <el-dialog title="物流进度"
                 :visible.sync="logisticsDialogVisible"
                 width="50%">

        <el-timeline :reverse="false">
          <el-timeline-item v-for="(activity, index) in progressInfo"
                            :key="index"
                            :timestamp="activity.time">
            {{activity.context}}
          </el-timeline-item>
        </el-timeline>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { getOrdersList } from 'network/orders'
import citydata from '@/network/citydata'
import { dayjs } from 'plugins'
import progressInfo from '@/network/progressInfo'
export default {
  data() {
    return {
      ordersList: [],
      ordersInfo: {
        query: '',
        pagenum: 2,
        pagesize: 5,
      },
      total: 0,
      formInfo: {
        address1: '',
        address2: '',
      },
      editDialogFormVisible: false,
      options: [],
      addressRules: {
        address1: [{ required: true, message: '请选择城市', trigger: 'blur' }],
        address2: [
          { required: true, message: '请输入详细地址', trigger: 'blur' },
        ],
      },
      logisticsDialogVisible: false,
      progressInfo: [],
    }
  },
  created() {
    this._getOrdersList()
  },
  filters: {
    day(old) {
      return dayjs(old * 1000).format('YYYY-MM-DD HH:mm:ss')
    },
  },
  methods: {
    handleSizeChange(val) {
      // 切换条数
      this.ordersInfo.pagesize = val
      this._getOrdersList()
    },
    handleCurrentChange(val) {
      // 切换页面
      this.ordersInfo.pagenum = val
      this._getOrdersList()
    },
    searchQuery() {
      // 失去焦点或者按回车键搜索内容
      this._getOrdersList()
    },
    // 弹出修改地址对话框
    editAddress() {
      this.options = citydata
      this.editDialogFormVisible = true
    },
    // 关闭修改地址对话框
    editAdressClose() {
      this.$refs.editAdressRefs.resetFields()
    },
    // 确定修改地址
    sureEditAdress() {
      this.$refs.editAdressRefs.validate((valid) => {
        if (!valid) return

        this.editDialogFormVisible = false
      })
    },
    // 物流进度按钮
    async logisticsProgressClick() {
      this.progressInfo = progressInfo.data
      this.logisticsDialogVisible = true
    },
    /* --------请求网络数据----------- */

    // 请求订单数据
    async _getOrdersList() {
      const res = await getOrdersList(this.ordersInfo)
      if (res.meta.status !== 200)
        return this.$message.error('获取订单列表数据失败')
      this.ordersList = res.data.goods
      this.ordersInfo.pagenum = res.data.pagenum
      this.total = res.data.total
      console.log(res.data.goods)
    },
  },
}
</script>

<style lang="scss" scoped>
.orders {
  .box-card {
    margin-top: 10px;

    .el-table {
      margin-top: 10px;
      margin-bottom: 10px;
      font-size: 12px;
    }
  }
}
</style>