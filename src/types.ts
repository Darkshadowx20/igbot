export interface InstagramMedia {
  type: "photo" | "video";
  url: string;
}

export interface ProxyConfig {
  host: string;
  protocol: string;
  port: number;
  auth?: {
    username: string;
    password: string;
  };
}

export interface DownloadOptions {
  proxy?: ProxyConfig;
  cookie?: string;
  fallbackToOembed?: boolean;
}

export interface Config {
  BOT_TOKEN: string;
  MongoDBURI: string;
  adminIds: number[];
  CONCURRENCY_LIMIT: number;
  PROXY?: ProxyConfig;
  IG_COOKIE?: string;
}

export interface DownloadStats {
  date: string;
  downloads: number;
}

export interface UserDocument {
  userID: string;
  username?: string | null;
  joinDate: Date;
  referrer?: string | null;
  role: "user" | "admin" | "mod";
}

export interface ActiveUserDocument {
  userID: string;
  username?: string | null;
  lastActive: Date;
  downloads: number;
}
