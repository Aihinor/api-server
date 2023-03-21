// 文章的路由模块

// 导入 express 模块
const express = require('express')
// 创建路由对象
const router = express.Router()
// 导入需要的处理函数模块
const article_handler = require('../router_handler/article')
// 导入解析 formdata 格式表单数据的包
const multer = require('multer')
// 导入处理路径的核心模块
const path = require('path')
// 创建 multer 的实例对象，通过 dest 属性指定文件的存放路径
const upload = multer({ dest: path.join(__dirname, '../uploads') })

// 导入验证数据的中间件
const expressJoi = require('@escook/express-joi')
// 导入文章的验证模块
const { add_article_schema } = require('../schema/article')
// 导入ID的验证模块
const { update_article_schema } = require('../schema/article')

// 缓存新闻内容的中间件
const cache = async (req, res, next) => {
  const { createClient } = require('redis')
  const redis_cache = createClient()
  await redis_cache.connect()
  // //尝试读取缓存中的数据
  const value = await redis_cache.get('data')
  console.log(value)
  if (value) {
    res.send({
      status: 0,
      message: '获取新闻数据成功！',
      data: value
    })
  } else {
    //不存在则去进行数据库读取
    next()
  }
}

// 发布新闻的路由
router.post('/add', upload.single('cover_img'), expressJoi(add_article_schema), article_handler.addArticle)
// 获取新闻的路由
router.get('/achieve', cache, article_handler.getArticle)
// 根据ID获取新闻
router.get('/gain/:id', article_handler.obtainNews)
// 根据ID点赞的路由
router.get('/updatelikes/:id', expressJoi(update_article_schema), article_handler.addCateLikes)
// 根据ID取消点赞的路由
router.get('/removelikes/:id', article_handler.cancelCateLikes)

// 向外共享路由对象
module.exports = router