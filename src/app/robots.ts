import type { MetadataRoute } from "next";
import { siteIndexable, siteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return siteIndexable
    ? { rules: { userAgent: "*", allow: "/" }, sitemap: `${siteUrl}/sitemap.xml` }
    : { rules: { userAgent: "*", disallow: "/" } };
}
