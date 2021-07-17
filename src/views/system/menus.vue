<template>
  <el-main>
    <!-- 搜索 -->
    <el-form :inline="true" :model="listQuery">
      <el-form-item>
        <el-input v-model="listQuery.userName" placeholder="用户名" style="width: 180px;" class="filter-item" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="">搜索</el-button>
        <el-button icon="el-icon-refresh" @click="">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-button class="filter-item" style="margin-left: 10px;" plain type="primary" icon="el-icon-plus" @click="handleAdd">{{ $t('i18nView.add') }}</el-button>
      <!-- <el-button class="filter-item" size="mini" style="margin-left: 10px;" plain type="success" icon="el-icon-edit" @click="handleEdit">修改</el-button> -->
      <!-- <el-button class="filter-item" size="mini" style="margin-left: 10px;" plain type="danger" icon="el-icon-delete" @click="handleEdit">删除</el-button> -->

      <!-- <el-button class="filter-item" style="margin-left: 10px;" plain type="warning" icon="el-icon-edit">密码重置</el-button> -->
    </el-row>

    <el-row>
      <el-table v-loading="loading" :data="menuList" row-key="id" stripe border :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
        <el-table-column prop="name" maxlength="50" label="菜单名称" :show-overflow-tooltip="true" width="200" />
        <el-table-column prop="icon" label="图标" align="center" width="100">
          <template slot-scope="scope">
            <svg-icon :icon-class="scope.row.icon" />
          </template>
        </el-table-column>
        <el-table-column prop="sortIndex" label="排序" align="center" width="60" />
        <el-table-column prop="viewPower" label="权限标识" align="center" :show-overflow-tooltip="true" />
        <el-table-column prop="path" label="路由地址" align="center" :show-overflow-tooltip="true" />
        <el-table-column prop="component" label="组件路径" align="center" :show-overflow-tooltip="true" />
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
    </el-row>

    <!-- 添加或修改菜单对话框 -->
    <el-dialog :title="formTitle" :visible.sync="open" width="800px" append-to-body :close-on-click-modal="false" @close="cancel">
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="菜单名称" prop="name">
              <el-input v-model="form.name" maxlength="50" placeholder="请输入菜单名称" />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="上级菜单">
              <treeselect v-model="form.parentUID" :class="size" :load-options="loadOptions" :options="menuOptions" :normalizer="normalizer" :show-count="true" no-results-text="没有查询到菜单" placeholder="选择上级菜单" />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="菜单图标">
              <el-popover placement="bottom-start" width="680" trigger="click" @show="$refs['iconSelect'].reset()">
                <IconSelect ref="iconSelect" @selected="selected" />
                <el-input slot="reference" v-model="form.icon" placeholder="点击选择图标" readonly>
                  <svg-icon v-if="form.icon" slot="prefix" :icon-class="form.icon" class="el-input__icon" style="height: 32px;width: 16px;" />
                  <i v-else slot="prefix" class="el-icon-search el-input__icon" />
                </el-input>
              </el-popover>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="显示排序" prop="sortIndex">
              <el-input-number v-model="form.sortIndex" :max="999" step-strictly controls-position="right" :min="0" />
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="路由地址" prop="path">
              <el-input v-model="form.path" maxlength="50" placeholder="请输入路由地址" />
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="组件路径" prop="component">
              <el-input v-model="form.component" maxlength="255" placeholder="请输入组件路径" />
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12">
            <el-form-item label="权限标识" prop="viewPower">
              <el-autocomplete v-model="form.viewPower" value-key="name" :maxlength="50" :fetch-suggestions="handlePowerSearch" placeholder="请选择权限标识" style="width:100%">
                <template slot-scope="{ item }">
                  {{ item.name }} | {{ item.description }}
                </template>
              </el-autocomplete>
            </el-form-item>
          </el-col> -->
          <!-- <el-col :span="12">
            <el-form-item label="归属系统" prop="system">
              <el-select v-model="form.system" placeholder="请选择归属系统" style="width:100%">
                <el-option v-for="item in systemOptions" :key="item.value" :label="item.label" :value="parseInt(item.value)" />
              </el-select>
            </el-form-item>
          </el-col> -->
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="open = false">取 消</el-button>
      </div>
    </el-dialog>
  </el-main>
</template>
<script>
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { getQueryPower, getQueryMenus, getCreateMenus } from '@/api/api'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import IconSelect from '@/components/IconSelect'
import local from '@/views/local'
const viewName = 'i18nView'
export default {
  name: 'User',
  components: { IconSelect, Treeselect },
  data() {
    return {
      listQuery: {
        userName: ''

      },
      page: 1,
      limit: 10,
      tableTotalCount: 30,
      listLoading: false,
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
      },

      // 是否显示弹出层
      open: false,
      // 表单参数
      form: {
        icon: ''
      },
      // 查询参数
      queryParams: {
        name: undefined
      },
      // 表单校验
      rules: {
        name: [
          { required: true, message: '菜单名称不能为空', trigger: 'blur' }
        ],
        sortIndex: [
          { required: true, message: '菜单顺序不能为空', trigger: 'blur' }
        ],
        path: [{ required: true, message: '路由地址不能为空', trigger: 'blur' }]
      },
      // 搜索条显示
      searchToggle: true,
      // 菜单表格树数据
      menuList: [],
      menuProps: {
        children: 'children',
        label: 'label'
      },
      // 菜单树选项
      menuOptions: [],
      // 菜单树选项
      // 归属系统选项
      systemOptions: []
    }
  },
  computed: {
    size() {
      return this.$store.getters.size
    },
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

    this.getTreeselect()
  },

  methods: {
    loadOptions({ action, parentNode, callback }) {},
    handleNodeClick() {
    },
    /** 查询菜单下拉树结构 */
    getTreeselect() {
      getQueryPower({}).then(response => {
        this.menuOptions = []
        const menu = {
          id: '-1',
          name: '根菜单',
          children: [],
          hasChildren: true
        }
        menu.children = response.data
        this.menuOptions.push(menu)
      })
    },

    /** 转换菜单数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children
      }
      return {
        id: node.id,
        label: node.name,
        children: node.children
      }
    },

    // 选择图标
    selected(name) {
      console.log(name)
      this.form.icon = name
    },

    /** 查询菜单列表 */
    getList() {
      this.loading = true
      getQueryPower(this.queryParams).then(response => {
        this.menuList = response.data
        this.loading = false
      })
    },

    handlePowerSearch(queryString, cb) {
      queryPower({ name: queryString }).then(response => {
        cb(response.data.dataSource)
      })
    },

    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id !== undefined) {
            updateMenu(this.form).then(response => {
              if (response.statusCode === 200) {
                this.$message({
                  message: '修改成功',
                  type: 'success'
                })
                this.open = false
                this.getList()
              }
            })
          } else {
            getCreateMenus(this.form).then(response => {
              if (response.statusCode === 200) {
                this.$message({
                  message: '新增成功',
                  type: 'success'
                })
                this.open = false
                this.getList()
              }
            })
          }
        }
      })
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

    handleAdd() {
      this.open = true
      this.formTitle = '编辑'
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
    },

    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
      this.getList()
    }
  }
}
</script>
<style lang="sass" scoped>

</style>
