'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import { ClassPeriod, Student, AttendanceRecord, AttendanceStatus } from '@/types';

// 임시 데이터 (실제로는 API에서 가져올 데이터)
const mockClassPeriod: ClassPeriod = {
  id: '1',
  subject: '수학',
  period: 1,
  date: '2024-08-15',
  startTime: '09:00',
  endTime: '09:50',
  attendanceCount: 28,
  totalStudents: 30,
};

const mockStudents: Student[] = [
  { id: '1', name: '김민준', studentNumber: '20240001', class: '3-1' },
  { id: '2', name: '이서윤', studentNumber: '20240002', class: '3-1' },
  { id: '3', name: '박지호', studentNumber: '20240003', class: '3-1' },
  { id: '4', name: '최예은', studentNumber: '20240004', class: '3-1' },
  { id: '5', name: '정도현', studentNumber: '20240005', class: '3-1' },
  { id: '6', name: '한소영', studentNumber: '20240006', class: '3-1' },
  { id: '7', name: '윤재민', studentNumber: '20240007', class: '3-1' },
  { id: '8', name: '임채원', studentNumber: '20240008', class: '3-1' },
  { id: '9', name: '오현우', studentNumber: '20240009', class: '3-1' },
  { id: '10', name: '강다은', studentNumber: '20240010', class: '3-1' },
];

// 출결 상태별 설정
const attendanceConfig = {
  present: { label: '출석', color: 'bg-green-500', hoverColor: 'hover:bg-green-600' },
  absent: { label: '결석', color: 'bg-red-500', hoverColor: 'hover:bg-red-600' },
  late: { label: '지각', color: 'bg-yellow-500', hoverColor: 'hover:bg-yellow-600' },
  early_leave: { label: '조퇴', color: 'bg-orange-500', hoverColor: 'hover:bg-orange-600' },
  sick_leave: { label: '병결', color: 'bg-blue-500', hoverColor: 'hover:bg-blue-600' },
  official_leave: { label: '공결', color: 'bg-purple-500', hoverColor: 'hover:bg-purple-600' },
};

export default function AttendanceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [attendanceRecords, setAttendanceRecords] = useState<{[studentId: string]: AttendanceStatus}>({
    '1': 'present',
    '2': 'present',
    '3': 'late',
    '4': 'present',
    '5': 'absent',
    '6': 'present',
    '7': 'present',
    '8': 'present',
    '9': 'present',
    '10': 'present',
  });
  
  // 알림 상태 관리
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error';
  }>({
    show: false,
    message: '',
    type: 'success'
  });

  // 출결 상태 변경
  const updateAttendance = (studentId: string, status: AttendanceStatus) => {
    setAttendanceRecords(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  // 출결 저장 함수
  const saveAttendance = async () => {
    try {
      // 실제 API 호출 로직이 들어갈 곳
      // await saveAttendanceAPI(params.id, attendanceRecords);
      
      // 임시로 저장 처리 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 성공 알림 표시
      showNotification('출결이 성공적으로 저장되었습니다! ✅', 'success');
    } catch (error) {
      // 실패 알림 표시
      showNotification('출결 저장 중 오류가 발생했습니다. 다시 시도해주세요.', 'error');
    }
  };

  // 알림 표시 함수
  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({
      show: true,
      message,
      type
    });

    // 3초 후 자동으로 알림 숨기기
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  // 출결 통계 계산
  const getAttendanceStats = () => {
    const stats = {
      present: 0,
      absent: 0,
      late: 0,
      early_leave: 0,
      sick_leave: 0,
      official_leave: 0,
    };

    Object.values(attendanceRecords).forEach(status => {
      stats[status]++;
    });

    return stats;
  };

  const stats = getAttendanceStats();
  const presentCount = stats.present + stats.late + stats.early_leave + stats.sick_leave + stats.official_leave;
  const attendanceRate = Math.round((presentCount / mockStudents.length) * 100);

  return (
    <MainLayout>
      <main className="overflow-y-auto p-8 min-h-[calc(100vh-4rem)]">
        {/* 헤더 */}
        <header className="mb-8">
          <nav className="text-sm text-gray-500 mb-4">
            <button 
              onClick={() => router.push('/')}
              className="hover:text-primary-500"
            >
              홈
            </button>
            <span className="mx-2">/</span>
            <button 
              onClick={() => router.push('/attendance')}
              className="hover:text-primary-500"
            >
              출결 관리
            </button>
            <span className="mx-2">/</span>
            <span className="text-gray-900">{mockClassPeriod.subject} {mockClassPeriod.period}교시</span>
          </nav>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                {mockClassPeriod.subject} {mockClassPeriod.period}교시 출결 관리
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">
                {mockClassPeriod.startTime} - {mockClassPeriod.endTime} | {new Date(mockClassPeriod.date).toLocaleDateString('ko-KR')}
              </p>
            </div>
            
            <button
              onClick={() => router.push('/attendance')}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <i className="fas fa-arrow-left"></i>
              <span>목록으로</span>
            </button>
          </div>
        </header>

        {/* 출결 통계 */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-500 mb-1">
                {attendanceRate}%
              </div>
              <div className="text-sm text-gray-600">출석률</div>
            </div>
            
            {Object.entries(attendanceConfig).map(([status, config]) => (
              <div key={status} className="text-center">
                <div className="text-xl font-bold text-gray-900 mb-1">
                  {stats[status as AttendanceStatus]}
                </div>
                <div className="flex items-center justify-center space-x-1">
                  <div className={`w-3 h-3 rounded-full ${config.color}`}></div>
                  <span className="text-sm text-gray-600">{config.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 학생 목록 및 출결 체크 */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">학생 출결 체크</h2>
            <p className="text-gray-600 text-sm mt-1">
              각 학생의 출결 상태를 클릭하여 변경할 수 있습니다.
            </p>
          </div>
          
          <div className="divide-y divide-gray-200">
            {mockStudents.map((student, index) => (
              <div key={student.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-600">
                        {index + 1}
                      </span>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-gray-900">{student.name}</h3>
                      <p className="text-sm text-gray-600">
                        {student.studentNumber} | {student.class}
                      </p>
                    </div>
                  </div>
                  
                  {/* 출결 상태 버튼들 */}
                  <div className="flex items-center space-x-2">
                    {Object.entries(attendanceConfig).map(([status, config]) => (
                      <button
                        key={status}
                        onClick={() => updateAttendance(student.id, status as AttendanceStatus)}
                        className={`
                          w-8 h-8 rounded-full transition-all duration-200 flex items-center justify-center
                          ${attendanceRecords[student.id] === status 
                            ? `${config.color} ring-2 ring-offset-2 ring-gray-300` 
                            : `bg-gray-200 ${config.hoverColor} hover:scale-110`
                          }
                        `}
                        title={config.label}
                      >
                        {attendanceRecords[student.id] === status && (
                          <i className="fas fa-check text-white text-xs"></i>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 저장 버튼 */}
        <div className="mt-6 flex justify-end">
          <button 
            onClick={saveAttendance}
            className="flex items-center space-x-2 bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors"
          >
            <i className="fas fa-save"></i>
            <span>출결 저장</span>
          </button>
        </div>

        {/* 토스트 알림 */}
        {notification.show && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-slide-in-down">
            <div className={`
              max-w-sm w-full bg-white rounded-lg shadow-lg border-l-4 p-4
              ${notification.type === 'success' 
                ? 'border-green-500' 
                : 'border-red-500'
              }
            `}>
              <div className="flex items-center">
                <div className={`
                  flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center
                  ${notification.type === 'success' 
                    ? 'bg-green-100 text-green-600' 
                    : 'bg-red-100 text-red-600'
                  }
                `}>
                  <i className={`fas ${
                    notification.type === 'success' ? 'fa-check' : 'fa-times'
                  } text-sm`}></i>
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {notification.message}
                  </p>
                </div>
                <button
                  onClick={() => setNotification(prev => ({ ...prev, show: false }))}
                  className="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <i className="fas fa-times text-sm"></i>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </MainLayout>
  );
}

