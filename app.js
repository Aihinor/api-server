// 导入 express 模块
const express = require('express')

// 创建服务器的实例对象
const app = express()

// 导入并配置 cors 中间件
const cors = require('cors')
app.use(cors())

// 配置解析表单数据的中间件
// 注意：这个中间件只能解析 application/x-www-form-urlencoded 格式的表单数据
// Express 框架在接收 POST 方式的请求参数之前需要设置 app.use(express.json()) 和 app.use(express.urlencoded({ extended: true }))
app.use(express.json()) 
app.use(express.urlencoded({ extended: false }))

// 一定要在路由之前封装 res.cc 函数
app.use((req, res, next) => {
  // status 默认值为1 表示失败的情况
  // err 的值可能是一个错误对象 也可能是一个错误的描述字符串
  res.cc = function (err, status = 1) {
    res.send({
      status,
      message: err instanceof Error ? err.message : err
    })
  }
  next()
})

// 一定要在路由之前配置解析 Token 的中间件

// 导入用于将客户端发送过来的 JWT 字符串 解析还原成JSON对象的包
const expressJWT = require('express-jwt')
const config = require('./schema/config')

app.use(expressJWT({ secret: config.jwtSecretKey }).unless({path:[/^\/api/]}))

// 导入并使用用户路由模块
const userRouter = require('./router/user')
const joi = require('joi')
app.use('/api', userRouter)
// 导入并使用用户信息的路由模块
const userinfoRouter = require('./router/userinfo')
app.use('/my',userinfoRouter)
// 导入并使用文章分类的路由模块
const artCateRouter = require('./router/artcate')
app.use('/my/article',artCateRouter)
// 导入并使用文章的路由模块
const articleRouter = require('./router/article')
app.use('/my/article',articleRouter)

// 导入并使用新闻的路由模块
const newsRouter = require('./router/news')
app.use('/api',newsRouter)

// 导入并使用发布ppt的路由模块
const pptRouter = require('./router/ppt')
app.use('/api',pptRouter)
// 托管静态资源文件
app.use('/uploads', express.static('./uploads'))

// 获取七牛云token的路由模块
const getTokenRouter = require('./router/getToken')
app.use('/api',getTokenRouter)

//开放upload静态文件
// var path = require('path');
// app.use(express.static(path.join(__dirname, 'uploads')));


// 定义错误级别的中间件
app.use((err, req, res, next) => {
  // 验证失败导致的错误
  if (err instanceof joi.ValidationError) return res.cc(err)
  // 身份认证失败后的错误
  if(err.name === 'UnauthorizedError') return res.cc('身份认证失败！')
  // 未知错误
  res.cc(err)
})

// 启动服务器
app.listen(3007, () => {
  console.log('api server running at http://127.0.0.1:3007')
})