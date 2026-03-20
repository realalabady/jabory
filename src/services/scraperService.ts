/**
 * Product Scraping Service
 * خدمة جلب بيانات المنتجات من الروابط
 * تستخدم Cloud Function للسحب من الخادم (أكثر موثوقية)
 */

import { getFunctions, httpsCallable } from "firebase/functions";
import { scrapeProduct as clientScrape } from "./productScraper";

const functions = getFunctions();

export interface ScrapedProduct {
  name: string;
  nameEn: string;
  description: string;
  price: number;
  oldPrice?: number;
  images: string[];
  supplierUrl: string;
  supplierName: string;
  supplierPrice?: number;
  specs?: Record<string, string>;
}

/**
 * تحديد إذا كان الرابط يحتاج سحب من الخادم
 * Amazon و المواقع المحمية تحتاج خادم
 */
function needsServerScrape(url: string): boolean {
  const domain = url.toLowerCase();
  return (
    domain.includes("amazon") ||
    domain.includes("alibaba") ||
    domain.includes("1688")
  );
}

/**
 * سحب بيانات المنتج من الخادم (Cloud Function)
 */
async function serverScrape(url: string): Promise<ScrapedProduct> {
  console.log("[Scraper] Using server-side scrape for:", url);
  
  const scrapeFunction = httpsCallable<{ url: string }, ScrapedProduct>(
    functions,
    "scrapeProductFromUrl"
  );

  const result = await scrapeFunction({ url });
  return result.data;
}

/**
 * سحب بيانات المنتج - تلقائياً يختار الطريقة المناسبة
 * 
 * @param url رابط المنتج
 * @param forceServer إجبار استخدام الخادم
 */
export async function scrapeProductByUrl(
  url: string,
  forceServer = false
): Promise<ScrapedProduct> {
  const trimmedUrl = url.trim();

  // استخدام الخادم للمواقع المحمية أو عند الطلب
  if (forceServer || needsServerScrape(trimmedUrl)) {
    try {
      return await serverScrape(trimmedUrl);
    } catch (serverError) {
      console.error("[Scraper] Server scrape failed:", serverError);
      // إذا فشل الخادم، حاول العميل كاحتياط
      console.log("[Scraper] Trying client-side as fallback...");
      try {
        return await clientScrape(trimmedUrl);
      } catch (clientError) {
        // أعد رسالة خطأ الخادم لأنها أكثر دقة
        throw serverError;
      }
    }
  }

  // استخدام العميل للمواقع الأخرى
  try {
    return await clientScrape(trimmedUrl);
  } catch (clientError) {
    console.log("[Scraper] Client scrape failed, trying server...");
    // إذا فشل العميل، حاول الخادم
    try {
      return await serverScrape(trimmedUrl);
    } catch (serverError) {
      // أعد رسالة خطأ العميل لأنها عادة أكثر وضوحاً
      throw clientError;
    }
  }
}

/**
 * سحب بيانات المنتج من الخادم فقط
 */
export async function scrapeProductFromServer(url: string): Promise<ScrapedProduct> {
  return serverScrape(url.trim());
}

/**
 * سحب بيانات المنتج من العميل فقط (CORS proxies)
 */
export async function scrapeProductFromClient(url: string): Promise<ScrapedProduct> {
  return clientScrape(url.trim());
}
