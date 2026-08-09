import { appNoticeStore } from "./appNoticeStore";
import type { SubjectDetailJob } from "./subjectDetailTypes";

/** Job이 ready가 되면 헤더 알림 벨에 노출할 앱 내 알림을 등록 */
export const notifyHub = {
  onJobReady(job: SubjectDetailJob) {
    appNoticeStore.add({
      id: `notice-${job.id}`,
      title: "학생들의 세부특기사항 작성이 완료되었습니다",
      href: `/records/subject-details?job=${job.id}`,
      createdAt: new Date().toISOString(),
    });
  },
};
