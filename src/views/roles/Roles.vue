<template>
  <div class="roles">
    <el-breadcrumb separator="/"
                   style="font-size: 12px;">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <el-button type="primary"
                 @click="roleDialogVisible = true">添加角色</el-button>

      <!-- 表格 -->
      <el-table :data="rolesList"
                style="width: 100%"
                border>
        <el-table-column type="expand">
          <template #default="scoped">
            <el-row v-for="(item,index) in scoped.row.children"
                    :key="item.id"
                    :class="[index == 0 ? 'row_tp mt':'',index == scoped.row.children.length - 1 ? 'mb' : '','row_bt','aligin_center']"
                    style=" margin-left: 50px; margin-right: 50px ">
              <el-col :span="5">
                <el-tag closable
                        @close="tagClose(scoped.row,item.id)">
                  {{item.authName}}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>

              <el-col :span="19">
                <el-row v-for="(v,i) in item.children"
                        :key="v.id"
                        :class="i !== item.children.length-1? ' row_bt':''"
                        class="aligin_center">

                  <el-col :span="5">
                    <el-tag closable
                            type="success"
                            @close="tagClose(scoped.row,v.id)">
                      {{v.authName}}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>

                  <el-col :span="19">
                    <el-tag closable
                            type="warning"
                            v-for="(tag,i) in v.children"
                            :key="i"
                            @close="tagClose(scoped.row,tag.id)">
                      {{tag.authName}}
                    </el-tag>
                  </el-col>

                </el-row>
              </el-col>

            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"
                         width="50"
                         label="#">
        </el-table-column>
        <el-table-column label="角色名称"
                         prop="roleName">
        </el-table-column>
        <el-table-column label="角色描述"
                         prop="roleDesc">
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scoped">
            <el-button type="primary"
                       icon="el-icon-edit"
                       size="mini"
                       @click="editRole(scoped.row.id)">编辑</el-button>
            <el-button type="danger"
                       icon="el-icon-delete"
                       size="mini"
                       @click="deleteRoleClick(scoped.row.id)">删除</el-button>
            <el-button type="warning"
                       icon="el-icon-setting"
                       size="mini"
                       @click="assingPermiClick(scoped.row.id)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加角色弹框 -->
    <el-dialog title="添加角色"
               :visible.sync="roleDialogVisible"
               @close="CancelRoleDialog">
      <el-form :model="roleForm"
               ref="roleRuleForm"
               :rules="roleRules">
        <el-form-item label="角色名称"
                      :label-width="'80px'"
                      prop="roleName">
          <el-input v-model="roleForm.roleName"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述"
                      :label-width="'80px'"
                      prop="roleDesc">
          <el-input v-model="roleForm.roleDesc"
                    autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="CancelRoleDialog">取 消</el-button>
        <el-button type="primary"
                   @click="sureAddRole">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑角色弹框 -->
    <el-dialog title="编辑角色"
               :visible.sync="editRoleDialog"
               @close="CancelEditRoleDialog">
      <el-form :model="editRoleForm"
               ref="editRoleRuleRorm"
               :rules="editRoleRules">
        <el-form-item label="角色名称"
                      :label-width="'80px'"
                      prop="roleName">
          <el-input v-model="editRoleForm.roleName"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述"
                      :label-width="'80px'"
                      prop="roleDesc">
          <el-input v-model="editRoleForm.roleDesc"
                    autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="CancelEditRoleDialog">取 消</el-button>
        <el-button type="primary"
                   @click="sureEditRole">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 分配权限弹框 -->
    <el-dialog title="分配权限"
               :visible.sync="rightsDialog"
               @close="CancelRightsDialog">

      <el-tree :props="props"
               :data="rightsData"
               show-checkbox
               default-expand-all
               :default-checked-keys="checkedRightId"
               node-key="id"
               ref="rightTree">
      </el-tree>

      <div slot="footer"
           class="dialog-footer">
        <el-button @click="rightsDialog = false">取 消</el-button>
        <el-button type="primary"
                   @click="sureRights">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getRolesList } from 'network/users'
import {
  addRolesData,
  accordIdRolesForm,
  putEditRoles,
  removeRole,
  getRightsData,
  getRolesRights,
  removeRoleRight,
} from 'network/roles.js'
export default {
  data() {
    return {
      rolesList: [],
      roleForm: {
        roleName: '',
        roleDesc: '',
      },
      roleDialogVisible: false,
      editRoleDialog: false,
      editRoleForm: {},
      rightsData: [],
      rightsDialog: false,
      checkedRightId: [],
      props: {
        label: 'authName',
        children: 'children',
      },
      rolesRights: [],
      rolesId: 0,
      roleRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
        ],
      },
      editRoleRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
        ],
      },
    }
  },
  methods: {
    CancelRoleDialog() {
      // 关闭添加角色弹窗
      this.$refs.roleRuleForm.resetFields()
      this.roleDialogVisible = false
    },
    sureAddRole() {
      // 确定添加角色
      this.$refs.roleRuleForm.validate(async (valid) => {
        if (!valid) return
        const res = await addRolesData(this.roleForm)
        if (res.meta.status !== 201)
          return this.$message({
            type: 'error',
            message: '添加角色失败',
          })

        this.$message({
          type: 'success',
          message: '添加角色成功',
        })

        this.roleDialogVisible = false

        this._getRolesList()
      })
    },
    async editRole(id) {
      // 点击编辑用户按钮，根据id获取当前数据，并且弹出编辑用户弹框
      const res = await accordIdRolesForm(id)
      if (res.meta.status != 200)
        return this.$message({
          type: 'error',
          message: '查询角色数据失败',
        })

      this.editRoleForm = res.data
      this.editRoleDialog = true
      console.log(this.editRoleForm)
    },
    CancelEditRoleDialog() {
      // 关闭编辑角色弹窗
      this.editRoleDialog = false
      this.$refs.editRoleRuleRorm.resetFields()
      this.editRoleForm = {}
    },
    sureEditRole() {
      // 确定编辑角色
      this.$refs.editRoleRuleRorm.validate(async (valid) => {
        if (!valid) return

        const res = await putEditRoles(this.editRoleForm)
        if (res.meta.status !== 200)
          return this.$message({
            type: 'error',
            message: '更新角色失败',
          })

        this.$message({
          type: 'success',
          message: '更新角色成功',
        })

        this.editRoleDialog = false

        this._getRolesList()
      })
    },
    deleteRoleClick(id) {
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          const res = await removeRole(id)
          if (res.meta.status !== 200)
            return this.$message({
              type: 'error',
              message: '删除角色失败',
            })

          this.$message({
            type: 'success',
            message: '删除成功!',
          })

          this._getRolesList()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
    assingPermiClick(id) {
      this.rolesId = id
      // 获取所有的权限列表
      this._getRightsData()

      // 获取当前角色已有的权限列表
      let checkedRight = this.rolesList.filter((v) => {
        return v.id == id
      })

      this.getLeafKeys(checkedRight[0], this.checkedRightId)
      this.rightsDialog = true
    },
    CancelRightsDialog() {
      // 关闭分配权限弹框
      this.checkedRightId = []
      this.rolesId = null

      this.$nextTick(() => {
        this.$refs.rightTree.setCheckedKeys([])
      })
    },
    async sureRights() {
      // 确定分配权限
      const res = await getRolesRights(
        this.rolesId,
        String([
          ...this.$refs.rightTree.getCheckedKeys(),
          ...this.$refs.rightTree.getHalfCheckedKeys(),
        ])
      )

      if (res.meta.status !== 200)
        return this.$message({
          type: 'error',
          message: '分配权限失败',
        })

      this.rightsDialog = false
      this.$message({
        type: 'success',
        message: '分配权限成功',
      })

      this._getRolesList()
    },
    //  设置一个递归函数,通过递归的形式，获取角色下所有三级权限的id，并保持在defKeys中
    getLeafKeys(node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach((item) => this.getLeafKeys(item, arr))
    },
    // 删除角色指定权限
    tagClose(role, rightId) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          const res = await removeRoleRight(role.id, rightId)
          if (res.meta.status !== 200) return this.$message.error('删除失败')
          this.$message.success('删除成功')
          // 在rolesList中找到该数据，然后进行替换
          role.children = res.data
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
    /* ----   请求网络数据    ------ */
    async _getRolesList() {
      const res = await getRolesList()
      if (res.meta.status !== 200)
        return this.$message({
          type: 'error',
          message: '获取角色列表数据失败',
        })
      this.rolesList = res.data
    },
    async _getRightsData() {
      const res = await getRightsData('tree')
      if (res.meta.status !== 200)
        return this.$message({
          type: 'error',
          message: '获取所有权限列表失败',
        })

      this.rightsData = res.data
    },
    async _getRolesRights(id) {
      const res = await getRolesRights(id)
      if (res.meta.status !== 200)
        return this.$message({
          type: 'error',
          message: '分配权限失败',
        })

      this.$message({
        type: 'success',
        message: '分配权限成功',
      })
    },
  },
  created() {
    this._getRolesList()
  },
}
</script>

<style lang="scss" scoped>
.roles {
  .box-card {
    margin-top: 10px;

    .el-table {
      margin-top: 10px;

      .el-tag {
        margin: 7px;
      }
    }
  }
}

.row_tp {
  border-top: 1px solid #eeeeee;
}

.row_bt {
  border-bottom: 1px solid #eeeeee;
}

.mt {
  margin-top: 20px;
}

.mb {
  margin-bottom: 20px;
}

.aligin_center {
  display: flex;
  align-items: center;
}
</style>