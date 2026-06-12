// import { defineStore } from 'vuex'
import { defineStore } from 'pinia';
import { login, getInfo } from '~/api/manager';
import { setToken, getToken, removeToken } from '~/composables/auth';
import { logOut } from '../api/manager';
import { ref } from 'vue';

export const useUserStore = defineStore('user', ()=> {
    const user = ref({})
    const asideWidth = ref('250px')
    const menus = ref([])
    const ruleNames = ref([])
    const tokenRef = ref(getToken() || '')

    // --- Actions (直接写函数，不需要 context 参数) ---
    // 登录
    const loginAction = async ({ username, password }) => {
        try {
            const res = await login(username, password)
            const newToken = res.token

            tokenRef.value = newToken;
            setToken(newToken)
            return res
        } catch (err) {
            return Promise.reject(err)
        }
    }

    // 获取用户信息 & 处理菜单权限
    const getInfoAction = async () => {
        try {
            const res = await getInfo()
            // 假设 res 包含 user 和 menus
            user.value = res || {}

            // 这里的 filterMenuTree 逻辑保持不变，但要改成 JS 函数形式
            const allowedMenus = ['后台面板', '用户管理', '管理员管理', '其他模块']
            const filterMenuTree = (list) => {
                return list.filter(item => allowedMenus.includes(item.name))
            }
            menus.value = filterMenuTree(res.menus || [])

            // 假设 res 还有 ruleNames
            ruleNames.value = res.ruleNames || []

            return { menus: menus.value }
        } catch (err) {
            return Promise.reject(err)
        }
    }

    // 退出登录
    const logoutAction = async () => {
        try {
            await logOut()
        } finally {
            // 无论接口成功失败，都清除本地状态
            removeToken()
            user.value = {}
            // menus.value = []
            // ruleNames.value = []
        }
    }

    // 切换侧边栏宽度
    const toggleAsideWidth = () => {
        asideWidth.value = asideWidth.value === '250px' ? '64px' : '250px'
    }

    return {
        user,
        asideWidth,
        menus,
        ruleNames,
        loginAction,
        getInfoAction,
        logoutAction,
        toggleAsideWidth
    }
})