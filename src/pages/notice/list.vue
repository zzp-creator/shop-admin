<template>
    <el-card shadow="never" class="border-0">
        <!-- 新增|刷新 -->
        <ListHeader @create="handleCreate" @refresh="getData" />
        <!-- 右侧：放当前页面特有的按钮（导出） -->
        <div class="flex items-center justify-between">
            <el-button type="success" size="small" 
            @click="handleExport">
                <el-icon><Download /></el-icon>
                导出Excel
            </el-button>
            <!-- 导入按钮 -->
            <el-upload
                ref="uploadRef"
                class="upload-demo"
                action="#" 
                :auto-upload="false"
                :on-change="handleFileUpload"
                :show-file-list="false"
                accept=".xlsx, .xls"
            >
                <el-button type="primary" size="small">
                    <el-icon><Upload /></el-icon>
                    导入Excel
                </el-button>
            </el-upload>
        </div>
        <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">
            <el-table-column prop="title" label="公告标题" min-width="200" show-overflow-tooltip />
            <el-table-column prop="create_time" label="发布时间" width="380" />
            <el-table-column label="操作" width="180" align="center">
                <template #default="scope">
                    <el-button type="primary" size="small" text @click="handleEdit(scope.row)">修改</el-button>
                    <!-- <el-button type="primary" size="small" text>删除</el-button> -->
                    <el-popconfirm title="是否要删除该公告?" confirmButtonText="确认" cancelButtonText="取消"
                        @confirm="handleDelete(scope.row.id)">
                        <template #reference>
                            <el-button text type="primary" size="small">
                                删除
                            </el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>

        <div class="flex items-center justify-center mt-5">
            <el-pagination background layout="prev, pager, next" :total="total" :current-page="currentPage"
                :page-size="limit" @current-change="getData" />
        </div>
        <FormDrawer ref="formDrawerRef" :title=drawerTitle @submit="handleSubmit">
            <el-form :model="form" ref="formRef" :rules="rules" label-width="80px" :inline="false">
                <el-form-item label="公告标题" prop="title">
                    <el-input v-model="form.title" placeholder="公告标题"></el-input>
                </el-form-item>
                <el-form-item label="公告内容" prop="content">
                    <el-input v-model="form.content" placeholder="公告内容" type="textarea" :row="5"></el-input>
                </el-form-item>
            </el-form>

        </FormDrawer>
    </el-card>
</template>

<script setup>
import dayjs from 'dayjs';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { ElMessage, ElLoading } from 'element-plus';
import { ref } from 'vue';
import ListHeader from '~/components/ListHeader.vue';
import FormDrawer from '~/components/FormDrawer.vue';
import {
    getNoticeList,
    createNotice,
    updateNotice,
    deleteNotice
} from '~/api/notice.js';
import { useInitTable, useInitForm } from '~/composables/useCommon.js';

const {
    tableData,
    loading,
    currentPage,
    total,
    limit,
    getData,
    handleDelete,
} = useInitTable({
    getList: getNoticeList,
    delete: deleteNotice,
});

const {
    formDrawerRef,
    formRef,
    form,
    rules,
    editId,
    drawerTitle,
    handleSubmit,
    resetForm,
    handleCreate,
    handleEdit
} = useInitForm({
    form: {
        title: "",
        content: ""
    },
    rules: {
        title: [{
            required: true,
            message: '公告标题不能为空',
            trigger: 'blur'
        },],
        content: [{
            required: true,
            message: '公告内容不能为空',
            trigger: 'blur'
        },],
    },
    getData,
    update: updateNotice,
    create: createNotice
});

// 导出表格
const handleExport = ()=> {
    console.log(tableData.value);
    const exportData = tableData.value.map(item => ({
        '公告标题': item.title,
        '发布时间': item.create_time,
        '公告内容': item.content
    }))

    // 使用XLSX创建工作簿
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, '公告列表');

    // 导出文件
    // 生成二进制字符串
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    // 创建Blob对象
    const blob = new Blob([excelBuffer], { type:'application/octet-stream' });
    // 格式化为：年月日时分秒 (例如：20260515153020)
    const timeStr = dayjs().format('YYYYMMDDHHmmss');
    saveAs(blob, `公告列表_${timeStr}.xlsx`);
}

// 定义上传组件的引用
const uploadRef = ref(null);

// 导入表格
const handleFileUpload = (file)=> {
    // 获取文件对象
    const rawFile = file.raw;

    if(!rawFile) return;

    // 定义映射关系
    const fieldMap = {
        '公告标题': 'title',
        '发布时间': 'create_time',
        '公告内容': 'content'
    };
    // 创建FileReader
    const reader = new FileReader();

    // 读取完成后
    reader.onload = (e)=> {
        const data = new Uint8Array(e.target.result);

        // 使用XLSX读取数据
        const workbook = XLSX.read(data, { type: 'array' });
        // 获取第一个工作表的名称
        const firstSheetName = workbook.SheetNames[0];
        const workSheet = workbook.Sheets[firstSheetName];
        // 转换为JSON
        const jsonData = XLSX.utils.sheet_to_json(workSheet);

        // 进行转换
        const formattedData = jsonData.map(json => {
            const newJson = {};

            // 遍历映射
            Object.keys(fieldMap).forEach(excelKey => {
                const codeKey = fieldMap[excelKey];

                if( json[excelKey] !== undefined ) {
                    newJson[codeKey] = json[excelKey];
                }
            });
            return newJson;
        });

        console.log('解析出来的数据', formattedData);

        //模拟上传和保存
        submitToServer(formattedData);
    };

    // 开始读取文件
    reader.readAsArrayBuffer(rawFile);
}

// 模拟提交给后端
const submitToServer = (data) => {
    const submitLoading = ElLoading.service({ text: '正在导入数据...' });

    // 模拟网络延迟
    setTimeout(()=> {
        submitLoading.close();

        tableData.value = [...data, ...tableData.value];

        ElMessage.success('导入成功！模拟数据已更新')
    }, 1500);
}

</script>