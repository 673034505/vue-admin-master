<template>
  <el-main>
    <!-- 搜索 -->
    <el-form :inline="true" :model="listQuery">
      <el-form-item>
        <el-input v-model="listQuery.userName" placeholder="用户名" style="width: 180px;" class="filter-item" />
      </el-form-item>
      <el-form-item>
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus" @click="handleAdd">{{ $t('i18nView.addUser') }}</el-button>
        <!-- <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleEdit">编辑角色</el-button>
        <el-button class="filter-item" style="margin-left: 10px;" type="success" icon="el-icon-edit">密码重置</el-button> -->
      </el-form-item>
    </el-form>

    <!-- 表格 -->
    <el-table
      ref="elTable"
      v-loading="listLoading"
      highlight-current-row
      :data="list"
      border
      @row-click="onRowClick"
    >
      <!-- <el-table-column type="selection" width="50" align="center" fixed="left" /> -->
      <el-table-column
        prop="id"
        type="index"
        label="序号"
        width="50"
        align="center"
      />
      <el-table-column
        prop="userName"
        :label="$t('i18nView.tableName')"
        align="center"
        show-overflow-tooltip
      />
      <el-table-column
        prop="userID"
        label="账号"
        align="center"
        show-overflow-tooltip
      />
      <el-table-column
        prop="phone"
        label="手机号"
        align="center"
        show-overflow-tooltip
      />
      <el-table-column
        prop="email"
        label="邮箱"
        align="center"
        show-overflow-tooltip
      />
      <el-table-column
        prop="createTime"
        label="创建时间"
        align="center"
        show-overflow-tooltip
      />
      <el-table-column
        prop="updateTime"
        label="更新时间"
        align="center"
        show-overflow-tooltip
      />
      <el-table-column align="center" fixed="right" label="操作" width="280">
        <template slot-scope="scope">
          <el-button
            :size="formSize"
            type="text"
            icon="el-icon-search"
            class="-my-1"
            @click="handleViewDetail(scope.$index, scope.row)"
          >
            <span class="text-sm">查看</span>
          </el-button>
          <el-button
            v-if="!scope.row.issuedTime"
            :size="formSize"
            type="text"
            icon="el-icon-edit"
            class="-my-1"
            @click="handleEdit(scope.row)"
          >
            <span class="text-sm">编辑</span>
          </el-button>
          <el-button
            v-if="!scope.row.issuedTime"
            :size="formSize"
            type="text"
            icon="el-icon-delete"
            class="-my-1 text-red-500"
            @click="handleDelete(scope.row)"
          >
            <span class="text-sm">删除</span>
          </el-button>
        </template>
      </el-table-column>

    </el-table>

    <div
      class="p-3 bg-gray-100 text-center"
      style="font-size: 0;	padding: 0.75rem;	text-align: center;"
    >
      <pagination
        layout="prev, pager, next"
        :page.sync="page"
        :limit.sync="limit"
        :total="tableTotalCount"
        @change="handleAppPageChange"
      />
    </div>

    <!-- 表单 -->
    <el-dialog
      :title="formTitle"
      :visible.sync="dialogVisible"
      width="800px"
      :close-on-click-modal="false"
      :fullscreen="fullScreen"
      @closed="handleClose('alertForm')"
    >
      <el-form
        ref="alertForm"
        label-width="110px"
        :size="formSize"
        :model="alertForm"
        class="stripe"
        :hide-required-asterisk="viewMode"
        :show-message="!viewMode"
        :disabled="viewMode"
        :rules="rules"
      >
        <el-divider content-position="left"><b>人员信息</b></el-divider>
        <el-row :gutter="10">
          <el-col :span="24">
            <el-form-item
              prop="userID"
              label="账号"
            >
              <el-input
                v-model.trim="alertForm.userID"
                placeholder="请输入用户编号"
              />
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item
              prop="password"
              label="密码"
            >
              <el-input
                v-model.trim="alertForm.password"
                show-password
                placeholder="请输入用户密码"
              />
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item
              prop="userName"
              label="姓名"
            >
              <el-input
                v-model.trim="alertForm.userName"
                placeholder="请输入用户姓名"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item prop="email" label="邮箱">
              <el-input v-model.trim="alertForm.email" placeholder="请选择邮箱" />
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item
              prop="sex"
              label="性别"
            >
              <el-select v-model="alertForm.sex" style="width:100%;" placeholder="请选择性别">
                <el-option label="男" value="男" />
                <el-option label="女" value="女" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item
              prop="phone"
              label="手机号"
            >
              <el-input
                v-model.number="alertForm.phone"
                placeholder="请输入用户手机号"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item
              prop="Address"
              label="地址"
            >
              <el-input
                v-model.trim="alertForm.Address"
                maxlength="50"
                placeholder="请输入地址"
              />
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>

      <template slot="footer">
        <div class="text-center">
          <el-button :size="formSize" @click="handleClose('alertForm')">{{ viewMode ? '关 闭' : '取 消' }}</el-button>
          <el-button v-show="!viewMode" type="primary" :size="formSize" @click="handleSubmitForm('alertForm')">确 定</el-button>
        </div>
      </template>

    </el-dialog>
  </el-main>
</template>
<script>
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import local from '@/views/local'
import { isvalidPhone } from '@/utils/validate'
import { getUsersQuery, getUsersCreate, getUsersInfo, getUsersUpdate, getUsersDelete } from '@/api/api'
const viewName = 'i18nView'
// 自定义验证
const validPhone = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入电话号码'))
  } else if (!isvalidPhone(value)) {
    callback(new Error('请输入正确的11位手机号码'))
  } else {
    callback()
  }
}
export default {
  name: 'PersonManage',
  components: { Pagination },
  data() {
    return {
      listQuery: {
        userName: ''

      },
      page: 1,
      limit: 10,
      tableTotalCount: 0,
      listLoading: false,
      list: [],
      selection: [],

      // 表单
      formTitle: '',
      formSize: document.body.clientWidth < 1440 ? 'mini' : 'small',
      dialogVisible: false,
      fullScreen: false,
      viewMode: false,
      rules: {
        userID: [
          { required: true, message: '请输入账号', trigger: 'blur' },
          { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
        ],
        userName: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
        ],
        nickName: [
          { required: true, message: '请输入用户昵称', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
        ],
        sex: [
          { required: true, message: '请输入性别', trigger: 'blur' }
        ],
        phone: [
          { required: true, trigger: 'blur', validator: validPhone }
        ]

      },
      queryForm: {
        name: '',
        phone: '',
        evilType: '', // 诈骗类型
        warnSource: '', // 预警来源
        victimLevel: '', // 风险等级
        administerPoliceStation: '', // 管辖派出所
        alertState: '', // 任务状态
        startTime: '',
        endTime: ''
      },
      alertForm: {
        userID: 'liuranran', // 账号
        password: '123456', // 密码
        userName: '刘燃燃', // 姓名
        email: '673034505@qq.com', // 邮箱
        phone: '17671544839', // 电话
        address: '', // 地址
        sex: '男' // 性别
      }
    }
  },
  computed: {
    lang: {
      get() {
        return this.$store.state.app.language
      },
      set(lang) {
        this.$i18n.locale = lang
        this.$store.dispatch('setLanguage', lang)
      }
    }
  },
  created() {
    if (!this.$i18n.getLocaleMessage('en')[viewName]) {
      this.$i18n.mergeLocaleMessage('en', local.en)
      this.$i18n.mergeLocaleMessage('zh', local.zh)
    }
    this.getList()
  },

  methods: {
    // 获取列表数据
    getList() {
      this.listLoading = true
      const { limit, pageNum } = this
      const params = {
        pageIndex: pageNum,
        pageSize: limit,
        orderBy: 0,
        sort: '',
        queryText: ''
      }
      getUsersQuery(params).then(response => {
        const { data, statusCode, message } = response
        this.listLoading = false
        if (statusCode === 200) {
          this.list = data.dataSource
          this.tableTotalCount = data.totalCount
        } else {
          this.$message.error(message)
        }
      })
    },

    refreshList() {
      this.getList()
    },

    // 监听多选框变化
    onSelectionChange(selection) {
      const that = this
      that.selection = []
      selection.forEach(function(value, index) {
        that.selection.push(value.id)
      })
    },

    // 表单dialog关闭
    handleClose(formName) {
      this.viewMode = false
      this.fullScreen = false
      this.dialogVisible = false
      this.$refs[formName].resetFields()
      this.alertForm = {
        userID: '', // 账号
        password: '', // 密码
        userName: '', // 姓名
        email: '', // 邮箱
        phone: '', // 电话
        address: '', // 地址
        sex: '' // 性别
      }
    },

    // 添加
    handleAdd() {
      this.formTitle = '添加'
      this.dialogVisible = true
    },

    // 编辑行数据
    handleEdit(row) {
      this.formTitle = '编辑'
      // this.alertForm = row
      this.getInfo(row)
      this.dialogVisible = true
    },

    // 查看行数据
    handleViewDetail(index, row) {
      this.formTitle = '查看'
      // this.alertForm = row
      this.getInfo(row)
      this.viewMode = true
      this.dialogVisible = true
    },

    // 获取用户信息
    getInfo(row) {
      // this.alertForm = row
      const params = { id: row.userID }
      getUsersInfo(params).then(response => {
        const { data, statusCode } = response
        if (statusCode === 200) {
          this.alertForm = data
        }
      })
    },

    // 删除
    handleDelete(row) {
      this.$confirm(`是否删除 ${row.userName}  等信息`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        dangerouslyUseHTMLString: true,
        center: true,
        type: 'warning'
      }).then(() => {
        getUsersDelete({ userIds: [row.userID] }).then(response => {
          const { statusCode, message } = response
          if (statusCode === 200) {
            this.$message.success('删除成功')
            this.refreshList()
          } else {
            this.$message.error(message)
          }
        })
      }).catch(() => {
      })
    },

    handleAppPageChange(page) {
      console.log(page)
    },

    // 提交表单
    handleSubmitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.formTitle === '添加') {
            const params = this.alertForm
            getUsersCreate(params).then(response => {
              const { data, statusCode, message } = response
              if (statusCode === 200) {
                if (data === 1) {
                  this.$message.success('添加成功')
                  this.dialogVisible = false
                  this.refreshList()
                }
              } else {
                this.$message.error(message)
              }
            })
          } else {
            const params = this.alertForm
            getUsersUpdate(params).then(response => {
              const { data, statusCode, message } = response
              if (statusCode === 200) {
                if (data === 1) {
                  this.$message.success('修改成功')
                  this.dialogVisible = false
                  this.refreshList()
                }
              } else {
                this.$message.error(message)
              }
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },

    // 点击行触发，选中或不选中复选框
    onRowClick(row, column, event) {
      this.$refs.elTable.toggleRowSelection(row)
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
