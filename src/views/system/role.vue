<template>
  <el-main>
    <!-- 搜索 -->
    <el-form :inline="true" :model="listQuery">
      <el-form-item>
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus" @click="handleAdd">{{ $t('i18nView.addRole') }}</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格 -->
    <el-table
      ref="elTable"
      v-loading="listLoading"
      highlight-current-row
      :data="list"
      border
    >
      <el-table-column prop="id" type="index" :label="$t('i18nView.SerialNumber')" width="120" align="center" />
      <el-table-column prop="name" :label="$t('i18nView.Role')" align="center" show-overflow-tooltip />
      <el-table-column prop="remark" :label="$t('i18nView.Rower')" align="center" show-overflow-tooltip />
      <el-table-column prop="createTime" :label="$t('i18nView.CreateTime')" align="center" show-overflow-tooltip />
      <el-table-column prop="updateTime" :label="$t('i18nView.UpdateTime')" align="center" show-overflow-tooltip />
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
        layout="prev, pager, next"
        :page.sync="pageNum"
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
      >
        <el-row :gutter="10">
          <el-col :span="24">
            <el-form-item
              prop="name"
              :label="$t('i18nView.Role') || 角色"
            >
              <el-input
                v-model.trim="form.name"
                maxlength="10"
                placeholder="请输入"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item
              prop="remark"
              :label="$t('i18nView.Rower') || 权限"
            >
              <el-input
                v-model.trim="form.remark"
                placeholder="请输入"
              />
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>

      <template slot="footer">
        <div class="text-center">
          <el-button :size="formSize" @click="handleClose('form')"> {{ viewMode ? ($t('i18nView.Close') ||'关 闭') : ( $t('i18nView.Cancel')|| '取 消') }} </el-button>
          <el-button v-show="!viewMode" type="primary" :size="formSize" @click="handleSubmitForm('form')"> {{ $t('i18nView.Determine') || '确 定' }} </el-button>
        </div>
      </template>

    </el-dialog>
  </el-main>
</template>
<script>

import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { getRolesList, getRolesCreatee, getRolesUpdate, getRolesDelet, getRolesInfo } from '@/api/api'
import local from '@/views/local'
const viewName = 'i18nView'
export default {
  name: 'User',
  components: { Pagination },
  data() {
    return {
      listQuery: {
        userName: ''

      },
      pageNum: 1,
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
        name: '',
        remark: ''
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

    /** 查询菜单列表 */
    getList() {
      this.loading = true
      const { limit, pageNum } = this
      const params = {
        pageIndex: pageNum,
        pageSize: limit,
        orderBy: 0,
        sort: '',
        queryText: ''
      }
      getRolesList(params).then(response => {
        const { data, statusCode, message } = response
        if (statusCode === 200) {
          this.list = data.dataSource
          this.tableTotalCount = data.totalCount
        } else {
          this.$message.error(message)
        }
        this.loading = false
      })
    },

    // 表单dialog关闭
    handleClose(formName) {
      this.viewMode = false
      this.fullScreen = false
      this.dialogVisible = false
      this.$refs[formName].resetFields()
      this.form = {
        name: '',
        remark: ''
      }
    },

    handleAdd() {
      this.formTitle = '添加'
      this.dialogVisible = true
    },

    // 编辑行数据
    handleEdit(row) {
      this.formTitle = '编辑'
      this.getInfo(row)
      this.dialogVisible = true
    },

    // 查看行数据
    handleViewDetail(index, row) {
      this.formTitle = '查看'
      this.getInfo(row)
      this.viewMode = true
      this.dialogVisible = true
    },

    // 获取详情
    getInfo(row) {
      getRolesInfo({ id: row.id }).then(response => {
        const { statusCode, message, data } = response
        if (statusCode === 200) {
          this.form = data
        } else {
          this.$message.error(message)
        }
      })
    },

    // 删除
    handleDelete(row) {
      this.$confirm(`是否删除 ${row.name}`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        dangerouslyUseHTMLString: true,
        center: true,
        type: 'warning'
      }).then(() => {
        getRolesDelet({ id: row.id }).then(response => {
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

    // 提交表单
    handleSubmitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.formTitle === '添加') {
            const params = this.form
            getRolesCreatee(params).then(response => {
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
            getRolesUpdate(params).then(response => {
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

    refreshList() {
      this.getList()
    },

    handleAppPageChange(page) {
      console.log(page)
    },

    // 点击行触发，选中或不选中复选框
    onRowClick(row, column, event) {
      this.$refs.elTable.toggleRowSelection(row)
    }
  }
}
</script>
<style lang="sss" scoped>

</style>
