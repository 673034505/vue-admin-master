<template>
  <div class="logo">
    <!-- <transition name="fade">
      <span v-if="isCollapse" key="0" class="logo_title is-bold " :class="{'is-text':!type,'is-img':type}">
        <template v-if="type">
          <img src="../../../assets/images/logo.21bf62ca.png" width="40" height="40">
        </template>
        <template v-else>
          {{ website.logo }}
        </template>
      </span>
    </transition>
    <transition-group name="fade">
      <template v-if="!isCollapse">
        <span key="1" class="logo_title is-bold"> {{ generateSkinTitle('common','title') }} </span>
      </template>
    </transition-group> -->
    <transition name="sidebarLogoFade">
      <router-link v-if="isCollapse" key="isCollapse" class="sidebar-logo-link" to="/">
        <img v-if="logo" src="../../../assets/images/logo.21bf62ca.png" class="sidebar-logo">
        <span v-if="sidebar.opened" key="1" class="logo_title is-bold"> {{ generateSkinTitle('common','title') }} </span>
      </router-link>
      <router-link v-else key="expand" class="sidebar-logo-link" to="/">
        <img v-if="logo" :src="logo" class="sidebar-logo">
        <h1 class="sidebar-title">{{ title }} </h1>
      </router-link>
    </transition>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { generateSkinTitle } from '@/utils/i18n'
export default {
  name: 'Logo',
  props: ['isCollapse'],
  data() {
    return {
      logo: '../../../assets/images/logo.21bf62ca.png',
      title: '11111'
    }
  },
  created() {},
  computed: {
    ...mapGetters(['website', 'sidebar']),
    type: function(val) {
      return true
      // return this.website.logo.indexOf('static') !== -1
    }
  },
  methods: {
    generateSkinTitle
  }
}
</script>

<style scoped="scoped" lang="scss">
div{
  -webkit-user-select:none;
  -moz-user-select:none;
  -ms-user-select:none;
  user-select:none;
  }
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-active {
  transition: opacity 2.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.logo {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  // width: 230px;
  height: 64px;
  line-height: 64px;
  background: rgb(45, 58, 75);
  color: #fdfdfd;
  text-align: center;
  font-size: 20px;
  font-weight: 600;
  overflow: hidden;
  box-sizing: border-box;
  cursor:pointer

}
.logo_title {
  padding: 0 5px 0 0;
  // color: #42b983;
  color: #ffffff;
  font-size: 20px;
  &.is-bold {
    font-weight: 700;
  }
}
.is-text {
  position: absolute;
  top: 0;
  // left: 20px;
}
.is-img {
  position: absolute;
  top: 10px;
  left: 10px;
}
.logo_subtitle {
  font-size: 16px;
  padding-top: 5px;
}
.sidebar-logo{
    width: 28px;
    height: 28px;
    vertical-align: middle;
    // margin-right: 6px;
}
</style>
