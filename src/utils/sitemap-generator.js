import { SitemapStream, streamToPromise } from 'sitemap';

const defaultRoutes = [
  { url: '/', changefreq: 'daily', priority: 1.0 },
  { url: '/FAQS', changefreq: 'monthly', priority: 0.8 },
  { url: '/Terms&Conditions', changefreq: 'monthly', priority: 0.5 },
  { url: '/Support&Contact', changefreq: 'monthly', priority: 0.7 },
  { url: '/TrackTicket', changefreq: 'monthly', priority: 0.6 },
];

const domainRoutes = {
  'mbktech.org': defaultRoutes,
  'api.mbktech.org': [
    { url: '/', changefreq: 'daily', priority: 1.0 },
    { url: '/Documentation', changefreq: 'monthly', priority: 0.9 }
  ],
  'download.mbktech.org': [
    { url: '/', changefreq: 'daily', priority: 1.0 }
  ],
  'mbkauthe.mbktech.org': [
    { url: '/', changefreq: 'daily', priority: 1.0 },
    { url: '/features', changefreq: 'weekly', priority: 0.9 },
    { url: '/docs', changefreq: 'daily', priority: 0.9 },
    { url: '/docs/getting-started', changefreq: 'weekly', priority: 0.9 },
    { url: '/docs/configuration', changefreq: 'weekly', priority: 0.8 },
    { url: '/docs/database', changefreq: 'weekly', priority: 0.8 },
    { url: '/docs/authentication', changefreq: 'weekly', priority: 0.8 },
    { url: '/docs/rbac', changefreq: 'weekly', priority: 0.8 },
    { url: '/docs/oauth', changefreq: 'weekly', priority: 0.8 },
    { url: '/docs/2fa', changefreq: 'weekly', priority: 0.8 },
    { url: '/docs/api-tokens', changefreq: 'weekly', priority: 0.8 },
    { url: '/docs/cli-auth', changefreq: 'weekly', priority: 0.8 },
    { url: '/docs/deployment', changefreq: 'weekly', priority: 0.8 },
    { url: '/docs/api-reference', changefreq: 'weekly', priority: 0.8 },
    { url: '/docs/error-codes', changefreq: 'weekly', priority: 0.7 },
    { url: '/docs/examples', changefreq: 'weekly', priority: 0.8 },
    { url: '/docs/changelog', changefreq: 'weekly', priority: 0.7 },
    { url: '/api-reference', changefreq: 'weekly', priority: 0.8 },
    { url: '/examples', changefreq: 'weekly', priority: 0.8 },
    { url: '/changelog', changefreq: 'weekly', priority: 0.7 }
  ]
};

const generateSitemap = async (domain, siteType = null) => {
  try {
    const smStream = new SitemapStream({
      hostname: `https://${domain}`,
      cacheTime: 600000
    });

    const pipeline = smStream;
    
    let routes;
    if (domain.includes('localhost')) {
      // Use routes based on site type for localhost
      if (siteType && domainRoutes[`${siteType}.mbktech.org`]) {
        routes = domainRoutes[`${siteType}.mbktech.org`];
      } else {
        routes = defaultRoutes;
      }
    } else {
      routes = domainRoutes[domain] || defaultRoutes;
    }
    
    // Add routes
    for (const route of routes) {
      smStream.write(route);
    }

    smStream.end();
    return await streamToPromise(pipeline);
  } catch (err) {
    console.error(`Error generating sitemap for ${domain}:`, err);
    throw err;
  }
};

export { generateSitemap, domainRoutes };