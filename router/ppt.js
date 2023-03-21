// 发布文件的路由模块

// 导入 express 模块
const express = require('express')
// 创建路由对象
const router = express.Router()
// 导入需要的处理函数模块
const ppt_handler = require('../router_handler/ppt')
// 导入解析 formdata 格式表单数据的包
const multer = require('multer')
// 导入处理路径的核心模块
const path = require('path')
// 创建 multer 的实例对象，通过 dest 属性指定文件的存放路径
// const upload = multer({ dest: path.join(__dirname, '../uploads') })
const upload = multer({ dest: path.join(__dirname, '../uploads') })
// var upload = multer({ dest: './public/uploads' })

// 发布ppt的路由
router.post('/uploadfile',upload.single('file'), ppt_handler.uploadFile)
// 获取ppt的路由
router.get('/getppt',ppt_handler.getPPT)

module.exports = router