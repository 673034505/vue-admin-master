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
            <span class="text-sm">详情 </span>
          </el-button>
          <el-button
            v-if="scope.row.canly === 1"
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
            v-if="scope.row.canjy === 1"
            :size="formSize"
            type="text"
            icon="el-icon-s-claim"
            class="-my-1"
            @click="handlBorrow(scope.$index, scope.row)"
          >
            <span class="text-sm">{{ $t('i18nView.Borrow') }}</span>
          </el-button>
          <el-button
            v-if="scope.row.canyy === 1"
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
import { getQueryZKPage, getDevicesubcategory, getDetail, QueryTeacher, setLYDevice, setJYDevice, setYYDevice, setBFDevice, setGHDevice, getQueryList } from '@/api/api'
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
        purchaseid: '',
        usenotes: '',
        adminname: '',
        adminno: '',
        supplytime: '',
        cost: '',
        position: '',
        savenotes: '',
        attrnotes: '',
        model: '',
        Sbcserialno: '',
        canyy: false,
        canjy: false,
        canly: false
      },
      supplierList: [],
      userList: [],
      purchaseid: '',
      devicesList: [],
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
    this.getDeviceList()
    this.getList()
  },

  methods: {
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
      getQueryZKPage(params).then(response => {
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
        purchaseid: '',
        usenotes: '',
        adminname: '',
        adminno: '',
        supplytime: '',
        cost: '',
        position: '',
        savenotes: '',
        attrnotes: '',
        model: '',
        Sbcserialno: '',
        canyy: false,
        canjy: false,
        canly: false
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
