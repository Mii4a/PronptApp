import React from 'react';
import '@/styles/globals.css';
import { Provider } from 'react-redux';
import { wrapper } from '@/store'
import type { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

const queryClient = new QueryClient();

export default function MyApp({ Component, ...rest }: AppProps) {
  //SSR・SSG対応のため，wrapper.useWrappedStore() で store と props を取得
  const { store, props } = wrapper.useWrappedStore(rest)

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <Component {...props.pageProps} />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </Provider>
  );
}

// wrapper.withReduxはreact8.00以降対応していないので注意