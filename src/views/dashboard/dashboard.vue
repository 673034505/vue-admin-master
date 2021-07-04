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

  .bg-white {
      --tw-bg-opacity: 1;
      background-color: rgba(255, 255, 255, var(--tw-bg-opacity));
  }
  .py-48 {
    padding-top: 12rem/* 192px */;
    padding-bottom: 12rem/* 192px */;
  }
  .text-center {
    text-align: center;
  }
  .text-2xl {
      font-size: 1.5rem/* 24px */;
      line-height: 2rem/* 32px */;
  }
  .text-green-500 {
      --tw-text-opacity: 1;
      color: rgba(16, 185, 129, var(--tw-text-opacity));
  }
</style>
