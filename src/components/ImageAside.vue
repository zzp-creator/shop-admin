<template>
    <el-aside width="200px" class="image-aside" v-loading="loading">
        <div class="top">

            <AsideList :active="activeId == item.id" v-for="(item,index) in pageList" :key="index">
                {{ item.name }}
            </AsideList>
        </div>
        <div class="bottom">
            <el-pagination background layout="prev, next" :total="total" 
            :current-page="currentPage" :page-size="limit" @current-change="getData"/>
        </div>
    </el-aside>

    <FormDrawer title="新增" ref="forDrawerRef" @submit="handleSubmit">

    </FormDrawer>
</template>

<script setup>
import {
    getImageClassList
} from '~/api/image_class.js';
import AsideList from './AsideList.vue';
import { ref } from 'vue';
import FormDrawer from './FormDrawer.vue';

// 加载动画
const loading = ref(false);
const pageList = ref([]);
const activeId = ref(0);

// 分页数据
const currentPage = ref(1);
const total = ref(0);
const limit = ref(10);

// 获取数据
function getData(p = null) {
    if (typeof p == "number") {
        currentPage.value = p;
    }
    loading.value = true;
    getImageClassList(currentPage.value)
    .then(res=>{
        total.value = res.totalCount;
        pageList.value = res.list;
        let item = res.list[0];
        if (item) {
            activeId.value = item.id;
        }
        console.log(res);
        
    }).finally(()=> {
        loading.value = false;
    })
}

getData();

const formDrawerRef = ref(null);
const handleCreate = ()=> formDrawerRef.value.open();
const handleSubmit = ()=> {
    console.log('提交表单');
}

</script>

<style>
.image-aside{
    border-right: 1px solid #eeeeee;
    position: relative;
}
.image-aside .top{
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 50px;
    overflow-y: auto;
}
.image-aside .bottom{
    position: absolute;
    bottom: 0;
    height: 50px;
    left: 0;
    right: 0;
    @apply flex items-center justify-center;
}
</style>