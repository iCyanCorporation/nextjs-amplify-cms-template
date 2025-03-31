/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com',
  generateRobotsTxt: true,
  generateIndexSitemap: true,
  changefreq: 'daily',
  priority: 0.7,
  sitemapSize: 5000,
  exclude: [
    '/admin/*',
    '/api/*',
    '/404',
    '/_*',
    '/500'
  ],
  alternateRefs: [
    {
      href: process.env.NEXT_PUBLIC_SITE_URL + '/en',
      hreflang: 'en',
    },
    {
      href: process.env.NEXT_PUBLIC_SITE_URL + '/ja',
      hreflang: 'ja',
    },
  ],
  transform: async (config, path) => {
    // Special handling for blog paths and important pages
    let priority = config.priority;
    let changefreq = config.changefreq;

    if (path.startsWith('/blog/')) {
      priority = 0.8;
      changefreq = 'weekly';
    } else if (path === '/about' || path === '/contact') {
      priority = 0.9;
      changefreq = 'monthly';
    } else {
      priority = 0.5;
      changefreq = 'monthly';
    }

    return {
      loc: path,
      changefreq,
      priority,
      lastmod: new Date().toISOString(),
      alternateRefs: [
        {
          href: `${process.env.NEXT_PUBLIC_SITE_URL}/en${path}`,
          hreflang: 'en',
        },
        {
          href: `${process.env.NEXT_PUBLIC_SITE_URL}/ja${path}`,
          hreflang: 'ja',
        },
      ],
    }
  },
  additionalPaths: async (config) => {
    // Static paths
    const staticPaths = [
      { loc: '/about', priority: 0.9, changefreq: 'monthly' },
      { loc: '/gallery', priority: 0.8, changefreq: 'weekly' },
      { loc: '/blog', priority: 0.8, changefreq: 'daily' }
    ];

    // Transform static paths
    const staticResults = staticPaths.map(({ loc, priority, changefreq }) => ({
      loc,
      priority,
      changefreq,
      lastmod: new Date().toISOString(),
      alternateRefs: [
        {
          href: `${process.env.NEXT_PUBLIC_SITE_URL}/en${loc}`,
          hreflang: 'en',
        },
        {
          href: `${process.env.NEXT_PUBLIC_SITE_URL}/ja${loc}`,
          hreflang: 'ja',
        },
      ],
    }));

    try {
      // Fetch blog posts (adjust the URL according to your API)
      const response = await fetch(`http://localhost:3001/api/blogs/list`);
      const blogs = await response.json();
      
      // Transform blog paths
      const blogResults = blogs.map((blog) => ({
        loc: `/blog/${blog.id}`,
        priority: 0.8,
        changefreq: 'weekly',
        lastmod: new Date().toISOString(),
        alternateRefs: [
          {
            href: `${process.env.NEXT_PUBLIC_SITE_URL}/en/blog/${blog.id}`,
            hreflang: 'en',
          },
          {
            href: `${process.env.NEXT_PUBLIC_SITE_URL}/ja/blog/${blog.id}`,
            hreflang: 'ja',
          },
        ],
      }));

      return [...staticResults, ...blogResults];
    } catch (error) {
      console.error('Error fetching blog posts for sitemap:', error);
      return staticResults;
    }
  },
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/*',
          '/admin/*',
          '/_next/*',
          '/*.json$',
          '/*.xml$'
        ],
      },
    ],
    additionalSitemaps: [
      // If you have additional sitemaps, add them here
      // `${process.env.NEXT_PUBLIC_SITE_URL}/blog-sitemap.xml`,
    ],
  },
}