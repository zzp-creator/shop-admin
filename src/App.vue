<script setup>
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <!-- <HelloWorld /> -->
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<style>
body {
  background-color: var(--bg-body);
  color: var(--text-primary);
  transition: background-color 0.3s, color 0.3s;
}
</style>

<style scoped>
/* body{
  @apply bg-gray-500;
} */
#nprogress .bar{
  /* background-color: #f4f4f4!important; */
  background-color: var(--accent) !important;
  height: 3px!important;
}
::-webkit-scrollbar{
  width: 4px;
  height: 6px;
}
::-webkit-scrollbar-corner{
  display: block;
}
::-webkit-scrollbar-thumb{
  border-radius: 8px;
  /* background-color: rgba(0, 0, 0, 0.2); */
  background-color: var(--border);
}
::-webkit-scrollbar-thumb,
::-webkit-scrollbar-track{
  border-right-color: transparent;
  border-left-color: transparent;
  /* background-color: rgba(0, 0, 0, 0.1); */
  background-color: transparent;
}
</style>
