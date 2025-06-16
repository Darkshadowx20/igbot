import { InstagramMedia } from "../types";

/**
 * Walk an Instagram GraphQL "xdt_shortcode_media" object and pull out the
 * highest-quality URLs for every piece of media it contains.
 *
 *  • Single image → one JPG/WEBP URL
 *  • Single video → one MP4 URL (largest width)
 *  • Carousel     → N URLs in natural order (mix of photo+video)
 *
 * @param raw The object returned by fetchInstagramPost()
 * @returns Array of {type:'photo'|'video', url:string}
 */
export function extractBestMedia(raw: any): InstagramMedia[] {
  if (!raw) return [];

  const out: InstagramMedia[] = [];

  /** Pick best video src (largest width) */
  const bestVideoSrc = (node: any): string | null => {
    if (node.video_url) return node.video_url;

    // Fallback: video_resources[] exists on some reels
    if (Array.isArray(node.video_resources) && node.video_resources.length) {
      return node.video_resources.reduce((best: any, cand: any) =>
        (cand.width || 0) > (best.width || 0) ? cand : best
      ).src;
    }
    return null;
  };

  /** Pick best image src (largest config_width) */
  const bestImageSrc = (node: any): string | null => {
    if (Array.isArray(node.display_resources) && node.display_resources.length) {
      return node.display_resources.reduce((best: any, cand: any) =>
        (cand.config_width || 0) > (best.config_width || 0) ? cand : best
      ).src;
    }
    return node.display_url || node.thumbnail_src || null;
  };

  /** Push a node's best media into out[] */
  const pushNode = (node: any) => {
    if (!node) return;

    if (node.is_video) {
      const vid = bestVideoSrc(node);
      if (vid) out.push({ type: "video", url: vid });
    } else {
      const img = bestImageSrc(node);
      if (img) out.push({ type: "photo", url: img });
    }
  };

  // Root post (covers single image / video / reel)
  pushNode(raw);

  // Carousel children (GraphSidecar)
  if (raw.edge_sidecar_to_children?.edges?.length) {
    for (const edge of raw.edge_sidecar_to_children.edges) {
      pushNode(edge?.node);
    }
  }

  // Deduplicate while preserving order
  const seen = new Set<string>();
  return out.filter((m) => (seen.has(m.url) ? false : (seen.add(m.url), true)));
}
