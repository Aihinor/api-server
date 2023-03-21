app.post('/', async (req, res) => {
  async function isOverLimit(ip) {
    // to define  
  }
  // 检查率限制  
  let overLimit = await isOverLimit(req.ip)
  if (overLimit) {
    res.status(429).send('Too many requests - try again later')
    return
  }
  // 允许访问资源  
  res.send("Accessed the precious resources!")
})


const redis = require('ioredis')
const client = redis.createClient({
  port: process.env.REDIS_PORT || 6379, host: process.env.REDIS_HOST || 'localhost',
})
client.on('connect', function () {
  console.log('connected');
});


async function isOverLimit(ip) {
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


const express = require('express')
const app = express()
const port = process.env.PORT || 3000
app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
