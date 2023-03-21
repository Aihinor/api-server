// 文章的处理函数模块

// 导入数据库操作模块
const db = require('../db')
// 导入处理路径的 path 核心模块
const path = require('path')
// 初始化redis
const redis = require('ioredis')
const client = redis.createClient({
  port: process.env.REDIS_PORT || 6379, 
  host: process.env.REDIS_HOST || 'localhost',
})
client.on('connect', function () {
  console.log('connected');
});


// 发布文章的处理函数
exports.addArticle = (req, res) => {
  // console.log(req.body) // 文本类型的数据
  // console.log('--------分割线----------')
  // console.log(req.file) // 文件类型的数据
  // 手动判断是否上传了文章封面
  if (!req.file || req.file.fieldname !== 'cover_img') return res.cc('文章封面是必选参数！')

  // 整理要插入数据库的文章信息对象
  const articleInfo = {
    // 标题、内容、状态、所属的分类Id
    ...req.body,
    // 文章封面在服务器端的存放路径
    cover_img: path.join('/uploads', req.file.filename),
    // 文章发布时间
    pub_date: new Date(),
    // 文章作者的Id
    author_id: req.user.id,
    // 文章点赞数
    likes: 1039,
    // 文章出版社
    press: '皆空n修行者n湛清兴',
    // 文章评论数
    comment: 322
  }
  // 定义发布文章的 SQL 语句
  const sql = `insert into ev_articles set ?`
  db.query(sql, articleInfo, (err, results) => {
    if (err) return res.cc(err)
    if (results.affectedRows !== 1) return res.cc('发布文章失败！')
    res.cc('发布文章成功！', 0)
  })
}

// 获取文章的处理函数
exports.getArticle = async (req, res) => {
  async function isOverLimit(ip) {
    // to define 
    let res
    try {
      res = await client.incr(ip)
    } catch (err) {
      console.error('isOverLimit: could not increment key')
      throw err
    }
    console.log(`${ip} has value: ${res}`)
    if (res > 10) { return true }
    client.expire(ip, 10)
  }
  // 检查率限制  
  let overLimit = await isOverLimit(req.ip)
  if (overLimit) {
    res.status(429).send('Too many requests - try again later')
    return
  }

  // 允许访问资源  
  // 定义 SQL 语句查询文章
  const sql = 'select * from ev_articles'
  db.query(sql, async (err, results) => {
    // 执行 SQL 语句失败
    if (err) return res.cc(err)
    // if(results.length !== 1) return res.cc('获取新闻数据失败！')

    const { createClient } = require('redis')
    const redis_cache = createClient()
    await redis_cache.connect()
    // console.log(results)

    //这里偷个懒用databaseValue代替数据库读取来的数据
    const databaseValue = JSON.stringify(results)
    // console.log(databaseValue)
    //用setEx函数存入redis，中间的数字代表缓存时间，这里设置为5秒方便测试
    await redis_cache.setEx('data', 5, databaseValue)
    const value = await redis_cache.get('data')
    res.send({ 
      status:0,
      message:'获取新闻数据成功！',
      data: value 
    })

    // res.send({
    //   status: 0,
    //   message: '获取新闻数据成功',
    //   data: results
    // })
  })
}

// 根据ID获取新闻的处理函数
exports.obtainNews = (req, res) => {
  // 定义 SQL 语句
  const sql = 'select * from ev_articles where id=?'
  db.query(sql, req.params.id, (err, results) => {
    if (err) return res.cc(err)
    if (results.length !== 1) return res.cc('获取新闻数据失败！')
    res.send({
      status: 0,
      message: '获取新闻数据成功！',
      data: results
    })
  })
}

// 根据ID点赞的处理函数
exports.addCateLikes = (req, res) => {
  // 定义 SQL 语句
  const sql = 'update ev_articles set is_likes=1,likes=likes+1 where id=?'
  db.query(sql, req.params.id, (err, results) => {
    if (err) return res.cc(err)
    if (results.affectedRows !== 1) return res.cc('更新新闻点赞数失败！')
    res.cc('更新新闻点赞数成功！', 0)
  })
}

// 根据ID取消点赞的处理函数
exports.cancelCateLikes = (req, res) => {
  // 定义 SQL 语句
  const sql = 'update ev_articles set is_likes=0,likes=likes-1 where id=?'
  db.query(sql, req.params.id, (err, results) => {
    if (err) return res.cc(err)
    if (results.affectedRows !== 1) return res.cc('更新新闻点赞数失败！')
    res.cc('更新新闻点赞数成功！', 0)
  })
}