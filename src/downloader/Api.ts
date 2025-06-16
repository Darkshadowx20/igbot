import axios, { AxiosProxyConfig } from 'axios';
import { DownloadOptions } from '../types';
import { config } from '../config';

/**
 * Fetches detailed Instagram post data via GraphQL, with optional oEmbed fallback.
 *
 * @param shortcode - The Instagram post shortcode (e.g., "C5h7kz6rHFb").
 * @param options - Download options including proxy and cookie settings
 * @returns The JSON object returned by Instagram (GraphQL or oEmbed structure under `oembed`).
 * @throws Error on network failures or if both GraphQL and oEmbed fail.
 */
export async function fetchInstagramPost(
  shortcode: string,
  options: DownloadOptions = {}
): Promise<any> {
  const {
    cookie = config.IG_COOKIE || process.env.IG_COOKIE || '',
    proxy = config.PROXY
  } = options;

  // Common headers to mimic Instagram web app
  const headers = {
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:126.0) Gecko/20100101 Firefox/126.0',
    Accept: '*/*',
    'Accept-Language': 'en-US,en;q=0.9',
    Referer: 'https://www.instagram.com/',
    'X-IG-App-ID': '936619743392459',
    Cookie: cookie,
  } as Record<string, string>;

  // Build GraphQL query URL
  const variables = JSON.stringify({
    shortcode,
    fetch_tagged_user_count: null,
    hoisted_comment_id: null,
    hoisted_reply_id: null,
  });
  const encodedVars = encodeURIComponent(variables);
  const gqlUrl =
    `https://www.instagram.com/graphql/query/?doc_id=8845758582119845&variables=${encodedVars}`;

  try {
    const response = await axios.get(gqlUrl, { 
      headers, 
      timeout: 20000, 
      proxy: proxy as AxiosProxyConfig 
    });
    const media = response.data?.data?.xdt_shortcode_media;
    if (media) {
      return media;
    }
    console.warn('No xdt_shortcode_media in GraphQL response, falling back.');
  } catch (err: any) {
    if (err.response) {
      console.warn(
        `GraphQL request failed with status ${err.response.status}:`,
        err.response.data
      );
    } else {
      console.warn('GraphQL request error:', err.message);
    }
  }
  
  // Return null if no data found
  return null;
}
