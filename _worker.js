/**
 * Cloudflare Worker for denpalrius.github.io static site
 */

// MIME type mappings
const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
  '.webmanifest': 'application/manifest+json'
};

// Default to index.html for root requests
const DEFAULT_DOCUMENT = 'index.html';

// Cache settings
const CACHE_OPTIONS = {
  cacheTtl: 86400, // 24 hours
  cacheTtlByStatus: { '404': 1, '500': 0 }
};

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    let path = url.pathname;

    // Handle root path
    if (path === '/') {
      path = '/' + DEFAULT_DOCUMENT;
    }

    // Remove leading slash for asset lookup
    const assetPath = path.startsWith('/') ? path.slice(1) : path;

    try {
      // Check if we're in development mode (no ASSETS binding)
      if (!env.ASSETS) {
        // For local development, we'll serve a simple HTML response
        if (path === '/index.html' || path === '/') {
          return new Response(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dennis Muticia - Development Mode</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
        .dev-info { background: #f0f8ff; border: 1px solid #0066cc; padding: 20px; border-radius: 8px; }
        .success { color: #006600; }
        .warning { color: #cc6600; }
    </style>
</head>
<body>
    <h1>🚀 Development Mode Active</h1>
    <div class="dev-info">
        <h2 class="success">✅ Worker is running successfully!</h2>
        <p>Your Cloudflare Worker is working correctly in development mode.</p>
        <p><strong>Next steps:</strong></p>
        <ul>
            <li>Run <code>npm run deploy</code> to deploy to production</li>
            <li>Your site will be available at <strong>https://dennismuticia.dev</strong></li>
            <li>All static assets will be served properly in production</li>
        </ul>
        <p class="warning"><strong>Note:</strong> Static assets are not available in local development mode. Deploy to test the full website functionality.</p>
    </div>
    <p><a href="https://dennismuticia.dev" target="_blank">View Production Site →</a></p>
</body>
</html>`, {
            status: 200,
            headers: {
              'Content-Type': 'text/html',
              'Cache-Control': 'no-cache'
            }
          });
        }
        
        // For other paths in development, return a helpful message
        return new Response(`
<!DOCTYPE html>
<html>
<head><title>Development Mode</title></head>
<body>
    <h1>Development Mode</h1>
    <p>Path: ${path}</p>
    <p>This asset would be served in production. Deploy to test full functionality.</p>
    <p><a href="/">← Back to Home</a></p>
</body>
</html>`, {
          status: 404,
          headers: {
            'Content-Type': 'text/html',
            'Cache-Control': 'no-cache'
          }
        });
      }

      // Production mode - get the asset from the site bucket
      const asset = await env.ASSETS.fetch(new Request(url, request));
      
      if (asset.status === 404) {
        // Try with index.html for directory requests
        if (!assetPath.includes('.')) {
          const indexPath = assetPath + '/' + DEFAULT_DOCUMENT;
          const indexAsset = await env.ASSETS.fetch(new Request(new URL(indexPath, url), request));
          
          if (indexAsset.status === 200) {
            return new Response(indexAsset.body, {
              status: 200,
              headers: {
                'Content-Type': MIME_TYPES['.html'] || 'text/html',
                'Cache-Control': 'public, max-age=3600',
                'X-Content-Type-Options': 'nosniff',
                'X-Frame-Options': 'DENY',
                'X-XSS-Protection': '1; mode=block'
              }
            });
          }
        }
        
        // Return 404 page
        return new Response('Page not found', {
          status: 404,
          headers: {
            'Content-Type': 'text/html',
            'Cache-Control': 'no-cache'
          }
        });
      }

      // Determine content type
      const extension = path.split('.').pop().toLowerCase();
      const contentType = MIME_TYPES['.' + extension] || 'application/octet-stream';

      // Set appropriate headers
      const headers = {
        'Content-Type': contentType,
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block'
      };

      // Add caching headers based on file type
      if (contentType.startsWith('text/') || contentType.includes('javascript') || contentType.includes('json')) {
        headers['Cache-Control'] = 'public, max-age=3600'; // 1 hour for text assets
      } else if (contentType.startsWith('image/')) {
        headers['Cache-Control'] = 'public, max-age=31536000'; // 1 year for images
      } else {
        headers['Cache-Control'] = 'public, max-age=86400'; // 24 hours default
      }

      // Add security headers for HTML files
      if (contentType === 'text/html') {
        headers['Content-Security-Policy'] = "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://static.hotjar.com https://calendar.google.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://calendar.google.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://www.google-analytics.com https://api.hotjar.com;";
      }

      return new Response(asset.body, {
        status: 200,
        headers: headers
      });

    } catch (error) {
      console.error('Error serving asset:', error);
      return new Response('Internal Server Error', {
        status: 500,
        headers: {
          'Content-Type': 'text/html',
          'Cache-Control': 'no-cache'
        }
      });
    }
  }
}; 