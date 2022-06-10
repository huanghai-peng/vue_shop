<template>
  <div class="login">
    <el-card class="box-card login-item">
      <div class="login-hd">
        <img src="~assets/img/login.jpeg"
             alt="">
      </div>
      <div class="login-info">
        <el-form ref="userRefForm"
                 :model="form"
                 :rules="formRules">
          <el-form-item prop="username">
            <el-input v-model="form.username"
                      placeholder="请输入用户名"
                      prefix-icon="el-icon-s-custom"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input placeholder="请输入密码"
                      v-model="form.password"
                      show-password
                      class="pwd"
                      prefix-icon="el-icon-lock"></el-input>
          </el-form-item>
          <el-form-item class="login-btn">
            <el-button type="primary"
                       @click="submitForm">登录</el-button>
            <el-button type="info" @click="resetForm">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getLogin } from 'network/login'
export default {
  data() {
    return {
      form: {
        username: 'admin',
        password: '123456',
      },
      formRules: {
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '长度在 3 到 10 个字符',
            trigger: 'blur',
          },
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '长度在 6 到 15 个字符',
            trigger: 'blur',
          },
        ],
      },
    }
  },
  components: {},
  methods: {
    submitForm() {
      this.$refs.userRefForm.validate(async (valid) => {
        if (!valid) return
        // 校检通过，发送请求
        const res = await getLogin(this.form)
        if (res.meta.status == 200) {
          // 登录成功，在sessionStorage中保存token
          sessionStorage.setItem('token', res.data.token)
          this.$message({
            message: res.meta.msg,
            type: 'success',
          })
          // 跳转到home页面
          this.$router.push('/home')
        } else {
          this.$message({
              message: res.meta.msg,
              type: 'error',
            })
        }
      })
    },
    resetForm() {
        this.$refs.userRefForm.resetFields();
      }
  },
}
</script>

<style lang="scss" scoped>
.login {
  position: relative;
  background-color: #2b4b6b;
  height: 100vh;

  .login-item {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 450px;
    height: 300px;
    transform: translate(-50%, -50%);
    overflow: visible;

    .login-hd {
      position: absolute;
      top: 0;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 130px;
      height: 130px;
      border-radius: 50%;
      overflow: hidden;
      background-color: #fff;
      padding: 10px;
      box-shadow: 0 0 10px #dddddd;
      border: 1px solid #eeeeee;

      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }
    .login-info {
      margin-top: 90px;
      .login-btn {
        text-align: right;
      }
    }
  }
}
</style>
