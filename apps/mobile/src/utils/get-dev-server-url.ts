import Constants from 'expo-constants';
import { Platform } from 'react-native';

const WEB_PORT = 3000;

/**
 * 개발 환경에서 웹 서버 URL을 자동으로 감지합니다.
 *
 * - Expo 개발 서버의 호스트 IP를 사용하여 웹 서버 URL을 구성합니다.
 * - 프로덕션 환경에서는 환경변수에서 URL을 가져옵니다.
 */
export function getDevServerUrl(): string {
  // 환경변수가 설정되어 있으면 우선 사용
  const envUrl = process.env.EXPO_PUBLIC_WEB_URL;
  if (envUrl) {
    return envUrl;
  }

  // 개발 환경에서 Expo 개발 서버의 호스트 IP 사용
  if (__DEV__) {
    const debuggerHost = Constants.expoConfig?.hostUri;

    if (debuggerHost) {
      // hostUri 형식: "192.168.0.10:8081" -> IP만 추출
      const host = debuggerHost.split(':')[0];
      return `http://${host}:${WEB_PORT}`;
    }

    // Android 에뮬레이터의 경우 10.0.2.2가 호스트 머신을 가리킴
    if (Platform.OS === 'android') {
      return `http://10.0.2.2:${WEB_PORT}`;
    }

    // iOS 시뮬레이터의 경우 localhost 사용 가능
    return `http://localhost:${WEB_PORT}`;
  }

  // 프로덕션 환경 - 환경 변수에서 URL 가져오기
  const productionUrl = process.env.EXPO_PUBLIC_PRODUCTION_URL;
  if (productionUrl) {
    return productionUrl;
  }

  // 환경 변수가 설정되지 않은 경우 기본값
  console.warn(
    'EXPO_PUBLIC_PRODUCTION_URL이 설정되지 않았습니다. 기본 URL을 사용합니다.',
  );
  return 'https://worklog.example.com';
}
