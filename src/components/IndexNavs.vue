<template>
    <div>
        <el-row :gutter="20" class="mt-5 flex flex-wrap justify-between" v-if="iconNavs && iconNavs.length > 0">
            <el-col :span="3" :offset="0" v-for="(item, index) in iconNavs" :key="index">
                <el-card shadow="hover" @click="$router.push(item.path)">
                    <div class="flex flex-col items-center justify-center cursor-pointer">
                        <el-icon :size="16" :class="item.color">
                            <component :is="item.icon"></component>
                        </el-icon>
                        <span class="text-sm mt-2">{{ item.title }}</span>
                    </div>
                </el-card>
                
            </el-col>
        </el-row>
    </div>
</template>

<script setup lang="ts">

const iconNavs = [
    {
        icon:"user",
        color:"text-light-blue-500",
        title:"用户",
        path:"/user/list"
    },
    {
        icon:"data-analysis",
        color:"text-violet-500",
        title:"会员",
        path:"/level/list"
    },
    {
        icon:"coordinate",
        color:"text-fuchsia-500",
        title:"管理员",
        path:"/manager/list"
    },
    {
        icon:"connection",
        color:"text-teal-500",
        title:"权限",
        path:"/access/list"
    },
    {
        icon:"histogram",
        color:"text-grey-500",
        title:"角色",
        path:"/role/list"
    },
    {
        icon:"picture",
        color:"text-rose-500",
        title:"图库",
        path:"/image/list"
    },
    {
        icon:"bell",
        color:"text-green-500",
        title:"公告",
        path:"/notice/list"
    },
    // {
    //     icon:"files",
    //     color:"text-yellow-500",
    //     title:"优惠券",
    //     path:"/coupon/list"
    // },
]
</script>