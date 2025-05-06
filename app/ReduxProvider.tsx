'use client'; // This directive makes it a client component

import { Provider } from 'react-redux';
import { makeStore } from '../lib/store';

export default function ReduxProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const store = makeStore();
  return <Provider store={store}>{children}</Provider>;
}