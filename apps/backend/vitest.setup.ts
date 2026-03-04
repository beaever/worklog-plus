import dotenv from 'dotenv';
import path from 'path';

// 테스트 환경변수 로드
dotenv.config({ path: path.resolve(__dirname, '.env.test') });
