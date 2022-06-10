<template>
  <div class="users">
    <el-breadcrumb separator="/"
                   style="font-size: 12px;">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入内容"
                    v-model="query"
                    clearable
                    @change="searchQuery">
            <el-button slot="append"
                       icon="el-icon-search"
                       @click="searchQuery"></el-button>
          </el-input>
        </el-col>
        <el-col :span="8">
          <el-button type="primary"
                     @click="usersDialogVisible = true;">添加用户</el-button>
        </el-col>
      </el-row>

      <el-table :data="userData"
                style="width: 100%"
                border>
        <el-table-column type="index"
                         :index="1"
                         label="#">
        </el-table-column>
        <el-table-column prop="username"
                         label="用户名"
                         width="180">
        </el-table-column>
        <el-table-column prop="email"
                         label="邮箱"
                         width="180">
        </el-table-column>
        <el-table-column prop="mobile"
                         label="电话">
        </el-table-column>
        <el-table-column prop="role_name"
                         label="角色">
        </el-table-column>
        <el-table-column prop="mg_state"
                         label="状态">
          <template #default="scoped">
            <el-switch v-model="scoped.row.mg_state"
                       active-color="#409EFF"
                       inactive-color="#DCDFE6"
                       @change="putUserState(scoped.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作"
                         width="200px">
          <template #default="scoped">
            <el-tooltip class="item"
                        effect="dark"
                        content="修改用户"
                        placement="top-start">
              <el-button type="primary"
                         icon="el-icon-edit"
                         size="mini"
                         round
                         @click="editUser(scoped.row)"></el-button>
            </el-tooltip>

            <el-tooltip class="item"
                        effect="dark"
                        content="删除用户"
                        placement="top-start">
              <el-button type="danger"
                         icon="el-icon-delete"
                         size="mini"
                         round
                         @click="deleteUser(scoped.row)"></el-button>
            </el-tooltip>

            <el-tooltip class="item"
                        effect="dark"
                        content="分配角色"
                        placement="top-start">
              <el-button type="warning"
                         icon="el-icon-setting"
                         size="mini"
                         round
                         @click="distRuleClick(scoped.row)"></el-button>
            </el-tooltip>

          </template>
        </el-table-column>
      </el-table>
      <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="pagenum"
                     :page-sizes="[1, 2, 5, 10]"
                     :page-size="pagesize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total">
      </el-pagination>
    </el-card>

    <!-- 添加用户弹框 -->
    <el-dialog title="添加用户"
               :visible.sync="usersDialogVisible"
               @close="CancelUsersDialog">
      <el-form :model="userForm"
               :rules="userRules"
               ref="userRuleForm">
        <el-form-item label="用户名"
                      :label-width="'80px'"
                      prop="username">
          <el-input v-model="userForm.username"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码"
                      :label-width="'80px'"
                      prop="password">
          <el-input v-model="userForm.password"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱"
                      :label-width="'80px'"
                      prop="email">
          <el-input v-model="userForm.email"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机"
                      :label-width="'80px'"
                      prop="mobile">
          <el-input v-model="userForm.mobile"
                    autocomplete="off"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="CancelUsersDialog">取 消</el-button>
        <el-button type="primary"
                   @click="sureAddUser">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑用户弹窗 -->
    <el-dialog title="编辑用户"
               :visible.sync="editDialogVisible"
               @close="CancelEditUsersDialog">
      <el-form :model="editUserData"
               :rules="editUserRules"
               ref="EditUserRuleForm">
        <el-form-item label="用户名"
                      :label-width="'80px'">
          <el-input v-model="editUserData.username"
                    autocomplete="off"
                    disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱"
                      :label-width="'80px'"
                      prop="email">
          <el-input v-model="editUserData.email"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机"
                      :label-width="'80px'"
                      prop="mobile">
          <el-input v-model="editUserData.mobile"
                    autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="CancelEditUsersDialog">取 消</el-button>
        <el-button type="primary"
                   @click="sureEditUser">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 分配角色弹窗 -->
    <el-dialog title="分配角色"
               :visible.sync="distDialogVisible"
               @close="CancelDistUsersDialog">
      <el-form :model="distRulesMsg"
               ref="distRuleForm">
        <el-form-item label="当前的用户 :"
                      :label-width="'110px'">
          {{distRulesMsg.username}}
        </el-form-item>
        <el-form-item label="当前的角色 :"
                      :label-width="'110px'">
          {{distRulesMsg.role_name}}
        </el-form-item>
        <el-form-item label="分配新角色 :"
                      :label-width="'110px'">
          <el-select v-model="rolesId"
                     placeholder="请选择新角色">
            <el-option :label="item.roleName"
                       :value="item.id"
                       v-for="item in rolesList"
                       :key="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="CancelDistUsersDialog">取 消</el-button>
        <el-button type="primary"
                   @click="sureDistUser">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getUsersData,
  addUser,
  putUser,
  getEditUser,
  putEditUser,
  removeUser,
  getRolesList,
  distRule
} from 'network/users'
export default {
  data() {
    let checkEmail = (rule, value, callback) => {
      const reg = /^\w{1,18}@[a-z0-9]+(\.[a-z]{2,4})+$/i
      if (!reg.test(value)) {
        callback(new Error('邮箱格式错误，请重新输入'))
      } else {
        callback()
      }
    }
    let checkMobile = (rule, value, callback) => {
      const reg = /^1(3\d|4[5-9]|5[0-35-9]|6[567]|7[0-8]|8\d|9[0-35-9])\d{8}$/
      if (!reg.test(value)) {
        callback(new Error('手机格式错误，请重新输入'))
      } else {
        callback()
      }
    }
    return {
      query: '',
      pagenum: 1,
      pagesize: 2,
      userData: [],
      total: 0,
      usersDialogVisible: false,
      userForm: {
        username: '',
        password: '',
        email: '',
        mobile: '',
      },
      editUserData: {},
      editDialogVisible: false,
      distDialogVisible: false,
      distRulesMsg: {
        username: '',
        role_name: '',
        id: 0,
      },
      rolesList: [],
      rolesId: '',
      userRules: {
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '用户名长度在 3 到 10 个字符',
            trigger: 'blur',
          },
        ],
        password: [
          { required: true, message: '请输入用户密码', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '密码长度在 6 到 15 个字符',
            trigger: 'blur',
          },
        ],
        email: [{ validator: checkEmail, trigger: 'blur' }],
        mobile: [{ validator: checkMobile, trigger: 'blur' }],
      },
      editUserRules: {
        email: [{ validator: checkEmail, trigger: 'blur' }],
        mobile: [{ validator: checkMobile, trigger: 'blur' }],
      },
    }
  },
  created() {
    // 获取用户列表数据
    this._getUsersData()
  },
  methods: {
    handleSizeChange(val) {
      // 切换条数
      this.pagesize = val
      this._getUsersData()
    },
    handleCurrentChange(val) {
      // 切换页面
      this.pagenum = val
      this._getUsersData()
    },
    searchQuery() {
      // 失去焦点或者按回车键搜索内容
      this._getUsersData()
    },
    sureAddUser() {
      // 确定添加用户
      this.$refs.userRuleForm.validate(async (valid) => {
        if (!valid) return

        // 发送请求，添加用户
        const res = await addUser(this.userForm)
        if (res.meta.status !== 201)
          return this.$message({
            type: 'error',
            message: '添加用户失败',
          })

        this.usersDialogVisible = false

        this.$message({
          type: 'success',
          message: '添加用户成功',
        })

        // 将数据进行重置
        this.$refs.userRuleForm.resetFields()
      })
    },
    CancelUsersDialog() {
      // 取消添加用户弹框
      this.$refs.userRuleForm.resetFields()
      this.usersDialogVisible = false
    },
    sureEditUser() {
      // 确定提交编辑用户
      this.$refs.EditUserRuleForm.validate(async (valid) => {
        if (!valid) return

        // 发送请求，添加用户
        const res = await putEditUser(this.editUserData)
        if (res.meta.status !== 200)
          return this.$message({
            type: 'error',
            message: '修改用户失败',
          })

        this.editDialogVisible = false

        this.$message({
          type: 'success',
          message: '修改用户成功',
        })

        // 修改成功，重新获取数据，更新表格
        this._getUsersData()
      })
    },
    CancelEditUsersDialog() {
      // 取消编辑用户弹框
      this.$refs.EditUserRuleForm.resetFields()
      this.editDialogVisible = false
    },
    async putUserState(scoped) {
      console.log(typeof scoped.id)
      // 更新用户状态
      const res = await putUser(scoped.id, scoped.mg_state)
      console.log(res)
      if (res.meta.status !== 200)
        return this.$message({
          type: 'error',
          message: '更新用户状态失败',
        })

      this.$message({
        type: 'success',
        message: '更新用户状态成功',
      })
    },
    async editUser(row) {
      // 修改用户信息
      // 弹出编辑用户弹窗，然后获取当前用户信息,进行显示
      const res = await getEditUser(row.id)
      if (res.meta.status !== 200)
        return this.$message({
          type: 'error',
          message: '获取编辑用户信息失败',
        })

      this.editUserData = res.data
      this.editDialogVisible = true
    },
    deleteUser(row) {
      // 删除用户
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          const res = await removeUser(row.id)
          if (res.meta.status !== 200)
            return this.$message({
              type: 'error',
              message: '删除用户失败',
            })

          this.$message({
            type: 'success',
            message: '删除成功!',
          })
          // 重新请求数据
          this._getUsersData()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
    distRuleClick(row) {
      // 显示分配弹窗，并且保存当前用户信息
      this.distDialogVisible = true
      this.distRulesMsg.username = row.username
      this.distRulesMsg.role_name = row.role_name
      this.distRulesMsg.id = row.id
      // 获取角色列表
      this._getRolesList()
    },
    CancelDistUsersDialog() {
      // 关闭分配角色弹窗
      this.distDialogVisible = false
    },
    async sureDistUser() {
      // 确定修改分配角色
      const res = await distRule(this.distRulesMsg.id,this.rolesId)
      if(res.meta.status !== 200) return this.$message({
          type:'error',
          message:'更新用户角色失败'
      })

        this.$message({
            type:'success',
            message:'更新用户角色成功'
        })

        this.distDialogVisible = false

        this._getUsersData()

        this.rolesId = ''
    },
    /* ------- 网络请求 ---------- */
    async _getUsersData() {
      const res = await getUsersData(this.query, this.pagenum, this.pagesize)
      if (res.meta.status !== 200)
        return this.$message({
          type: 'error',
          message: res.msg,
        })

      this.userData = res.data.users
      this.pagenum = res.data.pagenum
      this.total = res.data.total
    },
    async _getRolesList() {
      const res = await getRolesList()
      if (res.meta.status !== 200)
        return this.$message({
          type: 'error',
          message: '获取角色列表失败',
        })

      this.rolesList = res.data
    },
  },
}
</script>

<style lang="scss" scoped>
.users {
  .box-card {
    margin-top: 10px;

    .el-table {
      margin-top: 10px;
      margin-bottom: 10px;
    }
  }
}
</style>