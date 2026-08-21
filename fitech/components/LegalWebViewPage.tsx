import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import type { WebViewProps } from 'react-native-webview';

import PageContainer from '@/components/PageContainer';
import { useTheme } from '@/contexts/ThemeContext';

type Props = {
  title: string;
  url: string;
};

type WebViewComponent = React.ComponentType<WebViewProps>;

export function LegalWebViewPage({ title, url }: Props) {
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [WebView, setWebView] = useState<WebViewComponent | null>(null);

  useEffect(() => {
    let cancelled = false;

    void import('react-native-webview')
      .then((mod) => {
        if (!cancelled) {
          setWebView(() => mod.WebView);
        }
      })
      .catch((error) => {
        console.warn('[LegalWebView] Failed to load WebView module', error);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleLoadEnd = useCallback(() => {
    setIsLoading(false);
  }, []);

  const handleLoadStart = useCallback(() => {
    setIsLoading(true);
  }, []);

  return (
    <PageContainer
      title={title}
      disableScroll
      includeTabBarPadding={false}
      hasBottomPadding={false}
      style={styles.page}
    >
      <View style={styles.webviewWrap}>
        {isLoading || !WebView ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator color={theme.brand.primary} />
          </View>
        ) : null}
        {WebView ? (
          <WebView
            source={{ uri: url }}
            onLoadStart={handleLoadStart}
            onLoadEnd={handleLoadEnd}
            style={styles.webview}
            startInLoadingState={false}
            showsVerticalScrollIndicator
          />
        ) : null}
      </View>
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    paddingBottom: 0,
  },
  webviewWrap: {
    flex: 1,
    minHeight: 0,
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  loadingWrap: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
});
