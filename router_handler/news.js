// 新闻的处理函数模块

// 导入数据库操作模块
const db = require('../db')
// 导入处理路径的 path 核心模块
const path = require('path')

// 提交新闻详情内容的处理函数
exports.submitContent = (req,res) =>{
  const sql = 'update ev_articles set content=? where Id=15'
  db.query(sql,[req.body.content,req.params.id],(err,results)=>{
    if(err) return res.cc(err)
    if(results.affectedRows !== 1) return res.cc('提交新闻详情内容失败！')
    res.cc('提交新闻详情内容成功！',0)
  })
}