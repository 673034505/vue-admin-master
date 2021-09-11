<template>
  <el-main>
    <!-- 搜索 -->
    <!-- <el-form :inline="true" :model="listQuery">
      <el-form-item>
        <el-input v-model="listQuery.userName" placeholder="用户名" style="width: 180px;" class="filter-item" />
      </el-form-item>
      <el-form-item>
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus" @click="handleAdd">{{ $t('i18nView.addUser') }}</el-button>
      </el-form-item>
    </el-form> -->

    <!-- <el-row
      :gutter="10"
      class="mb8"
    >
      <el-button class="filter-item" style="margin-left: 10px;" plain type="primary" icon="el-icon-plus" @click="handleAdd"> 领用 </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" plain type="primary" icon="el-icon-plus" @click="handleAdd"> 借用 </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" plain type="primary" icon="el-icon-plus" @click="handleAdd"> 预约 </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" plain type="primary" icon="el-icon-plus" @click="handleAdd"> 报废 </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" plain type="primary" icon="el-icon-plus" @click="handleAdd"> 归还 </el-button>

    </el-row> -->

    <!-- 表格 -->
    <el-table
      ref="elTable"
      v-loading="listLoading"
      highlight-current-row
      :data="list"
      border
      @row-click="onRowClick"
      @selection-change="handleSelectionChange"
    >
      <!-- <el-table-column sortable type="selection" width="55" align="center" /> -->
      <!-- <el-table-column prop="id" type="index" :label="$t('i18nView.SerialNumber')" width="120" align="center" /> -->
      <el-table-column prop="serialno" label="物品编号" align="center" show-overflow-tooltip />
      <el-table-column prop="devicename" label="物品名称" align="center" show-overflow-tooltip />
      <el-table-column prop="subcategoryName" label="物品类别" align="center" show-overflow-tooltip />
      <el-table-column prop="model" label="型号" align="center" show-overflow-tooltip />
      <el-table-column prop="adminname" label="负责人姓名" align="center" show-overflow-tooltip />
      <el-table-column prop="attrnotes" label="物品描述" align="center" show-overflow-tooltip />
      <el-table-column prop="supplytime" label="出库时间" align="center" show-overflow-tooltip />
      <!-- <el-table-column prop="text" :label="$t('i18nView.EquipmentName')" align="center" show-overflow-tooltip />
      <el-table-column prop="value" :label="$t('i18nView.EquipmentCode')" align="center" show-overflow-tooltip />
      <el-table-column prop="type" :label="$t('i18nView.EquipmentType')" align="center" show-overflow-tooltip />
      <el-table-column prop="isvalid" :label="$t('i18nView.EquipmentCode')" align="center" show-overflow-tooltip />
      <el-table-column prop="level" :label="$t('i18nView.EquipmentCode')" align="center" show-overflow-tooltip />
      <el-table-column prop="parent" :label="$t('i18nView.EquipmentCode')" align="center" show-overflow-tooltip /> -->
      <!-- <el-table-column
        prop="supplytime"
        label="更新时间"
        align="center"
        show-overflow-tooltip
      /> -->
      <el-table-column align="center" fixed="right" :label="$t('i18nView.Operation')" width="350">
        <template slot-scope="scope">
          <el-button
            :size="formSize"
            type="text"
            icon="el-icon-search"
            class="-my-1"
            @click="handleViewDetail(scope.row)"
          >
            <span class="text-sm"> 详情 </span>
          </el-button>
          <el-button
            :size="formSize"
            type="text"
            icon="el-icon-sell"
            class="-my-1"
            @click="handlReturn(scope.$index, scope.row)"
          >
            <span class="text-sm">{{ $t('i18nView.Return') }}</span>
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
      @closed="handleClose('form')"
    >

      <template v-if="formTitle =='查看'">
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
          <el-divider content-position="left"><b>{{ $t('i18nView.WuPinXinXi') }}</b></el-divider>
          <el-row :gutter="10">
            <el-col :span="24">
              <el-form-item prop="serialno" :label="$t('i18nView.WuPinBianHao')">
                <el-input v-model.number="form.serialno" placeholder="请输入" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item prop="devicename" :label="$t('i18nView.WuPinMingChen')">
                <el-input v-model.number="form.devicename" placeholder="请输入" />
              </el-form-item>
            </el-col>

            <el-col :span="24">
              <el-form-item prop="position" :label="$t('i18nView.CunFanWeiZhi')">
                <el-input v-model.trim="form.position" placeholder="请输入" />
              </el-form-item>
            </el-col>

            <el-col :span="24">
              <el-form-item prop="adminno" :label="$t('i18nView.FuZeRenXinMing')">
                <el-select v-model="form.adminno" filterable placeholder="请选择">
                  <el-option
                    v-for="item in userList"
                    :key="item.userID"
                    :label="item.userName"
                    :value="item.userID"
                  />
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="24">
              <el-form-item prop="supplytime" :label="$t('i18nView.ChuHuoShiJian')">
                <el-date-picker
                  v-model="form.supplytime"
                  type="datetime"
                  placeholder="选择日期时间"
                />
              </el-form-item>
            </el-col>

            <el-col :span="24">
              <el-form-item prop="cost" :label="$t('i18nView.DanWeiChengBen')">
                <el-input v-model.number="form.cost" placeholder="请输入" />
              </el-form-item>
            </el-col>

            <el-col :span="24">
              <el-form-item prop="position" :label="$t('i18nView.CunFanWeiZhi')">
                <el-input v-model.trim="form.position" placeholder="请输入" />
              </el-form-item>
            </el-col>

            <el-col :span="24">
              <el-form-item prop="usenotes" :label="$t('i18nView.ShiYongXuZhi')">
                <el-input v-model.trim="form.usenotes" type="textarea" :autosize="{ minRows: 4, maxRows: 10 }" maxlength="200" show-word-limit placeholder="请输入" />
              </el-form-item>
            </el-col>

            <el-col :span="24">
              <el-form-item prop="savenotes" :label="$t('i18nView.BaoCunXunZhi')">
                <el-input v-model.trim="form.savenotes" type="textarea" :autosize="{ minRows: 4, maxRows: 10 }" maxlength="200" show-word-limit placeholder="请输入" />
              </el-form-item>
            </el-col>

            <el-col :span="24">
              <el-form-item prop="attrnotes" :label="$t('i18nView.WuPinTeXin')">
                <!-- <el-checkbox-group v-model="form.attrnotes" :disabled="viewMode">
                <el-checkbox :disabled="viewMode" value="canly" label="可领用" />
                <el-checkbox :disabled="viewMode" value="canjy" label="可借用" />
                <el-checkbox :disabled="viewMode" value="canyy" label="可预约" />
              </el-checkbox-group> -->
                <el-input v-model.trim="form.attrnotes" placeholder="请输入" />
              </el-form-item>
            </el-col>

            <el-col :span="24">
              <el-form-item prop="canly" :label="$t('i18nView.CuCunShuXin')">
                <!-- <el-checkbox-group v-model="form.attrnotes" :disabled="viewMode">
                <el-checkbox :disabled="viewMode" value="canly" label="可领用" />
                <el-checkbox :disabled="viewMode" value="canjy" label="可借用" />
                <el-checkbox :disabled="viewMode" value="canyy" label="可预约" />
              </el-checkbox-group> -->
                <el-checkbox :value="form.canly === 1 ? true:false">可领用</el-checkbox>
                <el-checkbox :value="form.canjy === 1 ? true:false">可借用</el-checkbox>
                <el-checkbox :value="form.canyy === 1 ? true:false">可预约</el-checkbox>
              </el-form-item>
            </el-col>

            <el-col :span="24">
              <el-form-item prop="model" :label="$t('i18nView.XingHao')">
                <el-input v-model.trim="form.model" placeholder="请输入" />
              </el-form-item>
            </el-col>

            <el-col :span="24">
              <el-form-item prop="Sbcserialno" :label="$t('i18nView.SheBeiChuBianHao')">
                <el-input v-model.trim="form.Sbcserialno" placeholder="请输入" />
              </el-form-item>
            </el-col>

          </el-row>
        </el-form>
      </template>

      <template v-if=" formTitle == '归还' ">
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

            <template v-if="formTitle == '归还'">
              <el-col :span="24">
                <el-form-item prop="Usenotes" label="归还说明">
                  <el-input v-model="form.Usenotes" autosize type="textarea" placeholder="请输入" />
                </el-form-item>
              </el-col>

            </template>

          </el-row>

        </el-form>
      </template>

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
import { QueryGHPage, getDevicesubcategory, getQueryList, QueryTeacher, getDetail, setLYDevice, setJYDevice, setYYDevice, setBFDevice, setGHDevice } from '@/api/api'
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
  name: 'DeviceList',
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
      multipleSelection: [],

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
        Usenotes: [
          { required: true, message: '请输入', trigger: 'blur' }
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
      supplierList: [],
      userList: [],
      purchaseid: '',
      devicesList: [],
      id: '',
      form: {

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
    this.getDeviceList()
    this.getList()
  },

  methods: {
    // 获取列表数据
    getList() {
      this.listLoading = true
      const { limit, page } = this
      const params = {
        pageIndex: page,
        pageSize: limit
        // orderBy: 0,
        // sort: ''
        // queryText: ''
      }
      QueryGHPage(params).then(response => {
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

    getDeviceList() {
      getDevicesubcategory().then(response => {
        const { data, statusCode, message } = response
        this.devicesList = data
      })

      getQueryList({ queryText: '' }).then(response => {
        const { data, statusCode, message } = response
        this.supplierList = data
      })

      QueryTeacher().then(response => {
        const { data, statusCode, message } = response
        if (statusCode === 200) {
          this.userList = data
        } else {
          this.$message.error(message)
        }
      })
    },

    // 领用仪器
    handlCollect(index, row) {
      this.formTitle = '领用'
      // this.form = row
      this.dialogVisible = true

      return
      this.$confirm(`${this.$t('i18nView.InstrumentWant')}`, `${this.$t('i18nView.Tips')}`, {
        confirmButtonText: `${this.$t('i18nView.Determine')}`,
        cancelButtonText: `${this.$t('i18nView.Cancel')}`,
        dangerouslyUseHTMLString: true,
        center: true,
        type: 'warning'
      }).then(() => {
        setLYDevice({ id: row.id }).then(response => {
          const { statusCode } = response
          if (statusCode == 200) {
            this.$message.success(`${this.$t('i18nView.Claim')}${this.$t('i18nView.Success')}`)
          } else {
            this.$message.error(`${this.$t('i18nView.Claim')}${this.$t('i18nView.Error')}`)
          }
          this.refreshList()
        })
      }).catch(() => {
      })
    },

    // 借用仪器
    handlBorrow(index, row) {
      this.formTitle = '借用'
      // this.form = row
      this.dialogVisible = true
      return
      this.$confirm(`${this.$t('i18nView.InstrumenBorrow')}`, `${this.$t('i18nView.Tips')}`, {
        confirmButtonText: `${this.$t('i18nView.Determine')}`,
        cancelButtonText: `${this.$t('i18nView.Cancel')}`,
        dangerouslyUseHTMLString: true,
        center: true,
        type: 'warning'
      }).then(() => {
        setJYDevice({ id: row.id }).then(response => {
          const { statusCode } = response
          if (statusCode == 200) {
            this.$message.success(`${this.$t('i18nView.Borrow')}${this.$t('i18nView.Success')}`)
          } else {
            this.$message.error(`${this.$t('i18nView.Borrow')}${this.$t('i18nView.Error')}`)
          }
          this.refreshList()
        })
      }).catch(() => {
      })
    },

    // 预约仪器
    handlReserve(index, row) {
      this.formTitle = '预约'
      // this.form = row
      this.dialogVisible = true
      return
      this.$confirm(`${this.$t('i18nView.InstrumenReserve')}`, `${this.$t('i18nView.Tips')}`, {
        confirmButtonText: `${this.$t('i18nView.Determine')}`,
        cancelButtonText: `${this.$t('i18nView.Cancel')}`,
        dangerouslyUseHTMLString: true,
        center: true,
        type: 'warning'
      }).then(() => {
        setYYDevice({ id: row.id }).then(response => {
          const { statusCode } = response
          if (statusCode == 200) {
            this.$message.success(`${this.$t('i18nView.Reserve')}${this.$t('i18nView.Success')}`)
          } else {
            this.$message.error(`${this.$t('i18nView.Reserve')}${this.$t('i18nView.Error')}`)
          }
          this.refreshList()
        })
      }).catch(() => {
      })
    },

    // 归还仪器
    handlReturn(index, row) {
      this.formTitle = '归还'
      // this.form = row
      this.id = row.id
      this.dialogVisible = true
    },

    // 报废仪器
    handlScrap(index, row) {
      this.formTitle = '报废'
      // this.form = row
      this.dialogVisible = true
      return
      this.$confirm(`${this.$t('i18nView.InstrumenScrap')}`, `${this.$t('i18nView.Tips')}`, {
        confirmButtonText: `${this.$t('i18nView.Determine')}`,
        cancelButtonText: `${this.$t('i18nView.Cancel')}`,
        dangerouslyUseHTMLString: true,
        center: true,
        type: 'warning'
      }).then(() => {
        setBFDevice({ id: row.id }).then(response => {
          const { statusCode } = response
          if (statusCode == 200) {
            this.$message.success(`${this.$t('i18nView.Scrap')}${this.$t('i18nView.Success')}`)
          } else {
            this.$message.error(`${this.$t('i18nView.Scrap')}${this.$t('i18nView.Error')}`)
          }
          this.refreshList()
        })
      }).catch(() => {
      })
    },

    refreshList() {
      this.getList()
    },

    // 获取表格选择
    handleSelectionChange(val) {
      this.multipleSelection = val
    },

    // 领用仪器
    setCollect() {
      if (this.multipleSelection.length > 0) {
        console.log('领用')
      }
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

    // 编辑行数据
    handleEdit(row) {
      this.formTitle = '编辑'
      // this.form = row
      this.getInfo(row)
      this.dialogVisible = true
    },

    // 查看行数据
    handleViewDetail(row) {
      this.formTitle = '查看'
      this.viewMode = true
      this.getInfo(row)
      // setTimeout(() => {
      //   this.form = row
      // }, 100)
      this.dialogVisible = true
    },

    // 获取用户信息
    getInfo(row) {
      // this.form = row
      const params = { id: row.id }
      getDetail(params).then(response => {
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
          setGHDevice({ id: this.id, Usenotes: this.form.Usenotes }).then(response => {
            const { statusCode } = response
            if (statusCode == 200) {
              this.dialogVisible = false
              this.$message.success(`${this.$t('i18nView.Return')}${this.$t('i18nView.Success')}`)
            } else {
              this.$message.error(`${this.$t('i18nView.Return')}${this.$t('i18nView.Error')}`)
            }
            this.refreshList()
          })
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
