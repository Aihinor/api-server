// 发布ppt的处理函数

// 导入数据库操作模块
const db = require('../db')
// 导入处理路径的 path 核心模块
const path = require('path')

// 发布ppt的处理函数
exports.uploadFile = (req,res)=>{
  const pptInfo = {
    file: path.join('/uploads', req.file.filename),
  }

  const sql = 'insert into ev_ppt set ?'
  db.query(sql,pptInfo,(err,results)=>{
    if(err) return res.cc(err)
    if(results.affectedRows !== 1) res.cc('上传PPT失败！')
    res.cc('上传PPT成功！',0)
  })
}

// 获取PPT的处理函数
exports.getPPT = (req,res)=>{
  const sql = 'select * from ev_ppt'
  db.query(sql,(err,results)=>{
    if(err) return res.cc(err)
    res.send({
      status:0,
      message:'获取PPT成功！',
      data:results
    })
  })
}