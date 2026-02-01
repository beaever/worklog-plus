import { useRef, useState } from 'react';
import { StyleSheet, ActivityIndicator, View } from 'react-native';
import { WebView, type WebViewMessageEvent } from 'react-native-webview';
import { getWebViewConfig } from './utils/webview-config';

// iOS 시뮬레이터에서 localhost 대신 Mac의 IP 주소 사용
// 실제 배포 시에는 환경변수로 설정
const WEB_URL = process.env.EXPO_PUBLIC_WEB_URL ?? 'http://172.30.1.36:3000';

export function WebViewContainer() {
  const webViewRef = useRef<WebView>(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleMessage = (event: WebViewMessageEvent) => {
    try {
      const data = JSON.parse(event.nativeEvent.data) as {
        type: string;
        payload?: unknown;
      };

      switch (data.type) {
        case 'NAVIGATION':
          break;
        case 'AUTH':
          break;
        default:
          console.log('Unknown message type:', data.type);
      }
    } catch (error) {
      console.error('Failed to parse WebView message:', error);
    }
  };

  const config = getWebViewConfig();

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{ uri: WEB_URL }}
        style={styles.webview}
        onLoadStart={() => setIsLoading(true)}
        onLoadEnd={() => setIsLoading(false)}
        onMessage={handleMessage}
        userAgent={config.userAgent}
        injectedJavaScript={config.injectedJS}
        javaScriptEnabled
        domStorageEnabled
        startInLoadingState
        allowsBackForwardNavigationGestures
        pullToRefreshEnabled
      />
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size='large' color='#0000ff' />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
});
