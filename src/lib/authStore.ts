"use client";

import { useState, useEffect } from "react";
import { StudentProfile, calculateLevel } from "./data";
import { getClassStudents, saveClassStudents, updateStudentProgress } from "./dataStore";

const STUDENT_STORAGE_KEY = "eduspark_active_student";
const TEACHER_STORAGE_KEY = "eduspark_active_teacher";

export interface TeacherProfile {
  id: string;
  name: string;
  email: string;
  schoolName: string;
  className: string;
  role: "teacher";
}

export const DEMO_TEACHER: TeacherProfile = {
  id: "GV01",
  name: "Cô Giáo",
  email: "giaovien@gmail.com",
  schoolName: "Trường Tiểu Học",
  className: "Lớp 4A",
  role: "teacher",
};

export function getStoredStudent(): StudentProfile | null {
  if (typeof window === "undefined") return null;
  const saved = localStorage.getItem(STUDENT_STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return null;
    }
  }
  return null;
}

export function saveStoredStudent(student: StudentProfile | null) {
  if (typeof window === "undefined") return;
  if (!student) {
    localStorage.removeItem(STUDENT_STORAGE_KEY);
  } else {
    localStorage.setItem(STUDENT_STORAGE_KEY, JSON.stringify(student));
  }
  window.dispatchEvent(new Event("eduspark_auth_change"));
}

export function getStoredTeacher(): TeacherProfile | null {
  if (typeof window === "undefined") return null;
  const saved = localStorage.getItem(TEACHER_STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return null;
    }
  }
  return null;
}

export function saveStoredTeacher(teacher: TeacherProfile | null) {
  if (typeof window === "undefined") return;
  if (!teacher) {
    localStorage.removeItem(TEACHER_STORAGE_KEY);
  } else {
    localStorage.setItem(TEACHER_STORAGE_KEY, JSON.stringify(teacher));
  }
  window.dispatchEvent(new Event("eduspark_auth_change"));
}

// React Hook to easily track auth across pages
export function useAuth() {
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [teacher, setTeacher] = useState<TeacherProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const update = () => {
      setStudent(getStoredStudent());
      setTeacher(getStoredTeacher());
      setLoading(false);
    };

    update();
    window.addEventListener("eduspark_auth_change", update);
    window.addEventListener("storage", update);

    return () => {
      window.removeEventListener("eduspark_auth_change", update);
      window.removeEventListener("storage", update);
    };
  }, []);

  const loginAsStudent = (studentId: string, pin?: string): { success: boolean; message?: string } => {
    if (!studentId || !studentId.trim()) {
      return { success: false, message: "Vui lòng nhập mã học sinh!" };
    }
    const classList = getClassStudents();
    const found = classList.find(
      (s) => s.studentId.toUpperCase() === studentId.trim().toUpperCase()
    );
    if (!found) {
      return {
        success: false,
        message: `Mã học sinh "${studentId.trim().toUpperCase()}" chưa được đăng ký trong hệ thống!`,
      };
    }
    const requiredPin = found.pin || "1234";
    if (!pin || pin.trim() !== requiredPin) {
      return {
        success: false,
        message: "Mã PIN không chính xác! Vui lòng kiểm tra lại.",
      };
    }
    saveStoredStudent(found);
    return { success: true };
  };

  const loginAsTeacher = (email?: string, password?: string): { success: boolean; message?: string } => {
    const saved = getStoredTeacher() || DEMO_TEACHER;
    const cleanEmail = (email || "").trim().toLowerCase();
    const cleanPass = (password || "").trim();

    if (!cleanEmail || !cleanPass) {
      return { success: false, message: "Vui lòng nhập đầy đủ email và mật khẩu giáo viên!" };
    }

    const validEmail = (saved.email || "giaovien@gmail.com").toLowerCase();
    const validPass = "teacher123";

    if (cleanEmail !== validEmail || cleanPass !== validPass) {
      return { success: false, message: "Email hoặc mật khẩu không chính xác!" };
    }

    saveStoredTeacher(saved);
    return { success: true };
  };

  const logout = () => {
    saveStoredStudent(null);
    saveStoredTeacher(null);
  };

  const addStudentXp = async (xpEarned: number) => {
    if (!student) return;
    const newXp = (Number(student.xp) || 0) + xpEarned;
    const levelInfo = calculateLevel(newXp);
    const newLevel = levelInfo.level;
    const updated: StudentProfile = {
      ...student,
      xp: newXp,
      level: newLevel,
      completedQuizzes: (Number(student.completedQuizzes) || 0) + 1,
    };
    // 1. Lưu ngay vào local storage & state học sinh hiện tại
    saveStoredStudent(updated);

    // 2. Cập nhật ngay danh sách lớp học ở Local (Optimistic UI tức thì)
    updateStudentProgress(student.studentId, xpEarned);

    // 3. Đồng bộ lên Turso Cloud và đợi ghi xong
    if (typeof window !== "undefined") {
      try {
        await fetch("/api/students", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: student.studentId,
            xpDelta: xpEarned,
            gemsDelta: Math.floor(xpEarned / 5),
          }),
        });
      } catch (e) {
        console.error("Lỗi đồng bộ Turso:", e);
      }
    }

    // 4. Phát sự kiện để Bảng thành tích tải lại dữ liệu mới nhất từ Turso
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("eduspark_class_change"));
    }
  };

  const updateStudentAvatar = (newAvatar: string) => {
    if (!student) return;
    const updated = {
      ...student,
      avatar: newAvatar,
    };
    saveStoredStudent(updated);
    const classList = getClassStudents();
    const updatedClass = classList.map((st) =>
      st.studentId.toUpperCase() === student.studentId.toUpperCase()
        ? { ...st, avatar: newAvatar }
        : st
    );
    saveClassStudents(updatedClass);
  };

  const updateTeacherProfile = (updated: Partial<TeacherProfile>) => {
    const current = getStoredTeacher() || DEMO_TEACHER;
    const next: TeacherProfile = { ...current, ...updated };
    saveStoredTeacher(next);
  };

  return {
    student,
    teacher,
    loading,
    loginAsStudent,
    loginAsTeacher,
    updateTeacherProfile,
    logout,
    addStudentXp,
    updateStudentAvatar,
  };
}

