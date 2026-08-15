import { describe, it, expect } from "vitest";
import { appNoticeStore } from "../appNoticeStore";

describe("appNoticeStore", () => {
  it("upserts by id instead of duplicating", () => {
    const id = `notice-test-${Date.now()}`;
    appNoticeStore.add({
      id,
      title: "첫 알림",
      href: "/records/subject-details?job=1",
      createdAt: "2026-01-01T00:00:00.000Z",
    });
    appNoticeStore.add({
      id,
      title: "갱신된 알림",
      href: "/records/subject-details?job=1",
      createdAt: "2026-01-02T00:00:00.000Z",
    });

    const matches = appNoticeStore.list().filter((n) => n.id === id);
    expect(matches).toHaveLength(1);
    expect(matches[0].title).toBe("갱신된 알림");
  });

  it("unreadCount ignores read notices", () => {
    const id = `notice-unread-${Date.now()}`;
    appNoticeStore.add({
      id,
      title: "안읽음",
      createdAt: new Date().toISOString(),
    });
    const before = appNoticeStore.unreadCount();
    expect(before).toBeGreaterThanOrEqual(1);
    appNoticeStore.markRead(id);
    expect(appNoticeStore.unreadCount()).toBe(before - 1);
  });
});
