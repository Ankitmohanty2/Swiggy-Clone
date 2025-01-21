const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'https://www.swiggy.com',
            changeOrigin: true,
            secure: false,
            pathRewrite: {
                '^/api': '/dapi'  // Rewrite /api to /dapi
            },
            onProxyReq: (proxyReq) => {
                proxyReq.setHeader('Access-Control-Allow-Origin', '*');
                proxyReq.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
                proxyReq.setHeader('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
            }
        })
    );
};