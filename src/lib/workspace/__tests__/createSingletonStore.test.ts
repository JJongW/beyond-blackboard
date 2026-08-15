import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { createSingletonStore } from "../createSingletonStore";

function installMemoryLocalStorage() {
  const map = new Map<string, string>();
  const api = {
    getItem: (k: string) => map.get(k) ?? null,
    setItem: (k: string, v: string) => {
      map.set(k, String(v));
    },
    removeItem: (k: string) => {
      map.delete(k);
    },
    clear: () => map.clear(),
  };
  Object.defineProperty(globalThis, "localStorage", {
    value: api,
    configurable: true,
  });
  Object.defineProperty(globalThis, "window", {
    value: globalThis,
    configurable: true,
  });
  return api;
}

describe("createSingletonStore getServerSnapshot", () => {
  const KEY = "cp.test.hydration";
  let ls: ReturnType<typeof installMemoryLocalStorage>;

  beforeEach(() => {
    ls = installMemoryLocalStorage();
    ls.clear();
  });

  afterEach(() => {
    Reflect.deleteProperty(globalThis, "localStorage");
    Reflect.deleteProperty(globalThis, "window");
  });

  it("keeps server snapshot at seed while getState hydrates localStorage", () => {
    ls.setItem(KEY, JSON.stringify({ count: 4 }));
    const store = createSingletonStore({ count: 3 }, { persistKey: KEY });

    expect(store.getServerSnapshot()).toEqual({ count: 3 });
    expect(store.getState()).toEqual({ count: 4 });
    // 서버 스냅샷은 hydrate 이후에도 시드 유지
    expect(store.getServerSnapshot()).toEqual({ count: 3 });
  });
});
