<template>
  <div class="rights">
    <el-breadcrumb separator="/"
                   style="font-size: 12px;">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <el-table :data="rightsData"
                border
                style="width: 100%">
        <el-table-column type="index"
                          label="#">
        </el-table-column>
        <el-table-column prop="authName"
                         label="权限名称"
                         >
        </el-table-column>
        <el-table-column prop="path"
                         label="路径"
                         >
        </el-table-column>
        <el-table-column prop="level"
                         label="权限等级" >
            <template #default="scoped">
                <el-tag v-if="scoped.row.level==0">一级</el-tag>
                <el-tag type="success" v-else-if="scoped.row.level==1">二级</el-tag>
                <el-tag type="warning" v-else>三级</el-tag>
            </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { getRightsData } from 'network/roles'
export default {
  data() {
    return {
      rightsData: [],
    }
  },
  created() {
    this._getRightsData()
  },
  methods: {
    async _getRightsData() {
      const res = await getRightsData('list')
      if (res.meta.status !== 200)
        return this.$message.error('获取权限列表失败')
      this.rightsData = res.data
    },
  },
}
</script>

<style lang="scss" scoped>
.rights {
  .box-card {
    margin-top: 10px;
  }
}
</style>