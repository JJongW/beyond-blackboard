import { createSingletonStore } from "./createSingletonStore";

export type AppNotice = {
  id: string;
  title: string;
  body?: string;
  href?: string;
  createdAt: string;
  readAt?: string;
};

export type AddAppNoticeInput = {
  id: string;
  title: string;
  body?: string;
  href?: string;
  createdAt: string;
};

type AppNoticeState = { notices: AppNotice[] };

const store = createSingletonStore<AppNoticeState>(
  { notices: [] },
  { persistKey: "cp.workspace.appNotices" },
);

/** 헤더 알림 벨용 앱 내 알림 — 최신순 정렬, localStorage에 지속 */
export const appNoticeStore = {
  subscribe: store.subscribe,
  getState: store.getState,
  getServerSnapshot: store.getServerSnapshot,
  list() {
    return store.getState().notices;
  },
  add(notice: AddAppNoticeInput) {
    store.setState((s) => ({ notices: [{ ...notice }, ...s.notices] }));
  },
  markRead(id: string) {
    store.setState((s) => ({
      notices: s.notices.map((n) =>
        n.id === id ? { ...n, readAt: new Date().toISOString() } : n,
      ),
    }));
  },
};
