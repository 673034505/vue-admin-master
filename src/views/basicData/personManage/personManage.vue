<template>
  <el-main>
    <!-- 搜索 -->
    用户管理
    <el-form :inline="true" :model="listQuery">
      <el-form-item>
        <el-input v-model="listQuery.userName" placeholder="用户名" style="width: 180px;" class="filter-item" />
      </el-form-item>
      <el-form-item>
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus" @click="dialogVisible= true">{{ $t('i18nView.addUser') }}</el-button>
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleEdit">编辑角色</el-button>
        <el-button class="filter-item" style="margin-left: 10px;" type="success" icon="el-icon-edit">密码重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格 -->
    <el-table
      ref="elTable"
      v-loading="listLoading"
      highlight-current-row
      :data="list"
      border
      @selection-change="onSelectionChange"
      @row-click="onRowClick"
    >
      <el-table-column type="selection" width="50" align="center" fixed="left" />
      <el-table-column
        prop="username"
        :label="$t('i18nView.tableName')"
        align="center"
        show-overflow-tooltip
      />
      <el-table-column
        prop="user"
        label="角色编码"
        align="center"
        show-overflow-tooltip
      />、
      <el-table-column
        prop="creattime"
        label="创建时间"
        align="center"
        show-overflow-tooltip
      />
      <el-table-column
        prop="updatetime"
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
      >
        <el-divider content-position="left"><b>人员信息</b></el-divider>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item
              prop="name"
              label="姓名"
            >
              <el-input
                v-model.trim="alertForm.name"
                maxlength="10"
                placeholder="请输入"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              prop="phone"
              label="手机号"
            >
              <el-input
                v-model.trim="alertForm.phone"
                placeholder="请输入"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item
              prop="address"
              label="地址"
            >
              <el-input
                v-model.trim="alertForm.address"
                maxlength="50"
                placeholder="请输入"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider content-position="left"><b>预警信息</b></el-divider>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item
              prop="occurTimeStr"
              label="受害时间"
            >
              <el-date-picker
                v-model="alertForm.occurTimeStr"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                style="width: 100%"
                placeholder="选择日期时间"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              prop="evilInfo"
              label="恶意信息值"
            >
              <el-input
                v-model.trim="alertForm.evilInfo"
                maxlength="50"
                name="name"
                placeholder="请输入"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item
              prop="remark"
              label="备注"
            >
              <el-input
                v-model="alertForm.remark"
                type="textarea"
                :rows="3"
                maxlength="100"
                show-word-limit
                placeholder="请输入内容"
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
import local from './local'
const viewName = 'i18nView'
export default {
  name: 'User',
  components: { Pagination },
  data() {
    return {
      listQuery: {
        userName: ''

      },
      page: 1,
      limit: 10,
      tableTotalCount: 30,
      listLoading: false,
      list: [
        { username: '刘燃燃', user: 'admin', phone: '17671644839', creattime: '2021-06-06 17:40:00', updatetime: '2021-06-06 17:40:00' },
        { username: '刘燃燃', user: 'admin', phone: '17671644839', creattime: '2021-06-06 17:40:00', updatetime: '2021-06-06 17:40:00' },
        { username: '刘燃燃', user: 'admin', phone: '17671644839', creattime: '2021-06-06 17:40:00', updatetime: '2021-06-06 17:40:00' },
        { username: '刘燃燃', user: 'admin', phone: '17671644839', creattime: '2021-06-06 17:40:00', updatetime: '2021-06-06 17:40:00' }
      ],
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
      alertForm: {
        name: '',
        phone: '',
        address: '',
        administerPoliceStation: '',
        businessOrSchool: '',
        belongingCommunity: '',
        subordinateStreet: '',
        victimLevel: '',
        evilType: '',
        occurTimeStr: '',
        occurTime: '',
        infoType: '',
        evilInfo: '',
        warnSource: '',
        remark: '',
        cheatType: '',
        cheatState: '',
        cheatMoney: '',
        cheatTime: '',
        professional: '',
        disposalRemark: '',
        reportState: '',
        dissuadeSituation: '',
        partiesPhotos: [],
        liarPhotos: []
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
  },

  methods: {
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
        name: '',
        phone: '',
        address: '',
        administerPoliceStation: '',
        businessOrSchool: '',
        belongingCommunity: '',
        subordinateStreet: '',
        victimLevel: '',
        evilType: '',
        occurTimeStr: '',
        occurTime: '',
        infoType: '',
        evilInfo: '',
        warnSource: '',
        remark: '',
        cheatType: '',
        cheatState: '',
        cheatMoney: '',
        cheatTime: '',
        professional: '',
        disposalRemark: '',
        reportState: '',
        dissuadeSituation: '',
        partiesPhotos: [],
        liarPhotos: []
      }
    },

    // 编辑行数据
    handleEdit(row) {
      this.formTitle = '编辑'
      this.dialogVisible = true
    },

    // 查看行数据
    handleViewDetail(index, row) {
      this.formTitle = '查看'
      this.viewMode = true
      this.dialogVisible = true
    },

    // 删除
    handleDelete(row) {
      this.$confirm('删除此警情?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        dangerouslyUseHTMLString: true,
        center: true,
        type: 'warning'
      }).then(() => {
        // deleteAlertInfo(row.id).then(res => {
        //   const { code, message } = res
        //   if (code === 200) {
        //     this.$message.error('删除成功')
        //     this.refreshList()
        //   } else {
        //     this.$message.error(message)
        //   }
        // })
      }).catch(() => {
      })
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
