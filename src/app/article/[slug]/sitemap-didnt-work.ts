// import { siteConfig } from '@/constant/config';
// import { makeEntryActor } from '@/dfx/service/actor-locator';
// import { MetadataRoute } from 'next';

// const entryActor = makeEntryActor();

// export async function generateSitemaps() {
//   const entryIds = await entryActor.getAllEntryIds(false);
//   return entryIds.map((id: any, index: number) => ({ id: index }));
// }

// export default async function sitemap({
//   id,
// }: {
//   id: number;
// }): Promise<MetadataRoute.Sitemap> {
//   const start = id * 50000;
//   const end = start + 50000;
//   const entryIds = await entryActor.getAllEntryIds(false);
//   const products = entryIds.slice(start, end);
//   return products.map((product: any) => ({
//     url: `${siteConfig.url}/ArticleN/${product.slug}`,
//     lastModified: product.date, // Assuming each product has a 'date' property
//   }));
// }
