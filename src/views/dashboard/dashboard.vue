<template>
  <div class="dashboard-container">
    <div class="bg-white py-48 text-center text-2xl text-green-500">
      您已进入管理平台
    </div>
  </div>
</template>

<script>
export default {
  name: 'Report',
  components: {

  },
  data() {
    return {

    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {}
}
</script>

<style scoped>
.item {
  margin-bottom: 16px;
}
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
  .dashboard-container{
    min-height: 80vh;
  }
  .dashboard-editor-container {
    padding: 32px;
    background-color: rgb(240, 242, 245);
    position: relative;

    .github-corner {
      position: absolute;
      top: 0;
      border: 0;
      right: 0;
    }

    .chart-wrapper {
      background: #fff;
      padding: 16px 16px 0;
      margin-bottom: 32px;
    }
  }

  @media (max-width:1024px) {
    .chart-wrapper {
      padding: 8px;
    }
  }
</style>
