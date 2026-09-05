"use client";

import { useState, useEffect } from "react";
import { StudentProfile } from "./data";
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
  id: "teacher_01",
  name: "Cô Nguyễn Mai Lan",
  email: "mailan.edu@gmail.com",
  schoolName: "Trường Tiểu Học & THCS Ánh Dương",
  className: "Khối 4 & 5",
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
    const classList = getClassStudents();
    const found = classList.find(
      (s) => s.studentId.toUpperCase() === studentId.trim().toUpperCase()
    );
    if (!found) {
      // Allow custom student ID creation on the fly for testing
      const newStudent: StudentProfile = {
        studentId: studentId.toUpperCase(),
        pin: pin || "1234",
        name: `Học Sinh ${studentId.toUpperCase()}`,
        avatar: "⭐",
        className: "Lớp 4A",
        grade: 4,
        xp: 150,
        level: 1,
        streak: 1,
        badges: ["first_quiz"],
        completedQuizzes: 1,
        accuracy: 90,
      };
      saveStoredStudent(newStudent);
      saveClassStudents([...classList, newStudent]);
      return { success: true };
    }
    saveStoredStudent(found);
    return { success: true };
  };

  const loginAsTeacher = () => {
    saveStoredTeacher(DEMO_TEACHER);
  };

  const logout = () => {
    saveStoredStudent(null);
    saveStoredTeacher(null);
  };

  const addStudentXp = (xpEarned: number) => {
    if (!student) return;
    const newXp = student.xp + xpEarned;
    const newLevel = Math.max(1, Math.floor(newXp / 500) + 1);
    const updated = {
      ...student,
      xp: newXp,
      level: newLevel,
      completedQuizzes: student.completedQuizzes + 1,
    };
    saveStoredStudent(updated);
    updateStudentProgress(student.studentId, xpEarned);
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

  return {
    student,
    teacher,
    loading,
    loginAsStudent,
    loginAsTeacher,
    logout,
    addStudentXp,
    updateStudentAvatar,
  };
}

