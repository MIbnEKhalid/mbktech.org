import rateLimit from 'express-rate-limit';
import NodeCache from 'node-cache';

// Initialize cache (TTL: 5 minutes for most endpoints, 1 minute for frequently changing data)
export const cache = new NodeCache({ stdTTL: 300, checkperiod: 60 });

// Rate limiting for general API endpoints
export const apiRateLimit = rateLimit({
  windowMs: 1 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: '1 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Strict rate limiting for form submissions
export const formRateLimit = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5, // Limit each IP to 5 form submissions per 10 minutes
  message: {
    error: 'Too many form submissions from this IP, please try again later.',
    retryAfter: '10 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Rate limiting for ticket search API
export const ticketSearchRateLimit = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 20, // Limit each IP to 20 ticket searches per 5 minutes
  message: {
    error: 'Too many ticket search requests, please try again later.',
    retryAfter: '5 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Cache middleware generator
export const cacheMiddleware = (duration = 300) => {
  return (req, res, next) => {
    const key = req.originalUrl || req.url;
    const cachedResponse = cache.get(key);

    if (cachedResponse) {
      res.set('X-Cache', 'HIT');
      return res.json(cachedResponse);
    }

    res.set('X-Cache', 'MISS');

    // Override res.json to cache the response
    const originalJson = res.json;
    res.json = function (data) {
      cache.set(key, data, duration);
      originalJson.call(this, data);
    };

    next();
  };
};

// IP whitelist for admin access (optional, you can modify this)
export const adminIPWhitelist = (req, res, next) => {
  // For now, allow all IPs since auth is handled separately
  // You can uncomment and modify this when you add authentication

  // const allowedIPs = ['127.0.0.1', '::1', '::ffff:127.0.0.1'];
  // const clientIP = req.ip || req.connection.remoteAddress;

  // if (!allowedIPs.includes(clientIP)) {
  //   return res.status(403).json({
  //     error: 'Access denied from this IP address'
  //   });
  // }

  next();
};

/*
// Security headers for API responses
export const apiSecurityHeaders = (req, res, next) => {
  // Remove sensitive headers
  res.removeHeader('X-Powered-By');

  // Add security headers
  res.set({
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin'
  });

  next();
};
*/

// Request logging middleware
export const requestLogger = (req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.url,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      statusCode: res.statusCode,
      duration: `${duration}ms`
    };

    // Log only non-admin routes or errors
    if (!req.url.startsWith('/admin') || res.statusCode >= 400) {
      console.log(`[${logData.timestamp}] ${logData.method} ${logData.url} - ${logData.statusCode} - ${logData.duration} - ${logData.ip}`);
    }
  });

  next();
};


export default {
//  securityHeaders,
  apiRateLimit,
  formRateLimit,
  ticketSearchRateLimit,
  cacheMiddleware,
  adminIPWhitelist,
//  apiSecurityHeaders,
  requestLogger
};
