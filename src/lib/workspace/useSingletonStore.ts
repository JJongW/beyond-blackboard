"use client";

import { useCallback, useSyncExternalStore } from "react";

type SubscribableStore<T> = {
  subscribe: (listener: () => void) => () => void;
  getState: () => T;
  getServerSnapshot: () => T;
};

/**
 * 싱글톤 스토어 ↔ React 구독.
 * getServerSnapshot으로 SSR/하이드레이션 시 localStorage hydrate 전 스냅샷을 사용해
 * 서버 HTML과 클라이언트 첫 페인트가 어긋나지 않게 함.
 */
export function useSingletonStore<T>(store: SubscribableStore<T>): T {
  return useSyncExternalStore(
    store.subscribe,
    store.getState,
    store.getServerSnapshot,
  );
}

/** 스토어 전체가 아닌 selector가 필요할 때 */
export function useSingletonSelector<T, S>(
  store: SubscribableStore<T>,
  selector: (state: T) => S,
): S {
  const getSnapshot = useCallback(
    () => selector(store.getState()),
    [store, selector],
  );
  const getServerSnapshot = useCallback(
    () => selector(store.getServerSnapshot()),
    [store, selector],
  );
  return useSyncExternalStore(store.subscribe, getSnapshot, getServerSnapshot);
}
