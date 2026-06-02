import { app } from "./app";
import { env } from "./config/env";
import { connectDatabase } from "./config/database";
import { connectRedis } from "./config/redis";

const startServer = async (): Promise<void> => {
  await connectDatabase();
  await connectRedis();

  app.listen(env.port, () => {
    console.log(`Server is running on port ${env.port}`);
  });
};

startServer().catch((error: unknown) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
