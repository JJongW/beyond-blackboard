"use client";

import { useCallback, useSyncExternalStore } from "react";

type SubscribableStore<T> = {
  subscribe: (listener: () => void) => () => void;
  getState: () => T;
};

/** 싱글톤 스토어 ↔ React 구독 */
export function useSingletonStore<T>(store: SubscribableStore<T>): T {
  return useSyncExternalStore(store.subscribe, store.getState, store.getState);
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
  return useSyncExternalStore(store.subscribe, getSnapshot, getSnapshot);
}
