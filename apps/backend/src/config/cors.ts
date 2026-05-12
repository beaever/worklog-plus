import type { CorsOptions } from 'cors';
import { env } from './env';

const allowedOrigins =
  env.NODE_ENV === 'production'
    ? [env.CORS_ORIGIN]
    : ['http://localhost:3000', 'http://localhost:8081', env.CORS_ORIGIN];

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS 정책에 의해 차단되었습니다'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  maxAge: 3600,
};
