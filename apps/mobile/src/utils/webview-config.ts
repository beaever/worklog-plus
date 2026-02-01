import { Platform } from 'react-native';

interface WebViewConfig {
  userAgent: string;
  injectedJS: string;
}

export function getWebViewConfig(): WebViewConfig {
  const platform = Platform.OS;
  const appVersion = '1.0.0';

  const userAgent = `WorkLogPlus/${appVersion} (${platform})`;

  const injectedJS = `
    (function() {
      window.isWorkLogApp = true;
      window.worklogAppPlatform = '${platform}';
      window.worklogAppVersion = '${appVersion}';
      
      window.postMessageToApp = function(type, payload) {
        window.ReactNativeWebView.postMessage(JSON.stringify({ type, payload }));
      };
      
      true;
    })();
  `;

  return {
    userAgent,
    injectedJS,
  };
}
