const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // API Proxy
  app.use(
    '/api',
    createProxyMiddleware({
      target: process.env.REACT_APP_API_URL || 'http://localhost:5000',
      changeOrigin: true,
      ws: true,
      pathRewrite: {
        '^/api': '',
      },
      onProxyRes: function(proxyRes, req, res) {
        proxyRes.headers['Access-Control-Allow-Origin'] = '*';
      },
      onError: (err, req, res) => {
        console.error('API Proxy Error:', err);
        res.status(500).send('API Proxy Error');
      }
    })
  );

  // Dashboard Proxy
  app.use(
    '/dashboard',
    createProxyMiddleware({
      target: process.env.REACT_APP_DASH_URL || 'http://localhost:8050',
      changeOrigin: true,
      ws: true,
      onError: (err, req, res) => {
        console.error('Dashboard Proxy Error:', err);
        res.status(500).send('Dashboard Proxy Error');
      }
    })
  );

  // Development WebSocket Proxy
  app.use(
    '/ws',
    createProxyMiddleware({
      target: 'ws://localhost:3000',
      ws: true,
      changeOrigin: true,
      logLevel: 'debug',
      onError: (err, req, res) => {
        console.error('WebSocket Proxy Error:', err);
        res.status(500).send('WebSocket Proxy Error');
      }
    })
  );
};