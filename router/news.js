// 新闻的路由模块

// 导入 express 模块
const express = require('express')
// 创建路由对象
const router = express.Router()
// 导入需要处理的函数模块
const article_handler = require('../router_handler/news')
// 导入解析 formdata 格式表单数据的包
const multer = require('multer')
// 导入处理路径的核心模块
const path = require('path')

// 导入验证数据的中间件
// const expressJoi = require('@escook/express-joi')

// 提交新闻详情内容的路由
router.post('/submit',article_handler.submitContent)

// 向外共享路由对象
module.exports = router