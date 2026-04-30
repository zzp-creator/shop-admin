// my-proxy/index.js
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// 1. 开启跨域支持，允许你的前端访问这个代理
app.use(cors());
app.use(express.json());

// 2. 关键设置：忽略 HTTPS 证书错误（解决第三方证书过期问题）
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// 3. 定义代理接口
app.all('*', async (req, res) => {
  try {
    // 获取前端传来的目标路径，例如 ?path=admin/login
    const targetPath = req.path;
    
    // if (!targetPath) {
    //   return res.status(400).json({ error: '缺少 path 参数' });
    // }
    if (targetPath === '/') {
        return res.send('Vercel Proxy is Running!');
    }

    const targetUrl = `http://ceshi13.dishait.cn${targetPath}`;
    console.log('正在代理:', req.method, targetUrl);
    // 转发请求
    const response = await axios({
      method: req.method,
      url: targetUrl,
      data: req.body,
      headers: {
        'Content-Type': 'application/json',
        // 如果有需要，可以在这里添加第三方需要的 Header
        'Cookie': req.headers.cookie || '' // 如果前端传了 Cookie，也转发过去
      },
      timeout: 10000,
    });

    // 返回数据
    res.json(response.data);
  } catch (error) {
    console.error('代理错误:', error.message);
    res.status(error.response?.status || 500).json({ error: '代理请求失败', message: error.message });
  }
});

// 1. 导出 app 给 Vercel 使用
module.exports = app;

// 2. 只有在本地运行时才监听端口，部署到 Vercel 后这段代码不会执行
if (process.env.NODE_ENV !== 'production') {
  app.listen(3000, () => {
    console.log('本地服务器运行在 3000');
  });
}