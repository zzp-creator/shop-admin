<template>
    <!-- <pre>{{ gridItems }}</pre> -->
    <div class="grid-stack">
        <div v-for="item in gridItems" :key="item.id" 
        class="grid-stack-item"
        :gs-x="item.x" :gs-y="item.y" :gs-w="item.w" :gs-h="item.h">
            <div class="grid-stack-item-content">
                <component :is='item.component' v-bind="item.props" />
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref, onMounted, computed, nextTick, markRaw } from "vue";
    import { useStore } from "vuex";
    import CountTo from "~/components/CountTo.vue";
    import TopStatsPanel from "~/components/TopStatsPanel.vue";
    import IndexNavs from "~/components/IndexNavs.vue";
    import IndexChart from "~/components/IndexChart.vue";
    import IndexCard from "~/components/IndexCard.vue";
    import {
        getStatistics1,
        getStatistics2
    } from "~/api/index.js";

    import { GridStack } from 'gridstack';
    import 'gridstack/dist/gridstack.min.css';

    // 获取store实例
    const store = useStore();

    // 从store中获取权限列表
    const ruleNames = computed(() => store.state.ruleNames);
    
    // 数据状态
    const panels = ref([]);
    const goods = ref([]);
    const order = ref([]);

    // 布局配置状态
    const gridItems = ref([]);

    // 初始化数据和布局
    const initDashboard = async () => {
        // 获取基础统计数据
        const res1 = await getStatistics1();
        panels.value = res1.panels;

        // 获取提示数据
        const res2 = await getStatistics2();
        goods.value = res2.goods;
        order.value = res2.order;

        // 根据权限组装布局配置
        const items = [];
        let currentY = 0;   // 简单的自动排列Y轴坐标

        if(ruleNames.value.includes('getStatistics1,GET')) {
            items.push({
                id: 'stats-1',
                component: markRaw(TopStatsPanel),    // 统计面板
                x: 0,
                y: currentY,
                w: 12,
                h: 3,
                props: {
                    panels: panels.value
                }
            });
            currentY += 3;
        }

        items.push({
            id: 'main-navs',
            component: markRaw(IndexNavs),
            x: 0,
            y: currentY,
            w: 12,
            h: 2
        });
        
        currentY += 2;

        if(ruleNames.value.includes('getStatistics3,GET')) {
            items.push({
                id: 'main-chart',
                component: markRaw(IndexChart),
                x: 0,
                y: currentY,
                w: 6,
                h: 7
            });
        }

        if(ruleNames.value.includes('getStatistics2,GET')) {
            items.push({
                id: 'info-cards-goods',
                component: markRaw(IndexCard),
                x: 6,
                y: currentY,
                w: 6,
                h: 3,
                props: {
                    title: '店铺及商品提示',
                    tip: '店铺及商品提示',
                    btns: goods.value
                }
            });
            items.push({
                id: 'info-cards-order',
                component: markRaw(IndexCard),
                x: 6,
                y: currentY,
                w: 6,
                h: 3,
                props: {
                    title: '交易提示',
                    tip: '需要立即处理的交易订单',
                    btns: order.value
                }
            });
        }
        
        
        gridItems.value = items;

        // 初始化GridStack
        await nextTick();
        const grid = GridStack.init({
            cellHeight: 80,
            margin: 5,
        });
    };

    onMounted(() => {
        initDashboard();
    });
    
    // getStatistics1().
    // then(res => {
    //     panels.value = res.panels;
    // })

    
    // getStatistics2().then(res=> {
    //     goods.value = res.goods;
    //     order.value = res.order;
    // })
</script>
<style scoped>
:deep(.grid-stack-item > .ui-resizable-handle) {
    opacity: 0;
    transition: opacity 0.2s ease;
    background-color: rgba(0, 0, 0, 0.1);
    border-radius: 4px;
}
:deep(.grid-stack-item:hover > .ui-resizable-handle) {
    opacity: 1;
}
</style>