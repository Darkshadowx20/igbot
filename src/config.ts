import dotenv from "dotenv";
import { Config, ProxyConfig } from "./types";

dotenv.config();

// Parse proxy configuration if provided
const parseProxy = (): ProxyConfig | undefined => {
  const host = process.env.PROXY_HOST;
  const protocol = process.env.PROXY_PROTOCOL;
  const port = process.env.PROXY_PORT ? parseInt(process.env.PROXY_PORT, 10) : undefined;
  const username = process.env.PROXY_USERNAME;
  const password = process.env.PROXY_PASSWORD;

  if (host && protocol && port) {
    const proxy: ProxyConfig = {
      host,
      protocol,
      port
    };
    
    if (username && password) {
      proxy.auth = { username, password };
    }
    
    return proxy;
  }
  
  return undefined;
};

export const config: Config = {
    BOT_TOKEN: process.env.BOT_TOKEN || "",
    MongoDBURI: process.env.MONGODB_URI || "",
    adminIds: [1097600241, 1940827166],
    CONCURRENCY_LIMIT: parseInt(process.env.CONCURRENCY_LIMIT || "3", 10),
    PROXY: parseProxy(),
    IG_COOKIE: process.env.IG_COOKIE || "",
}