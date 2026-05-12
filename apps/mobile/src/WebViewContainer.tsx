import { useRef, useState, useCallback } from 'react';
import { StyleSheet, View, useColorScheme } from 'react-native';
import { WebView, type WebViewMessageEvent } from 'react-native-webview';
import { getWebViewConfig } from './utils/webview-config';
import { getDevServerUrl } from './utils/get-dev-server-url';
import { LoadingScreen } from './components/LoadingScreen';

const WEB_URL = getDevServerUrl();

export function WebViewContainer() {
  const webViewRef = useRef<WebView>(null);
  const [isLoading, setIsLoading] = useState(true);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const handleLoadEnd = useCallback(() => {
    setIsLoading(false);
  }, []);

  const handleMessage = useCallback((event: WebViewMessageEvent) => {
    try {
      const data = JSON.parse(event.nativeEvent.data) as {
        type: string;
        payload?: unknown;
      };

      switch (data.type) {
        case 'LOADING_START':
          setIsLoading(true);
          break;
        case 'LOADING_END':
          setIsLoading(false);
          break;
        case 'AUTH':
          break;
        default:
          break;
      }
    } catch (error) {
      console.error('Failed to parse WebView message:', error);
    }
  }, []);

  const config = getWebViewConfig();

  const backgroundColor = isDark ? '#030712' : '#ffffff';

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <WebView
        ref={webViewRef}
        source={{ uri: WEB_URL }}
        style={[styles.webview, { backgroundColor }]}
        onLoadEnd={handleLoadEnd}
        onMessage={handleMessage}
        userAgent={config.userAgent}
        injectedJavaScript={config.injectedJS}
        javaScriptEnabled
        domStorageEnabled
        sharedCookiesEnabled
        thirdPartyCookiesEnabled
        startInLoadingState
        allowsBackForwardNavigationGestures
        pullToRefreshEnabled={false}
        scalesPageToFit={false}
        scrollEnabled
        bounces={false}
        overScrollMode='never'
        contentMode='mobile'
        setBuiltInZoomControls={false}
        setDisplayZoomControls={false}
      />
      {isLoading && <LoadingScreen />}
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
});
