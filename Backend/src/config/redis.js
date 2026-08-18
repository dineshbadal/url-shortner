import Redis from "ioredis";

const redis = new Redis("redis://localhost:6379");



const testRedis = async () => {
  redis.on("connect", () => {
      console.log("Redis connected");
  });
  
  redis.on("ready", () => {
      console.log("Redis ready");
  });
  
  redis.on("error", (err) => {
      console.error("Redis error:", err);
  });
    try {
        const response = await redis.ping();
        console.log("Redis ping:", response);

        await redis.set("test", "hello");

        const value = await redis.get("test");
        console.log("Redis value:", value);

        await redis.del("test");
    } catch (error) {
        console.error("Redis test failed:", error);
    }
};
export { testRedis, redis }