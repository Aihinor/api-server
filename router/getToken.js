// 获取七牛云token的路由模块

// 导入 express 模块
const express = require('express')
// 创建路由对象
const router = express.Router()
// 导入解析 formdata 格式表单数据的包
const multer = require('multer')
// 导入处理路径的核心模块
const path = require('path')

//引入七牛依赖
const qiniu = require("qiniu");
//客户端调用接口，生成token
let accessKey = 'pueCZS8H5SPbF9oVmxaME5TNH6hWy1480ltlAoFQ';
let secretKey = 'V5ElQbHYkjehDIECtMYTfdL0kHKRCB0UkS_umngx';
let mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
let options = {
  scope: 'news-photo', //七牛资源目录
  expires: 3600 * 24 //过期时间
};

let putPolicy = new qiniu.rs.PutPolicy(options);
let uploadToken = putPolicy.uploadToken(mac);

//把uploadToken返回给客户端
// 获取七牛云token的路由
router.get('/getToken', (req, res) => {
  if (uploadToken) {
    res.send({
      status: 0,
      message: '获取token成功！',
      data: uploadToken
    })
  } else{
    res.send({
      status:1,
      message:' token过期！',
      data:'error'
    })
  }
})

module.exports = router