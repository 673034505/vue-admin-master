<template>
  <el-main>
    <!-- 搜索 -->
    <el-form :inline="true" :model="queryForm">
      <el-form-item :label="$t('i18nView.WuPinMingChen')">
        <el-input v-model="queryForm.devicename" placeholder="请输入内容" />
      </el-form-item>
      <el-form-item :label="$t('i18nView.WuPinLeiBie')">
        <!-- <el-input v-model="queryForm.name" placeholder="请输入内容" /> -->
        <el-select v-model="queryForm.subcategory" clearable placeholder="请选择">
          <el-option
            v-for="item in devicesList"
            :key="item.value"
            :label="item.text"
            :value="item.text"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-search" @click="handleSearch"> {{ $t('i18nView.Search') }} </el-button>
        <el-button class="filter-item" style="margin-left: 10px;" type="success" icon="el-icon-plus" @click="handleAdd">{{ $t('i18nView.addCaiGou') }}</el-button>
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
      <!-- <el-table-column prop="id" type="index" :label="$t('i18nView.SerialNumber')" width="120" align="center" /> -->
      <el-table-column prop="serialno" :label="$t('i18nView.CaiGouBianHao')" align="center" show-overflow-tooltip />
      <el-table-column prop="devicename" :label="$t('i18nView.WuPinMingChen')" align="center" show-overflow-tooltip />
      <el-table-column prop="ccserialno" :label="$t('i18nView.ChuCanBianHao')" align="center" show-overflow-tooltip />
      <el-table-column prop="num" :label="$t('i18nView.ShuLiang')" align="center" show-overflow-tooltip />
      <el-table-column prop="statusName" :label="$t('i18nView.XianYouKuCun')" align="center" show-overflow-tooltip />
      <el-table-column prop="companyName" :label="$t('i18nView.CaiGouDanWei')" align="center" show-overflow-tooltip />
      <el-table-column prop="supplytime" :label="$t('i18nView.ZhuanHuan')" align="center" show-overflow-tooltip />
      <el-table-column prop="unitprice" :label="$t('i18nView.DanWeiJiaGe')" align="center" show-overflow-tooltip />
      <el-table-column prop="sumprice" :label="$t('i18nView.ZongJiaGe')" align="center" show-overflow-tooltip />

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
      <el-table-column align="center" fixed="right" :label="$t('i18nView.Operation')" width="150">
        <template slot-scope="scope">
          <el-button
            :size="formSize"
            type="primary"
            icon="el-icon-search"
            class="-my-1"
            @click="handlEaudit( scope.row)"
          >
            <span class="text-sm">{{ $t('i18nView.ShenPi') }} </span>
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
            <el-form-item prop="devicename" :label="$t('i18nView.WuPinMingChen')">
              <el-input v-model.trim="form.devicename" placeholder="请输入" />
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item prop="companyNo" :label="$t('i18nView.GonSiMingChen')">
              <el-select v-model="form.companyNo" placeholder="请选择" @change="supplierChange">
                <el-option
                  v-for="item in supplierList"
                  :key="item.companyNo"
                  :label="item.companyName"
                  :value="item.companyNo"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item prop="subcategory" :label="$t('i18nView.YiQiMingChen')">
              <el-select v-model="form.subcategory" placeholder="请选择" @change="subcategoryChange">
                <el-option
                  v-for="item in devicesList"
                  :key="item.value"
                  :label="item.text"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item prop="ccserialno" :label="$t('i18nView.ChuCanBianHao')">
              <el-input v-model.trim="form.ccserialno" placeholder="请输入" />
            </el-form-item>
          </el-col>

          <el-col :span="24">

            <el-col :span="6">
              <el-form-item prop="model" :label="$t('i18nView.CaiGouShuLiang')">
                <el-input-number v-model="form.num" :min="1" label="描述文字" @change="numbaerChange" />
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item prop="unit" :label="$t('i18nView.DanWei')">
                <el-input v-model.trim="form.unit" placeholder="请输入" />
              </el-form-item>
            </el-col>
          </el-col>

          <el-col :span="24">
            <el-form-item prop="unit" :label="$t('i18nView.DanWeiJiaGe')">
              <el-input v-model.number="form.unitprice" type="number" placeholder="请输入" @change="numbaerChange" />
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item prop="model" :label="$t('i18nView.ZongJiaGe')">
              <el-input v-model.trim="form.sumprice" disabled placeholder="请输入" />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item prop="purchsetime" :label="$t('i18nView.CaiGouShiJian')">
              <el-date-picker
                v-model="form.purchsetime"
                type="datetime"
                style="width: 265px;"
                placeholder="选择日期时间"
              /></el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item prop="yjtime" :label="$t('i18nView.YuJiSongDaShiJian')">
              <el-date-picker
                v-model="form.yjtime"
                type="datetime"
                style="width: 265px;"
                placeholder="选择日期时间"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <template slot="footer">
        <div class="text-center">
          <el-button :size="formSize" @click="handleClose('form')">{{ viewMode ? $t('i18nView.Close') : $t('i18nView.Cancel') }}</el-button>
          <el-button v-show="!viewMode" type="primary" :size="formSize" @click="handleSubmitForm('form')">{{ $t('i18nView.Determine') }}</el-button>
        </div>
      </template>

    </el-dialog>
  </el-main>
</template>
<script>
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import local from '@/views/local'
import { QueryPurchasPage, AddPurchase, getDetail, getModefiyDevice, getDevicesubcategory, getQueryList, GetPurchaseDetail, ModifyPurchase, DeletePurchase } from '@/api/api'
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
  name: 'ExistDevice',
  components: { Pagination },
  data() {
    return {
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
        devicename: [
          { required: true, message: '请填写', trigger: 'blur' }
        ],
        num: [
          { required: true, message: '请填写', trigger: 'blur' }
        ],
        ccserialno: [
          { required: true, message: '请填写', trigger: 'blur' }
        ],
        subcategory: [
          { required: true, message: '请填写', trigger: 'blur' }
        ],
        unit: [
          { required: true, message: '请填写', trigger: 'blur' }
        ],
        unitprice: [
          { required: true, message: '请填写', trigger: 'blur' }
        ],
        sumprice: [
          { required: true, message: '请填写', trigger: 'blur' }
        ],
        CompanyNo: [
          { required: true, message: '请填写', trigger: 'blur' }
        ],
        CompanyName: [
          { required: true, message: '请填写', trigger: 'blur' }
        ],
        purchsetime: [
          { required: true, trigger: 'blur' }
        ],
        yjtime: [
          { required: true, trigger: 'blur' }
        ]
      },
      form: {
        devicename: '',
        num: 1,
        ccserialno: '',
        // category:'仪器设备',
        status: 1,
        subcategory: '',
        unit: '',
        unitprice: '',
        sumprice: '',
        CompanyNo: '',
        CompanyName: '',
        purchsetime: '',
        yjtime: ''
      },
      queryForm: {
        devicename: '',
        subcategory: ''
      },
      supplierList: [],
      devicesList: []
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
    this.getDeviceList()
  },

  methods: {
    getDeviceList() {
      getDevicesubcategory().then(response => {
        const { data, statusCode, message } = response
        this.devicesList = data
      })

      getQueryList({ queryText: '' }).then(response => {
        const { data, statusCode, message } = response
        console.log(data, '===')
        this.supplierList = data
      })
    },
    // 获取列表数据
    getList() {
      this.listLoading = true
      const { limit, page } = this
      const params = {
        pageIndex: page,
        pageSize: limit,
        devicename: this.queryForm.devicename,
        subcategory: this.queryForm.subcategory
        // orderBy: 0,
        // sort: ''
        // queryText: ''
      }
      QueryPurchasPage(params).then(response => {
        console.log(response)
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
      // console.log(this.queryForm)
      this.refreshList()
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
      GetPurchaseDetail(params).then(response => {
        const { data, statusCode } = response
        if (statusCode === 200) {
          console.log(data)
          this.form = data
          // this.form.companyNo =
        }
      })
    },

    // 删除
    handleDelete(row) {
      this.$confirm(`是否删除 ${row.devicename} 设备`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        dangerouslyUseHTMLString: true,
        center: true,
        type: 'warning'
      }).then(() => {
        DeletePurchase({ id: row.id }).then(response => {
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
            const params = {
              ...this.form,
              status: 1,
              createtime: new Date(),
              category: '仪器设备'
            }
            AddPurchase(params).then(response => {
              console.log(response)
              const { statusCode, message } = response
              if (statusCode === 200) {
                this.$message.success('添加成功')
                this.dialogVisible = false
                this.refreshList()
              } else {
                this.$message.error(message)
              }
            })
          } else {
            // const params = {...this.form,sumprice:this.form.}
            const params = this.form
            ModifyPurchase(params).then(response => {
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
    },

    numbaerChange() {
      if (this.form.unitprice != '') {
        this.form.sumprice = (this.form.unitprice * this.form.num)
      }
    },

    supplierChange(e) {
      console.log(e)
      this.supplierList.map(item => {
        if (item.companyNo == e) {
          console.log(item)
          this.form.CompanyName = item.companyName
          this.form.CompanyNo = item.companyNo
        }
      })
    },

    subcategoryChange(e) {
      // this.devicesList.map(item => {
      //   if (item.value == e) {
      //     console.log(item)
      //     this.form.CompanyName = item.text
      //     this.form.CompanyNo = item.value
      //   }
      // })
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
