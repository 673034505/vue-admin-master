<template>
  <el-main>
    <!-- 搜索 -->
    <el-form :inline="true" :model="listQuery">
      <el-form-item>
        <el-input v-model="listQuery.userName" placeholder="用户名" style="width: 180px;" class="filter-item" @keyup.enter.native="" @blur="" />
      </el-form-item>
      <el-form-item>
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus" @click="">新增角色</el-button>
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleEdit">编辑角色</el-button>
        <el-button class="filter-item" style="margin-left: 10px;" type="success" icon="el-icon-edit" @click="">密码重置</el-button>
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
        label="角色名称"
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
      <!-- <el-table-column label="用户姓名">
        <template slot-scope="scope">
          {{ scope.row.username }}
        </template>
      </el-table-column> -->

    </el-table>

    <div class="p-3 bg-gray-100 text-center" style="font-size: 0">
      <pagination
        layout="prev, pager, next"
        :page.sync="page"
        :limit.sync="limit"
        :total="tableTotalCount"
        @change="handleAppPageChange"
      />
    </div>
  </el-main>
</template>
<script>
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
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
      selection: []
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

    // 编辑
    handleEdit() {
      const selection = this.selection
      if (selection.length === 1) {
        // this.$router.push({
        //   path: 'role-edit',
        //   query: {
        //     id: selection[0]
        //   }
        // })
      } else {
        this.$message({
          message: '请选择一条数据！',
          type: 'warning'
        })
      }
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
