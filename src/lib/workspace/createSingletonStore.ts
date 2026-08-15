/**
 * 모듈 싱글톤 스토어 — 데모용 메모리 상태.
 * persistKey가 있으면 클라이언트에서 localStorage에 동기화.
 *
 * getServerSnapshot은 초기값만 반환(localStorage 미적용) —
 * useSyncExternalStore SSR/하이드레이션 시 서버 HTML과 맞추기 위함.
 */
export type Listener = () => void;

export type SingletonStore<T> = {
  getState: () => T;
  /** SSR·하이드레이션용 — persist hydrate 없이 시드 스냅샷 */
  getServerSnapshot: () => T;
  setState: (next: T | ((prev: T) => T)) => void;
  subscribe: (listener: Listener) => () => void;
};

export type CreateStoreOptions = {
  /** 있으면 브라우저 localStorage에 JSON 저장 (새로고침 유지) */
  persistKey?: string;
};

export function createSingletonStore<T>(
  initial: T,
  options?: CreateStoreOptions,
): SingletonStore<T> {
  let state = initial;
  // hydrate/setState가 state를 교체해도 서버 스냅샷은 시드 참조를 유지
  const serverSnapshot = initial;
  let hydrated = false;
  const listeners = new Set<Listener>();

  const hydrate = () => {
    if (!options?.persistKey || hydrated) return;
    hydrated = true;
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(options.persistKey);
      if (raw) state = JSON.parse(raw) as T;
    } catch {
      // 손상된 캐시는 초기값 유지
    }
  };

  const persist = () => {
    if (!options?.persistKey || typeof window === "undefined") return;
    try {
      window.localStorage.setItem(options.persistKey, JSON.stringify(state));
    } catch {
      // quota / private mode
    }
  };

  return {
    getState: () => {
      hydrate();
      return state;
    },
    getServerSnapshot: () => serverSnapshot,
    setState: (next) => {
      hydrate();
      state =
        typeof next === "function" ? (next as (prev: T) => T)(state) : next;
      persist();
      listeners.forEach((l) => l());
    },
    subscribe: (listener) => {
      // 구독 시점에 hydrate해 하이드레이션 이후 getSnapshot이 로컬 데이터를 읽도록 함
      hydrate();
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
  };
}
