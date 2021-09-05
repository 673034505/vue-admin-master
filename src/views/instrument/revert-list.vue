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
      <el-table-column prop="text" label="负责人姓名" align="center" show-overflow-tooltip />
      <el-table-column prop="text" label="物品描述" align="center" show-overflow-tooltip />
      <el-table-column prop="text" label="出库时间" align="center" show-overflow-tooltip />
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

          <el-divider content-position="left"><b>商品信息</b></el-divider>
          <el-row :gutter="10">
            <el-col :span="24">
              <el-form-item prop="devicename" label="物品名称">
                <el-input v-model.trim="form.devicename" placeholder="请输入用户姓名" />
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item prop="devicename" label="物品类别">
                <el-input v-model.trim="form.devicename" placeholder="请输入用户编号" />
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item prop="devicename" label="物品特征">
                <el-input v-model.trim="form.devicename" placeholder="请输入用户编号" />
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item prop="devicename" label="采购人">
                <el-input v-model.trim="form.devicename" placeholder="请输入用户编号" />
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item prop="devicename" label="采购日期">
                <el-date-picker
                  v-model="form.datetime"
                  type="datetime"
                  style="width: 265px;"
                  placeholder="选择日期时间"
                /></el-form-item>
            </el-col>

            <el-col :span="24">
              <el-form-item prop="devicename" label="预计到达时间">
                <el-date-picker
                  v-model="form.datetime"
                  type="datetime"
                  style="width: 265px;"
                  placeholder="选择日期时间"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <!-- devicename -->
          <el-divider content-position="left"><b>商品价格</b></el-divider>
          <el-row :gutter="10">
            <el-col :span="24">
              <el-form-item prop="model" label="数量">
                <el-input-number v-model="form.num" :min="1" label="描述文字" />
              </el-form-item>
            </el-col>

            <el-col :span="24">
              <el-form-item prop="model" label="单价">
                <el-input-number v-model="form.unitNum" :min="1" label="描述文字" />
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item prop="model" label="总价">
                <el-input v-model.trim="form.sum" disabled placeholder="请输入用户编号" />
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
                <el-form-item prop="devicename" label="归还时间 ">
                  <el-date-picker
                    v-model="form.time"
                    type="datetime"
                    placeholder="选择日期时间"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item prop="devicename" label="归还品">
                  <el-input v-model.trim="form.devicename" placeholder="请输入借用人姓名" />
                </el-form-item>
              </el-col>

              <el-col :span="24">
                <el-form-item prop="devicename" label="归还原因">
                  <el-input v-model="form.devicename" autosize type="textarea" placeholder="请输入借用人姓名" />
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
import { QueryGHPage, getDetail, setLYDevice, setJYDevice, setYYDevice, setBFDevice, setGHDevice } from '@/api/api'
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
      form: {
        userID: 'liuranran', // 账号
        password: '123456', // 密码
        userName: '刘燃燃', // 姓名
        email: '673034505@qq.com', // 邮箱
        phone: '17671544839', // 电话
        address: '', // 地址
        sex: '男' // 性别
      },
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
      this.dialogVisible = true
      return
      this.$confirm(`${this.$t('i18nView.InstrumenReturn')}`, `${this.$t('i18nView.Tips')}`, {
        confirmButtonText: `${this.$t('i18nView.Determine')}`,
        cancelButtonText: `${this.$t('i18nView.Cancel')}`,
        dangerouslyUseHTMLString: true,
        center: true,
        type: 'warning'
      }).then(() => {
        setGHDevice({ id: row.id }).then(response => {
          const { statusCode } = response
          if (statusCode == 200) {
            this.$message.success(`${this.$t('i18nView.Return')}${this.$t('i18nView.Success')}`)
          } else {
            this.$message.error(`${this.$t('i18nView.Return')}${this.$t('i18nView.Error')}`)
          }
          this.refreshList()
        })
      }).catch(() => {
      })
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
      // this.getInfo(row)
      setTimeout(() => {
        this.form = row
      }, 100)
      this.dialogVisible = true
    },

    // 获取用户信息
    getInfo(row) {
      // this.form = row
      const params = { id: row.userID }
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
          if (this.formTitle === '添加') {
            const params = this.form
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
            const params = this.form
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
