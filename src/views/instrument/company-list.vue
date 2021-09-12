<template>
  <el-main>
    <!-- 搜索 -->
    <el-form :inline="true" :model="listQuery">
      <el-form-item>
        <el-button class="filter-item" style="margin-left: 10px;" type="success" icon="el-icon-plus" @click="handleAdd">{{ $t('i18nView.AddGongSi') }}</el-button>
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
      <el-table-column prop="companyNo" align="center" :show-overflow-tooltip="true" label="公司编号" width="120" />
      <el-table-column prop="companyName" :show-overflow-tooltip="true" align="center" label="公司名称" />
      <el-table-column prop="createTime" align="center" label="创建时间" />
      <!-- <el-table-column sortable prop="enable" align="center" label="是否启用" width="120">
        <template slot-scope="scope">
          <i :style="scope.row.enable === true ?'color:green':'color:red'" :class="scope.row.enable === true ? 'el-icon-success ':'el-icon-error'" />
        </template>
      </el-table-column> -->

      <el-table-column align="center" fixed="right" :label="$t('i18nView.Operation')" width="280">
        <template slot-scope="scope">
          <el-button
            :size="formSize"
            type="text"
            icon="el-icon-search"
            class="-my-1"
            @click="handleViewDetail(scope.$index, scope.row)"
          >
            <span class="text-sm">{{ $t('i18nView.See') }}</span>
          </el-button>
          <el-button
            v-if="!scope.row.issuedTime"
            :size="formSize"
            type="text"
            icon="el-icon-edit"
            class="-my-1"
            @click="handleEdit(scope.row)"
          >
            <span class="text-sm">{{ $t('i18nView.Edit') }}</span>
          </el-button>
          <el-button
            v-if="!scope.row.issuedTime"
            :size="formSize"
            type="text"
            icon="el-icon-delete"
            class="-my-1 text-red-500"
            @click="handleDelete(scope.row)"
          >
            <span class="text-sm">{{ $t('i18nView.Delete') }}</span>
          </el-button>
        </template>
      </el-table-column>

    </el-table>

    <div
      class="p-3 bg-gray-100 text-center"
      style="font-size: 0;	padding: 0.75rem;	text-align: center;"
    >
      <pagination
        layout="total, sizes, prev, pager, next"
        :page.sync="page"
        :limit.sync="limit"
        :total="tableTotalCount"
        @pagination="getList"
      />
    </div>

    <!-- 表单 -->
    <el-dialog
      :title="formTitle"
      :visible.sync="dialogVisible"
      width="800px"
      :close-on-click-modal="false"
      :fullscreen="fullScreen"
      @closed="handleClose('form')"
    >
      <el-form
        ref="form"
        label-width="110px"
        :size="formSize"
        :model="form"
        class="stripe"
        :hide-required-asterisk="viewMode"
        :show-message="!viewMode"
        :disabled="viewMode"
        :rules="rules"
      >
        <el-row :gutter="10">
          <el-col :span="24">
            <el-form-item prop="companyNo" label="公司编号">
              <el-input v-model.trim="form.companyNo" placeholder="请输入公司编号" />
            </el-form-item>

          </el-col>

          <el-col :span="24">
            <el-form-item prop="companyName" label="公司名称">
              <el-input v-model.trim="form.companyName" placeholder="请输入公司名称" />
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item prop="remark" label="备注">
              <el-input v-model.trim="form.remark" type="textarea" maxlength="100" placeholder="请输入备注" />
            </el-form-item>
          </el-col>

        </el-row>

      </el-form>

      <template slot="footer">
        <div class="text-center">
          <el-button :size="formSize" @click="handleClose('form')">{{ viewMode ? '关 闭' : '取 消' }}</el-button>
          <el-button v-show="!viewMode" type="primary" :size="formSize" @click="handleSubmitForm('form')">确 定</el-button>
        </div>
      </template>

    </el-dialog>
  </el-main>
</template>
<script>
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import local from '@/views/local'
import { getCompanList, createCompan, getCompanInfo, UpdateCompan, DeleteCompan } from '@/api/api'
import { isvalidPhone } from '@/utils/validate'
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
  name: 'CompanyList',
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
        companyNo: [
          { required: true, message: '请输入公司编号', trigger: 'blur' }
        ],
        companyName: [
          { required: true, message: '请输入公司名称', trigger: 'blur' }
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
      form: {
        companyNo: '',
        companyName: '',
        remark: '',
        enable: 1
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
      const { limit, page } = this
      const params = {
        pageIndex: page,
        pageSize: limit,
        orderBy: 'id',
        sort: 'descending'
        // orderBy: 0,
        // sort: ''
        // queryText: ''
      }
      getCompanList(params).then(response => {
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
      this.form = {
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

    // 搜索
    handleSearch() {

    },

    // 编辑行数据
    handleEdit(row) {
      this.formTitle = '编辑'
      // this.form = row
      this.getInfo(row)
      this.dialogVisible = true
    },

    // 查看行数据
    handleViewDetail(index, row) {
      this.formTitle = '查看'
      // this.form = row
      this.getInfo(row)
      this.viewMode = true
      this.dialogVisible = true
    },

    // 获取用户信息
    getInfo(row) {
      // this.form = row
      const params = { id: row.id }
      getCompanInfo(params).then(response => {
        const { data, statusCode } = response
        if (statusCode === 200) {
          this.form = data
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
        DeleteCompan({ userIds: [row.userID] }).then(response => {
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
            const params = this.form
            createCompan(params).then(response => {
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
            const params = this.form
            UpdateCompan(params).then(response => {
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

    handlEaudit() {
      this.$confirm(`是否同意通过审核`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        dangerouslyUseHTMLString: true,
        center: true,
        type: 'warning'
      }).then(() => {
        console.log('通过')
      }).catch(() => {
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
