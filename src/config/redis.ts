import { createClient } from "redis";
import { env } from "./env";

export const redisClient = createClient({
  url: env.redisUrl,
  socket: {
    connectTimeout: 3000,
    reconnectStrategy: false
  }
});

redisClient.on("error", (error: Error) => {
  console.warn("Redis optional initialization error:", error.message);
});

export const connectRedis = async (): Promise<void> => {
  try {
    await redisClient.connect();
    console.log("Redis connected");
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`Redis is optional for Task 001 and was not connected: ${message}`);
  }
};
