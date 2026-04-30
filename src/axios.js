import axios from "axios";
import { toast } from '~/composables/util';
import { getToken } from '~/composables/auth';
import store from './store'

// 判断当前环境是开发环境还是生产环境
const isProduction = import.meta.env.PROD;
console.log('当前开发环境-----' + isProduction);
const service = axios.create({
    baseURL: isProduction ? '/api' : '/api'
})

// 添加请求拦截器
service.interceptors.request.use(function (config) {
    // 往header头自动添加token
    const token = getToken()

    if (token) {
        config.headers['token'] = token;
    }

    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  });

// 添加响应拦截器
service.interceptors.response.use(function (response) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    return response.data.data;
  }, function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    const msg = error.response.data.msg || '请求失败'

    if (msg == "非法token，请先登录") {
      store.dispatch("logout").finally(()=> location.reload())
    }
    
    toast(msg, 'error')
    
    return Promise.reject(error);
  });

export default service