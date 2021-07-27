<template>
  <el-main>
    <el-row :gutter="24">
      <el-col :span="4">
        <el-table ref="roleTable" v-loading="loadingRoleUser" highlight-current-row :data="dataRoleTable" border :height="tableHeight-135" @row-click="handleRoleTableSelection">
          <el-table-column prop="name" label="角色名称" />
        </el-table>
      </el-col>
      <el-col :span="20">
        <el-form style="display:flex" :inline="true" @submit.native.prevent>
          <el-form-item>
            <el-button type="primary" icon="el-icon-plus" @click="handleGetUserTable">添加用户</el-button>
            <el-button type="danger" icon="el-icon-delete" @click="handleDelete">删除用户</el-button>
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
          <el-table-column type="selection" width="50" align="center" fixed="left" />
          <!-- <el-table-column prop="id" type="index" label="序号" width="50" align="center" /> -->
          <el-table-column prop="userID" label="用户账号" align="center" show-overflow-tooltip />
          <el-table-column prop="userName" :label="$t('i18nView.tableName')" align="center" show-overflow-tooltip />
          <el-table-column prop="sex" label="性别" align="center" show-overflow-tooltip />
          <el-table-column prop="phone" label="手机号" align="center" show-overflow-tooltip />
          <el-table-column prop="email" label="邮箱" align="center" show-overflow-tooltip />

        </el-table>

        <!-- <div
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
        </div> -->
      </el-col>
    </el-row>

    <!-- 添加或修改菜单对话框 -->
    <el-dialog title="添加用户" :visible.sync="open" highlight-current-row row-key="userId" append-to-body @close="cancel">
      <el-form style="display:flex" :inline="true" @submit.native.prevent>
        <el-form-item style="margin-left:auto">
          <el-input v-model="search" placeholder="请输入用户名称" clearable prefix-icon="el-icon-search" />
        </el-form-item>
      </el-form>
      <el-row>
        <el-col>
          <el-table ref="userTable" v-loading="loadingUser" :data="dataUserTable.filter(data => !search || data.userID.toLowerCase().includes(search.toLowerCase()) || data.userName.toLowerCase().includes(search.toLowerCase()))" row-key="userId" stripe border :height="tableHeight*0.5">
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column prop="userID" align="center" label="用户账号" width="150" />
            <el-table-column prop="userName" align="center" label="用户名称" width="150" />
            <el-table-column prop="sex" align="center" label="性别" width="80" />
            <!-- <el-table-column prop="enabled" align="center" label="是否启用" width="80">
              <template slot-scope="scope" label="操作">
                <i :style="scope.row.enabled === true ?'color:green':'color:red'" :class="scope.row.enabled === true ? 'el-icon-success ':'el-icon-error'" />
              </template>
            </el-table-column> -->
            <el-table-column prop="remark" align="center" label="备注" />
          </el-table>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
        <el-button @click="open = false">取 消</el-button>
      </div>
    </el-dialog>
  </el-main>
</template>
<script>
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import local from '@/views/local'
import { isvalidPhone } from '@/utils/validate'
import { getUsersQuery, getRolesUser, getRolesUserList, getRolesUserDelete, getRolesUserCreate, getRolesInfo, getUsersCreate, getUsersInfo, getUsersUpdate, getUsersDelete } from '@/api/api'
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
  name: 'RoleUsers',
  components: { Pagination },
  data() {
    return {
      // 遮罩层
      loadingUser: false,
      loadingRoleUser: false,
      // 表格高度
      tableHeight: window.innerHeight,
      // 角色列表
      dataRoleTable: [],
      // 已添加用户列表
      dataUserTable: [],
      // 勾选添加用户列表
      addSelections: [],
      // 勾选删除用户列表
      delSelections: [],
      // 过滤查询
      search: '',
      // 角色id
      roleId: '',
      // 是否显示弹出层
      open: false,

      tableTotalCount: 0,
      listLoading: false,
      list: [],
      selection: [],

      // 表单
      formTitle: '',
      formSize: document.body.clientWidth < 1440 ? 'mini' : 'small',
      dialogVisible: false,
      fullScreen: false,
      viewMode: false
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
    // this.getList()
    this.getRolesList()
  },

  methods: {
    getRolesList() {
      this.loadingRoleUser = true
      getRolesInfo().then(response => {
        const { data, statusCode, message } = response
        this.listLoading = false
        if (statusCode === 200) {
          this.dataRoleTable = data
          this.loadingRoleUser = false
          this.handleRoleTableSelection(this.dataRoleTable[0])
        } else {
          this.$message.error(message)
        }
      })
    },

    // 获取列表数据
    getList() {
      const params = {
        roleId: this.roleId
      }
      this.listLoading = true
      getRolesUser(params).then(response => {
        const { data, statusCode, message } = response
        if (statusCode === 200) {
          this.list = data
          this.listLoading = false
        } else {
          this.$message.error(message)
        }
      })
    },

    handleRoleTableSelection(row) {
      this.roleId = row.id
      this.getList()
    },

    // 删除角色用户
    handleDelete(row) {
      this.delSelections = []
      this.$refs.elTable.selection.forEach(element => {
        this.delSelections.push(element.userID)
      })
      if (this.delSelections.length === 0) {
        return
      }
      this.$confirm(
        '是否确认删除选中的 ' + this.delSelections.length + ' 条数据?',
        '警告',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          getRolesUserDelete({
            roleId: this.roleId,
            userIds: this.delSelections
          }).then(response => {
            if (response.statusCode === 200) {
              this.$message({
                message: '成功删除' + response.data + '条数据',
                type: 'success'
              })
              this.getList()
            }
          })
        })
        .catch(() => {})
    },

    handleAppPageChange(page) {
      console.log(page)
    },

    // 获取未添加角色列表
    handleGetUserTable() {
      this.open = true
      this.loadingUser = true
      getRolesUserList({ roleId: this.roleId }).then(response => {
        this.dataUserTable = response.data
        this.loadingUser = false
      })
    },

    // 新增用户角色
    handleSubmit() {
      this.addSelections = []
      this.$refs.userTable.selection.forEach(element => {
        this.addSelections.push(element.userID)
      })
      getRolesUserCreate({
        roleId: this.roleId,
        userIds: this.addSelections
      }).then(response => {
        if (response.statusCode === 200) {
          this.$message({
            message: '成功添加' + response.data + '条数据',
            type: 'success'
          })
          this.getList()
          this.open = false
        }
      })
    },

    cancel() {
      this.open = false
    },

    // 点击行触发，选中或不选中复选框
    onRowClick(row, column, event) {
      console.log(row)
      this.$refs.elTable.toggleRowSelection(row)
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
