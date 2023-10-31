import { Redis } from "ioredis"
require("dotenv").config()

const redisClinet = () => {
  if (process.env.REDIS_URL) {
    console.log(`redis connected`)
    return process.env.REDIS_URL
  }
  throw new Error("Reid conntection failed")
}
export const redis  = new Redis(redisClinet())