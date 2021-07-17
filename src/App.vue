<template>
  <div id="app">
    <!--登入动画-->
    <transition>
      <router-view class="app-router-view" />
    </transition>
  </div>
</template>

<script>
import 'vue-transition.css'
export default {
  name: 'App'
}

</script>
<style>
/* @import './assets/style/tailwind.scss'; */
  .app .app-router-view {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    overflow: hidden;
    backface-visibility: hidden;
    transform: translate3d(0, 0, 0);
    transform-style: preserve-3d;
    visibility: visible;
  }
  .mb8{
      margin-bottom: 8px;
  }
  .text-red-500{
    --tw-text-opacity: 1;
    color: rgba(239, 68, 68, var(--tw-text-opacity));
  }
  .text-green-500{
     --tw-text-opacity: 1;
      color: rgba(16, 185, 129, var(--tw-text-opacity));
  }
</style>
