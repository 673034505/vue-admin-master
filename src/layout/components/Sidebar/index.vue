<template>
  <el-scrollbar wrap-class="scrollbar-wrapper">
    <logo :is-collapse="isCollapse" />
    <el-menu
      class="height"
      mode="vertical"
      :show-timeout="200"
      :default-active="$route.path"
      :collapse="false"
      :unique-opened="true"
      background-color="#2d3a4b"
      text-color="white"
      active-text-color="#409EFF"
    >
      <sidebar-item :routes="permission_routers" />
    </el-menu>
  </el-scrollbar>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
import logo from './logo'
export default {
  components: { SidebarItem, logo },
  computed: {
    ...mapGetters([
      'sidebar',
      'permission_routers'
    ]),
    isCollapse() {
      return true
      // return !this.sidebar.opened
    }
  }
}
</script>
<style lang="scss">
.height{
  height: calc(100% - 64px) !important;
}
</style>
