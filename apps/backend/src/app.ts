import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { corsOptions } from './config/cors';
import { env } from './config/env';
import routes from './routes';
import { errorHandler } from './middleware/error';

/**
 * Express 애플리케이션 생성 및 설정
 *
 * @returns {Application} 설정된 Express 앱 인스턴스
 */
const createApp = (): Application => {
  const app = express();

  app.use(helmet());
  app.use(cors(corsOptions));
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));

  if (env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  } else {
    app.use(morgan('combined'));
  }

  app.get('/health', (_req: Request, res: Response) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: env.NODE_ENV,
    });
  });

  app.use('/api', routes);

  app.use((req: Request, res: Response) => {
    res.status(404).json({
      success: false,
      error: '요청하신 리소스를 찾을 수 없습니다',
      path: req.path,
    });
  });

  app.use(errorHandler);

  return app;
};

export default createApp;
