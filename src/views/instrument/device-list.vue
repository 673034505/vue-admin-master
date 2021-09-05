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
            icon="el-icon-sold-out"
            class="-my-1"
            @click="handlCollect(scope.$index, scope.row)"
          >
            <span class="text-sm">{{ $t('i18nView.Claim') }}</span>
          </el-button>
          <!-- <el-button
            :size="formSize"
            type="text"
            icon="el-icon-sell"
            class="-my-1"
            @click="handlReturn(scope.$index, scope.row)"
          >
            <span class="text-sm">{{ $t('i18nView.Return') }}</span>
          </el-button> -->
          <el-button
            v-if="!scope.row.issuedTime"
            :size="formSize"
            type="text"
            icon="el-icon-s-claim"
            class="-my-1"
            @click="handlBorrow(scope.$index, scope.row)"
          >
            <span class="text-sm">{{ $t('i18nView.Borrow') }}</span>
          </el-button>
          <el-button
            v-if="!scope.row.issuedTime"
            :size="formSize"
            type="text"
            icon="el-icon-document-remove"
            class="-my-1 "
            @click="handlReserve(scope.$index, scope.row)"
          >
            <span class="text-sm">{{ $t('i18nView.Reserve') }}</span>
          </el-button>

          <el-button
            :size="formSize"
            type="text"
            icon="el-icon-s-release"
            class="-my-1 text-red-500"
            @click="handlScrap(scope.$index, scope.row)"
          >
            <span class="text-sm">{{ $t('i18nView.Scrap') }}</span>
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

      <template v-if="formTitle == '借用' || formTitle == '领用'|| formTitle == '预约' || formTitle == '报废' ">
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
            <template v-if="formTitle == '借用'">
              <el-col :span="24">
                <el-form-item prop="Usenotes" label="用途">
                  <el-input v-model.trim="form.Usenotes" placeholder="请输入" />
                </el-form-item>
              </el-col>

              <el-col :span="24">
                <el-form-item prop="endtime" label="预计归还时间 ">
                  <el-date-picker
                    v-model="form.endtime"
                    type="datetime"
                    placeholder="选择日期时间"
                  />
                </el-form-item>
              </el-col>
            </template>

            <template v-if="formTitle == '领用'">
              <el-col :span="24">
                <el-form-item prop="Usenotes" label="用途">
                  <el-input v-model.trim="form.Usenotes" placeholder="请输入" />
                </el-form-item>
              </el-col>
            </template>

            <template v-if="formTitle == '预约'">
              <el-col :span="24">
                <el-form-item prop="Usenotes" label="用途">
                  <el-input v-model.trim="form.Usenotes" placeholder="请输入" />
                </el-form-item>
              </el-col>

              <el-col :span="24">
                <el-form-item prop="starttime" label="预约开始时间 ">
                  <el-date-picker
                    v-model="form.starttime"
                    placeholder="选择日期时间"
                    type="datetime"
                  />
                </el-form-item>
              </el-col>

              <el-col :span="24">
                <el-form-item prop="endtime" label="预约结束时间 ">
                  <el-date-picker
                    v-model="form.endtime"
                    placeholder="选择日期时间"
                    type="datetime"
                  />
                </el-form-item>
              </el-col>
            </template>

            <template v-if="formTitle == '报废'">

              <el-col :span="24">
                <el-form-item prop="starttime" label="报废时间 ">
                  <el-date-picker
                    v-model="form.starttime"
                    placeholder="选择日期时间"
                    type="datetime"
                  />
                </el-form-item>
              </el-col>

              <el-col :span="24">
                <el-form-item prop="Usenotes" label="报废原因">
                  <el-input v-model.trim="form.Usenotes" placeholder="请输入" />
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
import { getDevicesubcategory, getDetail, setLYDevice, setJYDevice, setYYDevice, setBFDevice, setGHDevice, getQueryList } from '@/api/api'
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
        Usenotes: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        starttime: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        endtime: [
          { required: true, message: '请输入', trigger: 'blur' }
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
        Usenotes: '', // 用途
        starttime: '', // 预计开始时间
        endtime: '' // 预计归还时间  预约结束时间

      },
      id: ''
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
      getDevicesubcategory(params).then(response => {
        const { data, statusCode, message } = response
        this.listLoading = false
        if (statusCode === 200) {
          this.list = data
          // this.tableTotalCount = data.totalCount
        } else {
          this.$message.error(message)
        }
      })
    },

    // 领用仪器
    handlCollect(index, row) {
      this.formTitle = '领用'
      this.id = row.id
      this.dialogVisible = true
    },

    // 借用仪器
    handlBorrow(index, row) {
      this.formTitle = '借用'
      this.id = row.id
      this.dialogVisible = true
    },

    // 预约仪器
    handlReserve(index, row) {
      this.formTitle = '预约'
      this.id = row.id
      this.dialogVisible = true
    },

    // 归还仪器
    handlReturn(index, row) {
      this.formTitle = '归还'
      this.id = row.id
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
      this.id = row.id
      this.dialogVisible = true
    },

    refreshList() {
      this.dialogVisible = false
      this.form = {
        Usenotes: '', // 用途
        starttime: '', // 预计开始时间
        endtime: '' // 预计归还时间  预约结束时间

      }
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
          if (this.formTitle === '领用') {
            setLYDevice({ id: this.id, Usenotes: this.form.Usenotes }).then(response => {
              const { statusCode } = response
              if (statusCode === 200) {
                this.$message.success(`${this.$t('i18nView.Claim')}${this.$t('i18nView.Success')}`)
              } else {
                this.$message.error(`${this.$t('i18nView.Claim')}${this.$t('i18nView.Error')}`)
              }
              this.refreshList()
            })
          } else if (this.formTitle === '借用') {
            setJYDevice({ id: this.id, Usenotes: this.form.Usenotes, endtime: this.form.endtime }).then(response => {
              const { statusCode } = response
              if (statusCode == 200) {
                this.$message.success(`${this.$t('i18nView.Borrow')}${this.$t('i18nView.Success')}`)
              } else {
                this.$message.error(`${this.$t('i18nView.Borrow')}${this.$t('i18nView.Error')}`)
              }
              this.refreshList()
            })
          } else if (this.formTitle === '预约') {
            setYYDevice({ id: this.id, Usenotes: this.form.Usenotes, starttime: this.form.starttime, endtime: this.form.endtime }).then(response => {
              const { statusCode } = response
              if (statusCode == 200) {
                this.$message.success(`${this.$t('i18nView.Reserve')}${this.$t('i18nView.Success')}`)
              } else {
                this.$message.error(`${this.$t('i18nView.Reserve')}${this.$t('i18nView.Error')}`)
              }
              this.refreshList()
            })
          } else if (this.formTitle === '报废') {
            setBFDevice({ id: this.id, Usenotes: this.form.Usenotes, starttime: this.form.starttime }).then(response => {
              const { statusCode } = response
              if (statusCode == 200) {
                this.$message.success(`${this.$t('i18nView.Scrap')}${this.$t('i18nView.Success')}`)
              } else {
                this.$message.error(`${this.$t('i18nView.Scrap')}${this.$t('i18nView.Error')}`)
              }
              this.refreshList()
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
