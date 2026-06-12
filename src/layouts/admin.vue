<template>
    <el-container class="h-screen">
        <el-header class="flex items-center w-full">
            <f-header/>
        </el-header>
        <el-container>
            <el-aside :width="userStore.asideWidth">
                <f-menu/>
            </el-aside>
            <el-main>
                <f-tag-list></f-tag-list>
                <router-view v-slot="{ Component }">
                    <transition name="fade">
                        <keep-alive :max="10">
                            <component :is="Component"></component>
                        </keep-alive>
                    </transition>
                </router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script setup>
import FHeader from './components/FHeader.vue';
import FMenu from './components/FMenu.vue';
import FTagList from './components/FTagList.vue';
import { onMounted, onUnmounted } from 'vue';
// import { useStore } from 'vuex';
import { useUserStore } from '../store/user'; 

// const store = useStore();
const userStore = useUserStore()

let resizeTimer = null;

// 3. 定义判断逻辑
const checkScreenSize = () => {
  const width = window.innerWidth;

  // 设定阈值，比如小于 1000px 就自动折叠
  const isMobileOrTablet = width < 1000;

  // 获取当前 Store 中的宽度状态
//   const currentWidth = store.state.asideWidth;
    const currentWidth = userStore.asideWidth;
//   console.log(currentWidth)

  if (isMobileOrTablet && currentWidth === '250px') {
    // 屏幕窄且当前是展开状态 -> 触发折叠
    // store.commit('handleAsideWidth');
    userStore.toggleAsideWidth();
  } else if (!isMobileOrTablet && currentWidth === '64px') {
    // 屏幕宽且当前是折叠状态 -> 触发展开
    // store.commit('handleAsideWidth');
    userStore.toggleAsideWidth();
  }
};

// 4. 挂载时执行一次 & 绑定监听
onMounted(() => {
  checkScreenSize(); // 初始化检查
  window.addEventListener('resize', checkScreenSize);
});

// 5. 卸载时移除监听 (非常重要！)
onUnmounted(() => {
    console.log('是否有移除监听')
    window.removeEventListener('resize', checkScreenSize);
});
</script>

<style>
.el.aside{
    transition: all 0.5s;
}
.fade-enter-from{
    opacity: 0;
}
.fade-enter-to{
    opacity: 1;
}
.fade-leave-from{
    opacity: 1;
}
.fade-leave-to{
    opacity: 0;
}
.fade-enter-active,
.fade-leave-active{
    transition: all 0.3s;
}
.fade-enter-active{
    transition-delay: 0.3s;
}
</style>