<template>
  <el-form ref="loginForm" class="login-form" status-icon :rules="loginRules" :model="loginForm" label-width="0">
    <el-form-item prop="userName">
      <el-input v-model="loginForm.userName" size="small" auto-complete="off" placeholder="请输入用户名" @keyup.enter.native="handleLogin">
        <i slot="prefix" class="icon-yonghu" />
      </el-input>
    </el-form-item>
    <el-form-item prop="passWord">
      <el-input v-model="loginForm.passWord" size="small" :type="passwordType" auto-complete="off" placeholder="请输入密码" @keyup.enter.native="handleLogin">
        <i slot="suffix" class="el-icon-view el-input__icon" @click="showPassword" />
        <i slot="prefix" class="icon-mima" />
      </el-input>
    </el-form-item>
    <!-- <el-checkbox v-model="checked">记住账号</el-checkbox> -->
    <el-form-item>
      <el-button type="primary" size="small" class="login-submit" @click.native.prevent="handleLogin">登录</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { isvalidUsername } from '@/utils/validate'
export default {
  name: 'Userlogin',
  props: [],
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!isvalidUsername(value)) {
        callback(new Error('请输入正确的用户名'))
      } else {
        callback()
      }
    }
    const validateCode = (rule, value, callback) => {
      if (this.code.value !== value) {
        this.loginForm.code = ''
        this.refreshCode()
        callback(new Error('请输入正确的验证码'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        userName: '9999',
        passWord: '123456',
        code: '1111',
        uuid: '111'
      },
      checked: false,
      code: {
        src: '',
        value: '',
        len: 4,
        type: 'text'
      },
      loginRules: {
        userName: [
          // { required: true, trigger: 'blur', validator: validateUsername }
          { required: true, trigger: 'blur' }
        ],
        passWord: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '密码长度最少为6位', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { min: 4, max: 4, message: '验证码长度为4位', trigger: 'blur' },
          { required: true, trigger: 'blur', validator: validateCode }
        ]
      },
      passwordType: 'passWord'
    }
  },
  computed: {
  },
  created() {
  },
  mounted() {},
  methods: {
    showPassword() {
      this.passwordType === ''
        ? (this.passwordType = 'passWord')
        : (this.passwordType = '')
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.$store.dispatch('Login', this.loginForm).then(response => {
            const { statusCode, data, message } = response
            if (statusCode === 200) {
              this.$router.push({ path: '/dashboard/dashboard' })
            } else {
              this.$message.error(message)
            }
          })
        }
      })
    }
  }
}
</script>
<style>
</style>
