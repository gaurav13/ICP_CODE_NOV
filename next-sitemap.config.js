const fs = require('fs');
const path = require('path');
const LANG = 'en';
const siteUrl = LANG == "en" ? 'https://pro.blockza.io/' : 'https://jp.blockza.io/';

let firstPartOfMain = `<?xml version="1.0" encoding="UTF-8"?><?xml-stylesheet type="text/xsl" href="/main-sitemap.xsl"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
const lastPart = `</sitemapindex>
              `;
let firstPartOfPages = `<?xml version="1.0" encoding="UTF-8"?><?xml-stylesheet type="text/xsl" href="/page_sitemap.xsl"?>
 <urlset xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"  xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd http://www.google.com/schemas/sitemap-image/1.1 http://www.google.com/schemas/sitemap-image/1.1/sitemap-image.xsd" xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
 `;
const {
  getArticlesSlugs,
  getPodcastsSlugs,
  getEventsSlugs,
  getDirectoriesSlugs,
  getCategoriesSlugs
} = require('./EntriesSlugs');

/**
 * getArticleSitemap use to generate sitemap of articles
 * @returns generate sitemap of all articles and return
 */
async function getArticleSitemap() {
  const articles = await getArticlesSlugs();
  let data = generateSiteMapDynamic(articles, 'article/');
  return data;
}

/**
 * getPodcastSitemap use to generate sitemap of podcast
 * @returns generate sitemap of all podcast and return
 */
async function getPodcastSitemap() {
  const podcasts = await getPodcastsSlugs();
  let data = generateSiteMapDynamic(podcasts, 'podcast/');
  return data;
}

/**
 * getEventsSitemap use to generate sitemap of events
 * @returns generate sitemap of all events and return
 */
async function getEventsSitemap() {
  const events = await getEventsSlugs();
  let data = generateSiteMapDynamic(events, 'event-details/');
  return data;
}

/**
 * getCategoriesSitemap use to generate sitemap of categories
 * @returns generate sitemap of all categories and return
 */
async function getCategoriesSitemap() {
  const categories = await getCategoriesSlugs();
  let data = generateSiteMapDynamic(categories, 'category-details?category=');
  return data;
}

/**
 * getDirectorySitemap use to generate sitemap of directories
 * @returns generate sitemap of all directories and return
 */
async function getDirectorySitemap() {
  const web3 = await getDirectoriesSlugs();
  let data = generateSiteMapDynamic(web3, 'directory/');
  return data;
}

/**
 * Generates sitemap dynamically based on pages and pagename
 * @param {*} pages 
 * @param {*} pagename 
 * @returns XML formatted string
 */
function generateSiteMapDynamic(pages, pagename) {
  let xml = firstPartOfPages;
  const formattedDate = '2024-04-24T12:24:24.000+00:00';
  pages.forEach((page) => {
    // Check if pagename is 'category-details?category=' to avoid trailing slash
    const trailingSlash = pagename === 'category-details?category=' ? '' : '/';
    xml += `
           <url>
		       <loc>${siteUrl + pagename + page.slug}${trailingSlash}</loc>
		       <lastmod>${page.modDate ?? formattedDate}</lastmod>
	         </url>
           `;
  });
  xml += `</urlset>`;
  return xml;
}

/**
 * Generates server-side sitemap
 * @returns List of sitemaps
 */
async function getServerSideSitemap() {
  const articleSitemap = await getArticleSitemap();
  const podcastSitemap = await getPodcastSitemap();
  const eventsSitemap = await getEventsSitemap();
  const directorySitemap = await getDirectorySitemap();
  const categories = await getCategoriesSitemap();

  const sitemaps = [
    { fileUrl: 'article-sitemap.xml', data: articleSitemap },
    { fileUrl: 'podcast-sitemap.xml', data: podcastSitemap },
    { fileUrl: 'event-sitemap.xml', data: eventsSitemap },
    { fileUrl: 'web3directory-sitemap.xml', data: directorySitemap },
    { fileUrl: 'categories-sitemap.xml', data: categories },
  ];

  return sitemaps;
}

/**
 * generateSitemap use to generate sitemap of static pages
 * @returns generate sitemap of all static pages and return
 */
async function generateSitemap() {
  const pagesFilePath = './public/page-sitemap.xml';

  const pagesJP = [
    'disclaimer',
    'editor-policy',
    'terms-of-use',
    'privacy-policy',
    'contact-us',
    'careers',
    'hinza-asif',
    'events',
    'web3-directory',
    'podcasts',
    'press-release',
    "campaigns",
    '',
  ];
  const pagesEN = [
    "campaigns",
    'events',
    'web3-directory',
    'podcasts',
    'press-release',
    '',
  ];
  let pages = LANG == "jp" ? pagesJP : pagesEN;

  const sitemap = generateSitemapXml(pages);
  fs.writeFileSync(path.resolve(pagesFilePath), sitemap);

  let newdata = await getServerSideSitemap();
  let sitemapLinks = ['page-sitemap.xml'];
  newdata.forEach((e) => {
    let data = e.data.toString();
    sitemapLinks.push(e.fileUrl);
    fs.writeFileSync(path.resolve(`./public/${e.fileUrl}`), data);
  });
  let sitemapLinkForMain = generateSitemapXmlMain(sitemapLinks);
  fs.writeFileSync(path.resolve(`./public/sitemap.xml`), sitemapLinkForMain);
}

/**
 * Generates sitemap XML for given pages
 * @param {*} pages 
 * @returns XML formatted string
 */
function generateSitemapXml(pages) {
  let creationDate = '2024-04-24T12:24:24.000+00:00';
  let xml = firstPartOfPages;

  pages.forEach((page) => {
    if (page === '') {
      // Skip the homepage, do not add it to the sitemap
      return;
    }

    // Assume that `page` is a string like 'category-details?category=1719210427243611048'
    // or 'some-other-page'
    let url;

    if (page.includes('category-details?category=')) {
      // If the page is a category, do not add a trailing slash
      url = `${siteUrl}${page}`;
    } else {
      // For all other pages, add a trailing slash
      url = `${siteUrl}${page}/`;
    }

    xml += `
       <url>
		   <loc>${url}</loc>
		   <lastmod>${creationDate}</lastmod>
	     </url>
       `;
  });

  xml += `</urlset>`;
  return xml;
}

/**
 * Generates the main sitemap XML
 * @param {*} pages 
 * @returns XML formatted string
 */
function generateSitemapXmlMain(pages) {
  let creationDate = '2024-04-24T12:24:24.000+00:00';
  let xml = firstPartOfMain;
  pages.forEach((page) => {
    xml += `	
    <sitemap>
		<loc>${siteUrl + page}</loc>
		<lastmod>${creationDate}</lastmod>
	</sitemap>
  `;
  });
  xml += lastPart;
  return xml;
}

/**
 * Generates robots.txt file
 */
function generateRobotsFile() {
  let data = `# *
  User-agent: *
  Allow: /
  
  # Sitemaps
  Sitemap: ${siteUrl}sitemap.xml
  `;
  fs.writeFileSync(path.resolve(`./public/robots.txt`), data);
}

generateRobotsFile();
generateSitemap();