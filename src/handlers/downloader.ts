// downloadHandler.ts

import { Composer, Context, InputFile } from "grammy";
import axios from "axios";
import { fetchInstagramPost } from "../downloader/Api";
import { extractBestMedia } from "../downloader/extractBestMedia";
import { DownloadStats } from "../db/models/downloads";
import { activeUsers } from "../db/models/activeUsers";
import { config } from "../config";
import { InstagramMedia } from "../types";

// Simple queue implementation to avoid ESM issues
class SimpleQueue {
  private concurrency: number;
  private running: number;
  private queue: (() => Promise<void>)[];

  constructor(concurrency: number) {
    this.concurrency = concurrency;
    this.running = 0;
    this.queue = [];
  }

  async add(fn: () => Promise<void>): Promise<void> {
    return new Promise((resolve) => {
      const run = async () => {
        this.running++;
        try {
          await fn();
        } catch (error) {
          console.error("Queue task error:", error);
        } finally {
          this.running--;
          this.next();
        }
        resolve();
      };

      this.queue.push(run);
      this.next();
    });
  }

  private next(): void {
    if (this.running < this.concurrency && this.queue.length > 0) {
      const task = this.queue.shift();
      if (task) {
        task();
      }
    }
  }
}

// Create a queue with limited concurrency
const downloadQueue = new SimpleQueue(config.CONCURRENCY_LIMIT);

function extractShortcode(url: string): string | null {
  const match = url.match(
    /(?:https?:\/\/)?(?:www\.)?instagram\.com\/(?:p|reel|tv)\/([a-zA-Z0-9_-]+)/
  );
  return match ? match[1] : null;
}

async function processDownload(
  ctx: Context,
  waitMsg: any,
  shortcode: string,
  originalText: string
) {
  try {
    const raw = await fetchInstagramPost(shortcode, {
      proxy: config.PROXY,
      cookie: config.IG_COOKIE,
    });

    const media = extractBestMedia(raw);
    if (!media.length) {
      await ctx.reply("Couldn't retrieve media – post may be private.");
      return;
    }

    const caption = `Downloaded by @${(await ctx.api.getMe()).username}\n\nPost: ${originalText}`;

    // Try sending via URL
    try {
      const hasVideo = media.some((m) => m.type === "video");
      const hasPhoto = media.some((m) => m.type === "photo");
      const mixed = hasVideo && hasPhoto;

      let album = media.map((m: InstagramMedia) =>
        mixed
          ? { type: "document" as const, media: m.url }
          : m.type === "video"
          ? { type: "video" as const, media: m.url }
          : { type: "photo" as const, media: m.url }
      );

      (album[0] as any).caption = caption;
      await ctx.replyWithMediaGroup(album);
    } catch (error) {
      console.error("Error sending media via URL:", error);
      // Fallback: buffer files
      const buffered = await Promise.all(
        media.map(async (m: InstagramMedia, idx) => {
          const res = await axios.get<ArrayBuffer>(m.url, {
            responseType: "arraybuffer",
          });
          const ext = m.type === "video" ? "mp4" : "jpg";
          const filename = `media_${idx}.${ext}`;
          return {
            type: m.type,
            media: new InputFile(Buffer.from(res.data), filename),
          };
        })
      );

      (buffered[0] as any).caption = caption;
      await ctx.replyWithMediaGroup(buffered);
    }

    // Update stats
    const today = new Date().toISOString().slice(0, 10);
    await DownloadStats.findOneAndUpdate(
      { date: today },
      { $inc: { downloads: 1 } },
      { upsert: true }
    );

    await activeUsers.findOneAndUpdate(
      { userID: ctx.from!.id },
      {
        $inc: { downloads: 1 },
        $set: { lastActive: today, username: ctx.from?.username },
      },
      { upsert: true }
    );
  } catch (error) {
    console.error("Download failed:", error);
    await ctx.reply("Failed to fetch Instagram post.");
  } finally {
    try {
      await ctx.api.deleteMessages(ctx.chat!.id, [
        waitMsg.message_id,
        ctx.message!.message_id,
      ]);
    } catch (deleteError) {
      console.error("Error deleting messages:", deleteError);
    }
  }
}

const downloadHandler = new Composer();

downloadHandler.hears(/instagram\.com\//i, async (ctx) => {
  const text = ctx.message?.text ?? "";
  const shortcode = extractShortcode(text);
  if (!shortcode) return;

  const waitMsg = await ctx.reply("📥 Queued… Please wait.");

  // Add the task to our simple queue
  downloadQueue.add(() => processDownload(ctx, waitMsg, shortcode, text));
});

export default downloadHandler;
